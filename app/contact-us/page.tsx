'use client';

import {
  Box,
  Heading,
  VStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Icon,
  Textarea,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  PhoneIcon,
  InfoIcon,
  RepeatIcon,
  SettingsIcon,
  StarIcon,
  WarningIcon,
  UnlockIcon,
  QuestionIcon,
} from '@chakra-ui/icons';
import { useState } from 'react';

export default function ContactUsPage() {
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = [
    { label: 'Network Wi-Fi and Internet Setup & Troubleshooting', icon: InfoIcon },
    { label: 'Computer Repairs & Upgrades', icon: SettingsIcon },
    { label: 'Software Installation / Procurement', icon: RepeatIcon },
    { label: 'Custom PC Build', icon: StarIcon },
    { label: 'Smart Home Assistance', icon: UnlockIcon },
    { label: 'Printer & Peripheral Support', icon: PhoneIcon },
    { label: 'Virus and Malware Support', icon: WarningIcon },
    { label: 'Mobile Device Support', icon: QuestionIcon },
    { label: 'Anything else', icon: QuestionIcon },
  ];

  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={{ base: 16, md: 24 }}
      maxW="4xl"
      mx="auto"
      color="gray.800"
      minH="80vh"
    >
      <Heading
        as="h1"
        size="2xl"
        mb={10}
        color="brand.green"
        textAlign="center"
      >
        Get in Touch
      </Heading>

      <VStack as="form" spacing={6}>
        <FormControl isRequired>
          <FormLabel>Your Name</FormLabel>
          <Input placeholder="Enter your full name" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input type="tel" placeholder="Enter your phone number" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>I want to enquire about</FormLabel>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />} width="full">
              {selectedTopic || 'Select a topic'}
            </MenuButton>
            <MenuList>
              {topics.map(({ label, icon }) => (
                <MenuItem
                  key={label}
                  icon={<Icon as={icon} />}
                  onClick={() => setSelectedTopic(label)}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Tell us more about what you're specifically after</FormLabel>
          <Textarea
            placeholder="Please provide details about your enquiry..."
            size="lg"
            minH="150px"
            resize="vertical"
          />
        </FormControl>

        <Button
          type="submit"
          size="lg"
          colorScheme="green"
          width={{ base: 'full', md: 'auto' }}
        >
          Send Enquiry
        </Button>
      </VStack>
    </Box>
  );
}
