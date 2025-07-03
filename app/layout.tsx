'use client';

import { ChakraProvider, Box, Flex } from '@chakra-ui/react';
import Script from 'next/script';
import theme from '../theme/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ErrorBoundary from '../components/ErrorBoundary';
import GoogleAnalytics from '../components/GoogleAnalytics';
import { LockProvider } from '../components/LockContext';
import { StripeDataProvider } from '../components/StripeDataContext';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Favicon SVG for modern browsers */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        {/* Fallback ICO for older browsers */}
        <link rel="shortcut icon" href="/favicon.ico" />
        
        {/* Basic Meta Tags */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta charSet="utf-8" />
        <title>Lucky Logic | Residential IT Support Sydney</title>
        <meta name="description" content="Professional IT support services in Sydney. We offer computer repairs, network setup, smart home assistance, and more. Fast, reliable, and affordable IT solutions for your home." />
        <meta name="keywords" content="IT support Sydney, computer repairs, network setup, smart home, tech support, residential IT, computer maintenance, Sydney IT services" />
        <meta name="author" content="Lucky Logic IT" />
        <meta name="robots" content="index, follow" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://luckylogic.com.au/" />
        <meta property="og:title" content="Lucky Logic | Residential IT Support Sydney" />
        <meta property="og:description" content="Professional IT support services in Sydney. We offer computer repairs, network setup, smart home assistance, and more. Fast, reliable, and affordable IT solutions for your home." />
        <meta property="og:image" content="https://luckylogic.com.au/lucky-logic-logo.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://luckylogic.com.au/" />
        <meta property="twitter:title" content="Lucky Logic | Residential IT Support Sydney" />
        <meta property="twitter:description" content="Professional IT support services in Sydney. We offer computer repairs, network setup, smart home assistance, and more. Fast, reliable, and affordable IT solutions for your home." />
        <meta property="twitter:image" content="https://luckylogic.com.au/lucky-logic-logo.png" />
        
        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#4CAF50" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Lucky Logic IT" />
        
        {/* Canonical URL */}
        <link rel="canonical" href="https://luckylogic.com.au/" />
      </head>
      <body>
        <a
          href="#main-content"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: 'auto',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
            zIndex: -1,
          }}
          onFocus={(e) => {
            e.currentTarget.style.position = 'static';
            e.currentTarget.style.width = 'auto';
            e.currentTarget.style.height = 'auto';
          }}
          onBlur={(e) => {
            e.currentTarget.style.position = 'absolute';
            e.currentTarget.style.width = '1px';
            e.currentTarget.style.height = '1px';
          }}
        >
          Skip to main content
        </a>
        <ChakraProvider theme={theme}>
          <ErrorBoundary>
            <LockProvider>
              <StripeDataProvider>
                <Flex direction="column" minH="100vh">
                  <Navbar />
                  <Box as="main" id="main-content" flex="1" pt="80px">
                    {children}
                  </Box>
                  <Footer />
                </Flex>
              </StripeDataProvider>
            </LockProvider>
          </ErrorBoundary>
        </ChakraProvider>
        <GoogleAnalytics />
      </body>
    </html>
  );
}
