import { Flex, Button } from '@chakra-ui/react';
import Link from 'next/link';

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
      gap={4}  // add some spacing
    >
      <Link href="/" passHref legacyBehavior>
        <Button as="a" colorScheme="green" variant="ghost" size="md">
          Home
        </Button>
      </Link>
    </Flex>
  );
}
