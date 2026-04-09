// server.js — Custom Next.js + Socket.io server
// Handles matchmaking, WebRTC signaling, and text chat relay.
// Video/audio streams go DIRECTLY between browsers (WebRTC P2P) —
// the server is only used for signaling, so it scales well even at 1000+ users.

const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const { Server } = require('socket.io')

// ─── Load Environment Variables ─────────────────────────────────────────────
// This ensures .env.local values (like ADMIN_PASSWORD) are available in server.js
const { loadEnvConfig } = require('@next/env')
loadEnvConfig(__dirname)

const dev = process.env.NODE_ENV !== 'production'
const hostname = process.env.HOSTNAME || 'localhost'
const port = parseInt(process.env.PORT || '3000', 10)

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

// ─── Matchmaking State ────────────────────────────────────────────────────────
// Separate queues per mode (FIFO)
const queues = {
  video: [],
  text: [],
}

// interest -> { mode -> Set<socketId> }
// Allows O(1) lookup: does anyone with interest 'gaming' want 'video' chat?
const interestMap = new Map()

// roomId → { members: Set<socketId> }
const rooms = new Map()

// socketId -> roomId (for O(1) reverse lookup)
const socketRoom = new Map()

// ─── Helpers ─────────────────────────────────────────────────────────────────

function addToInterestMap(socketId, mode, interests) {
  interests.forEach(tag => {
    if (!interestMap.has(tag)) interestMap.set(tag, { video: new Set(), text: new Set() })
    interestMap.get(tag)[mode].add(socketId)
  })
}

function removeFromInterestMap(socketId, mode, interests) {
  interests.forEach(tag => {
    const entry = interestMap.get(tag)
    if (entry) {
      entry[mode].delete(socketId)
      if (entry.video.size === 0 && entry.text.size === 0) interestMap.delete(tag)
    }
  })
}

/**
 * Find the best match in a queue for a given socket.
 * Priority: Interest overlap (O(1) via Map) -> Generic FIFO (O(1) via shift)
 */
function findMatch(mode, socketId, interests) {
  const queue = queues[mode]
  if (queue.length === 0) return null

  // 1. Try to find someone with overlapping interests
  if (interests.length > 0) {
    for (const tag of interests) {
      const candidates = interestMap.get(tag)?.[mode]
      if (candidates && candidates.size > 0) {
        // Pick the first available candidate (excluding self)
        for (const candidateId of candidates) {
          if (candidateId === socketId) continue
          
          // Found a match! Remove them from the global queue
          const idx = queue.findIndex(u => u.id === candidateId)
          if (idx !== -1) {
            const match = queue.splice(idx, 1)[0]
            removeFromInterestMap(match.id, mode, match.interests)
            return match
          }
        }
      }
    }
  }

  // 2. Fallback: Take the first person in queue who isn't us
  if (queue[0]?.id === socketId) {
    if (queue.length > 1) {
      const match = queue.splice(1, 1)[0]
      removeFromInterestMap(match.id, mode, match.interests)
      return match
    }
    return null
  }

  const match = queue.shift()
  removeFromInterestMap(match.id, mode, match.interests)
  return match
}

function removeFromQueue(socketId) {
  for (const mode of ['video', 'text']) {
    const idx = queues[mode].findIndex(u => u.id === socketId)
    if (idx !== -1) {
      const user = queues[mode].splice(idx, 1)[0]
      removeFromInterestMap(user.id, mode, user.interests)
      return
    }
  }
}

/**
 * Clean up a room when either user leaves or disconnects.
 * Notifies the remaining partner.
 */
function leaveRoom(io, socket) {
  const roomId = socketRoom.get(socket.id)
  if (!roomId) return

  // Notify partner
  socket.to(roomId).emit('partner-left')

  // Remove all members from the room
  const room = rooms.get(roomId)
  if (room) {
    room.members.forEach(memberId => {
      socketRoom.delete(memberId)
      const s = io.sockets.sockets.get(memberId)
      s?.leave(roomId)
    })
    rooms.delete(roomId)
  }
}

// ─── Server Bootstrap ─────────────────────────────────────────────────────────

app.prepare().then(() => {
const httpServer = createServer((req, res) => {
    handle(req, res, parse(req.url, true))
  })

  // ─── Moderation & Safety ───────────────────────────────────────────────────
  const fs = require('fs')
  const path = require('path')

  const MODERATION_FILE = path.join(__dirname, 'moderation.json')
  let moderationData = { bans: [], reports: {}, logs: [], visitors: [] }

  function loadModerationData() {
    try {
      if (fs.existsSync(MODERATION_FILE)) {
        const loaded = JSON.parse(fs.readFileSync(MODERATION_FILE, 'utf8'))
        moderationData = { ...moderationData, ...loaded }
      }
    } catch (e) {
      console.error('[mod] Error loading moderation data:', e)
    }
  }

  function saveModerationData() {
    try {
      fs.writeFileSync(MODERATION_FILE, JSON.stringify(moderationData, null, 2))
    } catch (e) {
      console.error('[mod] Error saving moderation data:', e)
    }
  }

  loadModerationData()

  const BAD_WORDS = [
    'nigger', 'faggot', 'tranny', 'porn', 'sex', 'dick', 'cock', 'pussy', 'cunt',
    'retard', 'kyś', 'kill yourself', 'hitler', 'nazi', 'chink', 'rape', 'pedo',
    'child porn', 'cp', 'nudity', 'naked', 'show me', 'snapchat', 'horny'
  ]
  const wordFilterRegex = new RegExp(`\\b(${BAD_WORDS.join('|')})\\b`, 'gi')

  function moderateContent(text) {
    return text.replace(wordFilterRegex, match => '*'.repeat(match.length))
  }

  function getIp(socket) {
    if (!socket || !socket.handshake) return '0.0.0.0';
    const forwarded = socket.handshake.headers['x-forwarded-for'];
    if (forwarded) return forwarded.split(',')[0].trim();
    return socket.handshake.address || '0.0.0.0';
  }

  function isBanned(ip) {
    return moderationData.bans.some(b => b.ip === ip && (!b.expires || b.expires > Date.now()))
  }

  function banUser(ip, reason = 'Repeated abuse reports') {
    if (isBanned(ip)) return
    moderationData.bans.push({
      ip,
      reason,
      timestamp: Date.now(),
      expires: null, // permanent for now
    })
    saveModerationData()
    console.log(`[mod] BANNED IP: ${ip} | Reason: ${reason}`)
  }

  // Handle reporting logic
  function reportUser(reporterSocket, roomId) {
    try {
      const room = rooms.get(roomId)
      if (!room) return

      // Find the partner (the one being reported)
      const members = Array.from(room.members)
      const reportedSocketId = members.find(id => id !== reporterSocket.id)
      if (!reportedSocketId) return

      const reportedSocket = io.sockets.sockets.get(reportedSocketId)
      const reportedIp = reportedSocket ? getIp(reportedSocket) : null

      if (!reportedIp) return

      // Log the report
      const report = {
        timestamp: Date.now(),
        reportedIp,
        reportedId: reportedSocketId,
        reporterId: reporterSocket.id,
        roomId,
      }
      moderationData.logs.unshift(report)
      if (moderationData.logs.length > 500) moderationData.logs.pop()

      // Increment report count
      moderationData.reports[reportedIp] = (moderationData.reports[reportedIp] || 0) + 1
      
      console.log(`[mod] Report for ${reportedIp} (Total: ${moderationData.reports[reportedIp]})`)

      // Auto-ban threshold check
      if (moderationData.reports[reportedIp] >= 3) {
        banUser(reportedIp, 'Automatic ban: Multiple abuse reports')
        if (reportedSocket) {
          reportedSocket.emit('banned', { reason: 'Your account has been suspended due to multiple reports of inappropriate behavior.' })
          reportedSocket.disconnect(true)
        }
      }

      saveModerationData()
    } catch (e) {
      console.error('[mod] Error processing report:', e)
    }
  }

  const io = new Server(httpServer, {
    cors: {
      origin: (process.env.CORS_ORIGIN || '*')
        .split(',')
        .map(o => o.trim())
        .flatMap(o => {
          if (o === '*') return ['*'];
          if (o.startsWith('http')) return [o];
          // Automatically add https if missing, and also handle www
          return [`https://${o}`, `https://www.${o.replace(/^www\./, '')}`];
        }),
      methods: ['GET', 'POST'],
      credentials: true,
    },
    // Keep connections alive — Railway closes idle WS after ~60s without traffic
    pingTimeout: 60000,
    pingInterval: 25000,
    // Try WebSocket first, fall back to polling
    transports: ['websocket', 'polling'],
    // Allow large signal payloads (some WebRTC offers can be big)
    maxHttpBufferSize: 1e7,
  })

  // ─── Socket Events ──────────────────────────────────────────────────────────

  io.on('connection', (socket) => {
    const ip = getIp(socket)
    // We no longer block the connection globally here. 
    // This allows banned admins to still reach the /admin login screen.

    socket.connectedAt = Date.now()
    const clientCount = io.engine.clientsCount
    if (dev) console.log(`[+] ${socket.id} (IP: ${ip}) connected | total: ${clientCount}`)

    // ── Record Visitor History ────────────────────────────────────────────────
    if (ip) {
      try {
        if (!moderationData.visitors) moderationData.visitors = []
        
        const existingIdx = moderationData.visitors.findIndex(v => v.ip === ip)
        if (existingIdx !== -1) {
          moderationData.visitors[existingIdx].lastSeen = Date.now()
          moderationData.visitors[existingIdx].visits = (moderationData.visitors[existingIdx].visits || 1) + 1
        } else {
          moderationData.visitors.unshift({
            ip,
            firstSeen: Date.now(),
            lastSeen: Date.now(),
            visits: 1
          })
          // Limit to 5000 visitors to avoid file bloat while still tracking many users
          if (moderationData.visitors.length > 5000) moderationData.visitors.pop()
        }
        saveModerationData()
      } catch (e) {
        console.error('[mod] Visitor history error:', e)
      }
    }

    // ── Join Queue ────────────────────────────────────────────────────────────
    socket.on('join-queue', ({ mode = 'video', interests = [] } = {}) => {
      if (isBanned(ip) && !socket.isAdmin) {
        socket.emit('banned', { reason: 'Your IP address is suspended from this service.' })
        return
      }
      const queueKey = mode === 'text' ? 'text' : 'video'
      const queue = queues[queueKey]

      // Clean up previous room if any
      if (socketRoom.get(socket.id)) {
        leaveRoom(io, socket)
      }

      // Normalize interests
      const normalizedInterests = (Array.isArray(interests) ? interests : [])
        .map(i => String(i).toLowerCase().trim())
        .filter(Boolean)
        .slice(0, 10)

      const match = findMatch(queueKey, socket.id, normalizedInterests)

      if (match) {
        const roomId = `room_${Date.now()}_${Math.random().toString(36).slice(2)}`
        rooms.set(roomId, { members: new Set([socket.id, match.id]) })
        socketRoom.set(socket.id, roomId)
        socketRoom.set(match.id, roomId)

        socket.join(roomId)
        io.sockets.sockets.get(match.id)?.join(roomId)

        socket.emit('matched', { roomId, initiator: true })
        io.to(match.id).emit('matched', { roomId, initiator: false })
      } else {
        // Avoid duplicates in queue
        if (!queue.find(u => u.id === socket.id)) {
          queue.push({ id: socket.id, interests: normalizedInterests })
          addToInterestMap(socket.id, queueKey, normalizedInterests)
        }
        socket.emit('waiting', { position: queue.length })
        if (dev) console.log(`[~] ${socket.id} waiting in ${queueKey} queue (len: ${queue.length})`)
      }
    })

    // ── Leave Queue (cancel waiting before match) ─────────────────────────────
    socket.on('leave-queue', () => {
      removeFromQueue(socket.id)
      socket.emit('queue-left')
    })

    // ── Leave Room (Next / Stop) ──────────────────────────────────────────────
    socket.on('leave-room', () => {
      leaveRoom(io, socket)
      if (dev) console.log(`[~] ${socket.id} left their room`)
    })

    // ── WebRTC Signaling Relay ────────────────────────────────────────────────
    // The server never sees video data — it only relays the tiny handshake signals
    socket.on('signal', ({ roomId, signal }) => {
      // Security: only relay if this socket is actually in the room
      const myRoom = socketRoom.get(socket.id)
      if (myRoom !== roomId) return
      socket.to(roomId).emit('signal', { signal })
    })

    // ── Text Chat Relay ───────────────────────────────────────────────────────
    socket.on('chat-message', ({ roomId, text }) => {
      if (!text || typeof text !== 'string') return
      const trimmed = text.trim().slice(0, 500) // max 500 chars
      if (!trimmed) return

      const myRoom = socketRoom.get(socket.id)
      if (myRoom !== roomId) return

      // Apply Filter
      const moderatedText = moderateContent(trimmed)

      if (isBanned(ip) && !socket.isAdmin) {
        socket.emit('banned', { reason: 'Your IP address is suspended from this service.' })
        socket.disconnect(true)
        return
      }

      socket.to(roomId).emit('chat-message', { text: moderatedText })
    })

    // ── Moderation Events ───────────────────────────────────────────────────
    socket.on('report-user', ({ roomId }) => {
      reportUser(socket, roomId)
    })

    // Admin: Get all moderation data
    socket.on('admin-get-data', ({ password }) => {
      try {
        const storedPass = (process.env.ADMIN_PASSWORD || '').trim()
        const providedPass = (password || '').trim()

        const isFirstAuth = storedPass && providedPass === storedPass
        
        if (socket.isAdmin || isFirstAuth) {
          if (isFirstAuth) {
            socket.isAdmin = true
            console.log(`[mod] Admin authenticated: ${ip}`)
          }

          const waitingCount = queues.video.length + queues.text.length
          
          // Gather all active connections (limit loop scope and add safety)
          const activeUsers = []
          if (io.sockets.sockets) {
            for (const [id, s] of io.sockets.sockets) {
               if (s) {
                 activeUsers.push({
                   id: id,
                   ip: getIp(s),
                   connectedAt: s.connectedAt || Date.now(),
                 })
               }
            }
          }

          socket.emit('admin-data', {
            ...moderationData,
            online: io.engine.clientsCount,
            waiting: waitingCount,
            chatting: rooms.size * 2,
            activeUsers: activeUsers.sort((a, b) => b.connectedAt - a.connectedAt).slice(0, 100) // Cap at 100 recent users
          })
        } else {
          if (!storedPass) {
            console.error('[mod] CRITICAL: ADMIN_PASSWORD is NOT set in environment variables!')
            socket.emit('admin-error', { message: 'Server Configuration Error: ADMIN_PASSWORD is not set in production.' })
          } else {
            socket.emit('admin-error', { message: 'Invalid Admin Password' })
          }
        }
      } catch (e) {
        console.error('[mod] Admin login error:', e)
        socket.emit('admin-error', { message: 'Internal Server Error during verification' })
      }
    })

    socket.on('admin-ban-ip', ({ ip, reason, password }) => {
      const storedPass = (process.env.ADMIN_PASSWORD || '').trim()
      const providedPass = (password || '').trim()

      if (socket.isAdmin || (storedPass && providedPass === storedPass)) {
        banUser(ip, reason)
        // Disconnect any active sockets with this IP
        for (const [id, s] of io.sockets.sockets) {
          if (getIp(s) === ip) {
            s.emit('banned', { reason })
            s.disconnect(true)
          }
        }
      }
    })

    socket.on('admin-unban-ip', ({ ip, password }) => {
      const storedPass = (process.env.ADMIN_PASSWORD || '').trim()
      const providedPass = (password || '').trim()

      if (socket.isAdmin || (storedPass && providedPass === storedPass)) {
        moderationData.bans = moderationData.bans.filter(b => b.ip !== ip)
        saveModerationData()
      }
    })

    // ── Stats ─────────────────────────────────────────────────────────────────
    socket.on('get-stats', () => {
      const waitingCount = queues.video.length + queues.text.length
      socket.emit('stats', {
        online: io.engine.clientsCount,
        waiting: waitingCount,
        chatting: rooms.size * 2,
        rooms: rooms.size,
      })
    })

    // ── Disconnect ────────────────────────────────────────────────────────────
    socket.on('disconnect', (reason) => {
      leaveRoom(io, socket)
      removeFromQueue(socket.id)
      if (dev) console.log(`[-] ${socket.id} disconnected (${reason}) | total: ${io.engine.clientsCount}`)
    })
  })

  // ─── Periodic Stats Broadcast ─────────────────────────────────────────────
  // Broadcasts online count every 30s — keeps connections warm on Railway
  // and gives all clients a live user count update without them asking.
  setInterval(() => {
    const waitingCount = queues.video.length + queues.text.length
    io.emit('stats', {
      online: io.engine.clientsCount,
      waiting: waitingCount,
      chatting: rooms.size * 2,
      rooms: rooms.size,
    })
    if (dev) {
      console.log(
        `[stats] online=${io.engine.clientsCount} | rooms=${rooms.size} | ` +
        `queue_video=${queues.video.length} | queue_text=${queues.text.length}`
      )
    }
  }, 30_000)

  // ─── Start ─────────────────────────────────────────────────────────────────
  httpServer.listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`)
    console.log(`> Mode: ${dev ? 'development' : 'production'}`)
  })
})
