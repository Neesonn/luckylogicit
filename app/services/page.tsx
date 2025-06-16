'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  SimpleGrid,
} from '@chakra-ui/react';
import {
  FiWifi,
  FiCpu,
  FiDownload,
  FiSettings,
  FiTool,
  FiPrinter,
  FiShield,
  FiHeadphones,
} from 'react-icons/fi';

const services = [
  {
    title: 'Network Setup & Troubleshooting',
    summary: 'We optimise your internet and fix dropouts or black spots around the home.',
    bullets: [
      'Router & modem configuration',
      'Wi-Fi blackspot fixes and mesh network setups',
      'ISP connectivity troubleshooting',
    ],
    ideal: 'Perfect for households with slow or unstable internet.',
    icon: FiWifi,
  },
  {
    title: 'Computer Repairs & Upgrades',
    summary: 'Repair, replace or upgrade your hardware to boost performance.',
    bullets: [
      'RAM and storage upgrades',
      'Laptop screen/keyboard repair',
      'Fan, power, and thermal troubleshooting',
    ],
    ideal: 'Great for slow, aging, or malfunctioning PCs/laptops.',
    icon: FiCpu,
  },
  {
    title: 'Software Installation & Support',
    summary: 'Install or repair software, OS, or remove malware.',
    bullets: [
      'Windows/macOS installation',
      'Office & licensed software setup',
      'Malware/virus removal',
    ],
    ideal: 'Anyone needing smooth, secure software operation.',
    icon: FiDownload,
  },
  {
    title: 'Custom PC Builds',
    summary: 'Let us help you design and build a high-performance desktop.',
    bullets: [
      'Gaming PCs and workstation builds',
      'Component selection & compatibility checks',
      'Assembly and OS setup',
    ],
    ideal: 'Gamers, editors, and power users needing performance.',
    icon: FiSettings,
  },
  {
    title: 'Smart Home Automation Assistance',
    summary: 'We connect and configure your smart home devices.',
    bullets: [
      'Google Home, Alexa, Apple HomeKit setup',
      'Smart lighting, switches, cameras',
      'Wi-Fi automation compatibility',
    ],
    ideal: 'Ideal for modern households wanting automation.',
    icon: FiTool,
  },
  {
    title: 'Printer & Peripheral Support',
    summary: 'Get your printers, scanners and accessories working seamlessly.',
    bullets: [
      'Printer and driver installations',
      'Wi-Fi printing & network setup',
      'Peripheral troubleshooting',
    ],
    ideal: 'Anyone struggling with devices that won’t connect.',
    icon: FiPrinter,
  },
  {
    title: 'Virus & Malware Removal',
    summary: 'Clean your computer from unwanted software and threats.',
    bullets: [
      'Full security scans',
      'Malware and ransomware removal',
      'System hardening recommendations',
    ],
    ideal: 'For compromised systems or suspicious behaviour.',
    icon: FiShield,
  },
  {
    title: 'Ongoing Tech Support',
    summary: 'We’re available for on-demand or ongoing remote or on-site support.',
    bullets: [
      'Flexible remote support options',
      'On-site visits for setup or repair',
      'Scheduled maintenance plans',
    ],
    ideal: 'Elderly, busy professionals, or families needing tech help.',
    icon: FiHeadphones,
  },
];

export default function ServicesPage() {
  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 16, md: 24 }} maxW="7xl" mx="auto">
      <Heading
        as="h1"
        size="2xl"
        mb={10}
        color="brand.green"
        textAlign="center"
        fontWeight="extrabold"
      >
        Our Services
      </Heading>

      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
        {services.map((service, idx) => (
          <Box
            key={idx}
            p={6}
            borderRadius="lg"
            boxShadow="md"
            bg="gray.50"
            transition="all 0.3s"
            _hover={{ transform: 'translateY(-4px)', boxShadow: 'xl' }}
          >
            <HStack spacing={4} align="start">
              <Box p={3} bg="green.100" borderRadius="full">
                <Icon as={service.icon} boxSize={6} color="brand.green" />
              </Box>
              <VStack align="start" spacing={2} flex="1">
                <Heading fontSize="lg" color="gray.800">
                  {service.title}
                </Heading>
                <Text color="gray.600">{service.summary}</Text>
                <VStack align="start" spacing={0} pt={2} fontSize="sm">
                  {service.bullets.map((item, i) => (
                    <Text key={i}>• {item}</Text>
                  ))}
                </VStack>
                <Text fontSize="sm" color="gray.500" pt={2}>
                  <strong>Ideal for:</strong> {service.ideal}
                </Text>
              </VStack>
            </HStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
}
