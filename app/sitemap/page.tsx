'use client';

import { Box, Heading, Text, VStack, Link, SimpleGrid, Badge, Container, Icon, HStack, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import Lottie from 'lottie-react';
import JsonLd from '../../components/JsonLd';
import { 
  FiHome, 
  FiUser, 
  FiSettings, 
  FiMail, 
  FiHelpCircle, 
  FiTool, 
  FiFileText, 
  FiShield, 
  FiFile, 
  FiInfo,
  FiMapPin,
  FiSearch
} from 'react-icons/fi';

interface SitemapPage {
  url: string;
  title: string;
  description: string;
  icon: React.ComponentType;
  section: string;
}

export default function SitemapPage() {
  const [animationData, setAnimationData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const sitemapData = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    'name': 'Site Map',
    'description': "Complete site map of Lucky Logic IT website. Find all pages and sections of our website organized by category."
  };

  const pages: SitemapPage[] = [
    // 💼 Business
    {
      url: '/',
      title: 'Home',
      description: 'Welcome to Lucky Logic IT - Professional IT support services in Sydney',
      icon: FiHome,
      section: 'Business'
    },
    {
      url: '/about-us',
      title: 'About Us',
      description: 'Learn about Lucky Logic IT and our mission to provide reliable IT services',
      icon: FiUser,
      section: 'Business'
    },
    {
      url: '/services',
      title: 'Services',
      description: 'Comprehensive IT services including computer repairs, network setup, and smart home assistance',
      icon: FiSettings,
      section: 'Business'
    },
    {
      url: '/terms',
      title: 'Terms & Conditions',
      description: 'Terms and conditions for using our website and services',
      icon: FiFile,
      section: 'Business'
    },
    {
      url: '/privacy-policy',
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information',
      icon: FiShield,
      section: 'Business'
    },
    // 🧾 Billing
    {
      url: '/invoice-search',
      title: 'Invoice Search',
      description: 'Search and access your invoices online',
      icon: FiFileText,
      section: 'Billing'
    },
    // ❓ Help & Support
    {
      url: '/contact-us',
      title: 'Contact Us',
      description: 'Get in touch with Lucky Logic IT for professional IT support in Sydney',
      icon: FiMail,
      section: 'Help & Support'
    },
    {
      url: '/troubleshoot',
      title: 'Troubleshoot',
      description: 'Self-help troubleshooting guides for common IT issues',
      icon: FiTool,
      section: 'Help & Support'
    },
    {
      url: '/faq',
      title: 'FAQ',
      description: 'Frequently asked questions about our IT services',
      icon: FiHelpCircle,
      section: 'Help & Support'
    },
    {
      url: '/travel-assistance',
      title: 'Frequent Flyer Help',
      description: 'Travel assistance and frequent flyer program support services',
      icon: FiMapPin,
      section: 'Help & Support'
    },
    // 📄 Legal
    {
      url: '/cookie-policy',
      title: 'Cookie Policy',
      description: 'Information about how we use cookies on our website',
      icon: FiInfo,
      section: 'Legal'
    },
    {
      url: '/legal',
      title: 'Legal Information',
      description: 'Legal documents and policies for Lucky Logic IT',
      icon: FiShield,
      section: 'Legal'
    }
  ];



  useEffect(() => {
    fetch('/sitemap-animation.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Failed to load sitemap animation:', err));
  }, []);

  return (
    <Container maxW="6xl" px={6} py={{ base: 16, md: 24 }}>
      <JsonLd data={sitemapData} />
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
      
      <Box mb={6}>
        <Text fontSize="sm" color="gray.500" mb={2}>
          <Link as={NextLink} href="/" color="gray.500" _hover={{ color: 'brand.green' }}>
            Home
          </Link>
          {' / '}
          Site Map
        </Text>
      </Box>

      <Heading as="h1" size="xl" mb={6} color="brand.green" textAlign="center">
        Site Map
      </Heading>

      <Text mb={10} textAlign="center" fontSize="lg" color="gray.600">
        Complete overview of all pages and sections on the Lucky Logic IT website.
        Find what you're looking for quickly and easily.
      </Text>

      <Box mb={8}>
        <InputGroup>
          <InputLeftElement pointerEvents="none">
            <Icon as={FiSearch} color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search pages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="lg"
            borderRadius="lg"
            bg="white"
            borderColor="gray.300"
            _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
          />
        </InputGroup>
      </Box>

      <VStack spacing={{ base: 6, md: 8 }} align="stretch">
        {Object.entries(
          pages
            .filter(page =>
              page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              page.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              page.section.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .reduce((acc, page) => {
              if (!acc[page.section]) {
                acc[page.section] = [];
              }
              acc[page.section].push(page);
              return acc;
            }, {} as Record<string, SitemapPage[]>)
        ).map(([section, sectionPages]) => (
          <Box key={section}>
            <Heading as="h2" size="md" mb={4} color="brand.green">
              {section}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={{ base: 4, md: 6 }} gap={4}>
              {sectionPages.map((page) => (
                                  <Box
                    key={page.url}
                    p={{ base: 4, md: 6 }}
                    bg="white"
                    borderRadius="lg"
                    boxShadow="sm"
                    borderWidth="1px"
                    borderColor="gray.200"
                    _hover={{ 
                      boxShadow: "md", 
                      transform: "scale(1.01)",
                      borderColor: 'brand.green'
                    }}
                    transition="all 0.2s ease"
                    lineHeight="1.6"
                  >
                  <HStack spacing={3} mb={3}>
                    <Icon as={page.icon} boxSize={5} color="brand.green" />
                    <Link as={NextLink} href={page.url} color="brand.green" fontWeight="semibold" fontSize={{ base: "md", md: "lg" }}>
                      {page.title}
                    </Link>
                  </HStack>
                  <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                    {page.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        ))}
      </VStack>

      <Box mt={12} p={6} bg="gray.50" borderRadius="lg" textAlign="center">
        <Text fontSize="sm" color="gray.600">
          Can't find what you're looking for?{' '}
          <Link as={NextLink} href="/contact-us" color="brand.green" textDecoration="underline">
            Contact us
          </Link>
          {' '}for assistance or use our{' '}
          <Link as={NextLink} href="/faq" color="brand.green" textDecoration="underline">
            FAQ section
          </Link>
          .
        </Text>
      </Box>
    </Container>
  );
} 