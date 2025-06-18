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
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [messageText, setMessageText] = useState('');
  const toast = useToast();
  const searchParams = useSearchParams();
  const showToast = searchParams.get('showToast');

  const validateForm = () => {
    if (!name || !email || !phone || !selectedTopic || !messageText) {
      toast({
        title: "Please complete all fields.",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
      return false;
    }
    return true;
  };

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
              aria-label="Close notification"
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
    
    if (!validateForm()) {
      return; // Stop if validation fails
    }

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
    const whatsappURL = `https://wa.me/61426901209?text=${encodeURIComponent(whatsappMessage)}`;
    
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
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    const subject = encodeURIComponent(`Enquiry from ${name} regarding ${selectedTopic}`);
    const body = encodeURIComponent(`
New Enquiry from ${name}

Contact Details:
Email: ${email}
Phone: ${phone}

Enquiry Topic:
${selectedTopic}

Message:*
${messageText}
    `.trim());
    
    const mailtoLink = `mailto:support@luckylogic.com.au?subject=${subject}&body=${body}`;
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
      <FormControl isRequired isInvalid={!name && name !== ''}>
        <FormLabel>Your Name</FormLabel>
        <Input 
          placeholder="Enter your full name" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          _focus={{
            borderColor: 'brand.green',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)',
          }}
        />
      </FormControl>

      <FormControl isRequired isInvalid={!email && email !== ''}>
        <FormLabel>Email Address</FormLabel>
        <Input 
          type="email" 
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          _focus={{
            borderColor: 'brand.green',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)',
          }}
        />
      </FormControl>

      <FormControl isRequired isInvalid={!phone && phone !== ''}>
        <FormLabel>Phone Number</FormLabel>
        <Input 
          type="tel" 
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          _focus={{
            borderColor: 'brand.green',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)',
          }}
        />
      </FormControl>

      <FormControl isRequired isInvalid={!selectedTopic && selectedTopic !== ''}>
        <FormLabel>I want to enquire about</FormLabel>
        <Menu>
          <MenuButton 
            as={Button} 
            rightIcon={<ChevronDownIcon />} 
            width="full" 
            aria-label="Select enquiry topic"
            _focus={{
              borderColor: 'brand.green',
              boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)',
            }}
          >
            {selectedTopic || 'Select a topic'}
          </MenuButton>
          <MenuList>
            {topics.map(({ label, icon }) => (
              <MenuItem
                key={label}
                icon={<Icon as={icon} />}
                onClick={() => setSelectedTopic(label)}
                _focus={{
                  bg: 'green.50',
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                }}
              >
                {label}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </FormControl>

      <FormControl isRequired isInvalid={!messageText && messageText !== ''}>
        <FormLabel>Your Message</FormLabel>
        <Textarea
          placeholder="Tell us about your enquiry"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          _focus={{
            borderColor: 'brand.green',
            boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)',
          }}
        />
      </FormControl>

      <Button
        type="submit"
        colorScheme="green"
        size="lg"
        width="full"
        onClick={handleSubmit}
        _focus={{
          outline: '2px solid',
          outlineColor: 'brand.green',
          outlineOffset: '2px',
        }}
      >
        Send via WhatsApp
      </Button>

      <Button
        colorScheme="green"
        variant="outline"
        size="lg"
        width="full"
        onClick={handleEmailSubmit}
        _focus={{
          outline: '2px solid',
          outlineColor: 'brand.green',
          outlineOffset: '2px',
        }}
      >
        Send via Email
      </Button>

      <VStack spacing={2} align="center" mt={10} textAlign="center">
        <Text fontSize="lg" fontWeight="semibold" color="brand.green">Or reach us directly:</Text>
        <Text fontSize="md">
          Email: <Link href="mailto:support@luckylogic.com.au" color="brand.green" rel="noopener noreferrer">support@luckylogic.com.au</Link>
        </Text>
        <Text fontSize="md">
          Phone: <Link href="tel:+61426901209" color="brand.green" rel="noopener noreferrer">+61 426 901 209</Link>
        </Text>
        <Text fontSize="md">
          Address: 580 Princes Highway, Kirrawee 2232
        </Text>
      </VStack>

    </VStack>
  );
}

export default function ContactUsPage() {
  const contactData = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Lucky Logic IT',
    description: 'Get in touch with Lucky Logic IT for all your residential IT support needs in Sydney.',
    mainEntity: {
      '@type': 'Organization',
      name: 'Lucky Logic IT',
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+61426901209',
        contactType: 'customer service',
        areaServed: 'Sydney',
        availableLanguage: 'English'
      },
      address: {
        '@type': 'PostalAddress',
        streetAddress: '580 Princes Highway',
        addressLocality: 'Kirrawee',
        addressRegion: 'NSW',
        postalCode: '2232',
        addressCountry: 'AU'
      }
    }
  };

  return (
    <>
      <SEO
        title="Contact Us"
        description="Get in touch with Lucky Logic IT for all your residential IT support needs in Sydney. We're here to help with computer repairs, network setup, and more."
        keywords="contact Lucky Logic, IT support contact, computer repair Sydney, tech support contact, IT help Sydney"
        canonicalUrl="https://luckylogic.com.au/contact-us"
      />
      <JsonLd data={contactData} />
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
    </>
  );
}
