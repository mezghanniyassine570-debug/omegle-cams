import React from 'react'
import Head from 'next/head'
import Link from 'next/link'

const LegalLayout = ({ children, title }: { children: React.ReactNode, title: string }) => (
  <div style={{
    minHeight: '100dvh',
    background: '#09090b',
    color: '#e4e4e7',
    fontFamily: 'Inter, sans-serif',
    padding: '60px 20px',
    lineHeight: '1.6'
  }}>
    <Head>
      <title>{title} | OmegleCams</title>
    </Head>
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <Link href="/" style={{ color: '#2563eb', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' }}>
        ← Back to Home
      </Link>
      <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '30px', color: '#fff', letterSpacing: '-0.02em' }}>{title}</h1>
      <div className="legal-content">
        {children}
      </div>
      <div style={{ marginTop: '60px', borderTop: '1px solid #27272a', paddingTop: '20px', textAlign: 'center', fontSize: '12px', color: '#71717a' }}>
        © {new Date().getFullYear()} OmegleCams.com. All rights reserved.
      </div>
    </div>
  </div>
)

export default function Contact() {
  return (
    <LegalLayout title="Contact Us">
      <section style={{ marginBottom: '30px' }}>
        <p>If you have any questions, concerns, or feedback regarding OmegleCams, please feel free to reach out to us.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>General Enquiries</h2>
        <p>For general questions or support, you can reach out to us at: <strong>support@omeglecams.com</strong></p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Abuse Reporting</h2>
        <p>To report abuse, harassment, or prohibited content, please use the in-chat report button or email: <strong>report@omeglecams.com</strong></p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>Privacy Inquiries</h2>
        <p>For data deletion requests or privacy-related questions: <strong>privacy@omeglecams.com</strong></p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <p>We aim to respond to all inquiries within 48-72 hours. Thank you for using OmegleCams!</p>
      </section>
    </LegalLayout>
  )
}
