'use client';
import { Box, Heading, Text, UnorderedList, ListItem, Link } from '@chakra-ui/react';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';

export default function PrivacyPolicyPage() {
  const privacyData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Privacy Policy',
    'description': 'Learn how Lucky Logic IT collects, uses, and protects your personal information. Read our privacy practices and your rights.'
  };

  return (
    <>
      <SEO
        title="Privacy Policy"
        description="Learn how Lucky Logic IT collects, uses, and protects your personal information. Read our privacy practices and your rights."
        keywords="privacy policy, data protection, Lucky Logic IT, Sydney IT services"
        canonicalUrl="https://luckylogic.com.au/privacy-policy"
      />
      <JsonLd data={privacyData} />
      <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
        <Heading as="h1" size="xl" mb={6} color="brand.green">
          Privacy Policy
        </Heading>
        <Text mb={2} fontSize="sm" color="gray.500" textAlign="right">
          Last updated: 25/06/2025
        </Text>

        <Text mb={6}>
          Lucky Logic IT Services ("we", "us", "our") respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and manage your personal data in compliance with the Australian Privacy Act 1988 and Australian Privacy Principles (APPs).
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          1. Information We Collect
        </Heading>
        <Text mb={4}>
          We may collect the following personal information:
        </Text>
        <UnorderedList mb={6} pl={6}>
          <ListItem>Contact details such as your name, email, phone number, and address</ListItem>
          <ListItem>Payment and billing information (limited to what is shared by our payment processor, Stripe)</ListItem>
          <ListItem>Details related to your device, network, and IT support requests</ListItem>
          <ListItem>Usage data and technical information collected via cookies, analytics tools (Google Analytics), and chat (Crisp)</ListItem>
          <ListItem>Any other information you provide directly to us (e.g., via contact forms powered by Formspree)</ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          2. How We Use Your Information
        </Heading>
        <Text mb={4}>
          We use your personal information to:
        </Text>
        <UnorderedList mb={6} pl={6}>
          <ListItem>Deliver and improve our residential IT support services</ListItem>
          <ListItem>Process payments and manage your account (via Stripe)</ListItem>
          <ListItem>Communicate with you about your inquiries and support requests (via Formspree and email)</ListItem>
          <ListItem>Provide live chat support (via Crisp, with your consent)</ListItem>
          <ListItem>Ensure compliance with legal obligations</ListItem>
          <ListItem>Enhance your experience on our website and services (including analytics and cookies, with your consent)</ListItem>
          <ListItem>Send marketing communications if you have consented (you may opt out at any time)</ListItem>
        </UnorderedList>

        <Text mb={6}>
          <strong>Live Chat Notice:</strong> When you use our live chat feature, any information you provide (such as your name, email, and chat content) is stored and processed by our chat provider, Crisp. Lucky Logic does not store chat transcripts on its own servers. Your chat interactions are subject to <Link href="https://crisp.chat/en/privacy/" color="brand.green" textDecoration="underline" isExternal rel="noopener noreferrer">Crisp's Privacy Policy</Link>.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          3. Disclosure of Your Information
        </Heading>
        <Text mb={6}>
          We do not sell your personal data. We may share your information with:
        </Text>
        <UnorderedList mb={6} pl={6}>
          <ListItem>Service providers who help us deliver services, including:
            <UnorderedList pl={6}>
              <ListItem><strong>Formspree</strong> (contact form submissions)</ListItem>
              <ListItem><strong>Stripe</strong> (payment processing and customer management)</ListItem>
              <ListItem><strong>Google Analytics</strong> (website analytics, only after you consent)</ListItem>
              <ListItem><strong>Crisp</strong> (live chat, only after you consent)</ListItem>
            </UnorderedList>
          </ListItem>
          <ListItem>Government or regulatory authorities where required by law</ListItem>
          <ListItem>Third parties with your explicit consent</ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          4. Data Security
        </Heading>
        <Text mb={6}>
          We implement industry-standard measures including SSL encryption, access controls, and regular security reviews to protect your data from unauthorized access and breaches. All payments made via our site are processed securely by Stripe. We do not store or handle your full card information.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          5. Cookies, Analytics & Consent
        </Heading>
        <Text mb={6}>
          Our website uses cookies and similar technologies for analytics, performance, and personalised experiences. Google Analytics and Crisp chat are only loaded after you accept cookies via our cookie banner. You can control cookies via your browser settings. For more details, please refer to our{' '}
          <Link href="/cookie-policy" textDecoration="underline" color="brand.green" isExternal rel="noopener noreferrer">
            Cookie Policy
          </Link>.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          6. International Data Transfers
        </Heading>
        <Text mb={6}>
          Some of our service providers (such as Stripe, Formspree, Google Analytics, and Crisp) may process your data outside Australia. We ensure that any such transfers are protected by appropriate safeguards consistent with this Privacy Policy and applicable law.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          7. Data Retention
        </Heading>
        <Text mb={6}>
          We retain personal information only as long as necessary for the purposes described or as required by law.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          8. Automated Decision-Making
        </Heading>
        <Text mb={6}>
          We do not use your personal information for automated decision-making or profiling.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          9. Your Rights
        </Heading>
        <Text mb={6}>
          Under Australian law, you have the right to access, correct, or delete your personal information. You may also withdraw consent or object to certain uses of your data. To exercise your rights, or to opt out of marketing communications, please contact us at <strong>support@luckylogic.com.au</strong>.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          10. Children's Privacy
        </Heading>
        <Text mb={6}>
          Our services are not directed to children under 16, and we do not knowingly collect personal data from children without parental consent.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          11. Changes to this Policy
        </Heading>
        <Text mb={6}>
          We may update this policy from time to time. We encourage you to review this page periodically for any changes.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          12. Contact Us
        </Heading>
        <Text mb={6}>
          For questions or concerns about privacy, or to exercise your rights, please contact us at{' '}
          <strong>support@luckylogic.com.au</strong>.
        </Text>
      </Box>
    </>
  );
}
