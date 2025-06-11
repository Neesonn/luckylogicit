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
        {/* Lucky Logic Logo (linked to home) */}
        <NextLink href="/" passHref legacyBehavior>
          <Box
            display="flex"
            alignItems="center"
            cursor="pointer"
            userSelect="none"
            mr={4}  // adds spacing after the logo and before the divider
          >
            <Text fontSize="xl" fontWeight="bold" color="brand.green" mr={2}>
              Lucky Logic
            </Text>

            <Box
              bg="rgba(201, 162, 39, 0.6)"  // brand gold with 60% opacity
              borderRadius="50%"
              width="28px"
              height="28px"
              display="flex"
              alignItems="center"
              justifyContent="center"
              userSelect="none"
            >
              <Text fontSize="lg" lineHeight="1" color="white" aria-label="Four leaf clover" role="img" m="0">
                🍀
              </Text>
            </Box>
          </Box>
        </NextLink>

        {/* Vertical Divider Line */}
        <Box
          height="24px"
          borderLeft="1px solid"
          borderColor="gray.200"
          opacity={100}
          mr={0}  // spacing after the divider before nav links
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
