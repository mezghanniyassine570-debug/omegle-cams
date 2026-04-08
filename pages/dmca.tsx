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

export default function DMCA() {
  return (
    <LegalLayout title="DMCA / Copyright Notice">
      <section style={{ marginBottom: '30px' }}>
        <p>OmegleCams.com respects the intellectual property rights of others and expects its users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement committed using the OmegleCams service.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>1. Prohibited Content</h2>
        <p>Users are strictly prohibited from sharing, broadcasting, or transmitting any material that they do not own or have explicit permission to use. This includes, but is not limited to, copyrighted videos, music, and images.</p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>2. Filing a DMCA Notice</h2>
        <p>If you are a copyright owner or an agent thereof and believe that any content on our site infringes upon your copyrights, you may submit a notification pursuant to the DMCA by providing our Copyright Agent with the following information in writing:</p>
        <ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
          <li>A physical or electronic signature of a person authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
          <li>Identification of the copyrighted work claimed to have been infringed.</li>
          <li>Identification of the material that is claimed to be infringing and information reasonably sufficient to permit us to locate the material (e.g., timestamps, screenshots, or user IDs if available).</li>
          <li>Information reasonably sufficient to permit us to contact you, such as an address, telephone number, and email address.</li>
          <li>A statement that you have a good faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.</li>
          <li>A statement that the information in the notification is accurate, and under penalty of perjury, that you are authorized to act on behalf of the owner of an exclusive right that is allegedly infringed.</li>
        </ul>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>3. Contact Information</h2>
        <p>DMCA complaints and copyright notices should be sent to: <strong>dmca@omeglecams.com</strong></p>
      </section>

      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#fff', fontSize: '1.5rem', marginBottom: '15px' }}>4. Counter-Notification</h2>
        <p>If you believe that your content was removed by mistake or misidentification, you may submit a counter-notification to us. Upon receipt of a valid counter-notification, we may restore the removed content unless the original complainant files a court action.</p>
      </section>
    </LegalLayout>
  )
}
