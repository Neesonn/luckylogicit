'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Box, Heading, Text, Spinner, Link, Alert, AlertIcon, VStack, Badge } from '@chakra-ui/react';

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
      <Box maxW="lg" mx="auto" mt={10}>
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
    <Box maxW="lg" mx="auto" mt={10} p={6} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <VStack spacing={4} align="start">
        <Heading size="md">Invoice #{invoice.number}</Heading>
        <Text><strong>Email:</strong> {invoice.customer_email}</Text>
        <Text><strong>Created:</strong> {new Date(invoice.created * 1000).toLocaleDateString()}</Text>
        <Text><strong>Due:</strong> {new Date(invoice.due_date * 1000).toLocaleDateString()}</Text>
        <Text><strong>Status:</strong> <Badge colorScheme={invoice.status === 'paid' ? 'green' : 'red'}>{invoice.status.toUpperCase()}</Badge></Text>
        <Text><strong>Amount Due:</strong> ${(invoice.amount_due / 100).toFixed(2)}</Text>
        <Link color="blue.500" href={invoice.hosted_invoice_url} isExternal>
          View Full Invoice PDF
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