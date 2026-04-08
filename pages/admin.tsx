import React, { useState, useEffect, useRef } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'

export default function AdminDashboard() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [loginError, setLoginError] = useState('')
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
      setIsAuthorized(true)
      setIsLoggingIn(false)
      setLoginError('')
    })

    socket.on('admin-error', (err: any) => {
      setLoginError(err.message)
      setIsLoggingIn(false)
      if (isAuthorized) {
        setIsAuthorized(false)
        alert(err.message)
      }
    })

    const interval = setInterval(() => {
      socket.emit('get-stats')
      if (isAuthorized) {
        // We no longer need to send the password every time because the server
        // now tracks 'socket.isAdmin' session state.
        socket.emit('admin-get-data', { password: '' })
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
    if (password && socketRef.current) {
      setIsLoggingIn(true)
      setLoginError('')
      socketRef.current.emit('admin-get-data', { password })
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

  const handleExport = () => {
    if (!data?.visitors || data.visitors.length === 0) {
      alert('No visitor data to export.')
      return
    }

    const header = "OmegleCams Visitor History Export\nGenerated: " + new Date().toLocaleString() + "\n" + "-".repeat(50) + "\n\n"
    const content = data.visitors.map((v: any) => 
        `IP: ${v.ip.padEnd(20)} | Visits: ${String(v.visits).padEnd(5)} | First Seen: ${new Date(v.firstSeen).toLocaleString()} | Last Seen: ${new Date(v.lastSeen).toLocaleString()}`
    ).join('\n')

    const blob = new Blob([header + content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `visitor_history_${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
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
          {loginError && (
            <div style={{
              backgroundColor: loginError.includes('Configuration Error') ? '#7c2d12' : '#450a0a', 
              border: loginError.includes('Configuration Error') ? '1px solid #d97706' : '1px solid #7f1d1d', 
              color: loginError.includes('Configuration Error') ? '#fef3c7' : '#fca5a5',
              padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'center',
              fontWeight: 600
            }}>
              {loginError}
            </div>
          )}
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => {
                setPassword(e.target.value)
                if (loginError) setLoginError('')
            }}
            disabled={isLoggingIn}
            style={{
              width: '100%', padding: '12px', background: '#09090b', border: '1px solid #27272a',
              borderRadius: '8px', color: '#fff', marginBottom: '16px', outline: 'none',
              opacity: isLoggingIn ? 0.5 : 1
            }}
          />
          <button 
            disabled={isLoggingIn}
            style={{
              width: '100%', padding: '12px', background: isLoggingIn ? '#1e3a8a' : '#2563eb', border: 'none',
              borderRadius: '8px', color: '#fff', fontWeight: 600, cursor: isLoggingIn ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            {isLoggingIn ? 'Verifying...' : 'Login'}
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
        
        {/* Active Connections */}
        <div style={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px', marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Active Connections
            <span style={{ fontSize: '11px', background: '#27272a', padding: '2px 8px', borderRadius: '100px', color: '#a1a1aa' }}>{data?.activeUsers?.length || 0}</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {data?.activeUsers?.length > 0 ? (
              data.activeUsers.map((user: any, i: number) => (
                <div key={user.id} style={{ 
                  backgroundColor: '#09090b', padding: '16px', borderRadius: '12px', border: '1px solid #27272a',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#fff', marginBottom: '4px' }}>{user.ip}</div>
                    <div style={{ fontSize: '11px', color: '#52525b' }}>ID: {user.id.slice(0, 8)}... • Online since {new Date(user.connectedAt).toLocaleTimeString()}</div>
                  </div>
                  <button
                    onClick={() => handleBan(user.ip)}
                    style={{ 
                        padding: '6px 10px', background: 'transparent', border: '1px solid #450a0a', 
                        color: '#ef4444', borderRadius: '6px', fontSize: '11px', fontWeight: 600, cursor: 'pointer' 
                    }}
                  >
                    Quick Ban
                  </button>
                </div>
              ))
            ) : (
              <p style={{ color: '#52525b', textAlign: 'center', gridColumn: '1 / -1', padding: '20px 0' }}>No active visitors tracked.</p>
            )}
          </div>
        </div>

        {/* Visitor History */}
        <div style={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px', marginTop: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid #27272a', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                Lifetime Visitor History
                <span style={{ fontSize: '11px', background: '#27272a', padding: '2px 8px', borderRadius: '100px', color: '#a1a1aa', marginLeft: '10px' }}>
                {data?.visitors?.length || 0} unique
                </span>
            </div>
            <button 
                onClick={handleExport}
                style={{
                    padding: '6px 14px', background: '#09090b', border: '1px solid #27272a', 
                    color: '#fff', borderRadius: '8px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    transition: 'border 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#52525b'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = '#27272a'}
            >
                Export TXT
            </button>
          </h2>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#71717a', borderBottom: '1px solid #27272a' }}>
                  <th style={{ padding: '12px 8px' }}>IP Address</th>
                  <th style={{ padding: '12px 8px' }}>Visits</th>
                  <th style={{ padding: '12px 8px' }}>First Seen</th>
                  <th style={{ padding: '12px 8px' }}>Last Seen</th>
                  <th style={{ padding: '12px 8px', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {data?.visitors?.length > 0 ? (
                  data.visitors.map((visitor: any, i: number) => (
                    <tr key={i} style={{ borderBottom: '1px solid #27272a', color: '#e4e4e7' }}>
                      <td style={{ padding: '12px 8px', fontFamily: 'monospace', color: '#fff' }}>{visitor.ip}</td>
                      <td style={{ padding: '12px 8px' }}>{visitor.visits}</td>
                      <td style={{ padding: '12px 8px', color: '#71717a', fontSize: '12px' }}>{new Date(visitor.firstSeen).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 8px', color: '#71717a', fontSize: '12px' }}>{new Date(visitor.lastSeen).toLocaleString()}</td>
                      <td style={{ padding: '12px 8px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleBan(visitor.ip)}
                          style={{ padding: '4px 10px', background: '#18181b', border: '1px solid #7f1d1d', color: '#ef4444', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                        >
                          Ban
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '40px 0', color: '#52525b' }}>No history recorded yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Global Stats or Search */}
        <div style={{ backgroundColor: '#18181b', borderRadius: '16px', border: '1px solid #27272a', padding: '24px', marginTop: '24px' }}>
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
