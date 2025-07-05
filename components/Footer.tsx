'use client';

import { Box, Text, Link, Stack, Button, InputGroup, InputRightElement, Spinner, Center } from '@chakra-ui/react';
import { useRef, useState, useEffect } from 'react';
import CookieBanner from './CookieBanner';
import { FaWrench } from 'react-icons/fa';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Input, useDisclosure, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FiMessageCircle } from 'react-icons/fi';
import { Tooltip } from '@chakra-ui/react';
import NextLink from 'next/link';
import { Link as ChakraLink } from '@chakra-ui/react';

declare global {
  interface Window {
    $crisp?: any;
    loadCrispWithUser?: (name: string, email: string) => void;
  }
}

export default function Footer() {
  const cookieBannerRef = useRef<{ openBanner: () => void }>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const ADMIN_PASSWORD = 'changeme'; // TODO: Replace with your real password
  const [showPassword, setShowPassword] = useState(false);
  const { isOpen: isChatOpen, onOpen: onChatOpen, onClose: onChatClose } = useDisclosure();
  const [chatName, setChatName] = useState('');
  const [chatEmail, setChatEmail] = useState('');
  const [chatError, setChatError] = useState('');
  const [crispLoaded, setCrispLoaded] = useState(false);
  const [isLoadingChat, setIsLoadingChat] = useState(false);

  const handleChangePreferences = () => {
    cookieBannerRef.current?.openBanner();
  };

  const handleAdminAccess = async () => {
    setError('');
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setPassword('');
        onClose();
        router.push('/admin');
      } else {
        setError('Incorrect password');
      }
    } catch (err) {
      setError('Something went wrong.');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const name = sessionStorage.getItem('crispName');
      const email = sessionStorage.getItem('crispEmail');
      if (name && email && window.$crisp) {
        setCrispLoaded(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedName = localStorage.getItem('crispName');
      const savedEmail = localStorage.getItem('crispEmail');
      if (savedName) setChatName(savedName);
      if (savedEmail) setChatEmail(savedEmail);
      if (savedName && savedEmail) {
        loadCrisp(savedName, savedEmail);
      }
    }
  }, []);

  const loadCrisp = (name: string, email: string) => {
    if (typeof window !== 'undefined' && !window.$crisp) {
      window.$crisp = [];
      (window as any).CRISP_WEBSITE_ID = "331a4420-a843-44e0-976c-fc2feddf2b0d";
      (function() {
        var d = document;
        var s = d.createElement("script");
        s.src = "https://client.crisp.chat/l.js";
        s.async = true;
        d.getElementsByTagName("head")[0].appendChild(s);
      })();
      setIsLoadingChat(true);
      var checkLoaded = setInterval(function() {
        if (window.$crisp && window.$crisp.is) {
          window.$crisp.push(["set", "user:email", email]);
          window.$crisp.push(["set", "user:nickname", name]);
          window.$crisp.push(["do", "chat:open"]);
          clearInterval(checkLoaded);
          setCrispLoaded(true);
          setIsLoadingChat(false);
          onChatClose();
        }
      }, 200);
    }
  };

  const handleChatButton = () => {
    onChatOpen();
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setChatError('');
    if (!chatName.trim() || !chatEmail.trim()) {
      setChatError('Please enter your name and email.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(chatEmail)) {
      setChatError('Please enter a valid email address.');
      return;
    }
    if (typeof window !== 'undefined') {
      localStorage.setItem('crispName', chatName);
      localStorage.setItem('crispEmail', chatEmail);
      loadCrisp(chatName, chatEmail);
    }
  };

  return (
    <>
      <Box textAlign="center" py={6} bg="brand.green" position="relative">
        {/* Sitemap/Quick Links */}
        <Box mb={4}>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} justify="center" align="center">
            <ChakraLink as={NextLink} href="/" color="white" textDecoration="underline">Home</ChakraLink>
            <ChakraLink as={NextLink} href="/about-us" color="white" textDecoration="underline">About Us</ChakraLink>
            <ChakraLink as={NextLink} href="/services" color="white" textDecoration="underline">Services</ChakraLink>
            <ChakraLink as={NextLink} href="/troubleshoot" color="white" textDecoration="underline">Troubleshoot</ChakraLink>
            <ChakraLink as={NextLink} href="/faq" color="white" textDecoration="underline">FAQ</ChakraLink>

            <ChakraLink as={NextLink} href="/contact-us" color="white" textDecoration="underline">Contact Us</ChakraLink>
          </Stack>
        </Box>

        <Stack spacing={1} mb={3}>
          <Text fontSize="sm" color="white">
            © {new Date().getFullYear()} Lucky Logic. All rights reserved.
          </Text>

          <Text fontSize="sm" color="white" mb={2}>
            ABN 68 522 123 312
          </Text>
          

          <Text fontSize="sm" color="white">
            <ChakraLink as={NextLink} href="/legal" textDecoration="underline" color="white">
              Legal
            </ChakraLink>
          </Text>
        </Stack>

        <Button
          size="sm"
          onClick={handleChangePreferences}
          variant="outline"
          colorScheme="yellow"
          aria-label="Change Cookie Preferences"
        >
          Change Cookie Preferences
        </Button>
        {/* Golden wrench icon button to open admin modal */}
        <Button
          position="absolute"
          left={4}
          top={4}
          aria-label="Admin Panel"
          bg="transparent"
          _hover={{ bg: 'rgba(0, 63, 45, 0.1)' }}
          onClick={onOpen}
          p={0}
          minW={0}
        >
          <FaWrench size={22} color="#003f2d" style={{ verticalAlign: 'middle' }} />
        </Button>
      </Box>

      {/* Admin password modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Admin Login</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl isInvalid={!!error}>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAdminAccess(); }}
                  autoFocus
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {error && <FormErrorMessage>{error}</FormErrorMessage>}
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleAdminAccess}>
              Login
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Floating chat button (bottom right) */}
      {!crispLoaded && (
        <Tooltip label="Chat with us" placement="left" hasArrow>
          <Button
            position="fixed"
            right={6}
            bottom={6}
            zIndex={1000}
            aria-label="Open live chat"
            bgGradient="linear(to-br, #38A169, #276749)"
            color="white"
            _hover={{
              transform: 'scale(1.08)',
              boxShadow: '0 8px 24px rgba(56,161,105,0.25)',
              bgGradient: 'linear(to-br, #276749, #38A169)'
            }}
            _active={{
              transform: 'scale(0.98)',
              boxShadow: '0 4px 12px rgba(56,161,105,0.18)'
            }}
            transition="all 0.18s cubic-bezier(.4,0,.2,1)"
            boxShadow="0 4px 16px rgba(56,161,105,0.18)"
            onClick={handleChatButton}
            p={0}
            minW={0}
            borderRadius="full"
            width="60px"
            height="60px"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FiMessageCircle size={32} />
          </Button>
        </Tooltip>
      )}
      {/* Chat Name/Email modal */}
      <Modal isOpen={isChatOpen} onClose={onChatClose} isCentered size="md">
        <ModalOverlay />
        <ModalContent borderRadius="2xl" boxShadow="2xl" p={2}>
          <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold" color="brand.green" pb={0}>
            Start Live Chat
          </ModalHeader>
          <Text textAlign="center" color="gray.600" fontSize="md" mt={1} mb={4}>
            Enter your details to connect instantly with our team.
          </Text>
          <ModalCloseButton disabled={isLoadingChat} />
          {isLoadingChat ? (
            <Center py={10} flexDirection="column">
              <Spinner size="xl" color="brand.green" mb={4} thickness="4px" speed="0.7s" />
              <Text color="gray.600" fontWeight="medium">Loading chat...</Text>
            </Center>
          ) : (
            <form onSubmit={handleChatSubmit}>
              <ModalBody pb={2}>
                <FormControl isRequired mb={4} isDisabled={isLoadingChat}>
                  <FormLabel>Name</FormLabel>
                  <Input
                    value={chatName}
                    onChange={e => setChatName(e.target.value)}
                    placeholder="Your name"
                    size="lg"
                    borderRadius="lg"
                    bg="gray.50"
                    _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                  />
                </FormControl>
                <FormControl isRequired mb={2} isInvalid={!!chatError} isDisabled={isLoadingChat}>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    value={chatEmail}
                    onChange={e => setChatEmail(e.target.value)}
                    placeholder="your@email.com"
                    size="lg"
                    borderRadius="lg"
                    bg="gray.50"
                    _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                  />
                  {chatError && <FormErrorMessage>{chatError}</FormErrorMessage>}
                </FormControl>
                <Text fontSize="xs" color="gray.500" mt={3} mb={1} textAlign="center">
                  By using this live chat, you accept our{' '}
                  <ChakraLink as={NextLink} href="/privacy-policy" color="brand.green" textDecoration="underline" target="_blank" rel="noopener noreferrer">Privacy Policy</ChakraLink>
                  {' '}and{' '}
                  <ChakraLink as={NextLink} href="/terms" color="brand.green" textDecoration="underline" target="_blank" rel="noopener noreferrer">Terms & Conditions</ChakraLink>.
                </Text>
              </ModalBody>
              <ModalFooter display="flex" flexDirection="column" gap={2}>
                <Button
                  w="100%"
                  size="lg"
                  type="submit"
                  borderRadius="lg"
                  isLoading={isLoadingChat}
                  loadingText="Loading chat..."
                  bg="brand.green"
                  color="white"
                  _hover={{ bg: '#14543a', boxShadow: 'md' }}
                  _active={{ bg: '#003f2d' }}
                  _focus={{ boxShadow: '0 0 0 2px #c9a227' }}
                >
                  Start Chat
                </Button>
                <Button variant="ghost" onClick={onChatClose} w="100%" size="lg" borderRadius="lg" isDisabled={isLoadingChat}>Cancel</Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>

      <CookieBanner ref={cookieBannerRef} />
    </>
  );
}
