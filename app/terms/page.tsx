'use client';
import { Box, Heading, Text } from '@chakra-ui/react';

export default function TermsPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
      <Heading as="h1" size="xl" mb={6} color="brand.green">
        Terms & Conditions
      </Heading>

      <Text mb={4}>
        Welcome to Lucky Logic. By accessing this website, you agree to the following terms and
        conditions.
      </Text>

      <Heading as="h2" size="md" mt={8} mb={2}>
        Use of Website
      </Heading>
      <Text mb={4}>
        You agree to use this site only for lawful purposes and in a way that does not infringe on
        others' rights.
      </Text>

      <Heading as="h2" size="md" mt={8} mb={2}>
        Intellectual Property
      </Heading>
      <Text mb={4}>
        All content, branding, and visuals on this site are the intellectual property of Lucky Logic
        and may not be reused without written permission.
      </Text>

      <Heading as="h2" size="md" mt={8} mb={2}>
        Limitation of Liability
      </Heading>
      <Text mb={4}>
        Lucky Logic is not liable for any damages resulting from the use of this website or the
        information provided.
      </Text>

      <Heading as="h2" size="md" mt={8} mb={2}>
        Changes
      </Heading>
      <Text>
        We may update these terms at any time. Continued use of the site implies agreement with the
        current terms.
      </Text>
    </Box>
  );
}
