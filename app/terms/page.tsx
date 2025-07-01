'use client';
import { Box, Heading, Text, UnorderedList, ListItem, Link, Alert, AlertIcon, AlertTitle, AlertDescription } from '@chakra-ui/react';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';

export default function TermsPage() {
  const termsData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Terms & Conditions',
    'description': "Read the terms and conditions for using Lucky Logic IT's website and services. Learn about your rights, responsibilities, and our legal policies."
  };

  return (
    <>
      <SEO
        title="Terms & Conditions"
        description="Read the terms and conditions for using Lucky Logic IT's website and services. Learn about your rights, responsibilities, and our legal policies."
        keywords="terms, conditions, legal, Lucky Logic IT, Sydney IT services"
        canonicalUrl="https://luckylogic.com.au/terms"
      />
      <JsonLd data={termsData} />
      <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
        <Text mb={2} fontSize="sm" color="gray.500" textAlign="right">
          Last updated: 01/07/2025
        </Text>
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
        <Alert status="warning" variant="left-accent" mb={6} borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle fontSize="md">Important Disclaimer</AlertTitle>
            <AlertDescription fontSize="sm">
              The troubleshooting guides provided on this site are for informational purposes only. Lucky Logic is not responsible for any issues, data loss, or damages that may occur as a result of following these instructions. Please proceed carefully and consult a professional if you are unsure.
            </AlertDescription>
          </Box>
        </Alert>

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
          4. Third-Party Links & Services
        </Heading>
        <Text mb={6}>
          This website may contain links to third-party websites for your convenience. Lucky Logic does not endorse and is not responsible for the content or practices of these external sites. We also use third-party services to operate our website, including:
        </Text>
        <UnorderedList mb={6} pl={6}>
          <ListItem><strong>Stripe</strong> for secure payment processing and customer management</ListItem>
          <ListItem><strong>Formspree</strong> for contact form submissions</ListItem>
          <ListItem><strong>Google Analytics</strong> for website analytics (only after you consent via our cookie banner)</ListItem>
          <ListItem><strong>Crisp</strong> for live chat support (only after you consent via our cookie banner)</ListItem>
        </UnorderedList>
        <Text mb={6}>
          These services may process your data outside Australia. Please review our <Link href="/privacy-policy" color="brand.green" textDecoration="underline">Privacy Policy</Link> and <Link href="/cookie-policy" color="brand.green" textDecoration="underline">Cookie Policy</Link> for more information about how your data is handled and your rights.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          4a. Frequent Flyer Assistance
        </Heading>
        <Text mb={6}>
          Lucky Logic IT offers Frequent Flyer Help as a paid advisory and/or booking assistance service. This service includes advice on the use of frequent flyer points, research on award seat availability, and (if applicable) assistance with booking flights using points.
        </Text>
        <UnorderedList mb={6} pl={6}>
          <ListItem>Lucky Logic IT is not affiliated with any airline, frequent flyer program, or travel provider. All advice is based on publicly available information and best efforts.</ListItem>
          <ListItem>Seat availability, pricing, and program rules are subject to change by airlines and are outside our control. We do not guarantee the availability of any specific flight or reward.</ListItem>
          <ListItem>Users are responsible for providing accurate frequent flyer account details, point balances, and travel preferences. Lucky Logic IT is not liable for errors resulting from incorrect information provided by the user.</ListItem>
          <ListItem>Lucky Logic IT is not responsible for any losses, missed opportunities, or changes in airline policies that may affect your ability to book or use points.</ListItem>
          <ListItem>By using this service, you acknowledge that all bookings are subject to the terms and conditions of the relevant airline or loyalty program.</ListItem>
        </UnorderedList>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          5. Privacy
        </Heading>
        <Text mb={6}>
          Your use of this website is also governed by our{' '}
          <Link href="/privacy-policy" color="brand.green" textDecoration="underline">
            Privacy Policy
          </Link>
          {' '}and our{' '}
          <Link href="/cookie-policy" color="brand.green" textDecoration="underline">
            Cookie Policy
          </Link>
          , which explain how we collect, manage, and protect your personal information. Please note that all customer and payment data entered at checkout is handled securely by Stripe. Lucky Logic does not store or have access to your full card details. Analytics and chat services are only loaded after you provide consent via our cookie banner.
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
        <Text mb={6}>
          If you have any questions or concerns regarding these Terms & Conditions, please contact us at{' '}
          <strong>support@luckylogic.com.au</strong>.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          9. Billing, Payments & Refunds
        </Heading>
        <Text mb={6}>
          Payments are processed securely via Stripe. The following terms apply to billing, payments, and refunds:
        </Text>
        <UnorderedList mb={6} pl={6}>
          <ListItem>
            Invoices are issued with payment due upon receipt unless otherwise agreed in writing.
          </ListItem>
          <ListItem>
            Stripe fees may apply: 1.75% + $0.30 for Visa/Mastercard; 3.5% + $0.30 for AMEX.
          </ListItem>
          <ListItem>
            Hardware and software purchases are non-refundable once installed, delivered, or digitally transferred.
          </ListItem>
          <ListItem>
            A 14-day warranty applies to all services provided unless otherwise specified in writing.
          </ListItem>
          <ListItem>
            No GST has been charged. Lucky Logic is not currently registered for GST.
          </ListItem>
          <ListItem>
            <strong>No Fix, No Fee:</strong> If we are unable to resolve your issue and it falls outside the scope of our services, no call-out fee will be charged.
          </ListItem>
          <ListItem>
            In circumstances where time has been spent attempting a resolution, including diagnostics, system testing, or third-party coordination, a partial fee may apply to cover time invested, even if a full solution was not provided.
          </ListItem>
          <ListItem>
            All quotes must be approved by the customer prior to work commencing. If an updated quote is required (e.g. for further diagnostics, part sourcing, or expanded work scope), it will be sent and must be accepted before further action is taken.
          </ListItem>
        </UnorderedList>
        <Text>
          For direct deposit payments, please refer to your invoice for bank account details.
        </Text>

        <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
          10. Live Chat Usage
        </Heading>
        <Text mb={4}>
          Our website offers a live chat feature to provide instant support and answer your questions. By using the live chat, you agree to communicate respectfully and lawfully with our team. The live chat is intended solely for genuine customer enquiries and support related to our services.
        </Text>
        <UnorderedList mb={6} pl={6}>
          <ListItem>Do not use the chat to send spam, advertisements, or irrelevant content</ListItem>
          <ListItem>Do not use abusive, offensive, or threatening language</ListItem>
          <ListItem>Do not attempt to harass, impersonate, or mislead our staff or other users</ListItem>
          <ListItem>Do not attempt to exploit, hack, or disrupt the chat system</ListItem>
        </UnorderedList>
        <Text mb={6}>
          Any misuse of the live chat, including but not limited to the behaviors listed above, will result in immediate restriction or permanent ban from the chat feature and may result in being banned from accessing our website and services. We reserve the right to report unlawful behavior to the relevant authorities. All chat interactions are subject to our <Link href="/privacy-policy" color="brand.green" textDecoration="underline">Privacy Policy</Link>.
        </Text>
      </Box>
    </>
  );
}
