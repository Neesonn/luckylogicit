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

const services = [
  { icon: MdWifi, label: 'Network Setup & Troubleshooting' },
  { icon: MdComputer, label: 'Computer Repairs & Upgrades' },
  { icon: MdDevices, label: 'Software Installation & Support' },
  { icon: MdBuild, label: 'Custom PC Builds' },
  { icon: MdHome, label: 'Smart Home Automation Assistance' },
  { icon: MdSupportAgent, label: 'Printer & Peripheral Support' },
  { icon: MdBugReport, label: 'Virus & Malware Removal' },
  { icon: MdSecurity, label: 'Ongoing Tech Support' },
  { icon: MdPhone, label: 'Phone & Tablet Troubleshooting' },
];

export default function ServiceGrid() {
  return (
    <Box
      pt={{ base: 8, md: 12 }}
      pb={{ base: 20, md: 28 }}
      px={{ base: 6, md: 24 }}
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

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={{ base: 6, md: 8 }}>
        {services.map((service, index) => (
          <GlassCard key={index} p={7}>
            <Flex align="start" gap={4}>
              <Icon as={service.icon} boxSize={6} color="brand.green" mt={1} />
              <Text
                fontSize="lg"
                fontWeight="medium"
                color="gray.800"
                lineHeight="taller"
              >
                {service.label}
              </Text>
            </Flex>
          </GlassCard>
        ))}
      </SimpleGrid>
    </Box>
  );
}
