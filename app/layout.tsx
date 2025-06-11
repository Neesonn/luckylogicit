// app/layout.tsx
'use client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="r71WszO964Ylg5Pg3MBa_q3h5x0o53j4FBd5v6gUWgk"
        />

        {/* Google Analytics (GA4) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-88W370Y84T" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-88W370Y84T');
            `,
          }}
        />
      </head>
      <body>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
