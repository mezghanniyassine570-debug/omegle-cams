import React, { useState } from 'react'

interface LegalModalProps {
  isOpen: boolean
  onAccept: () => void
  onClose: () => void
}

export default function LegalModal({ isOpen, onAccept, onClose }: LegalModalProps) {
  const [showFull, setShowFull] = useState(false)

  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      background: 'rgba(0, 0, 0, 0.85)',
      backdropFilter: 'blur(8px)',
    }}>
      <div style={{
        background: '#18181b',
        border: '1px solid #27272a',
        borderRadius: 24,
        maxWidth: 500,
        width: '100%',
        maxHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        animation: 'modalSlideUp 0.3s ease-out',
      }}>
        {/* Header */}
        <div style={{ padding: '24px 24px 12px', borderBottom: '1px solid #27272a' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>
            Agreement Required
          </h2>
          <p style={{ color: '#71717a', fontSize: '0.9rem', marginTop: 4 }}>
            Please review and accept our terms to continue.
          </p>
        </div>

        {/* Content */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {!showFull ? (
            <div style={{ color: '#d4d4d8', fontSize: '0.95rem', lineHeight: 1.6 }}>
              <ul style={{ paddingLeft: 20, marginBottom: 20 }}>
                <li><strong>Age Restriction:</strong> You must be 18 or older.</li>
                <li><strong>Responsibility:</strong> You are fully responsible for your own interactions.</li>
                <li><strong>Conduct:</strong> No illegal activity, pornography, or harassment.</li>
                <li><strong>Liability:</strong> Site owner is not responsible for any behavior or content.</li>
              </ul>
              <button 
                onClick={() => setShowFull(true)}
                style={{ 
                  background: 'none', border: 'none', color: '#2563eb', 
                  cursor: 'pointer', padding: 0, fontWeight: 600, fontSize: '0.9rem' 
                }}
              >
                Read full Terms of Service →
              </button>
            </div>
          ) : (
            <div style={{ color: '#a1a1aa', fontSize: '0.85rem', lineHeight: 1.6 }}>
              <button 
                onClick={() => setShowFull(false)}
                style={{ marginBottom: 15, background: '#27272a', border: 'none', color: '#fff', borderRadius: 8, padding: '4px 12px', cursor: 'pointer', fontSize: 12 }}
              >
                ← Back to Summary
              </button>
              <h3 style={{ color: '#fff', marginBottom: 10 }}>Terms of Service</h3>
              <p>By using OmegleCams.com, you agree to follow our rules. You must be 18+ years old. The service is provided "as is". The site owner has zero liability for any content shared or any actions taken by users. We do not monitor all interactions. You use the service at your own risk.</p>
              <h3 style={{ color: '#fff', margin: '15px 0 10px' }}>Conduct</h3>
              <p>Prohibited: Illegal activities, hate speech, pornography, spam, and sharing copyrighted material without permission. We reserve the right to ban users at any time.</p>
              <h3 style={{ color: '#fff', margin: '15px 0 10px' }}>Privacy</h3>
              <p>We collect minimal logs (IP/Timestamp) for abuse prevention. We do not sell your data.</p>
              <p style={{ marginTop: 15 }}>For more details, visit our full Legal pages in the site footer.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '20px 24px', borderTop: '1px solid #27272a', display: 'flex', gap: 12 }}>
          <button 
            onClick={onClose}
            style={{ 
              flex: 1, padding: '12px', borderRadius: 12, border: '1px solid #3f3f46', 
              background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 600 
            }}
          >
            Decline
          </button>
          <button 
            onClick={onAccept}
            style={{ 
              flex: 2, padding: '12px', borderRadius: 12, border: 'none', 
              background: 'linear-gradient(135deg, #2563eb, #7c3aed)', color: '#fff', 
              cursor: 'pointer', fontWeight: 800, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}
          >
            Accept & Start Chat
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
