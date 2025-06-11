'use client';
import { ChakraProvider } from '@chakra-ui/react';
import theme from '../theme/theme';
import CookieBanner from '../components/CookieBanner';
import GoogleAnalytics from '../components/GoogleAnalytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Google Site Verification */}
        <meta
          name="google-site-verification"
          content="r71WszO964Ylg5Pg3MBa_q3h5x0o53j4FBd5v6gUWgk"
        />
      </head>
      <body>
        <ChakraProvider theme={theme}>
          {children}
          <CookieBanner />
          <GoogleAnalytics />
        </ChakraProvider>
      </body>
    </html>
  );
}
