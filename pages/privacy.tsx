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

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy">
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>1. Information We Collect</h2>
        <p>To provide a functional and safe service, we collect minimal data from our users:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li><strong>IP Address:</strong> Collected for abuse prevention and security tracking.</li>
          <li><strong>Browser Information:</strong> Browser type, device type, and version for optimization.</li>
          <li><strong>Session Logs:</strong> Minimal timestamps and session IDs to track connections and detect bot activity.</li>
          <li><strong>Cookies:</strong> We use basic cookies and analytics to understand site usage and maintain session state.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>2. How We Use Data</h2>
        <p>Your data is used specifically for the following purposes:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li>To maintain and improve site functionality.</li>
          <li>To prevent abuse, spam, and illegal activities.</li>
          <li>To analyze general traffic patterns and performance.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>3. Data Sharing and Selling</h2>
        <p><strong>We do not sell your personal data to third parties.</strong> Data is only shared when required by law or to protect our legal rights, or in the case of preventing imminent harm.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>4. Your Rights</h2>
        <p>Users have the right to request information about the data we hold or request its deletion. If you wish to exercise these rights, please contact us at <strong>privacy@omeglecams.com</strong>.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>5. Security</h2>
        <p>We implement reasonable security measures to protect your information, but no method of transmission over the Internet is 100% secure. You use the service at your own risk.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>6. Policy Updates</h2>
        <p>We may update this Privacy Policy from time to time. We encourage users to check this page periodically for any changes.</p>
      </section>
    </LegalLayout>
  )
}
