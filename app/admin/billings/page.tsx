'use client';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button, IconButton, useBreakpointValue, VStack, HStack } from '@chakra-ui/react';
import Link from 'next/link';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { useLock } from '../../../components/LockContext';
import { useStripeData } from '../../../components/StripeDataContext';
import GlassCard from '../../../components/GlassCard';
import AdminSessionTimeout from '../../../components/AdminSessionTimeout';
import { useRouter } from 'next/navigation';

function getStatus(inv: any) {
  if (inv.status === 'open' && inv.due_date && inv.due_date * 1000 < Date.now()) {
    return 'Past Due';
  }
  return inv.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
}

function getDaysPastDue(inv: any) {
  if (!inv.due_date) return null;
  const days = Math.floor((Date.now() - inv.due_date * 1000) / (1000 * 60 * 60 * 24));
  return days > 0 ? days : null;
}

function formatDate(ts: number | null) {
  if (!ts) return '-';
  return new Date(ts * 1000).toLocaleDateString();
}

function formatAmount(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default function BillingsPage() {
  const { invoices, loading, error, refresh } = useStripeData();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInvoices, setModalInvoices] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);
  const { metricsLocked } = useLock();
  const isMobile = useBreakpointValue({ base: true, md: false });
  const router = useRouter();

  // Calculate buckets
  const buckets = [
    { label: 'Not yet due', color: 'purple.400', min: null, max: 0 },
    { label: '1–30 days past due', color: 'orange.400', min: 1, max: 30 },
    { label: '31–60 days past due', color: 'yellow.400', min: 31, max: 60 },
    { label: '61–90 days past due', color: 'red.300', min: 61, max: 90 },
    { label: '91–120 days past due', color: 'red.400', min: 91, max: 120 },
    { label: 'More than 120 days past due', color: 'red.600', min: 121, max: Infinity },
  ];
  const bucketData = buckets.map(b => {
    let count = 0, amount = 0, invs: any[] = [];
    (invoices ?? []).forEach(inv => {
      if (getStatus(inv) === 'Past Due') {
        const days = getDaysPastDue(inv);
        if (days && days >= (b.min ?? 0) && days <= b.max) {
          count++;
          amount += inv.amount_due;
          invs.push(inv);
        }
      } else if (b.label === 'Not yet due' && inv.status === 'open' && (!inv.due_date || inv.due_date * 1000 > Date.now())) {
        count++;
        amount += inv.amount_due;
        invs.push(inv);
      }
    });
    return { ...b, count, amount, invs };
  });
  const outstanding = bucketData.reduce((sum, b) => sum + b.amount, 0);

  // Top customers calculation
  const customerMap: Record<string, { name: string, email: string, count: number, total: number, paid: number, due: number, since: number | null }> = {};
  (invoices ?? []).forEach(inv => {
    if (!inv.customer_email) return;
    const key = inv.customer_email;
    if (!customerMap[key]) {
      customerMap[key] = { name: inv.customer_name || '', email: inv.customer_email, count: 0, total: 0, paid: 0, due: 0, since: null };
    }
    customerMap[key].count++;
    customerMap[key].total += inv.amount_due;
    const status = getStatus(inv);
    if (status === 'Paid') {
      customerMap[key].paid += inv.amount_due;
    } else if (status === 'Open' || status === 'Past Due') {
      customerMap[key].due += inv.amount_due;
    }
    if (!customerMap[key].since || (inv.created && inv.created < customerMap[key].since)) {
      customerMap[key].since = inv.created;
    }
  });
  const topCustomers = Object.values(customerMap).sort((a, b) => b.count - a.count).slice(0, 10);

  function formatMonthYear(ts: number | null) {
    if (!ts) return '-';
    const d = new Date(ts * 1000);
    return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
  }

  function openModal(invs: any[], title: string) {
    setModalInvoices(invs);
    setModalTitle(title);
    setModalOpen(true);
  }

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/admin/login');
  };

  return (
    <>
      <AdminSessionTimeout />
      <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" bg="gray.50" px={4} py={10}>
        <Box w="100%" maxW="1200px" mb={8} px={6}>
          <Box bg="#003f2d" color="white" py={6} px={8} borderRadius="2xl" boxShadow="lg" textAlign="center">
            <Box display="flex" alignItems="center" justifyContent="center" gap={3} mb={2}>
              <Heading as="h1" size="xl" fontWeight="bold" letterSpacing="tight" color="white" m={0}>
                Billings
              </Heading>
            </Box>
          </Box>
        </Box>
        <Box w="100%" maxW="1200px" display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={6}>
          {/* Billing Overview */}
          <Box flex="1" bg="white" borderRadius="xl" boxShadow="md" p={0} mb={{ base: 8, md: 0 }}>
            <Box bg="#003f2d" color="white" px={6} py={3} borderTopLeftRadius="xl" borderTopRightRadius="xl">
              <Heading as="h2" size="md" m={0} fontWeight="bold" letterSpacing="tight">Billing overview</Heading>
            </Box>
            <Box p={6}>
              {loading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />{error}</Alert> : (
                isMobile ? (
                  <VStack w="100%" spacing={4} maxW="500px" mb={4}>
                    <GlassCard w="100%" p={4} borderRadius="lg" boxShadow="md">
                      <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={2}>Outstanding invoices</Text>
                      <Text fontSize="3xl" fontWeight="extrabold" color="yellow.600" mb={4} style={metricsLocked ? { filter: 'blur(8px)' } : {}}>${(outstanding / 100).toFixed(2)} AUD</Text>
                      {bucketData.map(b => (
                        <Box key={b.label} mb={2} p={3} borderRadius="md" bg="gray.50" boxShadow="sm" display="flex" alignItems="center" justifyContent="space-between">
                          <Box display="flex" alignItems="center">
                            <Box w={2} h={2} borderRadius="full" bg={b.color} mr={2} />
                            <Text fontWeight="bold">{b.label}</Text>
                          </Box>
                          <HStack spacing={2}>
                            <Text fontWeight="bold" color="gray.700">{b.count}</Text>
                            <Text color="gray.500">/</Text>
                            <Text fontWeight="bold" color="gray.700">${(b.amount / 100).toFixed(2)}</Text>
                            {b.count > 0 && (
                              <Button size="xs" colorScheme="blue" variant="outline" onClick={() => openModal(b.invs, b.label)}>
                                View
                              </Button>
                            )}
                          </HStack>
                        </Box>
                      ))}
                    </GlassCard>
                  </VStack>
                ) : (
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr bg="#003f2d">
                        <Th color="white">INVOICE AGE</Th>
                        <Th color="white" isNumeric>INVOICES</Th>
                        <Th color="white" isNumeric>AMOUNT</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {bucketData.map(b => (
                        <Tr key={b.label}>
                          <Td><Box display="inline-block" w={2} h={2} borderRadius="full" bg={b.color} mr={2} />{b.label}</Td>
                          <Td isNumeric style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                            {b.count > 0 ? (
                              <Button size="xs" variant="link" colorScheme="blue" onClick={() => openModal(b.invs, b.label)}>{b.count}</Button>
                            ) : 0}
                          </Td>
                          <Td isNumeric style={metricsLocked ? { filter: 'blur(8px)' } : {}}>${(b.amount / 100).toFixed(2)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )
              )}
            </Box>
          </Box>
          {/* Top Customers */}
          <Box flex="1" bg="white" borderRadius="xl" boxShadow="md" p={0}>
            <Box bg="#003f2d" color="white" px={6} py={3} borderTopLeftRadius="xl" borderTopRightRadius="xl">
              <Heading as="h2" size="md" m={0} fontWeight="bold" letterSpacing="tight">Top Customers</Heading>
            </Box>
            <Box p={6}>
              {loading ? <Spinner /> : error ? <Alert status="error"><AlertIcon />{error}</Alert> : (
                isMobile ? (
                  <VStack w="100%" spacing={4} maxW="500px" mb={4}>
                    {topCustomers.length === 0 ? (
                      <GlassCard w="100%" p={4} borderRadius="lg" boxShadow="md">
                        <Text color="gray.400">No customers found.</Text>
                      </GlassCard>
                    ) : topCustomers.map(c => (
                      <GlassCard key={c.email} w="100%" p={4} borderRadius="lg" boxShadow="md">
                        <Text fontWeight="bold">{c.name || <Text as="span" color="gray.400">(No name)</Text>}</Text>
                        <Text>{c.email}</Text>
                        <Text>Customer since: {formatMonthYear(c.since)}</Text>
                        <HStack spacing={2} mt={2} flexWrap="wrap">
                          <Box px={2} py={1} borderRadius="md" bg="green.100" color="green.800" fontWeight="bold">Paid: ${(c.paid / 100).toFixed(2)}</Box>
                          <Box px={2} py={1} borderRadius="md" bg="red.100" color="red.800" fontWeight="bold">Due: ${(c.due / 100).toFixed(2)}</Box>
                          <Box px={2} py={1} borderRadius="md" bg="gray.100" color="gray.800" fontWeight="bold">Total: ${(c.total / 100).toFixed(2)}</Box>
                          <Box px={2} py={1} borderRadius="md" bg="blue.100" color="blue.800" fontWeight="bold">Invoices: {c.count}</Box>
                          {c.count > 0 && (
                            <Button size="xs" colorScheme="blue" variant="outline" onClick={() => openModal((invoices ?? []).filter(inv => inv.customer_email === c.email), `${c.name || c.email}'s`)}>
                              View
                            </Button>
                          )}
                        </HStack>
                      </GlassCard>
                    ))}
                  </VStack>
                ) : (
                  <Table size="sm" variant="simple">
                    <Thead>
                      <Tr bg="#003f2d">
                        <Th color="white">Name</Th>
                        <Th color="white">Email</Th>
                        <Th color="white">Customer since</Th>
                        <Th color="white" isNumeric>Invoices</Th>
                        <Th color="white" isNumeric>Invoice Paid</Th>
                        <Th color="white" isNumeric>Invoice Due</Th>
                        <Th color="white" isNumeric>Invoice Total</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {topCustomers.length === 0 ? (
                        <Tr><Td colSpan={7}><Text color="gray.400">No customers found.</Text></Td></Tr>
                      ) : topCustomers.map(c => (
                        <Tr key={c.email}>
                          <Td style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{c.name || <Text color="gray.400">(No name)</Text>}</Td>
                          <Td style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{c.email}</Td>
                          <Td>{formatMonthYear(c.since)}</Td>
                          <Td isNumeric style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{c.count > 0 ? (
                            <Button size="xs" variant="link" colorScheme="blue" onClick={() => openModal((invoices ?? []).filter(inv => inv.customer_email === c.email), `${c.name || c.email}'s`)}>{c.count}</Button>
                          ) : 0}</Td>
                          <Td isNumeric style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{c.paid > 0 ? (
                            <Box as="span" px={2} py={1} borderRadius="md" bg="green.100" color="green.800" fontWeight="bold" display="inline-block">
                              ${(c.paid / 100).toFixed(2)}
                            </Box>
                          ) : '$0.00'}</Td>
                          <Td isNumeric style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{c.due > 0 ? (
                            <Box as="span" px={2} py={1} borderRadius="md" bg="red.100" color="red.800" fontWeight="bold" display="inline-block">
                              ${(c.due / 100).toFixed(2)}
                            </Box>
                          ) : '$0.00'}</Td>
                          <Td isNumeric style={metricsLocked ? { filter: 'blur(8px)' } : {}}>${(c.total / 100).toFixed(2)}</Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )
              )}
            </Box>
          </Box>
        </Box>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size={isMobile ? 'full' : 'xl'} isCentered>
          <ModalOverlay />
          <ModalContent maxW={isMobile ? 'xs' : '1000px'}>
            <ModalHeader>{modalTitle} Invoices</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {modalInvoices.length === 0 ? (
                <Text>No invoices in this bucket.</Text>
              ) : (
                isMobile ? (
                  <VStack w="100%" spacing={4} maxW="500px" mb={4}>
                    {modalInvoices.map(inv => (
                      <GlassCard key={inv.id} w="100%" p={4} borderRadius="lg" boxShadow="md">
                        <Text fontSize="sm" color="brand.green" fontWeight="bold">Invoice: {inv.number || inv.id}</Text>
                        <Text fontWeight="bold">{inv.customer_name}</Text>
                        <Text>Description: {inv.lines && inv.lines.length > 0 && inv.lines[0].description ? inv.lines[0].description : '-'}</Text>
                        <Text>Amount: <span style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(inv.amount_due)}</span></Text>
                        <Text>Status: {getStatus(inv)}</Text>
                        <Text>Due: {formatDate(inv.due_date)}</Text>
                        <Button as="a" href={`https://dashboard.stripe.com/invoices/${inv.id}`} target="_blank" rel="noopener noreferrer" size="md" colorScheme="green" variant="outline" mt={2} w="100%">View</Button>
                      </GlassCard>
                    ))}
                  </VStack>
                ) : (
                  <Table size="sm" variant="simple" width="100%">
                    <Thead>
                      <Tr>
                        <Th minW="90px" whiteSpace="nowrap">Invoice #</Th>
                        <Th minW="110px" whiteSpace="nowrap">Customer</Th>
                        <Th minW="150px" whiteSpace="nowrap">Description</Th>
                        <Th minW="80px" whiteSpace="nowrap">Amount</Th>
                        <Th minW="80px" whiteSpace="nowrap">Status</Th>
                        <Th minW="100px" whiteSpace="nowrap">Due Date</Th>
                        <Th minW="80px" whiteSpace="nowrap">View</Th>
                      </Tr>
                    </Thead>
                    <Tbody fontSize={{ base: 'xs', md: 'sm' }}>
                      {modalInvoices.map(inv => (
                        <Tr key={inv.id}>
                          <Td>{inv.number || inv.id}</Td>
                          <Td>{inv.customer_name}</Td>
                          <Td>{inv.lines && inv.lines.length > 0 && inv.lines[0].description ? inv.lines[0].description : '-'}</Td>
                          <Td>{formatAmount(inv.amount_due)}</Td>
                          <Td>{getStatus(inv)}</Td>
                          <Td>{formatDate(inv.due_date)}</Td>
                          <Td>
                            <Button as="a" href={`https://dashboard.stripe.com/invoices/${inv.id}`} target="_blank" rel="noopener noreferrer" size="xs" colorScheme="green" variant="outline">View</Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
        <Button onClick={handleLogout} colorScheme="red" variant="outline" mt={6} isLoading={loggingOut}>
          Logout
        </Button>
        <Button as={Link} href="/admin" colorScheme="red" variant="outline" mt={4}>
          Back
        </Button>
      </Box>
    </>
  );
} 