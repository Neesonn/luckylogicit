'use client';
import { Box, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function CreateCustomerPage() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50" px={4}>
      <Heading as="h1" size="2xl" mb={4} color="brand.green">
        Create New Customer
      </Heading>
      <Text fontSize="lg" color="gray.600" textAlign="center">
        Customer creation form coming soon.
      </Text>
      <Button onClick={handleLogout} colorScheme="red" variant="outline" mt={6}>
        Logout
      </Button>
    </Box>
  );
} 