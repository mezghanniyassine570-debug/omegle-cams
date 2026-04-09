import React, { useState, useEffect } from 'react'

interface AgeGateProps {
  onAccept: () => void
}

export default function AgeGate({ onAccept }: AgeGateProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    // Check if already accepted
    const accepted = localStorage.getItem('omegle_age_accepted')
    if (!accepted) {
      setIsVisible(true)
      // Prevent scrolling while gate is shown
      document.body.style.overflow = 'hidden'
    } else {
      onAccept()
    }
  }, [onAccept])

  const handleAccept = () => {
    if (!checked) return
    localStorage.setItem('omegle_age_accepted', 'true')
    setIsVisible(false)
    document.body.style.overflow = 'auto'
    onAccept()
  }

  if (!isVisible) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      backgroundColor: '#09090b',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      color: '#e4e4e7',
      fontFamily: 'Inter, sans-serif',
    }} id="age-gate">
      <div style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: '#18181b',
        border: '1px solid #27272a',
        borderRadius: '24px',
        padding: '40px 32px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
      }}>
        {/* Warning Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#3f1515',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: '#ef4444',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 style={{
          fontSize: '24px',
          fontWeight: 900,
          marginBottom: '12px',
          color: '#fff',
          letterSpacing: '-0.025em',
        }}>
          it's not website for kids
        </h1>

        <p style={{
          fontSize: '15px',
          lineHeight: '1.6',
          color: '#a1a1aa',
          marginBottom: '24px',
        }}>
          OmegleCams is a platform intended for <strong style={{ color: '#fff' }}>adults only</strong>.
          By entering, you acknowledge that you may encounter user-generated content that is inappropriate
          or explicit.
        </p>

        <p style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#ef4444',
          marginBottom: '24px',
          backgroundColor: '#3f1515',
          padding: '12px',
          borderRadius: '12px',
          border: '1px solid #7f1d1d',
        }}>
          website owner is not responsible on any thing bad happen on the website
        </p>

        {/* Safety Warnings */}
        <div style={{
          textAlign: 'left',
          backgroundColor: '#09090b',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          fontSize: '13px',
          border: '1px solid #27272a',
        }}>
          <h2 style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#71717a', marginBottom: '12px' }}>
            Safety Acknowledgements
          </h2>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#2563eb' }}>•</span>
              <span>I am 18 years or older.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#2563eb' }}>•</span>
              <span>I will not share personal information with strangers.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#2563eb' }}>•</span>
              <span>I understand that nudity and harassment are strictly prohibited.</span>
            </li>
            <li style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: '#2563eb' }}>•</span>
              <span>I will report any abuse or illegal activity immediately.</span>
            </li>
          </ul>
        </div>

        {/* Accept checkbox */}
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer',
          marginBottom: '32px',
          userSelect: 'none',
          padding: '4px',
        }}>
          <input
            type="checkbox"
            checked={checked}
            onChange={(e) => setChecked(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              accentColor: '#2563eb',
              cursor: 'pointer',
            }}
          />
          <span style={{ fontSize: '14px', color: '#d4d4d8', fontWeight: 500 }}>
            I am 18+ and I agree to the <a href="/terms" target="_blank" style={{ color: '#60a5fa' }}>Terms</a>
          </span>
        </label>

        <button
          onClick={handleAccept}
          disabled={!checked}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '14px',
            border: 'none',
            fontWeight: 700,
            fontSize: '16px',
            cursor: checked ? 'pointer' : 'not-allowed',
            background: checked ? 'linear-gradient(135deg, #2563eb, #7c3aed)' : '#27272a',
            color: checked ? '#fff' : '#52525b',
            transition: 'all 0.2s',
            boxShadow: checked ? '0 10px 25px -5px rgba(37, 99, 235, 0.4)' : 'none',
          }}
        >
          Enter OmegleCams
        </button>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#52525b' }}>
          If you are under 18, please leave this site immediately.
        </p>
      </div>
    </div>
  )
}
