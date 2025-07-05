'use client';

import { useState } from 'react';
import {
  Box, Heading, Input, Button, VStack, FormControl, FormLabel, useToast, Text, Badge, Link, HStack, Divider, Grid, GridItem, Icon, Flex, IconButton, useClipboard, Collapse, useDisclosure,
} from '@chakra-ui/react';
import { FaUniversity, FaCreditCard, FaMobile, FaCopy, FaShieldAlt, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { FiFileText, FiMail, FiHelpCircle } from 'react-icons/fi';

interface Invoice {
  id: string;
  number: string;
  amount_due: number;
  status: string;
  hosted_invoice_url: string;
  invoice_pdf: string;
  customer_email: string;
  created: number;
  due_date: number;
}

export default function InvoiceSearchPage() {
  const [email, setEmail] = useState('');
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [error, setError] = useState('');
  const toast = useToast();
  const { onCopy: copyBSB } = useClipboard('067-873');
  const { onCopy: copyAccount } = useClipboard('1786 7448');
  const { onCopy: copyPayID } = useClipboard('michael@luckylogic.com.au');
  
  // Collapsible states for payment methods
  const { isOpen: isBankOpen, onToggle: onBankToggle } = useDisclosure({ defaultIsOpen: true });
  const { isOpen: isPayIDOpen, onToggle: onPayIDToggle } = useDisclosure({ defaultIsOpen: false });
  const { isOpen: isCardOpen, onToggle: onCardToggle } = useDisclosure({ defaultIsOpen: false });

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    setInvoice(null);

    const res = await fetch('/api/find-invoice', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, invoiceNumber }),
    });

    const data = await res.json();

    if (res.ok) {
      setInvoice(data.invoice);
      toast({
        title: 'Invoice Found',
        description: 'Your invoice details are displayed below.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } else {
      setError(data.error || 'Invoice not found');
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

  const getStatusBadge = (status: string) => {
    const isOverdue = invoice && invoice.due_date * 1000 < Date.now() && status === 'open';
    
    if (status === 'paid') {
      return (
        <Badge colorScheme="green" variant="solid" borderRadius="full" px={3} py={1} fontSize="sm">
          ✔️ PAID
        </Badge>
      );
    } else if (isOverdue) {
      return (
        <Badge colorScheme="red" variant="subtle" borderRadius="full" px={3} py={1} fontSize="sm">
          ❗ OVERDUE
        </Badge>
      );
    } else {
      return (
        <Badge colorScheme="yellow" variant="subtle" borderRadius="full" px={3} py={1} fontSize="sm">
          ⏳ PENDING
        </Badge>
      );
    }
  };

  const handleCopy = (text: string, label: string, copyFunction: () => void) => {
    copyFunction();
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
      status: 'success',
      duration: 2000,
      isClosable: true,
    });
  };

  return (
    <Box maxW="6xl" mx="auto" mt={{ base: 4, md: 10 }} p={{ base: 4, md: 6 }}>
      {/* Search Form */}
      <Box mb={{ base: 6, md: 8 }} p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="xl" boxShadow="lg" bg="white">
        <Heading mb={{ base: 4, md: 6 }} size={{ base: "md", md: "lg" }} color="brand.green" textAlign="center">🔍 Find Your Invoice</Heading>
        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={{ base: 4, md: 6 }} mb={4}>
                          <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>Invoice Number</FormLabel>
                <Input 
                  value={invoiceNumber} 
                  onChange={e => setInvoiceNumber(e.target.value)}
                  size={{ base: "md", md: "lg" }}
                  borderWidth="2px"
                  borderColor="gray.200"
                  fontSize={{ base: "16px", md: "md" }}
                  _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>Email Address</FormLabel>
                <Input 
                  type="email" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)}
                  size={{ base: "md", md: "lg" }}
                  borderWidth="2px"
                  borderColor="gray.200"
                  fontSize={{ base: "16px", md: "md" }}
                  _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                />
              </FormControl>
          </Grid>
                      <Flex justify="center">
              <Button 
                isLoading={loading} 
                type="submit" 
                colorScheme="green" 
                size={{ base: "md", md: "lg" }}
                px={{ base: 6, md: 8 }}
                py={{ base: 2, md: 3 }}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="semibold"
                w={{ base: "full", md: "auto" }}
                minH={{ base: "44px", md: "auto" }}
              >
                Find Invoice
              </Button>
            </Flex>
        </form>
      </Box>

              {error && (
          <Box mb={{ base: 4, md: 6 }} p={{ base: 3, md: 4 }} bg="red.50" borderWidth="1px" borderColor="red.200" borderRadius="xl">
            <Text color="red.600" fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>{error}</Text>
          </Box>
        )}

      {invoice && (
        <>
                      {/* Security Indicator */}
            <Box mb={{ base: 3, md: 4 }} p={{ base: 2, md: 3 }} bg="blue.50" borderWidth="1px" borderColor="blue.200" borderRadius="lg" textAlign="center">
              <Flex align="center" justify="center" gap={2}>
                <Icon as={FaShieldAlt} color="blue.600" boxSize={{ base: 3, md: 4 }} />
                <Text fontSize={{ base: "xs", md: "sm" }} color="blue.700" fontWeight="medium">
                  🔒 This page is secured by a one-time access link
                </Text>
              </Flex>
            </Box>

            <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={{ base: 4, md: 8 }}>
                          {/* Invoice Details - Left Column */}
              <GridItem>
                <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="xl" boxShadow="lg" bg="white" h="fit-content">
                  <Heading size={{ base: "md", md: "lg" }} color="brand.green" mb={{ base: 4, md: 6 }}>Invoice Details</Heading>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                                      {/* Invoice Header with Icon */}
                    <Box p={{ base: 3, md: 4 }} bg="gray.50" borderRadius="lg">
                      <Flex align="center" justify="space-between" direction={{ base: "column", sm: "row" }} gap={{ base: 2, sm: 0 }}>
                        <Flex align="center" gap={{ base: 2, md: 3 }}>
                          <Icon as={FiFileText} color="brand.green" boxSize={{ base: 5, md: 6 }} />
                          <Heading size={{ base: "sm", md: "md" }} color="gray.800">Invoice #{invoice.number}</Heading>
                        </Flex>
                        {getStatusBadge(invoice.status)}
                      </Flex>
                    </Box>
                  
                  <Divider />
                  
                                      {/* Amount Due - Bigger and Styled */}
                    <Box p={{ base: 3, md: 4 }} bg="gray.50" borderRadius="lg" textAlign="center">
                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium" mb={1}>Amount Due</Text>
                      <Text fontSize={{ base: "2xl", md: "3xl" }} fontWeight="bold" color="gray.800">
                        ${(invoice.amount_due / 100).toFixed(2)}
                      </Text>
                    </Box>
                    
                    <Grid templateColumns={{ base: "1fr", sm: "1fr 1fr" }} gap={{ base: 3, md: 4 }}>
                      <Box p={{ base: 2, md: 3 }} bg="gray.50" borderRadius="md">
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">Created Date</Text>
                        <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>{new Date(invoice.created * 1000).toLocaleDateString()}</Text>
                      </Box>
                      <Box p={{ base: 2, md: 3 }} bg="gray.50" borderRadius="md">
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">Due Date</Text>
                        <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>{new Date(invoice.due_date * 1000).toLocaleDateString()}</Text>
                      </Box>
                    </Grid>
                  
                                      <Box p={{ base: 2, md: 3 }} bg="gray.50" borderRadius="md">
                      <Flex align="center" gap={2} mb={1}>
                        <Icon as={FiMail} color="gray.600" boxSize={{ base: 3, md: 4 }} />
                        <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" fontWeight="medium">Customer Email</Text>
                      </Flex>
                      <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }} wordBreak="break-all">{invoice.customer_email}</Text>
                    </Box>
                  
                  <Divider />
                  
                                      <Link 
                      href={invoice.hosted_invoice_url} 
                      isExternal 
                      _hover={{ textDecoration: 'none' }}
                    >
                      <Button 
                        colorScheme="blue" 
                        variant="outline" 
                        size={{ base: "md", md: "lg" }}
                        w="full"
                        fontWeight="semibold"
                        minH={{ base: "44px", md: "auto" }}
                        fontSize={{ base: "sm", md: "md" }}
                      >
                        📄 View Full Invoice PDF
                      </Button>
                    </Link>
                </VStack>
              </Box>
            </GridItem>

                          {/* Payment Methods - Right Column */}
              <GridItem>
                <Box p={{ base: 4, md: 6 }} borderWidth="1px" borderRadius="xl" boxShadow="lg" bg="white" h="fit-content">
                  <Heading size={{ base: "md", md: "lg" }} color="brand.green" mb={{ base: 4, md: 6 }}>Payment Methods</Heading>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                                      {/* Bank Transfer Section */}
                    <Box borderWidth="2px" borderRadius="xl" bg="blue.50" borderColor="blue.200" borderLeft="4px solid blue.500" overflow="hidden">
                      <Flex 
                        p={{ base: 3, md: 4 }} 
                        align="center" 
                        justify="space-between" 
                        cursor="pointer" 
                        onClick={onBankToggle}
                        _hover={{ bg: 'blue.100' }}
                        transition="background 0.2s"
                        minH={{ base: "44px", md: "auto" }}
                      >
                        <HStack spacing={{ base: 2, md: 3 }} align="center">
                          <Text fontSize={{ base: "xl", md: "2xl" }}>🏦</Text>
                          <Text fontWeight="bold" color="blue.600" fontSize={{ base: "md", md: "lg" }}>Bank Transfer</Text>
                        </HStack>
                        <Icon 
                          as={isBankOpen ? FaChevronUp : FaChevronDown} 
                          color="blue.600" 
                          boxSize={{ base: 3, md: 4 }} 
                        />
                      </Flex>
                                          <Collapse in={isBankOpen} animateOpacity>
                        <Box p={{ base: 3, md: 4 }} pt={0}>
                          <VStack spacing={{ base: 1, md: 2 }} align="stretch">
                            <Text fontSize={{ base: "sm", md: "md" }}><strong>Bank:</strong> Commonwealth Bank of Australia</Text>
                            <Text fontSize={{ base: "sm", md: "md" }}><strong>Account Name:</strong> Lucky Logic IT</Text>
                            <Flex align="center" gap={{ base: 1, md: 2 }}>
                              <Text fontSize={{ base: "sm", md: "md" }}><strong>BSB:</strong> 067-873</Text>
                              <IconButton
                                aria-label="Copy BSB"
                                icon={<FaCopy />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                onClick={() => handleCopy('067-873', 'BSB', copyBSB)}
                                minW={{ base: "32px", md: "auto" }}
                                minH={{ base: "32px", md: "auto" }}
                              />
                            </Flex>
                            <Flex align="center" gap={{ base: 1, md: 2 }}>
                              <Text fontSize={{ base: "sm", md: "md" }}><strong>Account Number:</strong> 1786 7448</Text>
                              <IconButton
                                aria-label="Copy Account Number"
                                icon={<FaCopy />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                onClick={() => handleCopy('1786 7448', 'Account Number', copyAccount)}
                                minW={{ base: "32px", md: "auto" }}
                                minH={{ base: "32px", md: "auto" }}
                              />
                            </Flex>
                            <Text fontSize={{ base: "sm", md: "md" }}><strong>Reference:</strong> {invoice.number}</Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} mt={2} color="gray.600" fontStyle="italic">
                              Please use your invoice number as the payment reference.
                            </Text>
                          </VStack>
                        </Box>
                      </Collapse>
                  </Box>

                                      {/* PayID Section */}
                    <Box borderWidth="2px" borderRadius="xl" bg="purple.50" borderColor="purple.200" borderLeft="4px solid purple.500" overflow="hidden">
                      <Flex 
                        p={{ base: 3, md: 4 }} 
                        align="center" 
                        justify="space-between" 
                        cursor="pointer" 
                        onClick={onPayIDToggle}
                        _hover={{ bg: 'purple.100' }}
                        transition="background 0.2s"
                        minH={{ base: "44px", md: "auto" }}
                      >
                        <HStack spacing={{ base: 2, md: 3 }} align="center">
                          <Text fontSize={{ base: "xl", md: "2xl" }}>💸</Text>
                          <Text fontWeight="bold" color="purple.600" fontSize={{ base: "md", md: "lg" }}>PayID</Text>
                        </HStack>
                        <Icon 
                          as={isPayIDOpen ? FaChevronUp : FaChevronDown} 
                          color="purple.600" 
                          boxSize={{ base: 3, md: 4 }} 
                        />
                      </Flex>
                                          <Collapse in={isPayIDOpen} animateOpacity>
                        <Box p={{ base: 3, md: 4 }} pt={0}>
                          <VStack spacing={{ base: 1, md: 2 }} align="stretch">
                            <Flex align="center" gap={{ base: 1, md: 2 }}>
                              <Text fontSize={{ base: "sm", md: "md" }}><strong>PayID:</strong> michael@luckylogic.com.au</Text>
                              <IconButton
                                aria-label="Copy PayID"
                                icon={<FaCopy />}
                                size={{ base: "xs", md: "sm" }}
                                variant="ghost"
                                onClick={() => handleCopy('michael@luckylogic.com.au', 'PayID', copyPayID)}
                                minW={{ base: "32px", md: "auto" }}
                                minH={{ base: "32px", md: "auto" }}
                              />
                            </Flex>
                            <Text fontSize={{ base: "sm", md: "md" }}><strong>Account Name:</strong> LUCKY LOGIC IT SERVICES</Text>
                            <Text fontSize={{ base: "sm", md: "md" }}><strong>Reference:</strong> {invoice.number}</Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} mt={2} color="gray.600" fontStyle="italic">
                              Use your invoice number as the payment reference.
                            </Text>
                          </VStack>
                        </Box>
                      </Collapse>
                  </Box>

                                      {/* Credit Card Section */}
                    <Box borderWidth="2px" borderRadius="xl" bg="green.50" borderColor="green.200" borderLeft="4px solid green.500" overflow="hidden">
                      <Flex 
                        p={{ base: 3, md: 4 }} 
                        align="center" 
                        justify="space-between" 
                        cursor="pointer" 
                        onClick={onCardToggle}
                        _hover={{ bg: 'green.100' }}
                        transition="background 0.2s"
                        minH={{ base: "44px", md: "auto" }}
                      >
                        <HStack spacing={{ base: 2, md: 3 }} align="center">
                          <Text fontSize={{ base: "xl", md: "2xl" }}>💳</Text>
                          <Text fontWeight="bold" color="green.600" fontSize={{ base: "md", md: "lg" }}>Credit/Debit Card Payment</Text>
                        </HStack>
                        <Icon 
                          as={isCardOpen ? FaChevronUp : FaChevronDown} 
                          color="green.600" 
                          boxSize={{ base: 3, md: 4 }} 
                        />
                      </Flex>
                                          <Collapse in={isCardOpen} animateOpacity>
                        <Box p={{ base: 3, md: 4 }} pt={0}>
                          <VStack spacing={{ base: 1, md: 2 }} align="stretch">
                            <Text fontWeight="semibold" fontSize={{ base: "sm", md: "md" }}>To make payment via Credit/Debit Card:</Text>
                            <Text fontSize={{ base: "sm", md: "md" }} ml={{ base: 2, md: 4 }}>Contact: <Link href="mailto:michael@luckylogic.com.au" color="green.600" fontWeight="medium">michael@luckylogic.com.au</Link></Text>
                            <Text fontSize={{ base: "xs", md: "sm" }} color="green.600" mt={2} fontStyle="italic">
                              Processing fees apply: Visa/Mastercard 1.75% + $0.30, AMEX 3.5% + $0.30
                            </Text>
                          </VStack>
                        </Box>
                      </Collapse>
                  </Box>
                </VStack>
              </Box>
            </GridItem>
          </Grid>

                      {/* Help Section */}
            <Box mt={{ base: 4, md: 6 }} p={{ base: 3, md: 4 }} bg="gray.50" borderWidth="1px" borderColor="gray.200" borderRadius="xl" textAlign="center">
              <Flex align="center" justify="center" gap={2} mb={2}>
                <Icon as={FiHelpCircle} color="gray.600" boxSize={{ base: 4, md: 5 }} />
                <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "sm", md: "md" }}>Need help?</Text>
              </Flex>
              <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" mb={2}>
                Contact us for payment assistance or invoice questions
              </Text>
              <Link href="mailto:michael@luckylogic.com.au" color="brand.green" fontWeight="medium" fontSize={{ base: "sm", md: "md" }}>
                michael@luckylogic.com.au
              </Link>
            </Box>
        </>
      )}
    </Box>
  );
} 