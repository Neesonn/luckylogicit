'use client';
import { Box, Heading, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';

export default function PrivacyPolicyPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
      <Heading as="h1" size="xl" mb={6} color="brand.green">
        Privacy Policy
      </Heading>

      <Text mb={6}>
        Lucky Logic ("we", "us", "our") respects your privacy and is committed to protecting your personal information.
        This Privacy Policy explains how we collect, use, disclose, and manage your personal data in compliance with the Australian Privacy Act 1988 and Australian Privacy Principles (APPs).
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        1. Information We Collect
      </Heading>
      <Text mb={4}>
        We may collect the following personal information:
      </Text>
      <UnorderedList mb={6} pl={6}>
        <ListItem>Contact details such as your name, email, phone number, and address</ListItem>
        <ListItem>Payment and billing information</ListItem>
        <ListItem>Details related to your device, network, and IT support requests</ListItem>
        <ListItem>Usage data and technical information collected via cookies and analytics tools</ListItem>
        <ListItem>Any other information you provide directly to us</ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        2. How We Use Your Information
      </Heading>
      <Text mb={4}>
        We use your personal information to:
      </Text>
      <UnorderedList mb={6} pl={6}>
        <ListItem>Deliver and improve our residential IT support services</ListItem>
        <ListItem>Process payments and manage your account</ListItem>
        <ListItem>Communicate with you about your inquiries and support requests</ListItem>
        <ListItem>Ensure compliance with legal obligations</ListItem>
        <ListItem>Enhance your experience on our website and services</ListItem>
        <ListItem>Send marketing communications if you have consented</ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        3. Disclosure of Your Information
      </Heading>
      <Text mb={6}>
        We do not sell your personal data. We may share your information with:
      </Text>
      <UnorderedList mb={6} pl={6}>
        <ListItem>Service providers who help us deliver services (e.g., payment processors)</ListItem>
        <ListItem>Government or regulatory authorities where required by law</ListItem>
        <ListItem>Third parties with your explicit consent</ListItem>
      </UnorderedList>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        4. Data Security
      </Heading>
      <Text mb={6}>
        We implement industry-standard measures including SSL encryption, access controls, and regular security reviews to protect your data from unauthorized access and breaches.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        5. Cookies & Tracking
      </Heading>
      <Text mb={6}>
        Our website uses cookies and similar technologies for analytics, performance, and personalized experiences. You can control cookies via your browser settings. For more details, please refer to our{' '}
        <Link href="/cookie-policy" textDecoration="underline" color="brand.green" isExternal>
          Cookie Policy
        </Link>.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        6. Your Rights
      </Heading>
      <Text mb={6}>
        Under Australian law, you have the right to access, correct, or delete your personal information. You may also withdraw consent or object to certain uses of your data. Contact us to exercise your rights.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        7. International Data Transfers
      </Heading>
      <Text mb={6}>
        If we transfer your personal data overseas, we ensure it is protected by appropriate safeguards consistent with this Privacy Policy.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        8. Data Retention
      </Heading>
      <Text mb={6}>
        We retain personal information only as long as necessary for the purposes described or as required by law.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        9. Children’s Privacy
      </Heading>
      <Text mb={6}>
        Our services are not directed to children under 16, and we do not knowingly collect personal data from children without parental consent.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        10. Changes to this Policy
      </Heading>
      <Text mb={6}>
        We may update this policy from time to time. We encourage you to review this page periodically for any changes.
      </Text>

      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        11. Contact Us
      </Heading>
      <Text mb={6}>
        For questions or concerns about privacy, please contact us at{' '}
        <strong>support@luckylogic.com.au</strong>.
      </Text>
    </Box>
  );
}
