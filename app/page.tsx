'use client';

import { Box } from '@chakra-ui/react';
import Hero from '../components/Hero';
import ServiceGrid from '../components/ServiceGrid';
import GoogleHead from '../components/GoogleHead';
import JsonLd from '../components/JsonLd';

export default function HomePage() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Lucky Logic IT',
    image: 'https://luckylogic.com.au/lucky-logic-logo.png',
    '@id': 'https://luckylogic.com.au',
    url: 'https://luckylogic.com.au',
    telephone: '+61426901209',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '580 Princes Highway',
      addressLocality: 'Kirrawee',
      addressRegion: 'NSW',
      postalCode: '2232',
      addressCountry: 'AU'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: -34.0357,
      longitude: 151.0700
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday'
      ],
      opens: '09:00',
      closes: '17:00'
    },
    sameAs: [
      'https://www.facebook.com/luckylogicIT/',
      'https://instagram.com/luckylogicit'
    ]
  };

  return (
    <>
      <GoogleHead />
      <JsonLd data={organizationData} />
      <Box px={{ base: 4, md: 0 }}>
        <Hero />
        <ServiceGrid />
      </Box>
    </>
  );
}
