'use client';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  List,
  ListItem,
  ListIcon,
  useBreakpointValue,
  Button,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
  Image,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import SEO from '../../components/SEO';
import { useRouter } from 'next/navigation';
import {
  FiBookOpen,
  FiUserCheck,
  FiShield,
  FiTarget,
  FiList,
} from 'react-icons/fi';
import JsonLd from '../../components/JsonLd';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function AboutUsPage() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  const handleViewServices = () => router.push('/services');

  const aboutSections = [
    {
      title: 'Our Story',
      content:
        "Lucky Logic was founded out of a genuine passion for technology and a desire to help people get the most from their digital lives. Our founder has over 15 years of experience working with some of Australia's leading IT companies, gaining expertise in both hardware and software, as well as hands-on technical support. This extensive background has shaped our unique approach to residential IT. We combine professional knowledge with a personal touch, ensuring that every client receives solutions tailored to their needs. Our story is one of continuous learning, dedication, and a commitment to making technology accessible and stress-free for everyone.",
    },
    {
      title: 'What Makes Us Boutique?',
      content:
        "What sets Lucky Logic apart is our boutique approach to IT support. Unlike large, impersonal providers, we take the time to listen to your concerns and understand your unique situation. Whether you need help on-site or remotely, we tailor our solutions to fit your specific requirements. Our goal is to build lasting relationships with our clients, founded on trust, attention to detail, and genuine care. We believe that great service means being available when you need us, communicating clearly, and always putting your needs first.",
    },
    {
      title: 'A Needed Solution',
      content:
        "In 2024, we identified a significant gap in the market for high-quality IT support tailored to both homes and small businesses. While larger companies often have access to dedicated IT teams, many households, home offices, and small businesses struggle to find reliable and trustworthy help. Lucky Logic was created to fill this void. Our services are designed specifically for Sydney homes and small businesses, providing expert assistance with everything from network setup to device troubleshooting. We understand the unique challenges faced by residential clients and small business owners alike, and we're committed to delivering solutions that are both effective and easy to understand.",
    },
    {
      title: 'Your Security, Our Priority',
      content:
        "Your security is at the heart of everything we do. In today's digital world, threats like scams, phishing, and online fraud are more prevalent than ever. We take these concerns seriously and make your safety our top priority. Whether we are assisting you in person or providing remote support, we use best practices to protect your data and privacy. We stay up to date with the latest security trends and ensure that you are informed and empowered to keep your technology safe. Our commitment is to give you peace of mind, knowing that your digital life is in good hands.",
    },
  ];

  const coverageSection = {
    title: 'Insurance',
    content: (
      <>
        <Text fontSize="lg" fontWeight="medium" color="gray.800" mb={4}>
          Your Peace of Mind
        </Text>
        <Text color="gray.700" mb={4}>
          We understand that inviting someone into your home or handing over your devices takes trust, so we take that responsibility seriously.
        </Text>
        <Text color="gray.700" mb={2}>
          Lucky Logic is fully insured, including:
        </Text>
        <List spacing={2} pl={4} mb={4} styleType="disc">
          <ListItem>Public & Product Liability, AUD $5 million (AUD $5,000,000)</ListItem>
        </List>
        <Text color="gray.700" mb={2}>
          Our goal is simple: Help you feel confident, supported, and sorted when it comes to anything tech.
        </Text>
        <Text color="gray.700">
          A Certificate of Currency can be produced on request.
        </Text>
      </>
    ),
  };

  const servicesList = [
    '<b>Wi-Fi setup and optimisation:</b> including router configuration and troubleshooting with your internet provider. We help ensure strong, reliable coverage throughout your home.',
    '<b>Laptop and desktop repairs, custom computer builds:</b> sourcing of quality parts tailored to your needs. We keep your devices running smoothly and efficiently.',
    '<b>Windows operating system installation, virus and malware removal:</b> ongoing software troubleshooting. We make sure your systems are secure and up to date.',
    '<b>Support for smart home devices and home automation:</b> helping you get the most out of your connected lifestyle. <i>Please note this service is offered within a limited scope, but we are happy to advise on compatibility and setup.</i>',
  ];

  const aboutData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    'name': 'About Lucky Logic IT',
    'description': "Learn about Lucky Logic IT, Sydney's trusted residential IT support service.",
    'mainEntity': {
      '@type': 'Organization',
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
        'streetAddress': '580 Princes Highway',
        'addressLocality': 'Kirrawee',
        'addressRegion': 'NSW',
        'postalCode': '2232',
        'addressCountry': 'AU'
      }
    }
  };

  return (
    <>
      <SEO
        title="About Us"
        description="Learn about Lucky Logic IT, Sydney's trusted residential IT support service."
        keywords="IT support Sydney, computer repairs, tech support, residential IT services"
        canonicalUrl="https://luckylogic.com.au/about-us"
      />
      <JsonLd data={aboutData} />
      <Box px={6} pt="100px" pb={{ base: 16, md: 24 }} maxW="7xl" mx="auto" color="gray.800">
        {/* Hero Section */}
        <Box
          position="relative"
          bg="#0d3c2b"
          px={{ base: 4, md: 12 }}
          py={{ base: 12, md: 24 }}
          mb={{ base: 16, md: 20 }}
          width="100%"
          overflow="hidden"
          borderRadius="2xl"
        >
          {/* Circuit Pattern Background */}
          <Box
            position="absolute"
            inset={0}
            zIndex={0}
            pointerEvents="none"
            opacity={0.18}
          >
            {/* Faded logo overlays in each circle */}
            <Image src="/about-us/about-us-logo.png" alt="Lucky Logic Logo" position="absolute" left="140px" top="40px" boxSize="120px" opacity={0.18} pointerEvents="none" />
            <Image src="/about-us/about-us-logo.png" alt="Lucky Logic Logo" position="absolute" left="520px" top="120px" boxSize="160px" opacity={0.18} pointerEvents="none" />
            <Image src="/about-us/about-us-logo.png" alt="Lucky Logic Logo" position="absolute" left="1050px" top="70px" boxSize="100px" opacity={0.18} pointerEvents="none" />
            <Image src="/about-us/about-us-logo.png" alt="Lucky Logic Logo" position="absolute" left="830px" top="230px" boxSize="140px" opacity={0.18} pointerEvents="none" />
            <Image src="/about-us/about-us-logo.png" alt="Lucky Logic Logo" position="absolute" left="360px" top="280px" boxSize="80px" opacity={0.18} pointerEvents="none" />
          </Box>
          <Flex align="center" position="relative" zIndex={1} maxW="7xl" mx="auto">
            <Box>
              <Heading as="h1" fontSize={{ base: "2xl", md: "4xl", lg: "5xl" }} color="white" fontWeight="bold" mb={6} lineHeight="1.1">
                About Lucky Logic
              </Heading>
              <Text fontSize={{ base: "lg", md: "2xl" }} color="white" fontWeight="medium">
                Your trusted partner for <span style={{ color: '#c9a227', fontWeight: 600, display: 'inline' }}>seamless residential & small business IT solutions</span> in Sydney's Sutherland Shire and greater Sydney area.
              </Text>
            </Box>
          </Flex>
        </Box>

        <Stack spacing={16}>
          {aboutSections.map((section, idx) => (
            <SimpleGrid
              key={section.title}
              columns={{ base: 1, md: 2 }}
              spacing={10}
              alignItems="center"
              bg="whiteAlpha.800"
              borderRadius="2xl"
              boxShadow="lg"
              p={{ base: 6, md: 12 }}
            >
              <Box order={{ base: 1, md: idx % 2 === 0 ? 1 : 2 }}>
                <Heading as="h2" size="lg" color="brand.green" mb={4}>
                  {section.title}
                </Heading>
                <Text fontSize="lg" color="gray.800">
                  {section.content}
                </Text>
              </Box>
              <Box order={{ base: 2, md: idx % 2 === 0 ? 2 : 1 }} display={{ base: 'none', md: 'flex' }} justifyContent="center" alignItems="center">
                {idx === 0 && (
                  <Image
                    src="/about-us/about-us1.png"
                    alt="Lucky Logic About Us DNA Graphic"
                    maxW="260px"
                    maxH="350px"
                    borderRadius="xl"
                    boxShadow="md"
                  />
                )}
                {idx === 1 && (
                  <Image
                    src="/about-us/about-us2.png"
                    alt="Lucky Logic Boutique Approach Graphic"
                    maxW="260px"
                    maxH="350px"
                    borderRadius="xl"
                    boxShadow="md"
                  />
                )}
                {idx === 2 && (
                  <Image
                    src="/about-us/about-us3.png"
                    alt="Lucky Logic Needed Solution Graphic"
                    maxW="260px"
                    maxH="350px"
                    borderRadius="xl"
                    boxShadow="md"
                  />
                )}
                {idx === 3 && (
                  <Image
                    src="/about-us/about-us4.png"
                    alt="Lucky Logic Security Priority Graphic"
                    maxW="260px"
                    maxH="350px"
                    borderRadius="xl"
                    boxShadow="md"
                  />
                )}
              </Box>
            </SimpleGrid>
          ))}

          {/* Our Services Section */}
          <Box
            bg="whiteAlpha.800"
            borderRadius="2xl"
            boxShadow="lg"
            p={{ base: 6, md: 12 }}
            textAlign="center"
          >
            <Heading as="h2" size="lg" color="brand.green" mb={6}>
              Our Services
            </Heading>
            <Text fontSize="lg" fontWeight="medium" color="gray.800" mb={8}>
              We offer a comprehensive range of home technology services to simplify, secure, and enhance your digital experience. Our team is dedicated to providing clear, effective solutions for every aspect of your home IT needs:
            </Text>
            <List spacing={4} mb={8} fontWeight="semibold" styleType="disc" textAlign="left" maxW="2xl" mx="auto">
              {servicesList.map((item, i) => (
                <ListItem key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </List>
            <Button
              size="lg"
              bg="brand.green"
              color="white"
              onClick={handleViewServices}
              _hover={{ bg: 'green.700', boxShadow: 'lg', transform: 'translateY(-2px)' }}
            >
              View Our Services
            </Button>
          </Box>

          {/* Lucky Logic Coverage Section */}
          <Box
            bg="whiteAlpha.800"
            borderRadius="2xl"
            boxShadow="lg"
            p={{ base: 6, md: 12 }}
          >
            <Heading as="h2" size="lg" color="brand.green" mb={4}>
              {coverageSection.title}
            </Heading>
            {coverageSection.content}
          </Box>
        </Stack>
      </Box>
    </>
  );
}
