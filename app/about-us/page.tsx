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

  const Section = ({
    icon,
    title,
    content,
  }: {
    icon: any;
    title: string;
    content: string;
  }) => (
    <MotionBox
      p={8}
      borderRadius="2xl"
      boxShadow="lg"
      bg="whiteAlpha.800"
      backdropFilter="blur(12px)"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ translateY: -4, boxShadow: 'xl' }}
    >
      <Heading
        as="h2"
        size="lg"
        color="brand.green"
        mb={4}
        textTransform="capitalize"
        display="flex"
        alignItems="center"
        gap={3}
      >
        <Icon as={icon} boxSize={6} /> {title}
      </Heading>
      <Text fontSize="lg" fontWeight="medium" color="gray.800" lineHeight="taller">
        {content}
      </Text>
    </MotionBox>
  );

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
        <VStack
          spacing={6}
          mb={{ base: 16, md: 20 }}
          py={{ base: 10, md: 20 }}
          borderRadius="2xl"
          boxShadow="2xl"
          bg="brand.green"
          textAlign="center"
        >
          <MotionHeading
            as="h1"
            size={{ base: '2xl', md: '3xl' }}
            color="white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            About Lucky Logic
          </MotionHeading>
          <MotionText
            fontSize={{ base: 'md', md: 'xl' }}
            color="white"
            fontWeight="medium"
            maxW="2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Your trusted partner for seamless residential IT solutions in Sydney's Sutherland Shire.
          </MotionText>
        </VStack>

        <VStack spacing={12} align="stretch">
          <Section
            icon={FiBookOpen}
            title="Our Story"
            content="Lucky Logic was founded out of a genuine passion for technology and a desire to help people get the most from their digital lives. Our founder has over 15 years of experience working with some of Australia's leading IT companies, gaining expertise in both hardware and software, as well as hands-on technical support. This extensive background has shaped our unique approach to residential IT. We combine professional knowledge with a personal touch, ensuring that every client receives solutions tailored to their needs. Our story is one of continuous learning, dedication, and a commitment to making technology accessible and stress-free for everyone."
          />
          <Divider />
          <Section
            icon={FiUserCheck}
            title="What Makes Us Boutique?"
            content="What sets Lucky Logic apart is our boutique approach to IT support. Unlike large, impersonal providers, we take the time to listen to your concerns and understand your unique situation. Whether you need help on-site or remotely, we tailor our solutions to fit your specific requirements. Our goal is to build lasting relationships with our clients, founded on trust, attention to detail, and genuine care. We believe that great service means being available when you need us, communicating clearly, and always putting your needs first."
          />
          <Divider />
          <Section
            icon={FiTarget}
            title="A Needed Solution"
            content="In 2024, we identified a significant gap in the market for high-quality residential IT support. While businesses often have access to dedicated IT teams, many households and home offices struggle to find reliable and trustworthy help. Lucky Logic was created to fill this void. Our services are designed specifically for Sydney homes, providing expert assistance for everything from network setup to device troubleshooting. We understand the unique challenges faced by residential clients and are committed to delivering solutions that are both effective and easy to understand."
          />
          <Divider />
          <Section
            icon={FiShield}
            title="Your Security, Our Priority"
            content="Your security is at the heart of everything we do. In today's digital world, threats like scams, phishing, and online fraud are more prevalent than ever. We take these concerns seriously and make your safety our top priority. Whether we are assisting you in person or providing remote support, we use best practices to protect your data and privacy. We stay up to date with the latest security trends and ensure that you are informed and empowered to keep your technology safe. Our commitment is to give you peace of mind, knowing that your digital life is in good hands."
          />
          <Divider />
          <MotionBox
            p={8}
            borderRadius="2xl"
            boxShadow="lg"
            bg="whiteAlpha.800"
            backdropFilter="blur(12px)"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Heading
              as="h2"
              size="lg"
              mb={6}
              color="brand.green"
              textAlign="center"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
            >
              <Icon as={FiList} boxSize={6} /> Our Services
            </Heading>
            <Text fontSize="lg" fontWeight="medium" color="gray.800" mb={8} textAlign="center">
              We offer a comprehensive range of home technology services to simplify, secure, and enhance your digital experience. Our team is dedicated to providing clear, effective solutions for every aspect of your home IT needs:
            </Text>
            <List spacing={4} mb={8} fontWeight="semibold">
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.green" />
                Wi-Fi setup and optimisation, including router configuration and troubleshooting with your internet provider. We help ensure strong, reliable coverage throughout your home.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.green" />
                Laptop and desktop repairs, custom computer builds, and sourcing of quality parts tailored to your needs. We keep your devices running smoothly and efficiently.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.green" />
                Windows operating system installation, virus and malware removal, and ongoing software troubleshooting. We make sure your systems are secure and up to date.
              </ListItem>
              <ListItem>
                <ListIcon as={CheckCircleIcon} color="brand.green" />
                Support for smart home devices and home automation, helping you get the most out of your connected lifestyle. Please note this service is offered within a limited scope, but we are happy to advise on compatibility and setup.
              </ListItem>
            </List>
            <Box textAlign="center">
              <MotionButton
                size="lg"
                bg="brand.green"
                color="white"
                onClick={handleViewServices}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                _hover={{ bg: 'green.700', boxShadow: 'lg', transform: 'translateY(-2px)' }}
              >
                View Our Services
              </MotionButton>
            </Box>
          </MotionBox>
        </VStack>
      </Box>
    </>
  );
}
