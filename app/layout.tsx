'use client';

import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import theme from '../theme/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <Head>
        {/* Favicon SVG for modern browsers */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Fallback ICO for older browsers */}
        <link rel="shortcut icon" href="/favicon.ico" />
        {/* Meta tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Lucky Logic | Residential IT Support</title>
      </Head>
      <body>
        <ChakraProvider theme={theme}>
          <Navbar />
          <Box pt="80px" minHeight="calc(100vh - 120px)" w="full">
            {children}
            <Footer />
          </Box>
        </ChakraProvider>
      </body>
    </html>
  );
}
