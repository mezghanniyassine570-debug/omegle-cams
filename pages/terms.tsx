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

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service">
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>1. Acceptance of Terms</h2>
        <p>By accessing and using OmegleCams.com ("the Site"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the service.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>2. Strict Age Requirement (18+)</h2>
        <p>You MUST be at least 18 years of age to use OmegleCams.com. This platform is strictly for adults only. Minors are strictly prohibited from accessing or using this service. By clicking through our age gate and using the Site, you represent and warrant that you are at least 18 years old.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>3. User Responsibility</h2>
        <p>Users are fully and solely responsible for their interactions and any content they share or encounter on the Site. The site owner is not responsible for any behavior, content, or communication between users.</p>
        <p><strong>Use at your own risk.</strong> You may encounter content that is offensive, harmful, or inappropriate.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>4. Prohibited Conduct & Zero Tolerance</h2>
        <p>We have a <strong>Zero Tolerance Policy</strong> for the following prohibited activities:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li>Sexual content involving minors (will be reported to NCMEC/authorities).</li>
          <li>Nudity, sexual acts, or sexually explicit content of any kind.</li>
          <li>Harassment, bullying, hate speech, or exploitation.</li>
          <li>Illegal activity or promotion of illegal acts.</li>
          <li>Spamming or sending unsolicited advertisements.</li>
          <li>Sharing copyrighted material without permission.</li>
        </ul>
        <p style={{ marginTop: '10px' }}>Violation of these rules will result in an immediate and permanent ban. We cooperate with law enforcement when required.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>5. Termination of Access</h2>
        <p>We reserve the right to suspend, ban, or terminate your access to the Site at any time, without notice, for any reason, including but not limited to violations of these Terms.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>6. No Liability Clause</h2>
        <p>The service is provided on an "AS IS" and "AS AVAILABLE" basis. OmegleCams and its owners shall not be liable for any damages, harm, loss of data, or other issues arising from your use of the service. We do not guarantee that the service will be uninterrupted or error-free.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>7. Reporting Abuse</h2>
        <p>We actively take steps to prevent misuse and remove harmful users. If you encounter content or behavior that violates these terms, please report it immediately via the in-chat report button or by emailing <strong>omegleadminuser@gmail.com</strong>.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>8. Governing Law</h2>
        <p>These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
      </section>
    </LegalLayout>
  )
}
