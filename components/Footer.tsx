'use client';

import { Box, Text, Link, Stack, Button, InputGroup, InputRightElement } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import CookieBanner from './CookieBanner';
import { FaWrench } from 'react-icons/fa';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Input, useDisclosure, FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';

export default function Footer() {
  const cookieBannerRef = useRef<{ openBanner: () => void }>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const ADMIN_PASSWORD = 'changeme'; // TODO: Replace with your real password
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <>
      <Box textAlign="center" py={6} bg="brand.green" position="relative">
        {/* Sitemap/Quick Links */}
        <Box mb={4}>
          <Stack direction={{ base: 'column', sm: 'row' }} spacing={4} justify="center" align="center">
            <Link href="/" color="white" textDecoration="underline">Home</Link>
            <Link href="/about-us" color="white" textDecoration="underline">About Us</Link>
            <Link href="/services" color="white" textDecoration="underline">Services</Link>
            <Link href="/faq" color="white" textDecoration="underline">FAQ</Link>
            <Link href="/contact-us" color="white" textDecoration="underline">Contact Us</Link>
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
            <Link href="/legal" textDecoration="underline" color="white">
              Legal
            </Link>
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
          right={4}
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

      <CookieBanner ref={cookieBannerRef} />
    </>
  );
}
