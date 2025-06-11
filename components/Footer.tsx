import { Box, Text, Link, Stack } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box textAlign="center" py={6} bg="brand.green">
      <Stack spacing={1}>
        <Text fontSize="sm" color="white">
          © {new Date().getFullYear()} Lucky Logic. All rights reserved.
        </Text>
        <Text fontSize="sm" color="white">
          <Link href="/privacy-policy" textDecoration="underline">
            Privacy Policy
          </Link>{' '}
          ·{' '}
          <Link href="/terms" textDecoration="underline">
            Terms & Conditions
          </Link>
        </Text>
      </Stack>
    </Box>
  );
}
