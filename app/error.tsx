'use client';

import { Box, Heading, Text, Button, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import SEO from '../components/SEO';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <>
      <SEO
        title="Server Error"
        description="An unexpected error occurred. Please try again later."
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
            500 - Server Error
          </Heading>
          <Text color="gray.600">
            An unexpected error occurred. Please try again later.
          </Text>
          <VStack spacing={4}>
            <Button
              colorScheme="green"
              onClick={() => reset()}
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              colorScheme="green"
              onClick={() => router.push('/')}
            >
              Return Home
            </Button>
          </VStack>
        </VStack>
      </Box>
    </>
  );
} 