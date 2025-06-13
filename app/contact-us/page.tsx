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
  Text,
  HStack,
  useToast,
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
  const toast = useToast();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [message, setMessage] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const whatsappMessage = `
*New Enquiry from ${name}*

*Contact Details:*
📧 Email: ${email}
📱 Phone: ${phone}

*Enquiry Topic:*
${selectedTopic}

${selectedImage ? `*📎 Image Note:*\n"${selectedImage.name}" uploaded. Please attach this image manually in WhatsApp.` : ''}

*Message:*
${message}
    `.trim();

    const whatsappURL = `https://wa.me/61413346507?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappURL, '_blank');

    toast({
      title: 'Enquiry sent!',
      description: 'We’ve opened WhatsApp so you can finalise your message.',
      status: 'success',
      duration: 5000,
      isClosable: true,
    });

    // Reset the form
    setName('');
    setEmail('');
    setPhone('');
    setSelectedTopic('');
    setSelectedImage(null);
    setMessage('');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  return (
    <Box
      px={{ base: 4, md: 8 }}
      py={{ base: 16, md: 24 }}
      maxW="4xl"
      mx="auto"
      color="gray.800"
      minH="80vh"
    >
      <Heading as="h1" size="2xl" mb={10} color="brand.green" textAlign="center">
        Get in Touch
      </Heading>

      <VStack as="form" spacing={6} onSubmit={handleSubmit}>
        <FormControl isRequired>
          <FormLabel>Your Name</FormLabel>
          <Input
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
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

        <FormControl>
          <FormLabel>Do you have an image of the problem/product?</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            display="none"
            id="image-upload"
          />
          <HStack spacing={4}>
            <Button
              as="label"
              htmlFor="image-upload"
              cursor="pointer"
              colorScheme="green"
              variant="outline"
            >
              Choose Image
            </Button>
            {selectedImage && (
              <Text fontSize="sm" color="gray.600">
                {selectedImage.name}
              </Text>
            )}
          </HStack>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Tell us more about what you're specifically after</FormLabel>
          <Textarea
            placeholder="Please provide details about your enquiry..."
            size="lg"
            minH="150px"
            resize="vertical"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </FormControl>

        <Button
          type="submit"
          size="lg"
          colorScheme="green"
          width={{ base: 'full', md: 'auto' }}
        >
          Send Enquiry via WhatsApp
        </Button>
      </VStack>
    </Box>
  );
}
