'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Icon,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  SimpleGrid,
  useBreakpointValue,
  useColorModeValue,
  Divider,
  Button,
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
import { useRouter } from 'next/navigation';

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
    ideal: "Anyone struggling with devices that won't connect.",
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
    summary: "We're available for on-demand or ongoing remote or on-site support.",
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
  const isMobile = useBreakpointValue({ base: true, md: false });
  const iconBg = useColorModeValue('gray.100', 'gray.700');
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/contact-us');
  };

  return (
    <Box px={{ base: 4, md: 8 }} py={{ base: 16, md: 24 }} maxW="7xl" mx="auto" bg="white">
      <VStack spacing={4} textAlign="center" mb={12}>
        <Heading as="h1" size="2xl" fontWeight="bold" color="brand.green">
          Our Services
        </Heading>
        <Text fontSize="lg" color="gray.600" maxW="2xl">
          Friendly, professional IT help delivered to your door.
        </Text>
      </VStack>

      {isMobile ? (
        <Accordion allowToggle>
          {services.map((service, idx) => (
            <AccordionItem key={idx} border="1px solid" borderColor="gray.200" borderRadius="xl" mb={4}>
              <h2>
                <AccordionButton px={4} py={6} _expanded={{ bg: 'green.50' }}>
                  <HStack spacing={4} flex="1" textAlign="left">
                    <Box p={2} bg={iconBg} borderRadius="full">
                      <Icon as={service.icon} boxSize={5} color="brand.green" />
                    </Box>
                    <Text fontWeight="semibold">{service.title}</Text>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel px={6} pb={6}>
                <Text mb={2} fontSize="sm" color="gray.700">{service.summary}</Text>
                <VStack align="start" spacing={1} fontSize="sm" color="gray.600" mb={3}>
                  {service.bullets.map((point, i) => (
                    <Text key={i}>• {point}</Text>
                  ))}
                </VStack>
                <Divider mb={2} />
                <Text fontSize="xs" color="gray.500" mb={3}>
                  <strong>Ideal for:</strong> {service.ideal}
                </Text>
                <Button
                  size="sm"
                  colorScheme="green"
                  variant="outline"
                  width="full"
                  mt={2}
                  onClick={handleContactClick}
                >
                  Get in touch
                </Button>
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
          {services.map((service, idx) => (
            <Box
              key={idx}
              p={6}
              borderRadius="xl"
              boxShadow="sm"
              border="1px solid"
              borderColor="gray.200"
              transition="all 0.2s"
              _hover={{ boxShadow: 'md' }}
              bg="white"
            >
              <HStack spacing={4} mb={3}>
                <Box bg={iconBg} p={3} borderRadius="full">
                  <Icon as={service.icon} boxSize={6} color="brand.green" />
                </Box>
                <Heading fontSize="lg" color="gray.800">
                  {service.title}
                </Heading>
              </HStack>

              <Text fontSize="sm" color="gray.700" mb={2}>
                {service.summary}
              </Text>

              <VStack align="start" spacing={1} fontSize="sm" color="gray.600" mt={2}>
                {service.bullets.map((point, i) => (
                  <Text key={i}>• {point}</Text>
                ))}
              </VStack>

              <Divider my={4} />

              <Text fontSize="sm" color="gray.500" fontStyle="italic" mb={3}>
                <strong>Ideal for:</strong> {service.ideal}
              </Text>
              <Button
                size="sm"
                colorScheme="green"
                variant="outline"
                width="full"
                onClick={handleContactClick}
              >
                Get in touch
              </Button>
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
}
