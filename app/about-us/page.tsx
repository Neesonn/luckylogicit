'use client';
import { Box, Heading, Text, VStack, Divider, Image } from '@chakra-ui/react';

export default function AboutUsPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="4xl" mx="auto" color="gray.800">

      {/* Center logo and heading together */}
      <VStack spacing={130} mb={8} align="center">
        <Box width="200px" height="80px">
          <Image src="/logo.png" alt="Lucky Logic Logo" objectFit="contain" />
        </Box>
        <Heading as="h1" size="2xl" color="brand.green" textAlign="center">
          About Lucky Logic
        </Heading>
      </VStack>

      <VStack spacing={6} align="start">
        <Text fontSize="lg" lineHeight="taller">
          Lucky Logic was born from the passion and vision of our founder, who brings over 15 years of valuable experience working with and for some of Australia’s leading IT companies. With a rich background spanning hardware and software sales, alongside hands-on technical support roles, this experience has uniquely shaped our approach to residential IT support, blending professional know-how with genuine care for everyday users.
        </Text>

        <Text fontSize="lg" lineHeight="taller">
          In 2024, after closely observing the IT landscape across Sydney, we realised there was a noticeable gap in dedicated residential IT services. While commercial IT solutions thrive in the business world, many households and home offices face challenges when seeking reliable, trustworthy and personalised IT assistance. That is where Lucky Logic steps in. Our mission is to bridge this gap by offering boutique IT services designed exclusively for Sydney’s residential customers.
        </Text>

        <Text fontSize="lg" lineHeight="taller">
          What makes us boutique? It means we focus on delivering tailored, personal service that is often missing from large, generic providers. We take the time to listen and understand each client’s unique situation, delivering solutions that truly fit their needs, whether that is on-site support in your home or remote assistance, whichever works best for you. Boutique IT is not just about quick fixes; it is about building lasting relationships based on trust, attention to detail and quality care.
        </Text>

        <Divider />

        <Text fontSize="lg" lineHeight="taller">
          Our comprehensive range of services covers all the essentials for today’s connected home:
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.25rem', listStyleType: 'disc' }}>
            <li>Network setup and optimisation, including router configuration, troubleshooting with internet providers, and improving Wi-Fi coverage for your whole home.</li>
            <li>Expert PC and laptop repairs, custom-built computers, and sourcing quality parts tailored to your needs.</li>
            <li>Windows operating system installations, virus and malware removal, plus ongoing software troubleshooting to keep your devices running smoothly.</li>
            <li>Assistance with smart home devices and home automation, helping you get the most out of your connected lifestyle. Please note this service is offered within a limited scope.</li>
          </ul>
        </Text>

        <Divider />

        <Text fontSize="lg" lineHeight="taller">
          In an age where cybersecurity threats are more sophisticated and prevalent than ever, we understand the concerns many people have about scams, phishing and online fraud. This makes personalised, face-to-face or trusted remote IT support more important than ever. At Lucky Logic, your security and peace of mind are our top priorities. We work hard to build transparent, honest relationships so you can feel confident and safe every time you reach out.
        </Text>

        <Text fontSize="lg" lineHeight="taller">
          Choosing Lucky Logic means partnering with a team who genuinely cares about your digital wellbeing. We understand the intricacies of your home IT environment and are dedicated to ensuring your technology supports your lifestyle smoothly, securely and stress-free.
        </Text>
      </VStack>
    </Box>
  );
}
