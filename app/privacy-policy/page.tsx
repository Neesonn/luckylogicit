'use client';
import { Box, Heading, Text, UnorderedList, ListItem } from '@chakra-ui/react';

export default function PrivacyPolicyPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
      <Heading as="h1" size="xl" mb={6} color="brand.green">
        Privacy Policy
      </Heading>

      <Text mb={4}>
        At Lucky Logic, we take your privacy seriously. This Privacy Policy explains how we
        collect, use, and protect your personal information.
      </Text>

      <Heading as="h2" size="md" mt={8} mb={2}>
        What We Collect
      </Heading>
      <UnorderedList mb={4}>
        <ListItem>Basic contact details (e.g. if you submit a form)</ListItem>
        <ListItem>Anonymous site usage data (via Google Analytics)</ListItem>
      </UnorderedList>

      <Heading as="h2" size="md" mt={8} mb={2}>
        How We Use It
      </Heading>
      <Text mb={4}>
        We use collected data to:
      </Text>
      <UnorderedList mb={4}>
        <ListItem>Respond to inquiries</ListItem>
        <ListItem>Improve our website and services</ListItem>
      </UnorderedList>

      <Heading as="h2" size="md" mt={8} mb={2}>
        Data Sharing
      </Heading>
      <Text mb={4}>
        We never sell your data. Any third-party tools (like Google Analytics) are used strictly for
        analytics and site improvement.
      </Text>

      <Heading as="h2" size="md" mt={8} mb={2}>
        Contact Us
      </Heading>
      <Text>
        If you have any privacy concerns, contact us at{' '}
        <strong>support@luckylogic.com.au</strong>.
      </Text>
    </Box>
  );
}
