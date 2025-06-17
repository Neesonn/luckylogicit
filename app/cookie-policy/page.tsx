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
        This Cookie Policy explains how Lucky Logic IT Services ("we", "us", "our"), operated by Michael Neeson trading as a sole trader, uses cookies and similar tracking technologies on our website.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        What Are Cookies?
      </Heading>
      <Text mb={6}>
        Cookies are small text files stored on your device when you visit a website. They help improve your browsing experience by remembering your preferences, enabling functionality, and supporting security.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Types of Cookies We Use
      </Heading>
      <UnorderedList mb={6} pl={6}>
        <ListItem>
          <strong>Essential Cookies:</strong> Required for core site functionality, such as secure logins and Stripe payment processing.
        </ListItem>
        <ListItem>
          <strong>Analytics Cookies:</strong> Help us understand how visitors use our site so we can improve performance. We use tools like Google Analytics.
        </ListItem>
        <ListItem>
          <strong>Functional Cookies:</strong> Remember your preferences, such as display settings, to provide a smoother experience.
        </ListItem>
        <ListItem>
          <strong>Marketing Cookies:</strong> We currently do not use any marketing or advertising cookies on our site.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Third-Party Cookies
      </Heading>
      <Text mb={6}>
        We use a limited number of third-party services that may place cookies on your device:
      </Text>
      <UnorderedList mb={6} pl={6}>
        <ListItem>
          <strong>Google Analytics:</strong> Tracks anonymous usage data to help us understand website performance. Learn more or opt out at{' '}
          <Link href="https://tools.google.com/dlpage/gaoptout" isExternal textDecoration="underline" color="brand.green">
            tools.google.com/dlpage/gaoptout
          </Link>.
        </ListItem>
        <ListItem>
          <strong>Stripe:</strong> Our payment processor may use cookies to facilitate secure payment processing. Stripe’s cookie practices are governed by their own{' '}
          <Link href="https://stripe.com/cookies-policy/legal" isExternal textDecoration="underline" color="brand.green">
            Cookie Policy
          </Link>.
        </ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        How You Can Control Cookies
      </Heading>
      <Text mb={6}>
        You can manage or disable cookies via your browser settings. Please note that disabling essential cookies may impact the website’s core functionality, including login and checkout.
      </Text>

      <Text mb={6}>
        Most browsers allow you to:
      </Text>
      <UnorderedList mb={6} pl={6}>
        <ListItem>View the cookies stored on your device</ListItem>
        <ListItem>Delete existing cookies</ListItem>
        <ListItem>Block or restrict cookies for future visits</ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Changes to This Policy
      </Heading>
      <Text mb={6}>
        We may update this Cookie Policy from time to time. Please revisit this page periodically to stay informed about how we use cookies.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Contact Us
      </Heading>
      <Text>
        If you have any questions about this Cookie Policy or our privacy practices, please contact us at{' '}
        <strong>michael@luckylogic.com.au</strong>.
      </Text>

      <Text mt={8}>
        For more information about how we manage your data, please review our{' '}
        <NextLink href="/privacy-policy" passHref legacyBehavior>
          <Link color="brand.green" textDecoration="underline">Privacy Policy</Link>
        </NextLink>.
      </Text>
    </Box>
  );
}
