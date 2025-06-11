'use client';

import {
  Box,
  Heading,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Text,
  VStack,
  HStack,
  useColorModeValue,
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
    description: `From router configuration and Wi-Fi optimization to troubleshooting with your internet service provider, we ensure your home network is fast, reliable, and secure.`,
    icon: FiWifi,
  },
  {
    title: 'Computer Repairs & Upgrades',
    description: `We provide expert repairs and upgrades for your PC or laptop, including hardware diagnostics, component replacements, and performance enhancements.`,
    icon: FiCpu,
  },
  {
    title: 'Software Installation & Support',
    description: `Installing operating systems, software applications, and managing virus/malware removal to keep your devices running smoothly and securely.`,
    icon: FiDownload,
  },
  {
    title: 'Custom PC Builds',
    description: `Build your ideal computer tailored to your needs — whether for gaming, work, or general use — with expert advice and quality components.`,
    icon: FiSettings,
  },
  {
    title: 'Smart Home Automation Assistance',
    description: `Setup and troubleshooting for smart home devices like lights, thermostats, security cameras, and voice assistants to enhance your living experience.`,
    icon: FiTool,
  },
  {
    title: 'Printer & Peripheral Support',
    description: `Installation, setup, and troubleshooting of printers, scanners, and other peripheral devices for seamless connectivity and performance.`,
    icon: FiPrinter,
  },
  {
    title: 'Virus & Malware Removal',
    description: `Thorough scanning and removal of malicious software to protect your data and restore device performance.`,
    icon: FiShield,
  },
  {
    title: 'Ongoing Tech Support',
    description: `Reliable remote or onsite support plans designed to keep your home technology running without interruptions.`,
    icon: FiHeadphones,
  },
];

export default function ServicesPage() {
  const bgActive = useColorModeValue('brand.lightGreen', 'brand.darkGreen');
  const iconBgActive = useColorModeValue('rgba(201, 162, 39, 0.2)', 'rgba(201, 162, 39, 0.4)');
  const iconColorActive = useColorModeValue('brand.gold', 'brand.gold');
  const iconColorInactive = useColorModeValue('gray.400', 'gray.500');

  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="4xl" mx="auto" color="gray.800">
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

      <Accordion allowMultiple>
        {services.map(({ title, description, icon: Icon }, idx) => (
          <AccordionItem
            key={idx}
            mb={4}
            borderRadius="lg"
            boxShadow="sm"
            border="1px solid"
            borderColor="transparent"
            overflow="hidden"
            _last={{ mb: 0 }}
            transition="box-shadow 0.3s ease"
            _hover={{ boxShadow: 'md', borderColor: 'gray.200' }}
          >
            {({ isExpanded }) => (
              <>
                <AccordionButton
                  px={6}
                  py={6}
                  _hover={{ bg: 'gray.50' }}
                  bg={isExpanded ? bgActive : 'white'}
                  color={isExpanded ? iconColorActive : 'gray.800'}
                  fontWeight={isExpanded ? 'bold' : 'semibold'}
                  borderRadius="lg"
                  transition="all 0.3s ease"
                  _focus={{ boxShadow: 'outline' }}
                  cursor="pointer"
                >
                  <HStack spacing={5} flex="1" textAlign="left">
                    <Box
                      bg={isExpanded ? iconBgActive : 'transparent'}
                      borderRadius="full"
                      w="48px"
                      h="48px"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      transition="background-color 0.3s ease"
                    >
                      <Icon
                        size="28px"
                        color={isExpanded ? iconColorActive : iconColorInactive}
                      />
                    </Box>
                    <Heading
                      as="h3"
                      fontSize="lg"
                      fontWeight="bold"
                      color={isExpanded ? iconColorActive : 'gray.800'}
                      m={0}
                    >
                      {title}
                    </Heading>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel
                  pb={6}
                  fontSize="md"
                  color="gray.600"
                  lineHeight="tall"
                  bg="white"
                  transition="all 0.3s ease"
                >
                  <Text>{description}</Text>
                </AccordionPanel>
              </>
            )}
          </AccordionItem>
        ))}
      </Accordion>
    </Box>
  );
}
