import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [data, setData] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [connected, setConnected] = useState(false)
  const socketRef = useRef<any>(null)

  useEffect(() => {
    const { getSocket } = require('../lib/socket')
    const socket = getSocket()
    socketRef.current = socket

    setConnected(socket.connected)
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))

    // Public stats (no password needed)
    socket.emit('get-stats')
    socket.on('stats', (res: any) => {
      setStats(res)
    })

    socket.on('admin-data', (res: any) => {
      setData(res)
    })

    socket.on('admin-error', (err: any) => {
      alert(err.message)
      setIsAuthorized(false)
    })

    const interval = setInterval(() => {
      socket.emit('get-stats')
      if (isAuthorized && password) {
        socket.emit('admin-get-data', { password })
      }
    }, 5000)

    return () => {
      clearInterval(interval)
      socket.off('stats')
      socket.off('admin-data')
      socket.off('admin-error')
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [isAuthorized, password])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password) {
      setIsAuthorized(true)
    }
  }

  const handleBan = (ip: string) => {
    const reason = prompt('Reason for ban:', 'Repeated abuse reports')
    if (reason && socketRef.current) {
      socketRef.current.emit('admin-ban-ip', { ip, reason, password })
    }
  }

  const handleUnban = (ip: string) => {
    if (confirm(`Unban IP ${ip}?`) && socketRef.current) {
      socketRef.current.emit('admin-unban-ip', { ip, password })
    }
  }

  if (!isAuthorized) {
    return (
      <div style={{
        height: '100dvh', backgroundColor: '#09090b', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: '#fff', fontFamily: 'Inter, sans-serif'
      }}>
        <form onSubmit={handleLogin} style={{
          backgroundColor: '#18181b', padding: '32px', borderRadius: '16px',
          border: '1px solid #27272a', width: '100%', maxWidth: '360px'
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px', textAlign: 'center' }}>Admin Access</h1>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%', padding: '12px', background: '#09090b', border: '1px solid #27272a',
              borderRadius: '8px', color: '#fff', marginBottom: '16px', outline: 'none'
            }}
          />
          <button style={{
            width: '100%', padding: '12px', background: '#2563eb', border: 'none',
            borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer'
          }}>
            Login
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh', backgroundColor: '#09090b', color: '#e4e4e7',
      padding: '40px 20px', fontFamily: 'Inter, sans-serif'
    }}>
      <Head>
        <title>OmegleCams | Admin Dashboard</title>
      </Head>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 900, color: '#fff' }}>Moderation Dashboard</h1>
            <p style={{ color: '#71717a' }}>Live tracking and abuse management</p>
          </div>
          <div style={{ display: 'flex', gap: '32px', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: connected ? '#22c55e' : '#ef4444' }}></div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: connected ? '#22c55e' : '#ef4444', textTransform: 'uppercase' }}>
                {connected ? 'Live' : 'Offline'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '32px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#22c55e' }}>{stats?.online || 0}</div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#52525b' }}>Total</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#60a5fa' }}>{stats?.waiting || 0}</div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#52525b' }}>Waiting</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 800, color: '#a78bfa' }}>{stats?.chatting || 0}</div>
                <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#52525b' }}>Chatting</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
          {/* Recent Reports */}
          <div style={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>Recent Reports</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {data?.logs?.length > 0 ? (
                data.logs.map((log: any, i: number) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fca5a5' }}>IP: {log.reportedIp}</div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>{new Date(log.timestamp).toLocaleString()} • Room: {log.roomId}</div>
                    </div>
                    <button
                      onClick={() => handleBan(log.reportedIp)}
                      style={{ padding: '6px 12px', background: '#3f1515', border: '1px solid #7f1d1d', color: '#ef4444', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Ban IP
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: '#52525b', textAlign: 'center', padding: '40px 0' }}>No reports logged yet.</p>
              )}
            </div>
          </div>

          {/* Active Bans */}
          <div style={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '12px' }}>Banned IPs</h2>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {data?.bans?.length > 0 ? (
                data.bans.map((ban: any, i: number) => (
                  <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #27272a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{ban.ip}</div>
                      <div style={{ fontSize: '11px', color: '#71717a' }}>{ban.reason} • {new Date(ban.timestamp).toLocaleDateString()}</div>
                    </div>
                    <button
                      onClick={() => handleUnban(ban.ip)}
                      style={{ padding: '6px 12px', background: '#09090b', border: '1px solid #27272a', color: '#a1a1aa', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                    >
                      Unban
                    </button>
                  </div>
                ))
              ) : (
                <p style={{ color: '#52525b', textAlign: 'center', padding: '40px 0' }}>No active bans.</p>
              )}
            </div>
          </div>
        </div>

        {/* Global Stats or Search */}
        <div style={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px' }}>
             <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px' }}>Quick Ban via IP</h2>
             <div style={{ display: 'flex', gap: '12px' }}>
                <input
                  id="quick-ban-ip"
                  type="text"
                  placeholder="0.0.0.0"
                  style={{ flex: 1, padding: '12px', background: '#09090b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                />
                <button
                  onClick={() => {
                    const el = document.getElementById('quick-ban-ip') as HTMLInputElement
                    if (el.value) { handleBan(el.value); el.value = ''; }
                  }}
                  style={{ padding: '0 24px', background: '#2563eb', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: 'pointer' }}
                >
                  Apply Ban
                </button>
             </div>
        </div>
      </div>
    </div>
  )
}
