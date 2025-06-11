'use client';

import { Box, Text, Link, Stack, Button } from '@chakra-ui/react';
import { useRef } from 'react';
import CookieBanner from './CookieBanner';

export default function Footer() {
  const cookieBannerRef = useRef<{ openBanner: () => void }>(null);

  const handleChangePreferences = () => {
    cookieBannerRef.current?.openBanner();
  };

  return (
    <>
      <Box textAlign="center" py={6} bg="brand.green">
        <Stack spacing={1} mb={3}>
          <Text fontSize="sm" color="white">
            © {new Date().getFullYear()} Lucky Logic. All rights reserved.
          </Text>
          <Text fontSize="sm" color="white">
            <Link href="/privacy-policy" textDecoration="underline" color="white">
              Privacy Policy
            </Link>{' '}
            ·{' '}
            <Link href="/terms" textDecoration="underline" color="white">
              Terms & Conditions
            </Link>
          </Text>
        </Stack>

        <Button
          size="sm"
          onClick={handleChangePreferences}
          variant="outline"
          colorScheme="yellow"
          aria-label="Change Cookie Preferences"
        >
          Change Cookie Preferences
        </Button>
      </Box>

      {/* Render CookieBanner once here */}
      <CookieBanner ref={cookieBannerRef} />
    </>
  );
}
