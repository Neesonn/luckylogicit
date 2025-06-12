import { Flex, Text, Box, HStack, Spacer } from '@chakra-ui/react';
import NextLink from 'next/link';

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
    </Flex>
  );
}