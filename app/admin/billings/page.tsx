'use client';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Spinner, Alert, AlertIcon, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton, Button } from '@chakra-ui/react';

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
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalInvoices, setModalInvoices] = useState<any[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  useEffect(() => {
    fetch('/api/list-stripe-invoices')
      .then(res => res.json())
      .then(data => {
        if (data.success) setInvoices(data.invoices);
        else setError(data.error || 'Failed to fetch invoices.');
        setLoading(false);
      })
      .catch(() => { setError('Something went wrong.'); setLoading(false); });
  }, []);

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
    invoices.forEach(inv => {
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
  invoices.forEach(inv => {
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

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" bg="gray.50" px={4} py={10}>
      <Box w="100%" maxW="1200px" mb={8} px={6}>
        <Box bg="#003f2d" color="white" py={6} px={8} borderRadius="2xl" boxShadow="lg" textAlign="center">
          <Heading as="h1" size="xl" fontWeight="bold" letterSpacing="tight" color="white" m={0} mb={2}>
            Billings
          </Heading>
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
              <>
                <Text fontSize="2xl" fontWeight="bold" color="gray.700" mb={2}>Outstanding invoices</Text>
                <Text fontSize="3xl" fontWeight="extrabold" color="yellow.600" mb={4}>${(outstanding / 100).toFixed(2)} AUD</Text>
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
                        <Td isNumeric>
                          {b.count > 0 ? (
                            <Button size="xs" variant="link" colorScheme="blue" onClick={() => openModal(b.invs, b.label)}>{b.count}</Button>
                          ) : 0}
                        </Td>
                        <Td isNumeric>${(b.amount / 100).toFixed(2)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
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
                      <Td>{c.name || <Text color="gray.400">(No name)</Text>}</Td>
                      <Td>{c.email}</Td>
                      <Td>{formatMonthYear(c.since)}</Td>
                      <Td isNumeric>{c.count > 0 ? (
                        <Button size="xs" variant="link" colorScheme="blue" onClick={() => openModal(invoices.filter(inv => inv.customer_email === c.email), `${c.name || c.email}'s`)}>{c.count}</Button>
                      ) : 0}</Td>
                      <Td isNumeric>{c.paid > 0 ? (
                        <Box as="span" px={2} py={1} borderRadius="md" bg="green.100" color="green.800" fontWeight="bold" display="inline-block">
                          ${(c.paid / 100).toFixed(2)}
                        </Box>
                      ) : '$0.00'}</Td>
                      <Td isNumeric>{c.due > 0 ? (
                        <Box as="span" px={2} py={1} borderRadius="md" bg="red.100" color="red.800" fontWeight="bold" display="inline-block">
                          ${(c.due / 100).toFixed(2)}
                        </Box>
                      ) : '$0.00'}</Td>
                      <Td isNumeric>${(c.total / 100).toFixed(2)}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </Box>
        </Box>
      </Box>
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{modalTitle} Invoices</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {modalInvoices.length === 0 ? (
              <Text>No invoices in this bucket.</Text>
            ) : (
              <Table size="sm" variant="simple">
                <Thead>
                  <Tr>
                    <Th>Invoice #</Th>
                    <Th>Customer</Th>
                    <Th>Amount</Th>
                    <Th>Due Date</Th>
                    <Th>View</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {modalInvoices.map(inv => (
                    <Tr key={inv.id}>
                      <Td>{inv.number || inv.id}</Td>
                      <Td>{inv.customer_name}</Td>
                      <Td>{formatAmount(inv.amount_due)}</Td>
                      <Td>{formatDate(inv.due_date)}</Td>
                      <Td>
                        {inv.hosted_invoice_url ? (
                          <Button as="a" href={inv.hosted_invoice_url} target="_blank" rel="noopener noreferrer" size="xs" colorScheme="green" variant="outline">View</Button>
                        ) : (
                          <Text color="gray.400">N/A</Text>
                        )}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
} 