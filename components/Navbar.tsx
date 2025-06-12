import { Flex, Text, Box } from '@chakra-ui/react';
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
      {/* Left side container for logo and nav links */}
      <Flex align="center" gap={6}>
        {/* Logo initials and Clover icon linked to home */}
        <NextLink href="/" passHref legacyBehavior>
          <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            userSelect="none"
            mr={4}
          >
            {/* First L in dark green */}
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#003f2d"
              aria-label="Logo initial L"
            >
              L
            </Text>
            {/* Second L in gold */}
            <Text
              fontSize="3xl"
              fontWeight="bold"
              color="#c9a227"
              mr={-3}  // spacing before clover
              aria-label="Logo initial L"
            >
              L
            </Text>
            {/* Clover icon */}
            <Text
              fontSize="3xl"
              lineHeight="1"
              color="brand.green"
              aria-label="Four leaf clover"
              role="img"
              m="0"
            >
              🍀
            </Text>
          </Box>
        </NextLink>

        {/* Vertical Divider Line */}
        <Box
          height="24px"
          borderLeft="1px solid"
          borderColor="gray.200"
          opacity={0.4}
          mr={0}
        />

        {/* Navigation Links */}
        <NextLink href="/" passHref legacyBehavior>
          <Text
            as="a"
            color="brand.green"
            fontWeight="medium"
            fontSize="md"
            cursor="pointer"
          >
            Home
          </Text>
        </NextLink>

        <NextLink href="/about-us" passHref legacyBehavior>
          <Text
            as="a"
            color="brand.green"
            fontWeight="medium"
            fontSize="md"
            cursor="pointer"
          >
            About Us
          </Text>
        </NextLink>

        <NextLink href="/services" passHref legacyBehavior>
          <Text
            as="a"
            color="brand.green"
            fontWeight="medium"
            fontSize="md"
            cursor="pointer"
          >
            Services
          </Text>
        </NextLink>

        <NextLink href="/contact-us" passHref legacyBehavior>
          <Text
            as="a"
            color="brand.green"
            fontWeight="medium"
            fontSize="md"
            cursor="pointer"
          >
            Contact Us
          </Text>
        </NextLink>
      </Flex>
    </Flex>
  );
}
