'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Box, Heading, Text, Spinner, Link, Alert, AlertIcon, VStack, Badge, Divider, Flex, HStack, Icon } from '@chakra-ui/react';
import { FaUniversity } from 'react-icons/fa';

function InvoiceAccessContent() {
  const token = useSearchParams().get('token');
  const [invoice, setInvoice] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchInvoice = async () => {
      const res = await fetch(`/api/verify-invoice?token=${token}`);
      const data = await res.json();
      if (res.ok) setInvoice(data.invoice);
      else setError(data.error);
    };
    fetchInvoice();
  }, [token]);

  if (error) {
    return (
      <Box maxW="md" mx="auto" mt={10}>
        <Alert status="error">
          <AlertIcon />
          {error}
        </Alert>
      </Box>
    );
  }

  if (!invoice) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text mt={4}>Loading invoice...</Text>
      </Box>
    );
  }

  return (
    <Box maxW="md" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md" bg="white">
      <Heading mb={4} size="md" color="brand.green">Invoice #{invoice.number}</Heading>
      <VStack spacing={3} align="stretch">
        <Flex justify="space-between" align="center">
          <Text fontWeight="bold">Status:</Text>
          <Badge colorScheme={invoice.status === 'paid' ? 'green' : invoice.status === 'open' ? 'yellow' : 'red'} fontSize="md">
            {invoice.status.toUpperCase()}
          </Badge>
        </Flex>
        <Divider />
        <HStack justify="space-between">
          <Text fontWeight="bold">Amount Due:</Text>
          <Text fontWeight="bold" color="brand.green" fontSize="lg">${(invoice.amount_due / 100).toFixed(2)}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>Created:</Text>
          <Text>{new Date(invoice.created * 1000).toLocaleDateString()}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>Due:</Text>
          <Text>{new Date(invoice.due_date * 1000).toLocaleDateString()}</Text>
        </HStack>
        <HStack justify="space-between">
          <Text>Email:</Text>
          <Text>{invoice.customer_email}</Text>
        </HStack>
        <Divider />
        <Box mt={2} mb={2} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
          <HStack mb={2} spacing={2} align="center">
            <Icon as={FaUniversity} color="brand.green" boxSize={5} />
            <Text fontWeight="bold" color="brand.green">Bank Transfer Details</Text>
          </HStack>
          <Text><strong>Account Name:</strong> Lucky Logic IT Services</Text>
          <Text><strong>BSB:</strong> 633-000</Text>
          <Text><strong>Account Number:</strong> 123456789</Text>
          <Text><strong>Reference:</strong> {invoice.number}</Text>
          <Text fontSize="sm" color="gray.500" mt={2}>
            Please use your invoice number as the payment reference.
          </Text>
        </Box>
        <Divider />
        <Link color="blue.500" href={invoice.hosted_invoice_url} isExternal fontWeight="bold">
          View or Download Full Invoice PDF
        </Link>
      </VStack>
    </Box>
  );
}

export default function InvoiceAccessPage() {
  return (
    <Suspense fallback={<Box textAlign="center" mt={20}><Spinner size="xl" /><Text mt={4}>Loading...</Text></Box>}>
      <InvoiceAccessContent />
    </Suspense>
  );
} 