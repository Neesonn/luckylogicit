"use client";
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';
import { Box, Flex } from '@chakra-ui/react';

export default function ClientLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  return (
    <Flex direction="column" minH="100vh">
      {!isLoginPage && <Navbar />}
      <Box as="main" id="main-content" flex="1" pt={!isLoginPage ? "80px" : 0}>
        {children}
      </Box>
      {!isLoginPage && <Footer />}
    </Flex>
  );
} 