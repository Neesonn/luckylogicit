'use client';

import { useState } from 'react';
import {
  Box, Heading, Input, Button, VStack, FormControl, FormLabel, useToast,
} from '@chakra-ui/react';

export default function InvoiceSearchPage() {
  const [email, setEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    const res = await fetch('/api/send-magic-link', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, invoiceNumber }),
    });

    if (res.ok) {
      toast({
        title: 'Email Sent',
        description: 'Check your inbox for a secure invoice link.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setEmail('');
      setInvoiceNumber('');
    } else {
      const data = await res.json();
      toast({
        title: 'Error',
        description: data.error || 'Something went wrong.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Heading mb={4} size="md">🔍 Find Your Invoice</Heading>
      <form onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired>
            <FormLabel>Invoice Number</FormLabel>
            <Input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email Address</FormLabel>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} />
          </FormControl>
          <Button isLoading={loading} type="submit" colorScheme="green">
            Send Magic Link
          </Button>
        </VStack>
      </form>
    </Box>
  );
} 