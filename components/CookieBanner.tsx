'use client';

import { Box, Button, Text, Flex, Stack } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

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
    <Box
      position="fixed"
      bottom={0}
      width="100%"
      bg="gray.800"
      color="white"
      zIndex={999}
      px={4}
      py={3}
    >
      <Flex
        maxW="6xl"
        mx="auto"
        align="center"
        justify="space-between"
        flexWrap="wrap"
        direction={{ base: 'column', md: 'row' }}
        gap={4}
      >
        <Text fontSize="sm" textAlign="center">
          We use cookies to improve your experience. By using this site, you agree to our{' '}
          <a href="/privacy-policy" style={{ textDecoration: 'underline' }}>
            Privacy Policy
          </a>
          .
        </Text>
        <Stack direction="row" spacing={3}>
          <Button size="sm" colorScheme="green" onClick={handleAccept}>
            Accept
          </Button>
          <Button size="sm" colorScheme="red" variant="outline" onClick={handleDecline}>
            Decline
          </Button>
        </Stack>
      </Flex>
    </Box>
  );
}
