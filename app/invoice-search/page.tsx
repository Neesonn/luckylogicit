'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  Spinner,
  Card,
  CardBody,
  CardHeader,
  SimpleGrid,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useState } from 'react';
import { SearchIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { FaCreditCard, FaReceipt, FaSearch } from 'react-icons/fa';
import SEO from '../../components/SEO';
import JsonLd from '../../components/JsonLd';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  number: string;
  amount: number;
  dueDate: string;
  status: 'paid' | 'unpaid';
  customerName: string;
  customerEmail: string;
  description: string;
  items: InvoiceItem[];
}

export default function InvoiceSearchPage() {
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState('');
  const [showEmail, setShowEmail] = useState(false);
  const toast = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!invoiceNumber.trim()) {
      setError('Please enter an invoice number');
      return;
    }

    setLoading(true);
    setError('');
    setInvoice(null);

    try {
      // Simulate API call - replace with actual invoice search API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock invoice data - replace with actual API response
      const mockInvoice: Invoice = {
        id: invoiceNumber,
        number: invoiceNumber,
        amount: 150.00,
        dueDate: '2024-02-15',
        status: 'unpaid' as const,
        customerName: 'John Smith',
        customerEmail: 'john.smith@example.com',
        description: 'IT Support Services - Network Setup',
        items: [
          { description: 'Network Setup & Troubleshooting', quantity: 1, rate: 120.00, amount: 120.00 },
          { description: 'Call-out Fee', quantity: 1, rate: 30.00, amount: 30.00 }
        ]
      };

      setInvoice(mockInvoice);
      toast({
        title: 'Invoice Found',
        description: `Invoice #${invoiceNumber} has been found.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      setError('Failed to find invoice. Please check the invoice number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayInvoice = async () => {
    if (!invoice) return;

    setLoading(true);
    try {
      // Simulate payment processing - replace with actual payment API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: 'Payment Successful',
        description: `Invoice #${invoice.number} has been paid successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      // Reset form after successful payment
      setInvoice(null);
      setInvoiceNumber('');
      setEmail('');
    } catch (err) {
      toast({
        title: 'Payment Failed',
        description: 'There was an error processing your payment. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const seoData = {
    title: 'Pay Invoice - Lucky Logic IT Services',
    description: 'Search and pay your Lucky Logic IT Services invoices securely online. Quick and easy payment processing.',
    keywords: 'pay invoice, invoice payment, Lucky Logic, IT services payment',
    url: '/invoice-search',
  };

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Pay Invoice",
    "description": "Search and pay your Lucky Logic IT Services invoices securely online.",
    "url": "https://luckylogic.com.au/invoice-search",
  };

  return (
    <>
      <SEO {...seoData} />
      <JsonLd data={jsonLdData} />
      
      <Box minH="100vh" bg="gray.50" pt="100px" pb={8}>
        <Box maxW="4xl" mx="auto" px={{ base: 4, md: 8 }}>
          {/* Header */}
          <VStack spacing={6} textAlign="center" mb={8}>
            <Heading as="h1" size="2xl" color="brand.green" fontWeight="bold">
              Pay Invoice
            </Heading>
            <Text fontSize="lg" color="gray.600" maxW="2xl">
              Search for your invoice and make a secure payment online. Enter your invoice number to get started.
            </Text>
          </VStack>

          {/* Search Form */}
          <Card mb={8} boxShadow="lg">
            <CardHeader bg="brand.green" color="white" borderTopRadius="lg">
              <HStack>
                <FaSearch />
                <Heading size="md">Search Invoice</Heading>
              </HStack>
            </CardHeader>
            <CardBody p={6}>
              <form onSubmit={handleSearch}>
                <VStack spacing={6}>
                  <FormControl isRequired>
                    <FormLabel fontWeight="semibold" color="gray.700">Invoice Number</FormLabel>
                    <Input
                      value={invoiceNumber}
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      placeholder="Enter invoice number (e.g., INV-2024-001)"
                      size="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontWeight="semibold" color="gray.700">Email Address (Optional)</FormLabel>
                    <InputGroup size="lg">
                      <Input
                        type={showEmail ? "text" : "email"}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email address"
                        borderWidth="2px"
                        borderColor="gray.200"
                        _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                      />
                      <InputRightElement>
                        <IconButton
                          aria-label={showEmail ? "Hide email" : "Show email"}
                          icon={showEmail ? <ViewOffIcon /> : <ViewIcon />}
                          variant="ghost"
                          onClick={() => setShowEmail(!showEmail)}
                        />
                      </InputRightElement>
                    </InputGroup>
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="green"
                    size="lg"
                    w="full"
                    isLoading={loading}
                    loadingText="Searching..."
                    leftIcon={<SearchIcon />}
                    _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                    transition="all 0.2s"
                  >
                    Search Invoice
                  </Button>
                </VStack>
              </form>

              {error && (
                <Alert status="error" mt={4} borderRadius="md">
                  <AlertIcon />
                  {error}
                </Alert>
              )}
            </CardBody>
          </Card>

          {/* Invoice Details */}
          {invoice && (
            <Card boxShadow="lg" mb={8}>
              <CardHeader bg="green.50" borderTopRadius="lg">
                <HStack justify="space-between">
                  <HStack>
                    <FaReceipt color="#003f2d" />
                    <Heading size="md" color="brand.green">Invoice Details</Heading>
                  </HStack>
                  <Text fontSize="lg" fontWeight="bold" color="brand.green">
                    ${invoice.amount.toFixed(2)}
                  </Text>
                </HStack>
              </CardHeader>
              <CardBody p={6}>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} mb={6}>
                  <VStack align="start" spacing={3}>
                    <Box>
                      <Text fontWeight="semibold" color="gray.600">Invoice Number:</Text>
                      <Text fontSize="lg" fontWeight="bold">{invoice.number}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.600">Customer:</Text>
                      <Text fontSize="lg">{invoice.customerName}</Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.600">Due Date:</Text>
                      <Text fontSize="lg">{new Date(invoice.dueDate).toLocaleDateString()}</Text>
                    </Box>
                  </VStack>
                  <VStack align="start" spacing={3}>
                    <Box>
                      <Text fontWeight="semibold" color="gray.600">Status:</Text>
                      <Text fontSize="lg" color={invoice.status === 'paid' ? 'green.500' : 'orange.500'} fontWeight="bold">
                        {invoice.status === 'paid' ? 'Paid' : 'Unpaid'}
                      </Text>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.600">Description:</Text>
                      <Text fontSize="lg">{invoice.description}</Text>
                    </Box>
                  </VStack>
                </SimpleGrid>

                {/* Invoice Items */}
                <Box mb={6}>
                  <Text fontWeight="semibold" color="gray.700" mb={3}>Invoice Items:</Text>
                  <VStack spacing={2} align="stretch">
                    {invoice.items.map((item, index) => (
                      <HStack key={index} justify="space-between" p={3} bg="gray.50" borderRadius="md">
                        <Box flex="1">
                          <Text fontWeight="medium">{item.description}</Text>
                          <Text fontSize="sm" color="gray.600">
                            {item.quantity} × ${item.rate.toFixed(2)}
                          </Text>
                        </Box>
                        <Text fontWeight="bold">${item.amount.toFixed(2)}</Text>
                      </HStack>
                    ))}
                  </VStack>
                </Box>

                {/* Payment Button */}
                <Button
                  onClick={handlePayInvoice}
                  colorScheme="green"
                  size="lg"
                  w="full"
                  isLoading={loading}
                  loadingText="Processing Payment..."
                  leftIcon={<FaCreditCard />}
                  _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
                  transition="all 0.2s"
                  isDisabled={invoice.status === 'paid'}
                >
                  {invoice.status === 'paid' ? 'Invoice Already Paid' : 'Pay Invoice'}
                </Button>
              </CardBody>
            </Card>
          )}

          {/* Help Section */}
          <Card boxShadow="md">
            <CardHeader bg="blue.50" borderTopRadius="lg">
              <Heading size="md" color="blue.600">Need Help?</Heading>
            </CardHeader>
            <CardBody p={6}>
              <VStack spacing={4} align="start">
                <Text color="gray.700">
                  If you're having trouble finding your invoice or making a payment, please contact us:
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                  <Box>
                    <Text fontWeight="semibold" color="brand.green">Phone:</Text>
                    <Text>0426 901 209</Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="brand.green">Email:</Text>
                    <Text>support@luckylogic.com.au</Text>
                  </Box>
                </SimpleGrid>
              </VStack>
            </CardBody>
          </Card>
        </Box>
      </Box>
    </>
  );
} 