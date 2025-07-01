import { Box, Heading, Text, VStack, Button, Alert, AlertIcon, AlertTitle, AlertDescription, HStack } from '@chakra-ui/react';
import { FiGift, FiUserCheck, FiUsers, FiCheckCircle, FiMessageCircle, FiSearch, FiCheckSquare, FiCalendar, FiHelpCircle, FiMap } from 'react-icons/fi';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';
import NextLink from 'next/link';

const travelAssistanceData = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'name': 'Frequent Flyer Help',
  'description': 'Expert advice and booking assistance for using your frequent flyer points. Maximise your points and travel smarter with Lucky Logic IT.',
  'provider': {
    '@type': 'LocalBusiness',
    'name': 'Lucky Logic IT',
    'url': 'https://luckylogic.com.au',
    'logo': 'https://luckylogic.com.au/lucky-logic-logo.png',
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '+61426901209',
      'contactType': 'customer service',
      'areaServed': 'Sydney',
      'availableLanguage': 'English'
    },
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'South Village, 2 Kiln Rd, Kirrawee 2232 (Pickup and Dropoff only)',
      'addressLocality': 'Kirrawee',
      'addressRegion': 'NSW',
      'postalCode': '2232',
      'addressCountry': 'AU'
    }
  },
  'areaServed': 'Sydney',
  'serviceType': 'Frequent Flyer Assistance',
  'url': 'https://luckylogic.com.au/travel-assistance',
  'image': 'https://luckylogic.com.au/lucky-logic-logo.png',
};

export default function FrequentFlyerHelpPage() {
  return (
    <Box
      sx={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
      }}
    >
      <SEO
        title="Frequent Flyer Help"
        description="Expert advice and booking assistance for using your frequent flyer points. Maximise your points and travel smarter with Lucky Logic IT."
        keywords="frequent flyer help, points booking, travel assistance, award seat, loyalty points, Sydney, Lucky Logic IT"
        canonicalUrl="https://luckylogic.com.au/travel-assistance"
      />
      <JsonLd data={travelAssistanceData} />
      {/* Hero Banner */}
      <Box
        bgGradient="linear(to-br, #003f2d 60%, #14543a 100%)"
        color="white"
        py={{ base: 12, md: 24 }}
        px={{ base: 2, md: 10 }}
        borderRadius="2xl"
        boxShadow="2xl"
        maxW="6xl"
        mx="auto"
        mt={{ base: 12, md: 32 }}
        mb={{ base: 8, md: 12 }}
        textAlign="center"
        position="relative"
        overflow="hidden"
      >
        <VStack spacing={6}>
          <Heading as="h1" size={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight="extrabold" letterSpacing="tight" color="white">
            ✈️ Frequent Flyer Assistance
          </Heading>
          <Text fontSize={{ base: 'xl', md: '2xl' }} fontWeight="semibold" color="#b8e4d5">
            Maximise Your Points. Minimise the Stress.
          </Text>
          <Alert
            variant="left-accent"
            borderRadius="xl"
            mb={2}
            justifyContent="center"
            bg="#e9f5f1"
            borderLeftColor="#003f2d"
            color="#003f2d"
          >
            <AlertIcon color="#003f2d" />
            <Box>
              <AlertTitle fontSize="md" color="#003f2d">Don't mistake a rewards flight for a points flight again!</AlertTitle>
              <AlertDescription fontSize="sm" color="gray.800">
                Many airlines display 'reward' seats that are not actually bookable with points. We'll help you spot the difference and avoid disappointment.
              </AlertDescription>
            </Box>
          </Alert>
          <Text fontSize={{ base: 'md', md: 'lg' }} maxW="2xl" mx="auto" opacity={0.95} color="white">
            Have a stash of frequent flyer points but not sure how to use them? Or always told there's "no availability" when you try to book?
          </Text>
          <Text fontSize={{ base: 'md', md: 'lg' }} maxW="2xl" mx="auto" opacity={0.95} color="white">
            Whether you're flying solo, booking a family holiday, or planning a round the world adventure, our Frequent Flyer Help service takes the guesswork out of using your hard-earned points. We specialise in turning loyalty points into premium travel experiences, without the overwhelm.
          </Text>
          <NextLink href="/contact-us" passHref>
            <Button
              as="a"
              size="lg"
              colorScheme="green"
              bg="#003f2d"
              color="white"
              fontWeight="bold"
              borderRadius="full"
              px={8}
              py={6}
              fontSize={{ base: 'md', md: 'xl' }}
              mt={4}
              boxShadow="lg"
              _hover={{ bg: '#14543a', color: 'white' }}
            >
              Get Frequent Flyer Help
            </Button>
          </NextLink>
        </VStack>
      </Box>
      {/* Navigation Buttons for FAQ, IT Services, Troubleshooting Guide */}
      <HStack justify="center" spacing={4} mb={8} display={{ base: 'none', md: 'flex' }}>
        <Button as={NextLink} href="/faq" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid" size="md">
          <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1, color: '#e53e3e' }}>❓</span>
          FAQ
        </Button>
        <Button as={NextLink} href="/services" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid" size="md">
          <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1 }}>⚙️</span>
          IT Services
        </Button>
        <Button as={NextLink} href="/troubleshoot" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid" size="md">
          <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1 }}>🔧</span>
          Troubleshooting Guide
        </Button>
      </HStack>
      <VStack display={{ base: 'flex', md: 'none' }} spacing={3} mb={8} width="100%" align="center">
        <Button as={NextLink} href="/faq" size="sm" maxW="320px" width="100%" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid">
          <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1, color: '#e53e3e' }}>❓</span>
          FAQ
        </Button>
        <Button as={NextLink} href="/services" size="sm" maxW="320px" width="100%" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid">
          <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1 }}>⚙️</span>
          IT Services
        </Button>
        <Button as={NextLink} href="/troubleshoot" size="sm" maxW="320px" width="100%" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid">
          <span style={{ marginRight: 6, fontSize: '1.1em', lineHeight: 1 }}>🔧</span>
          Troubleshooting Guide
        </Button>
      </VStack>
      {/* What We Can Help With */}
      <Box bg="white" borderRadius="2xl" boxShadow="lg" maxW="5xl" mx="auto" mb={{ base: 6, md: 10 }} px={{ base: 2, md: 10 }} py={{ base: 6, md: 14 }}>
        <Heading as="h2" size="lg" mb={6} color="#003f2d">
          What We Can Help With
        </Heading>
        <VStack align="start" spacing={6}>
          <Box display="flex" alignItems="flex-start" gap={3}>
            <FiGift style={{ color: '#003f2d', marginTop: 4 }} />
            <Box>
              <Text as="span" fontWeight="bold" color="#003f2d">Best Use of Your Points</Text>
              <Text color="gray.700">Learn how to extract maximum value from your Qantas, Velocity, KrisFlyer, Asia Miles, or other frequent flyer programs.</Text>
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start" gap={3}>
            <FiSearch style={{ color: '#003f2d', marginTop: 4 }} />
            <Box>
              <Text as="span" fontWeight="bold" color="#003f2d">Award Seat Research & Recommendations</Text>
              <Text color="gray.700">We'll find the best available options for your dates, routes, and class of travel, whether you're after business class luxury or the best economy deals.</Text>
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start" gap={3}>
            <FiCalendar style={{ color: '#003f2d', marginTop: 4 }} />
            <Box>
              <Text as="span" fontWeight="bold" color="#003f2d">Booking Strategy & Timing</Text>
              <Text color="gray.700">Understand when to book, how far in advance, and how to secure the best availability before it disappears.</Text>
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start" gap={3}>
            <FiHelpCircle style={{ color: '#003f2d', marginTop: 4 }} />
            <Box>
              <Text as="span" fontWeight="bold" color="#003f2d">Program Navigation & Advice</Text>
              <Text color="gray.700">Confused about transfer partners, surcharges, or points expiries? We'll explain it all in simple terms and help you plan ahead.</Text>
            </Box>
          </Box>
          <Box display="flex" alignItems="flex-start" gap={3}>
            <FiMap style={{ color: '#003f2d', marginTop: 4 }} />
            <Box>
              <Text as="span" fontWeight="bold" color="#003f2d">Custom Trip Planning</Text>
              <Text color="gray.700">Have a specific trip in mind? We can work with you to build an itinerary that makes the most of your points, stopovers, and open-jaws.</Text>
            </Box>
          </Box>
        </VStack>
      </Box>
      {/* Who This Is For */}
      <Box bg="white" borderRadius="2xl" boxShadow="lg" maxW="5xl" mx="auto" mb={{ base: 6, md: 10 }} px={{ base: 2, md: 10 }} py={{ base: 6, md: 14 }}>
        <Heading as="h2" size="lg" mb={6} color="#003f2d">
          Who This Is For
        </Heading>
        <VStack align="start" spacing={4} as="ul" pl={2}>
          <Text as="li" fontSize="md" pl={2} color="#003f2d" display="flex" alignItems="center" gap={2}>
            <FiGift style={{ color: '#003f2d' }} />
            Anyone with unused points who wants help unlocking their value
          </Text>
          <Text as="li" fontSize="md" pl={2} color="#003f2d" display="flex" alignItems="center" gap={2}>
            <FiUserCheck style={{ color: '#003f2d' }} />
            Busy professionals looking for a tailored booking solution
          </Text>
          <Text as="li" fontSize="md" pl={2} color="#003f2d" display="flex" alignItems="center" gap={2}>
            <FiUsers style={{ color: '#003f2d' }} />
            Families or couples planning overseas travel
          </Text>
          <Text as="li" fontSize="md" pl={2} color="#003f2d" display="flex" alignItems="center" gap={2}>
            <FiCheckCircle style={{ color: '#003f2d' }} />
            Frequent flyers who want a second opinion before booking
          </Text>
        </VStack>
      </Box>
      {/* Our Process */}
      <Box bg="white" borderRadius="2xl" boxShadow="lg" maxW="5xl" mx="auto" mb={{ base: 6, md: 10 }} px={{ base: 2, md: 10 }} py={{ base: 6, md: 14 }}>
        <Heading as="h2" size="lg" mb={6} color="#003f2d">
          Our Process
        </Heading>
        <VStack align="start" spacing={5}>
          <Box display="flex" alignItems="center" gap={2}>
            <FiMessageCircle style={{ color: '#003f2d' }} />
            <Text as="span" fontWeight="bold" color="#003f2d">Initial Chat</Text>
            <Text as="span" color="gray.700"> – Tell us where you want to go, how many points you have, and your ideal travel dates.</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <FiSearch style={{ color: '#003f2d' }} />
            <Text as="span" fontWeight="bold" color="#003f2d">Options Review</Text>
            <Text as="span" color="gray.700"> – We'll research and provide flight redemption options based on value, availability, and comfort.</Text>
          </Box>
          <Box display="flex" alignItems="center" gap={2}>
            <FiCheckSquare style={{ color: '#003f2d' }} />
            <Text as="span" fontWeight="bold" color="#003f2d">Booking Support</Text>
            <Text as="span" color="gray.700"> – We'll guide you through the redemption process, or book it on your behalf if eligible.</Text>
          </Box>
        </VStack>
      </Box>
      {/* Call to Action Banner */}
      <Box px={{ base: 2, md: 8 }} py={{ base: 8, md: 16 }} maxW="5xl" mx="auto" color="white" bgGradient="linear(to-r, #003f2d, #14543a)" borderRadius="2xl" boxShadow="2xl" textAlign="center" mt={{ base: 8, md: 10 }} mb={{ base: 10, md: 16 }}>
        <Heading as="h2" size="lg" mb={4} fontWeight="extrabold" color="white">
          Let's Turn Points into Journeys
        </Heading>
        <Text fontSize={{ base: 'md', md: 'lg' }} mb={4}>
          Stop letting your points sit idle or expire. Get expert guidance and start flying smarter.
        </Text>
        <NextLink href="/contact-us" passHref>
          <Button
            as="a"
            size="lg"
            colorScheme="green"
            bg="#003f2d"
            color="white"
            fontWeight="bold"
            borderRadius="full"
            px={8}
            py={6}
            fontSize={{ base: 'md', md: 'xl' }}
            mt={2}
            boxShadow="lg"
            _hover={{ bg: '#14543a', color: 'white' }}
          >
            Contact us today
          </Button>
        </NextLink>
      </Box>
    </Box>
  );
} 