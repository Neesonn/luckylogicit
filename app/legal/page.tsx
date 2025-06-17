'use client';

import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function LegalPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
      <Heading as="h1" size="xl" mb={6} color="brand.green">
        Legal Information
      </Heading>

      <Text mb={10}>
        Below you'll find all current legal documents relating to the use of Lucky Logic IT Services.
        These policies explain how we operate, how your data is handled, and your rights as a customer.
      </Text>

      <VStack align="start" spacing={4}>
        <Link as={NextLink} href="/privacy-policy" color="brand.green" fontWeight="semibold">
          📄 Privacy Policy
        </Link>
        <Link as={NextLink} href="/terms" color="brand.green" fontWeight="semibold">
          📄 Terms & Conditions
        </Link>
        <Link as={NextLink} href="/cookie-policy" color="brand.green" fontWeight="semibold">
          📄 Cookie Policy
        </Link>
      </VStack>
    </Box>
  );
}
