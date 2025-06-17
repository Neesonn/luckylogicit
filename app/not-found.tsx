'use client';

import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import SEO from '../components/SEO';

export default function NotFound() {
  const router = useRouter();

  return (
    <>
      <SEO
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        noindex={true}
      />
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
        px={4}
      >
        <VStack spacing={6} textAlign="center" maxW="600px">
          <Heading as="h1" size="xl" color="brand.green">
            404 - Page Not Found
          </Heading>
          <Text color="gray.600">
            The page you're looking for doesn't exist or has been moved.
          </Text>
          <Button
            colorScheme="green"
            onClick={() => router.push('/')}
          >
            Return Home
          </Button>
        </VStack>
      </Box>
    </>
  );
} 