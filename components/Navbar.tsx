import { Flex, Link } from '@chakra-ui/react';
import NextLink from 'next/link';

export default function Navbar() {
  return (
    <Flex
      as="nav"
      justify="flex-start"
      align="center"
      px={6}
      py={3}
      bg="white"
      boxShadow="md"
      position="relative"
      zIndex={10}
      gap={6}
    >
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
    </Flex>
  );
}
