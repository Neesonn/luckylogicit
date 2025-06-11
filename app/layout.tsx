// app/layout.tsx
'use client';
import { ChakraProvider } from '@chakra-ui/react';
import Head from 'next/head';
import theme from '../theme/theme';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        <meta name="google-site-verification" content="r71WszO964Ylg5Pg3MBa_q3h5x0o53j4FBd5v6gUWgk" />
      </Head>
      <body>
        <ChakraProvider theme={theme}>{children}</ChakraProvider>
      </body>
    </html>
  );
}
