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
  useToast,
  Text,
  HStack,
  Flex,
  Link,
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
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [messageText, setMessageText] = useState('');
  const toast = useToast();
  const searchParams = useSearchParams();
  const showToast = searchParams.get('showToast');

  useEffect(() => {
    if (showToast === 'true') {
      toast({
        title: "Enquiry sent!",
        description: "Your enquiry has been sent via WhatsApp. We'll get back to you soon.",
        status: "success",
        duration: null,
        isClosable: true,
        position: "top",
        render: () => (
          <Box
            color="white"
            p={3}
            bg="green.500"
            borderRadius="md"
            boxShadow="lg"
            position="relative"
            minW="300px"
          >
            <Button
              position="absolute"
              top="8px"
              right="8px"
              size="sm"
              variant="ghost"
              color="white"
              _hover={{ bg: 'whiteAlpha.200' }}
              onClick={() => toast.closeAll()}
            >
              ✕
            </Button>
            <Heading size="md" mb={2}>Enquiry sent!</Heading>
            <Text>Your enquiry has been sent via WhatsApp. We'll get back to you soon.</Text>
          </Box>
        ),
      });
    }
  }, [showToast, toast]);

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
    
    // Create the message with all form data
    const whatsappMessage = `
*New Enquiry from ${name}*

*Contact Details:*
📧 Email: ${email}
📱 Phone: ${phone}

*Enquiry Topic:*
${selectedTopic}

*Message:*
${messageText}
    `.trim();

    // Create WhatsApp URL with the message
    const whatsappURL = `https://wa.me/61413346507?text=${encodeURIComponent(whatsappMessage)}`;
    
    // Open WhatsApp in a new tab
    window.open(whatsappURL, '_blank');

    // Reset form
    setName('');
    setEmail('');
    setPhone('');
    setSelectedTopic('');
    setMessageText('');

    // Redirect to the same page with a query parameter to show toast
    window.location.href = '/contact-us?showToast=true';
  };

  const handleEmailSubmit = () => {
    const subject = encodeURIComponent(`Enquiry from ${name} regarding ${selectedTopic}`);
    const body = encodeURIComponent(`
New Enquiry from ${name}

Contact Details:
Email: ${email}
Phone: ${phone}

Enquiry Topic:
${selectedTopic}

Message:
${messageText}
    `.trim());
    
    const mailtoLink = `mailto:michael@luckylogic.com.au?subject=${subject}&body=${body}`;
    window.open(mailtoLink, '_blank');

    // Reset form (optional, depending on desired UX after email client opens)
    setName('');
    setEmail('');
    setPhone('');
    setSelectedTopic('');
    setMessageText('');
  };

  return (
    <VStack as="form" spacing={6}>
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

      <FormControl isRequired>
        <FormLabel>Tell us more about what you're specifically after</FormLabel>
        <Textarea
          placeholder="Please provide details about your enquiry..."
          size="lg"
          minH="150px"
          resize="vertical"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
        />
      </FormControl>

      <Flex
        direction={{ base: 'column', md: 'row' }}
        gap={4}
        width={{ base: 'full', md: 'auto' }}
      >
        <Button
          type="submit"
          size="lg"
          bg="brand.green"
          color="white"
          width="full"
          leftIcon={<FaWhatsapp />}
          boxShadow="md"
          _hover={{ bg: 'green.700', boxShadow: 'lg', transform: 'translateY(-2px)' }}
          transition="all 0.2s"
          mb={{ base: 4, md: 0 }}
        >
          Send Enquiry via WhatsApp
        </Button>
        <Button
          type="button"
          size="lg"
          bg="brand.gold"
          color="white"
          width="full"
          leftIcon={<FaEnvelope />}
          onClick={handleEmailSubmit}
          boxShadow="md"
          _hover={{ bg: '#b38d1c', boxShadow: 'lg', transform: 'translateY(-2px)' }}
          transition="all 0.2s"
        >
          Send Enquiry via Email
        </Button>
      </Flex>

      <VStack spacing={2} align="center" mt={10} textAlign="center">
        <Text fontSize="lg" fontWeight="semibold" color="brand.green">Or reach us directly:</Text>
        <Text fontSize="md">
          Email: <Link href="mailto:michael@luckylogic.com.au" color="brand.green">michael@luckylogic.com.au</Link>
        </Text>
        <Text fontSize="md">
          Phone: <Link href="tel:+61413346507" color="brand.green">+61 413 346 507</Link>
        </Text>
        <Text fontSize="md">
          Address: 580 Princes Highway, Kirrawee 2232
        </Text>
      </VStack>

    </VStack>
  );
}

export default function ContactUsPage() {
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

      <Suspense fallback={<div>Loading...</div>}>
        <ContactForm />
      </Suspense>
    </Box>
  );
}
