import { Flex, Image } from '@chakra-ui/react';

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
      position="relative"     // ✅ ensure it stacks
      zIndex={10}             // ✅ sits above Hero SVG
    >
      <Image
        src="/logo.png"
        alt="Lucky Logic Logo"
        width="50px"
        height="auto"
      />
    </Flex>
  );
}
