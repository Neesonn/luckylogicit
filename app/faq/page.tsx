'use client';

import {
  Box,
  Heading,
  Container,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Link,
  Button,
  HStack
} from '@chakra-ui/react';
import NextLink from 'next/link';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';

export default function FAQPage() {
  const faqData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': [
      {
        '@type': 'Question',
        'name': 'How do I enable and use Live Chat?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `To use our Live Chat feature, you'll need to enable cookies for this website. If you previously declined cookies, you can update your preference at any time by clicking the Change Cookie Preferences button in the footer, or by clicking here which will cause the cookie banner to popup. Once cookies are accepted, simply refresh the page and the Live Chat will become available. You'll then be able to connect instantly with our team.`
        }
      },
      {
        '@type': 'Question',
        'name': 'What areas do you cover?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `We primarily service the Sutherland Shire region, as we are based locally in Kirrawee. However, we can accommodate requests from other parts of Sydney depending on availability. If you are located outside the Shire and would like to confirm service coverage, please contact us.`
        }
      },
      {
        '@type': 'Question',
        'name': 'How quickly can you respond to a service request?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `We aim to respond to all enquiries within one business day. Same-day or next-day appointments are often available depending on urgency and technician availability.`
        }
      },
      {
        '@type': 'Question',
        'name': 'Do you offer a warranty on repairs?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes, all hardware repairs and upgrades are covered by a 7-day workmanship warranty. If you experience any service-related issues during this period, we will resolve them at no additional cost.`
        }
      },
      {
        '@type': 'Question',
        'name': 'Is there an emergency callout fee?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Emergency callout fees may apply for after-hours or weekend visits. We will always inform you of any additional charges before confirming your booking.`
        }
      },
      {
        '@type': 'Question',
        'name': 'Are you COVID-safe?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes. We follow all current NSW Health guidelines, including mask use, hygiene practices, and social distancing. If you have specific health concerns, let us know and we will do our best to accommodate you.`
        }
      },
      {
        '@type': 'Question',
        'name': 'What payment methods do you accept?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `We accept EFTPOS, credit and debit cards, and cash. All services include a detailed invoice for your records. Credit card payments incur the following processing fees through Stripe: Visa and Mastercard are subject to a 1.75% + $0.30 fee, and American Express is subject to a 3.5% + $0.30 fee. These charges cover the transaction cost only — no profit is made from these fees. Alternatively, you may make a direct bank transfer using the account details provided on your invoice.`
        }
      },
      {
        '@type': 'Question',
        'name': 'Do you offer remote support?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `Yes, we offer secure remote support for many software and troubleshooting needs. Contact us to find out if your issue can be resolved remotely.`
        }
      },
      {
        '@type': 'Question',
        'name': 'How do I book a service?',
        'acceptedAnswer': {
          '@type': 'Answer',
          'text': `You can book a service by filling out our contact form, emailing us at support@luckylogic.com.au or calling +61 426 901 209.`
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Frequently Asked Questions | Lucky Logic IT"
        description="Answers to common questions about Lucky Logic IT's services, coverage area, response time, warranty, emergency callout fees, COVID-safe protocols, and more."
        canonicalUrl="https://luckylogic.com.au/faq"
      />
      <JsonLd data={faqData} />

      <Container maxW="4xl" py={{ base: 12, md: 20 }}>
        <Heading as="h1" size="2xl" mb={6} color="brand.green" textAlign="center">
          Frequently Asked Questions (FAQ)
        </Heading>

        <Text fontSize="lg" color="gray.700" textAlign="center" maxW="2xl" mx="auto" mb={10}>
          Below you'll find answers to some of the most common questions we receive about our services, coverage area, and policies. If your question isn't listed here, feel free to{' '}
          <Link as={NextLink} href="/contact-us" color="brand.green" textDecoration="underline">
            contact us
          </Link>
          .
        </Text>
        <HStack justify="center" spacing={4} mb={8}>
          <Button as={NextLink} href="/services" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid" size="md">
            <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1 }}>⚙️</span>
            Our Services
          </Button>
          <Button as={NextLink} href="/troubleshoot" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid" size="md">
            <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1 }}>🔧</span>
            Troubleshooting Guide
          </Button>
        </HStack>

        <Accordion allowMultiple>
          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  How do I enable and use Live Chat?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              To use our Live Chat feature, you'll need to enable cookies for this website. If you previously declined cookies, you can update your preference at any time by clicking the <strong>Change Cookie Preferences</strong> button in the footer, or by <Button variant="link" color="brand.green" onClick={() => {
                const btn = document && document.querySelector && document.querySelector('[aria-label="Change Cookie Preferences"]');
                if (btn && typeof (btn as HTMLButtonElement).click === 'function') {
                  (btn as HTMLButtonElement).click();
                }
              }}>clicking here</Button> which will cause the cookie banner to popup.

              <br /><br />
              Once cookies are accepted, simply refresh the page and the Live Chat will become available. You'll then be able to connect instantly with our team.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  What areas do you cover?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              We primarily service the Sutherland Shire region, as we are based locally in Kirrawee. However, we can accommodate requests from other parts of Sydney depending on availability. If you are located outside the Shire and would like to confirm service coverage, please{' '}
              <Link as={NextLink} href="/contact-us" color="brand.green" textDecoration="underline">
                contact us
              </Link>
              .
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  How quickly can you respond to a service request?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              We aim to respond to all enquiries within one business day. Same-day or next-day appointments are often available depending on urgency and technician availability.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  Do you offer a warranty on repairs?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes, all hardware repairs and upgrades are covered by a 7-day workmanship warranty. If you experience any service-related issues during this period, we will resolve them at no additional cost.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  Is there an emergency callout fee?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Emergency callout fees may apply for after-hours or weekend visits. We will always inform you of any additional charges before confirming your booking.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  Are you COVID-safe?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes. We follow all current NSW Health guidelines, including mask use, hygiene practices, and social distancing. If you have specific health concerns, let us know and we will do our best to accommodate you.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  What payment methods do you accept?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              We accept EFTPOS, credit and debit cards, and cash. All services include a detailed invoice for your records. <br /><br />
              Credit card payments incur the following processing fees through Stripe: Visa and Mastercard are subject to a 1.75% + $0.30 fee, and American Express is subject to a 3.5% + $0.30 fee. These charges cover the transaction cost only — no profit is made from these fees. <br /><br />
              Alternatively, you may make a direct bank transfer using the account details provided on your invoice.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  Do you offer remote support?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              Yes, we offer secure remote support for many software and troubleshooting needs. Contact us to find out if your issue can be resolved remotely.
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <h2>
              <AccordionButton>
                <Box flex="1" textAlign="left" fontWeight="bold" color="brand.green">
                  How do I book a service?
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              You can book a service by filling out our{' '}
              <Link as={NextLink} href="/contact-us" color="brand.green" textDecoration="underline">
                contact form
              </Link>
              , emailing us at{' '}
              <Link href="mailto:support@luckylogic.com.au" color="brand.green" textDecoration="underline">
                support@luckylogic.com.au
              </Link>{' '}
              or calling{' '}
              <Link href="tel:+61426901209" color="brand.green" textDecoration="underline">
                +61 426 901 209
              </Link>
              .
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Container>
    </>
  );
}
