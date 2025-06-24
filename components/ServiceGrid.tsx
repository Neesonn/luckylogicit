'use client';

import { Box, SimpleGrid, Text, Heading, Icon, Flex } from '@chakra-ui/react';
import {
  MdWifi,
  MdBuild,
  MdComputer,
  MdHome,
  MdSecurity,
  MdDevices,
  MdBugReport,
  MdSupportAgent,
  MdPhone,
} from 'react-icons/md';
import GlassCard from './GlassCard';
import NextLink from 'next/link';
import { motion } from 'framer-motion';

const services = [
  { icon: MdWifi, label: 'Network Setup & Troubleshooting', description: 'Optimise your home Wi-Fi, fix dropouts, and get expert help with your internet.', href: '/services#network-setup' },
  { icon: MdComputer, label: 'Computer Repairs & Upgrades', description: 'Repairs, upgrades, and maintenance for laptops and desktops.', href: '/services#computer-repairs' },
  { icon: MdDevices, label: 'Software Installation & Support', description: 'Install or troubleshoot software, operating systems, and apps.', href: '/services#software-support' },
  { icon: MdBuild, label: 'Custom PC Builds', description: 'Design and build a custom PC tailored to your needs.', href: '/services#custom-pc' },
  { icon: MdHome, label: 'Smart Home Automation Assistance', description: 'Setup and support for smart home devices and automation.', href: '/services#smart-home' },
  { icon: MdSupportAgent, label: 'Printer & Peripheral Support', description: 'Get your printers, scanners, and accessories working seamlessly.', href: '/services#printer-support' },
  { icon: MdBugReport, label: 'Virus & Malware Removal', description: 'Remove viruses, malware, and secure your devices.', href: '/services#virus-removal' },
  { icon: MdSecurity, label: 'Ongoing Tech Support', description: 'On-demand or ongoing remote and on-site tech support.', href: '/services#tech-support' },
  { icon: MdPhone, label: 'Phone & Tablet Troubleshooting', description: 'Help with iPhone, Android, iPad, and tablet issues.', href: '/services#phone-tablet' },
];

const MotionBox = motion(Box);

export default function ServiceGrid() {
  return (
    <Box
      pt={{ base: 8, md: 12 }}
      pb={{ base: 24, md: 32 }}
      px={{ base: 4, sm: 8, md: 24 }}
      py={{ base: 8, md: 12 }}
      bg="brand.lightGreen"
      backgroundImage="url('/noise-light.png')"
      backgroundRepeat="repeat"
      backgroundSize="512px 512px"
    >
      <Heading
        textAlign="center"
        mb={14}
        fontSize={{ base: '2xl', md: '4xl' }}
        fontWeight="semibold"
        lineHeight="shorter"
        color="brand.green"
      >
        What We Can Help You With
      </Heading>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 2, lg: 3 }} spacing={{ base: 8, sm: 10, md: 12 }}>
        {services.map((service, index) => (
          <MotionBox
            key={index}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.08 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            <NextLink href={service.href} passHref legacyBehavior>
              <a tabIndex={0} aria-label={`Learn more about ${service.label}`} style={{ textDecoration: 'none', height: '100%' }}>
                <GlassCard
                  p={7}
                  display="flex"
                  flexDirection="column"
                  justifyContent="flex-start"
                  minHeight="180px"
                  height="100%"
                  role="group"
                  _hover={{
                    boxShadow: '2xl',
                    transform: 'translateY(-6px) scale(1.04)',
                    borderColor: 'brand.green',
                  }}
                  _focus={{ boxShadow: 'outline', borderColor: 'brand.green' }}
                  style={{ cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}
                >
                  <Flex align="center" gap={4} flex="1" position="relative" zIndex={2}>
                    <Box
                      as="span"
                      role="presentation"
                      transition="transform 0.2s, color 0.2s"
                      _groupHover={{ transform: 'scale(1.18)', color: 'green.600' }}
                    >
                      <Icon as={service.icon} boxSize={6} color="brand.green" mt={1} />
                    </Box>
                    <Box textAlign="left" w="100%">
                      <Text
                        fontSize="lg"
                        fontWeight="medium"
                        color="gray.800"
                        lineHeight="taller"
                      >
                        {service.label}
                      </Text>
                      <Text fontSize="sm" color="gray.600" fontWeight="normal" mt={1}>
                        {service.description}
                      </Text>
                    </Box>
                  </Flex>
                </GlassCard>
              </a>
            </NextLink>
          </MotionBox>
        ))}
      </SimpleGrid>
    </Box>
  );
}
