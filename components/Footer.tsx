import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer style={{
      width: '100%',
      padding: '30px 20px',
      borderTop: '1px solid #27272a',
      background: '#09090b',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
        fontSize: '13px',
        fontWeight: 500
      }}>
        <Link href="/terms" style={{ color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }} 
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
          Terms of Service
        </Link>
        <Link href="/privacy" style={{ color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
          Privacy Policy
        </Link>
        <Link href="/dmca" style={{ color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
          DMCA / Copyright
        </Link>
        <Link href="/contact" style={{ color: '#71717a', textDecoration: 'none', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = '#71717a')}>
          Contact
        </Link>
      </div>
      <div style={{
        marginTop: '20px',
        textAlign: 'center',
        color: '#3f3f46',
        fontSize: '11px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase'
      }}>
        © {new Date().getFullYear()} OmegleCams.com — Talk to Strangers!
      </div>
    </footer>
  )
}
