'use client';
import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  Image,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  useBreakpointValue,
  Container,
  Button,
  Flex,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function AboutUsPage() {
  const [animationData, setAnimationData] = useState(null);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  useEffect(() => {
    fetch('/about-animation.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Failed to load animation:', err));
  }, []);

  const handleViewServices = () => {
    router.push('/services');
  };

  return (
    <Box px={6} pt="100px" pb={{ base: 16, md: 24 }} maxW="7xl" mx="auto" color="gray.800">
      {/* Hero Section with Animation */}
      <VStack spacing={8} mb={{ base: 16, md: 24 }} py={{ base: 8, md: 16 }} bg="brand.green" borderRadius="xl" boxShadow="xl">
        {animationData && (
          <Box width={{ base: "200px", md: "320px" }} height={{ base: "200px", md: "320px" }}>
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
        )}
        
        <MotionHeading
          as="h1"
          size={{ base: "xl", md: "3xl" }}
          color="white"
          textAlign="center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Lucky Logic
        </MotionHeading>
        <MotionText
          fontSize={{ base: "md", md: "lg" }}
          color="white"
          textAlign="center"
          maxW="3xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Your trusted partner for seamless residential IT solutions.
        </MotionText>
      </VStack>

      {/* Main Content Sections */}
      <VStack spacing={{ base: 8, md: 12 }} mb={16} align="stretch">
        {/* Row 1: Our Story & What Makes Us Boutique? */}
        <Flex direction={{ base: "column", md: "row" }} gap={{ base: 8, md: 10 }}>
          <MotionBox
            flex="1"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            whileHover={{ translateY: -5, boxShadow: 'lg' }}
          >
            <Heading as="h2" size="lg" color="brand.green" mb={4}>
              Our Story
            </Heading>
            <Text fontSize="lg" lineHeight="taller">
              Lucky Logic was born from the passion and vision of our founder, who brings over 15 years of valuable experience working with and for some of Australia's leading IT companies. With a rich background spanning hardware and software sales, alongside hands-on technical support roles, this experience has uniquely shaped our approach to residential IT support, blending professional know-how with genuine care for everyday users.
            </Text>
          </MotionBox>
          <MotionBox
            flex="1"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ translateY: -5, boxShadow: 'lg' }}
          >
            <Heading as="h2" size="lg" color="brand.green" mb={4}>
              What Makes Us Boutique?
            </Heading>
            <Text fontSize="lg" lineHeight="taller">
              We deliver tailored, personal service that's often missing from large, generic providers. We take the time to listen and understand your unique situation, whether it's on-site or remote assistance so you get solutions that truly fit. Boutique IT is about more than quick fixes; it's about lasting relationships built on trust, detail, and care.
            </Text>
          </MotionBox>
        </Flex>

        {/* Row 2: A Needed Solution & Your Security, Our Priority */}
        <Flex direction={{ base: "column", md: "row" }} gap={{ base: 8, md: 10 }}>
          <MotionBox
            flex="1"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ translateY: -5, boxShadow: 'lg' }}
          >
            <Heading as="h2" size="lg" color="brand.green" mb={4}>
              A Needed Solution
            </Heading>
            <Text fontSize="lg" lineHeight="taller">
              In 2024, after closely observing the IT landscape across Sydney, we realised there was a noticeable gap in dedicated residential IT services. While commercial IT solutions thrive in the business world, many households and home offices face challenges when seeking reliable, trustworthy and personalised IT assistance. That's where Lucky Logic steps in with boutique services designed exclusively for Sydney's residential customers.
            </Text>
          </MotionBox>
          <MotionBox
            flex="1"
            p={6}
            borderRadius="lg"
            boxShadow="md"
            bg="white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            whileHover={{ translateY: -5, boxShadow: 'lg' }}
          >
            <Heading as="h2" size="lg" color="brand.green" mb={4}>
              Your Security, Our Priority
            </Heading>
            <Text fontSize="lg" lineHeight="taller">
              In an age where cybersecurity threats are more sophisticated and prevalent than ever, we understand the concerns many people have about scams, phishing and online fraud. This makes personalised, face-to-face or trusted remote IT support more important than ever. At Lucky Logic, your security and peace of mind are our top priorities.
            </Text>
          </MotionBox>
        </Flex>
      </VStack>

      <Divider my={16} />

      {/* Services Section */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Heading as="h2" size="lg" mb={6} color="brand.green" textAlign="center">
          Our Services
        </Heading>
        <Text fontSize="lg" lineHeight="taller" mb={8} textAlign="center">
          We provide complete home tech solutions designed to simplify and secure your digital life:
        </Text>
        <List spacing={4} mb={8}>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="brand.green" />
            Network setup and optimisation, including router configuration, troubleshooting with internet providers, and improving Wi-Fi coverage for your whole home.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="brand.green" />
            Expert PC and laptop repairs, custom-built computers, and sourcing quality parts tailored to your needs.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="brand.green" />
            Windows operating system installations, virus and malware removal, plus ongoing software troubleshooting to keep your devices running smoothly.
          </ListItem>
          <ListItem>
            <ListIcon as={CheckCircleIcon} color="brand.green" />
            Assistance with smart home devices and home automation, helping you get the most out of your connected lifestyle. Please note this service is offered within a limited scope.
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
            transition={{ duration: 0.5, delay: 0.8 }}
            _hover={{ bg: 'green.700', boxShadow: 'lg', transform: 'translateY(-2px)' }}
            style={{ transition: 'all 0.2s' }}
          >
            View All Services
          </MotionButton>
        </Box>
      </MotionBox>

      <Divider my={16} />

      {/* Final Message */}
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        textAlign="center"
      >
        <Heading as="h2" size="lg" mb={4} color="brand.green">
          Why Choose Lucky Logic?
        </Heading>
        <Text fontSize="lg" lineHeight="taller">
          Choosing Lucky Logic means partnering with a team who genuinely cares about your digital wellbeing. We understand the intricacies of your home IT environment and are dedicated to ensuring your technology supports your lifestyle smoothly, securely and stress-free.
        </Text>
      </MotionBox>
    </Box>
  );
}
