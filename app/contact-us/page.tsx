'use client';

import { useState } from 'react';
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
import { useSearchParams } from 'next/navigation';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

function ContactForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedTopic, setSelectedTopic] = useState('');
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const topics = [
    { label: 'Network Wi-Fi and Internet Setup & Troubleshooting', icon: InfoIcon },
    { label: 'Computer Repairs & Upgrades', icon: SettingsIcon },
    { label: 'Software Installation / Procurement', icon: RepeatIcon },
    { label: 'Custom PC Build', icon: StarIcon },
    { label: 'Smart Home Assistance', icon: UnlockIcon },
    { label: 'Printer & Peripheral Support', icon: PhoneIcon },
    { label: 'Virus and Malware Support', icon: WarningIcon },
    { label: 'Mobile Device Support', icon: QuestionIcon },
    { label: 'Frequent Flyer Help', icon: StarIcon },
    { label: 'Anything else', icon: QuestionIcon },
  ];

  const validateForm = () => {
    if (!name || !email || !phone || !selectedTopic || !messageText) {
      toast({
        title: 'Please complete all fields.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: 'Please enter a valid email address.',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top',
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const formspreeEndpoint = 'https://formspree.io/f/mqablbey';
      if (!formspreeEndpoint) {
        throw new Error('Formspree endpoint is not defined in environment variables');
      }
      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          topic: selectedTopic,
          message: messageText,
        }),
      });
      if (response.ok) {
        toast({
          title: 'Message sent!',
          description: 'Thank you for your message. We will get back to you soon.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        setName('');
        setEmail('');
        setPhone('');
        setSelectedTopic('');
        setMessageText('');
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit} w="full" method="POST">
      <VStack spacing={6}>
        <FormControl isRequired>
          <FormLabel>Your Name</FormLabel>
          <Input
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>I want to enquire about</FormLabel>
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              width="full"
              aria-label="Select enquiry topic"
              _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
            >
              {selectedTopic || 'Select a topic'}
            </MenuButton>
            <MenuList>
              {topics.map(({ label, icon }) => (
                <MenuItem
                  key={label}
                  icon={<Icon as={icon} />}
                  onClick={() => setSelectedTopic(label)}
                  _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}
                >
                  {label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Your Message</FormLabel>
          <Textarea
            placeholder="Tell us about your enquiry"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
          />
        </FormControl>
        <Button
          type="submit"
          size="lg"
          width="full"
          isLoading={isLoading}
          loadingText="Sending..."
          bg="#003f2d"
          color="white"
          _hover={{ bg: '#14543a' }}
          _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}
        >
          Send Message
        </Button>
      </VStack>
    </Box>
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
        streetAddress: 'South Village, 2 Kiln Rd, Kirrawee 2232 (Pickup and Dropoff only)',
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

        <ContactForm />

        <VStack spacing={2} align="center" mt={10} textAlign="center">
          <Text fontSize="lg" fontWeight="semibold" color="brand.green">Or reach us directly:</Text>
          <Text fontSize="md" display="flex" alignItems="center" justifyContent="center" gap={2}>
            <Icon as={FiMail} boxSize={5} color="brand.green" />
            Email: <Link href="mailto:support@luckylogic.com.au" color="brand.green" rel="noopener noreferrer">support@luckylogic.com.au</Link>
          </Text>
          <Text fontSize="md" display="flex" alignItems="center" justifyContent="center" gap={2}>
            <Icon as={FiPhone} boxSize={5} color="brand.green" />
            Phone: <Link href="tel:+61426901209" color="brand.green" rel="noopener noreferrer">+61 426 901 209</Link>
          </Text>
          <Text fontSize="md" display="flex" alignItems="center" justifyContent="center" gap={2}>
            <Icon as={FiMapPin} boxSize={5} color="brand.green" />
            Address: South Village, 2 Kiln Rd, Kirrawee 2232 (Pickup and Dropoff only)
          </Text>
        </VStack>

      </Box>
    </>
  );
}
