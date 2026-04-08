import React, { useState, useEffect } from 'react'

export default function AgeGate() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  useEffect(() => {
    const verified = localStorage.getItem('omeglecams_age_verified') === 'true'
    setIsVerified(verified)
  }, [])

  const handleVerify = () => {
    localStorage.setItem('omeglecams_age_verified', 'true')
    setIsVerified(true)
  }

  const handleExit = () => {
    window.location.href = 'https://www.google.com'
  }

  if (isVerified === null || isVerified === true) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 9999,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(9, 9, 11, 0.95)',
      backdropFilter: 'blur(16px)',
      padding: '24px',
      color: '#fff',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: 480,
        width: '100%',
        textAlign: 'center',
        padding: '48px 32px',
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: 32,
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        animation: 'fadeIn 0.5s ease-out'
      }}>
        <div style={{
          width: 80,
          height: 80,
          background: 'rgba(239, 68, 68, 0.1)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          color: '#ef4444',
          fontSize: '2rem',
          fontWeight: 900,
          border: '2px solid #ef4444'
        }}>
          18+
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: 800,
          marginBottom: 16,
          background: 'linear-gradient(to right, #fff, #a1a1aa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Age Verification Required
        </h1>

        <p style={{
          color: '#a1a1aa',
          lineHeight: 1.6,
          marginBottom: 32,
          fontSize: '1.1rem'
        }}>
          This platform contains adult content and is restricted to users aged 18 and older. 
          By entering, you confirm that you are at least 18 years of age.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button
            onClick={handleVerify}
            style={{
              padding: '16px',
              borderRadius: 16,
              border: 'none',
              background: '#fff',
              color: '#000',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.02)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)' }}
          >
            I am 18 or older — Enter
          </button>
          
          <button
            onClick={handleExit}
            style={{
              padding: '16px',
              borderRadius: 16,
              border: '1px solid #27272a',
              background: 'transparent',
              color: '#71717a',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { 
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'rgba(255,255,255,0.05)';
                el.style.color = '#fff';
            }}
            onMouseLeave={e => { 
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = 'transparent';
                el.style.color = '#71717a';
            }}
          >
            I am under 18 — Exit
          </button>
        </div>

        <p style={{ marginTop: 32, fontSize: '0.8rem', color: '#52525b' }}>
          By clicking "Enter", you agree to our Terms of Service and Privacy Policy.
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
