'use client';
import { Box, Heading, Text, Button, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();
  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50" px={4}>
      <Heading as="h1" size="2xl" mb={4} color="brand.green">
        Admin Dashboard
      </Heading>
      <Text fontSize="lg" color="gray.600" textAlign="center" mb={6}>
        Welcome to the admin panel. Here you can manage and monitor your site.
      </Text>
      <HStack spacing={6} mb={6}>
        <Button as={Link} href="/admin/create-customer" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} size="lg">
          Create new Customer
        </Button>
        <Button as={Link} href="/admin/view-customers" bg="#003f2d" color="white" _hover={{ bg: '#14543a' }} size="lg">
          View Customers
        </Button>
      </HStack>
      <Button onClick={handleLogout} colorScheme="red" variant="outline" mt={6}>
        Logout
      </Button>
    </Box>
  );
} 