import { Flex, Text, Box, HStack, Spacer, IconButton } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebook } from 'react-icons/fa';

export default function Navbar() {
  return (
    <Flex
      as="nav"
      direction="row"
      width="100%"
      height="80px"
      px={4}
      py={3}
      bg="white"
      boxShadow="md"
      position="fixed"
      top={0}
      left={0}
      zIndex={10}
      align="center"
    >
      {/* Logo */}
      <NextLink href="/" passHref legacyBehavior>
        <Box
          as="img"
          src="/lucky-logic-logo.png"
          alt="Lucky Logic logo"
          height="200px"
          width="auto"
          objectFit="contain"
          display="block"
          cursor="pointer"
        />
      </NextLink>

      {/* Navigation Links */}
      <HStack spacing={6} ml={6} align="center">
        <NextLink href="/" passHref legacyBehavior>
          <Text as="a" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer">
            Home
          </Text>
        </NextLink>

        <NextLink href="/about-us" passHref legacyBehavior>
          <Text as="a" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer">
            About Us
          </Text>
        </NextLink>

        <NextLink href="/services" passHref legacyBehavior>
          <Text as="a" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer">
            Services
          </Text>
        </NextLink>

        <NextLink href="/contact-us" passHref legacyBehavior>
          <Text as="a" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer">
            Contact Us
          </Text>
        </NextLink>
      </HStack>

      <Spacer />

      {/* Social Media Icons */}
      <HStack spacing={2}>
        <IconButton
          as="a"
          href="https://wa.me/61413346507"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          icon={<FaWhatsapp />}
          colorScheme="whatsapp"
          size="lg"
          fontSize="24px"
          variant="ghost"
          _hover={{ transform: 'scale(1.1)' }}
          transition="transform 0.2s"
        />
        <IconButton
          as="a"
          href="https://instagram.com/luckylogicit"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Instagram"
          icon={<FaInstagram />}
          colorScheme="pink"
          size="lg"
          fontSize="24px"
          variant="ghost"
          _hover={{ transform: 'scale(1.1)' }}
          transition="transform 0.2s"
        />
        <IconButton
          as="a"
          href="https://facebook.com/luckylogicit"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Facebook"
          icon={<FaFacebook />}
          colorScheme="facebook"
          size="lg"
          fontSize="24px"
          variant="ghost"
          _hover={{ transform: 'scale(1.1)' }}
          transition="transform 0.2s"
        />
      </HStack>
    </Flex>
  );
}