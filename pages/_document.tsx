import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Google Analytics (gtag.js) */}
          <script async src="https://www.googletagmanager.com/gtag/js?id=G-FEP0G4RJXM" />
          <script
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-FEP0G4RJXM');
              `,
            }}
          />

          <link rel="icon" href="/favicon2.PNG" />

          {/* Google Fonts - Inter */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap"
            rel="stylesheet"
          />
          <meta name="theme-color" content="#09090b" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
