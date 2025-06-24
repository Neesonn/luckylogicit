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
  FiPhone,
} from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import ServiceGrid from '../../components/ServiceGrid';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';
import NextLink from 'next/link';

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
      'Laptop & PC repair',
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
      'Device troubleshooting (Ipad/Iphone)',
      
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
  {
    title: 'Phone & Tablet Troubleshooting',
    summary: 'Expert help for iPhone, Android, iPad, and tablet issues—setup, sync, app problems, and more.',
    bullets: [
      'Device setup and configuration',
      'App installation and troubleshooting',
      'Syncing email, contacts, and cloud accounts',
      'Screen, charging, and connectivity issues',
    ],
    ideal: 'Anyone struggling with their mobile or tablet device.',
    icon: FiPhone,
  },
];

export default function ServicesPage() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const iconBg = useColorModeValue('gray.100', 'gray.700');
  const router = useRouter();

  const handleContactClick = () => {
    router.push('/contact-us');
  };

  const servicesData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: [
      {
        '@type': 'Service',
        position: 1,
        name: 'Network Wi-Fi and Internet Setup & Troubleshooting',
        description: 'Professional network setup and troubleshooting services for your home internet and Wi-Fi needs.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      },
      {
        '@type': 'Service',
        position: 2,
        name: 'Computer Repairs & Upgrades',
        description: 'Expert computer repair and upgrade services to keep your devices running smoothly.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      },
      {
        '@type': 'Service',
        position: 3,
        name: 'Software Installation / Procurement',
        description: 'Professional software installation and procurement services for all your digital needs.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      },
      {
        '@type': 'Service',
        position: 4,
        name: 'Custom PC Build',
        description: 'Custom PC building services tailored to your specific needs and requirements.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      },
      {
        '@type': 'Service',
        position: 5,
        name: 'Smart Home Assistance',
        description: 'Expert smart home setup and integration services for modern living.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      },
      {
        '@type': 'Service',
        position: 6,
        name: 'Printer & Peripheral Support',
        description: 'Comprehensive support for printers and other peripheral devices.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      },
      {
        '@type': 'Service',
        position: 7,
        name: 'Virus and Malware Support',
        description: 'Professional virus removal and malware protection services.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      },
      {
        '@type': 'Service',
        position: 8,
        name: 'Mobile Device Support',
        description: 'Expert support for all your mobile device needs.',
        provider: {
          '@type': 'LocalBusiness',
          name: 'Lucky Logic IT'
        }
      }
    ]
  };

  return (
    <>
      <SEO
        title="Our Services"
        description="Explore Lucky Logic IT's comprehensive range of residential IT services in Sydney. From computer repairs to smart home setup, we've got you covered."
        keywords="IT services Sydney, computer repairs, network setup, smart home, tech support, residential IT, computer maintenance, Sydney IT services"
        canonicalUrl="https://luckylogic.com.au/services"
      />
      <JsonLd data={servicesData} />
      <Box px={{ base: 4, md: 8 }} py={{ base: 16, md: 24 }} maxW="7xl" mx="auto" bg="white">
        <VStack spacing={4} textAlign="center" mb={12}>
          <Heading as="h1" size="2xl" fontWeight="bold" color="brand.green">
            Our Services
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="2xl">
            Friendly, professional IT help delivered to your door with clear, upfront pricing. We only charge a call-out fee once we've assessed the issue and you've approved the quote. Most problems can be resolved during the initial visit, but if further diagnostics, parts, or repairs are needed, an updated quote will be provided for your approval before any additional work is done.
          </Text>
          <HStack justify="center" spacing={4} mt={2}>
            <Button as={NextLink} href="/faq" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} variant="solid" size="md">
              View FAQ
            </Button>
            <Button as={NextLink} href="/troubleshoot" variant="outline" size="md" color="#003f2d" borderColor="#003f2d" _hover={{ bg: '#e9f5f1' }}>
              Troubleshooting Guide
            </Button>
          </HStack>
        </VStack>

        {isMobile ? (
          <Accordion allowToggle>
            {services.map((service, idx) => (
              <AccordionItem key={idx} border="1px solid" borderColor="gray.200" borderRadius="xl" mb={4}>
                <h2>
                  <AccordionButton 
                    px={4} 
                    py={6} 
                    _expanded={{ bg: 'green.50' }}
                    _focus={{
                      outline: '2px solid',
                      outlineColor: 'brand.green',
                      outlineOffset: '2px',
                    }}
                  >
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
                    aria-label={`Get in touch about ${service.title}`}
                    _focus={{
                      outline: '2px solid',
                      outlineColor: 'brand.green',
                      outlineOffset: '2px',
                    }}
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
                _focus={{
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                  boxShadow: 'md',
                }}
                bg="white"
                tabIndex={0}
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
                  aria-label={`Get in touch about ${service.title}`}
                >
                  Get in touch
                </Button>
              </Box>
            ))}
          </SimpleGrid>
        )}
      </Box>
    </>
  );
}
