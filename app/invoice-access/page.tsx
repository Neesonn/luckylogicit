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
        {/* Bank Transfer Section */}
        <Box mt={2} mb={2} p={4} borderWidth="1px" borderRadius="md" bg="blue.50" borderColor="blue.200">
          <HStack mb={2} spacing={2} align="center">
            <Icon as={FaUniversity} color="blue.600" boxSize={5} />
            <Text fontWeight="bold" color="blue.600">Bank Transfer Details</Text>
          </HStack>
          <Text><strong>Bank:</strong> Commonwealth Bank of Australia</Text>
          <Text><strong>Account Name:</strong> Lucky Logic IT</Text>
          <Text><strong>BSB:</strong> 067-873</Text>
          <Text><strong>Account Number:</strong> 1786 7448</Text>
          <Text><strong>Reference:</strong> {invoice.number}</Text>
          <Text fontSize="sm" color="blue.600" mt={2}>
            Please use your invoice number as the payment reference.
          </Text>
        </Box>

        {/* PayID Section */}
        <Box mt={2} mb={2} p={4} borderWidth="1px" borderRadius="md" bg="purple.50" borderColor="purple.200">
          <HStack mb={2} spacing={2} align="center">
            <Icon as={FaUniversity} color="purple.600" boxSize={5} />
            <Text fontWeight="bold" color="purple.600">PayID Details</Text>
          </HStack>
          <Text><strong>PayID:</strong> michael@luckylogic.com.au</Text>
          <Text><strong>Account Name:</strong> LUCKY LOGIC IT SERVICES</Text>
          <Text><strong>Reference:</strong> {invoice.number}</Text>
          <Text fontSize="sm" color="purple.600" mt={2}>
            Use your invoice number as the payment reference.
          </Text>
        </Box>

        {/* Credit Card Section */}
        <Box mt={2} mb={2} p={4} borderWidth="1px" borderRadius="md" bg="green.50" borderColor="green.200">
          <HStack mb={2} spacing={2} align="center">
            <Icon as={FaUniversity} color="green.600" boxSize={5} />
            <Text fontWeight="bold" color="green.600">Credit Card Payment</Text>
          </HStack>
          <Text><strong>Processing Fees:</strong></Text>
          <Text fontSize="sm" ml={4}>• Visa/Mastercard: 1.75% + $0.30</Text>
          <Text fontSize="sm" ml={4}>• American Express: 3.5% + $0.30</Text>
          <Text fontSize="sm" color="green.600" mt={2}>
            Fees cover transaction costs only - no profit is made from these charges.
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