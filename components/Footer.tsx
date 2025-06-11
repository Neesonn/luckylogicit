import { Box, Text } from '@chakra-ui/react';

export default function Footer() {
  return (
    <Box textAlign="center" py={6} bg="brand.green">
      <Text fontSize="sm" color="white">
        © {new Date().getFullYear()} Lucky Logic. All rights reserved.
      </Text>
    </Box>
  );
}
