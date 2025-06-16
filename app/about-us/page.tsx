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
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

export default function AboutUsPage() {
  return (
    <Box px={6} pt="100px" pb={{ base: 16, md: 24 }} maxW="4xl" mx="auto" color="gray.800">
      {/* Logo at top near navbar */}
      <Box width="160px" mx="auto" mt={-100} mb={2}>
        <Image src="/logo.png" alt="Lucky Logic Logo" objectFit="contain" />
      </Box>

      {/* Main Heading */}
      <Heading as="h1" size="2xl" color="brand.green" textAlign="center" mb={12}>
        About Lucky Logic
      </Heading>

      {/* Our Story */}
      <Heading as="h2" size="lg" mt={8} mb={4} color="brand.green">
        Our Story
      </Heading>
      <Text fontSize="lg" lineHeight="taller">
        Lucky Logic was born from the passion and vision of our founder, who brings over 15 years of valuable experience working with and for some of Australia’s leading IT companies. With a rich background spanning hardware and software sales, alongside hands-on technical support roles, this experience has uniquely shaped our approach to residential IT support, blending professional know-how with genuine care for everyday users.
      </Text>

      {/* Market Gap */}
      <Heading as="h2" size="lg" mt={10} mb={4} color="brand.green">
        A Needed Solution
      </Heading>
      <Text fontSize="lg" lineHeight="taller">
        In 2024, after closely observing the IT landscape across Sydney, we realised there was a noticeable gap in dedicated residential IT services. While commercial IT solutions thrive in the business world, many households and home offices face challenges when seeking reliable, trustworthy and personalised IT assistance. That’s where Lucky Logic steps in with boutique services designed exclusively for Sydney’s residential customers.
      </Text>

      {/* Boutique Approach */}
      <Heading as="h2" size="lg" mt={10} mb={4} color="brand.green">
        What Makes Us Boutique?
      </Heading>
      <Text fontSize="lg" lineHeight="taller">
        We deliver tailored, personal service that’s often missing from large, generic providers. We take the time to listen and understand your unique situation, whether it’s on-site or remote assistance so you get solutions that truly fit. Boutique IT is about more than quick fixes; it’s about lasting relationships built on trust, detail, and care.
      </Text>

      <Divider my={10} />

      {/* Services */}
      <Heading as="h2" size="lg" mb={4} color="brand.green">
        Our Services
      </Heading>
      <Text fontSize="lg" lineHeight="taller" mb={4}>
        We provide complete home tech solutions designed to simplify and secure your digital life:
      </Text>
      <List spacing={4} pl={4}>
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

      <Divider my={10} />

      {/* Security & Peace of Mind */}
      <Heading as="h2" size="lg" mb={4} color="brand.green">
        Your Security, Our Priority
      </Heading>
      <Text fontSize="lg" lineHeight="taller" mb={6}>
        In an age where cybersecurity threats are more sophisticated and prevalent than ever, we understand the concerns many people have about scams, phishing and online fraud. This makes personalised, face-to-face or trusted remote IT support more important than ever. At Lucky Logic, your security and peace of mind are our top priorities. We work hard to build transparent, honest relationships so you can feel confident and safe every time you reach out.
      </Text>

      {/* Final Message */}
      <Heading as="h2" size="lg" mb={4} color="brand.green">
        Why Choose Lucky Logic?
      </Heading>
      <Text fontSize="lg" lineHeight="taller">
        Choosing Lucky Logic means partnering with a team who genuinely cares about your digital wellbeing. We understand the intricacies of your home IT environment and are dedicated to ensuring your technology supports your lifestyle smoothly, securely and stress-free.
      </Text>
    </Box>
  );
}
