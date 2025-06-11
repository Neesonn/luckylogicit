'use client';
import { ChakraProvider, Box } from '@chakra-ui/react';
import theme from '../theme/theme';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ChakraProvider theme={theme}>
          <Navbar />
          <Box minHeight="calc(100vh - 120px)"> {/* Adjust if needed */}
            {children}
          </Box>
          <Footer />
        </ChakraProvider>
      </body>
    </html>
  );
}
