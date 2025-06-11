'use client';

import {
  Box,
  Button,
  Text,
  Flex,
  Stack,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Background overlay */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex="9998"
      />

      {/* Cookie consent popup */}
      <Box
        position="fixed"
        top="50%"
        left="50%"
        transform="translate(-50%, -50%)"
        zIndex="9999"
        bg="gray.800"
        color="white"
        px={6}
        py={5}
        rounded="lg"
        boxShadow="lg"
        maxW="sm"
        textAlign="center"
      >
        <Text fontSize="sm" mb={4}>
          We use cookies to improve your experience. By using this site, you agree to our{' '}
          <a href="/privacy-policy" style={{ textDecoration: 'underline' }}>
            Privacy Policy
          </a>.
        </Text>
        <Stack direction="row" spacing={4} justify="center" flexWrap="wrap">
          <Button size="sm" colorScheme="green" onClick={handleAccept}>
            Accept
          </Button>
          <Button size="sm" colorScheme="red" variant="outline" onClick={handleDecline}>
            Decline
          </Button>
        </Stack>
      </Box>
    </>
  );
}
