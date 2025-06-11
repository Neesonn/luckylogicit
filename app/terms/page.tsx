'use client';
import { Box, Heading, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';

export default function TermsPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
      <Heading as="h1" size="xl" mb={6} color="brand.green">
        Terms & Conditions
      </Heading>

      <Text mb={6}>
        Welcome to Lucky Logic. By accessing and using this website, you agree to comply with and be
        bound by these Terms and Conditions. Please read them carefully before using our services.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        1. Use of Website
      </Heading>
      <Text mb={4}>
        You agree to use this website lawfully and responsibly, and not to:
      </Text>
      <UnorderedList mb={6} pl={6}>
        <ListItem>Use the site for fraudulent or unlawful purposes</ListItem>
        <ListItem>Interfere with or disrupt website operation or security</ListItem>
        <ListItem>Upload or transmit harmful, offensive, or illegal content</ListItem>
        <ListItem>Attempt to gain unauthorized access to any part of the website</ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        2. Intellectual Property Rights
      </Heading>
      <Text mb={6}>
        All content, trademarks, logos, images, and software on this website are the property of Lucky Logic or its licensors. You may view and use the content for personal, non-commercial use only. Any other use, including reproduction, modification, or distribution without prior written permission, is prohibited.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        3. Disclaimers and Limitation of Liability
      </Heading>
      <Text mb={6}>
        While we strive to provide accurate and up-to-date information, Lucky Logic makes no warranties or representations about the completeness, reliability, or accuracy of the website content.
      </Text>
      <Text mb={6}>
        To the maximum extent permitted by law, Lucky Logic shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising out of your access or use of this website or reliance on its content.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        4. Third-Party Links
      </Heading>
      <Text mb={6}>
        This website may contain links to third-party websites for your convenience. Lucky Logic does not endorse and is not responsible for the content or practices of these external sites.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        5. Privacy
      </Heading>
      <Text mb={6}>
        Your use of this website is also governed by our{' '}
        <Link href="/privacy-policy" color="brand.green" textDecoration="underline">
          Privacy Policy
        </Link>
        , which explains how we collect and manage your personal information.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        6. Changes to Terms
      </Heading>
      <Text mb={6}>
        Lucky Logic reserves the right to modify or update these Terms & Conditions at any time without prior notice. Your continued use of the website after such changes constitutes your acceptance of the new terms.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        7. Governing Law
      </Heading>
      <Text mb={6}>
        These Terms and Conditions are governed by the laws of New South Wales, Australia. Any disputes arising will be subject to the exclusive jurisdiction of the courts in New South Wales.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        8. Contact Us
      </Heading>
      <Text>
        If you have any questions or concerns regarding these Terms & Conditions, please contact us at{' '}
        <strong>support@luckylogic.com.au</strong>.
      </Text>
    </Box>
  );
}
