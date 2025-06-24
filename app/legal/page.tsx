'use client';

import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import JsonLd from '../../components/JsonLd';

export default function LegalPage() {
  const [animationData, setAnimationData] = useState(null);

  const legalData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Legal Information',
    'description': "Legal information and documents for Lucky Logic IT, including privacy policy, terms & conditions, and cookie policy."
  };

  useEffect(() => {
    fetch('/legal-animation.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Failed to load legal animation:', err));
  }, []);

  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto">
      <JsonLd data={legalData} />
      {animationData && (
        <Box display="flex" justifyContent="center" alignItems="center" mb={8}>
          <Lottie
            animationData={animationData}
            loop
            autoplay
            style={{ width: '320px', maxWidth: '100%', height: 'auto' }}
          />
        </Box>
      )}
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
