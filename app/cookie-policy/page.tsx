'use client';

import NextLink from 'next/link';
import { Box, Heading, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';

export default function CookiePolicyPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
      <Heading as="h1" size="xl" mb={6} color="brand.green">
        Cookie Policy
      </Heading>

      <Text mb={6}>
        This Cookie Policy explains how Lucky Logic (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) uses cookies and similar tracking technologies on our website.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        What Are Cookies?
      </Heading>
      <Text mb={6}>
        Cookies are small text files stored on your device when you visit a website. They help improve your browsing experience by remembering your preferences and enabling site functionality.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Types of Cookies We Use
      </Heading>
      <UnorderedList mb={6} pl={6}>
        <ListItem>
          <strong>Essential Cookies:</strong> Necessary for the website to function properly. They enable core features like page navigation and access to secure areas.
        </ListItem>
        <ListItem>
          <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our site, allowing us to improve its performance. We use tools like Google Analytics.
        </ListItem>
        <ListItem>
          <strong>Functional Cookies:</strong> Remember your preferences, such as language or region, to provide a more personalized experience.
        </ListItem>
        <ListItem>
          <strong>Marketing Cookies:</strong> Used to track visitors across websites to display relevant advertisements. We currently do not use marketing cookies.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        How You Can Control Cookies
      </Heading>
      <Text mb={6}>
        You can manage or disable cookies through your browser settings. However, disabling certain cookies may affect website functionality and your user experience.
      </Text>

      <Text mb={6}>
        Most browsers allow you to:
      </Text>
      <UnorderedList mb={6} pl={6}>
        <ListItem>View the cookies stored on your device</ListItem>
        <ListItem>Delete existing cookies</ListItem>
        <ListItem>Block or restrict cookies in the future</ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Third-Party Cookies
      </Heading>
      <Text mb={6}>
        We use Google Analytics, which sets cookies on our behalf to collect anonymous usage data. For more information on Google Analytics cookies and how to opt-out, please visit{' '}
        <Link href="https://tools.google.com/dlpage/gaoptout" isExternal textDecoration="underline" color="brand.green">
          https://tools.google.com/dlpage/gaoptout
        </Link>.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Changes to This Policy
      </Heading>
      <Text mb={6}>
        We may update this Cookie Policy from time to time. We encourage you to review this page periodically to stay informed about how we use cookies.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Contact Us
      </Heading>
      <Text>
        If you have any questions about this policy or our privacy practices, please contact us at{' '}
        <strong>support@luckylogic.com.au</strong>.
      </Text>

      <Text mt={8}>
        For our full privacy information, please see our{' '}
        <NextLink href="/privacy-policy" passHref legacyBehavior>
          <Link color="brand.green" textDecoration="underline">Privacy Policy</Link>
        </NextLink>.
      </Text>
    </Box>
  );
}
