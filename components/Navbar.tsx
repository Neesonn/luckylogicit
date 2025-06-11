import { Flex, Link, Box, Image } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Navbar() {
  return (
    <Flex
      as="nav"
      justify="space-between"
      align="center"
      px={6}
      py={3}
      bg="white"
      boxShadow="md"
      position="relative"
      zIndex={10}
    >
      {/* Left side navigation links */}
      <Flex gap={6} align="center">
        <NextLink href="/" passHref legacyBehavior>
          <Link color="brand.green" fontWeight="medium" fontSize="md">
            Home
          </Link>
        </NextLink>

        <NextLink href="/about-us" passHref legacyBehavior>
          <Link color="brand.green" fontWeight="medium" fontSize="md">
            About Us
          </Link>
        </NextLink>

        <NextLink href="/contact-us" passHref legacyBehavior>
          <Link color="brand.green" fontWeight="medium" fontSize="md">
            Contact Us
          </Link>
        </NextLink>
      </Flex>

      {/* Right side logo box */}
      <Box width="120px" height="80px">
        <Image
          src="/logo.png"
          alt="Lucky Logic Logo"
          objectFit="contain"
          width="100%"
          height="100%"
        />
      </Box>
    </Flex>
  );
}
