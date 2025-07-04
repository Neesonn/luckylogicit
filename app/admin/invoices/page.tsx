'use client';
import { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, Text, Button, ButtonGroup, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Input, InputGroup, InputLeftElement, Select, Checkbox, useToast, IconButton, useBreakpointValue, VStack, HStack } from '@chakra-ui/react';
import { ArrowBackIcon, ExternalLinkIcon, DownloadIcon, SearchIcon, TriangleDownIcon, TriangleUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { useLock } from '../../../components/LockContext';
import { useStripeData } from '../../../components/StripeDataContext';
import GlassCard from '../../../components/GlassCard';

export default function InvoicesPage() {
  const { invoices, loading, error, refresh } = useStripeData();
  const [loggingOut, setLoggingOut] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [dateField, setDateField] = useState<'created' | 'due_date'>('created');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [hideVoid, setHideVoid] = useState(false);
  const [detailsInvoice, setDetailsInvoice] = useState<any | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const toast = useToast();
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [notesLoading, setNotesLoading] = useState(false);
  const { metricsLocked } = useLock();
  const isMobile = useBreakpointValue({ base: true, md: false });

  function formatDate(ts: number | null) {
    if (!ts) return '-';
    return new Date(ts * 1000).toLocaleDateString();
  }

  function formatAmount(cents: number) {
    return `$${(cents / 100).toFixed(2)}`;
  }

  function getStatus(inv: any) {
    if (inv.status === 'open' && inv.due_date && inv.due_date * 1000 < Date.now()) {
      return 'Past Due';
    }
    return inv.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  // Filtered invoices
  const filteredInvoices = (invoices ?? []).filter(inv => {
    // Hide Void filter
    if (hideVoid && getStatus(inv) === 'Void') return false;
    // Status filter
    if (filter !== 'all') {
      if (filter === 'past_due' && getStatus(inv) !== 'Past Due') return false;
      if (filter !== 'past_due' && getStatus(inv).toLowerCase() !== filter.replace('_', ' ')) return false;
    }
    // Date range filter
    if (dateStart || dateEnd) {
      const ts = inv[dateField] ? new Date(inv[dateField] * 1000) : null;
      if (dateStart && (!ts || ts < new Date(dateStart))) return false;
      if (dateEnd && (!ts || ts > new Date(dateEnd + 'T23:59:59'))) return false;
    }
    // Search filter
    if (search.trim() !== '') {
      const term = search.trim().toLowerCase();
      const fields = [
        inv.customer_name,
        inv.customer_email,
        inv.number,
        inv.id,
        getStatus(inv),
        formatDate(inv.created),
        formatDate(inv.due_date),
        formatAmount(inv.amount_due),
      ];
      if (!fields.some(f => (f || '').toString().toLowerCase().includes(term))) return false;
    }
    return true;
  });
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(filteredInvoices.length / pageSize);

  // Summary calculations
  const totalPaid = (filteredInvoices ?? []).filter(inv => getStatus(inv) === 'Paid').reduce((sum, inv) => sum + inv.amount_due, 0);
  const totalOverdue = (filteredInvoices ?? []).filter(inv => getStatus(inv) === 'Past Due').reduce((sum, inv) => sum + inv.amount_due, 0);
  const totalOutstanding = (filteredInvoices ?? []).filter(inv => ['Open', 'Past Due'].includes(getStatus(inv))).reduce((sum, inv) => sum + inv.amount_due, 0);
  const totalVoid = (filteredInvoices ?? []).filter(inv => getStatus(inv) === 'Void').reduce((sum, inv) => sum + inv.amount_due, 0);

  function handleSort(col: string) {
    if (sortBy === col) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortDir('asc');
    }
  }

  function getSortIcon(col: string) {
    if (sortBy !== col) return null;
    return sortDir === 'asc' ? <TriangleUpIcon ml={1} /> : <TriangleDownIcon ml={1} />;
  }

  // Sort filteredInvoices before paginating
  const sortedInvoices = [...(filteredInvoices ?? [])].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (sortBy === 'customer_name' || sortBy === 'customer_email' || sortBy === 'status' || sortBy === 'number') {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }
    if (sortBy === 'amount_due') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    if (sortBy === 'created' || sortBy === 'due_date') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedInvoices = sortedInvoices.slice((page - 1) * pageSize, page * pageSize);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin-logout', { method: 'POST' });
    window.location.href = '/';
  };

  // Reset page to 1 when filter changes
  useEffect(() => { setPage(1); }, [filter, invoices]);

  const handleViewInvoice = (inv: any) => {
    setSelectedInvoice(inv);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInvoice(null);
  };

  const handleRowClick = (inv: any) => {
    setDetailsInvoice(inv);
    setIsDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setDetailsInvoice(null);
  };

  useEffect(() => {
    if (detailsInvoice) {
      setNotesValue(detailsInvoice.notes || '');
      setEditingNotes(false);
    }
  }, [detailsInvoice]);

  // Helper to get country flag emoji from country code
  function countryFlagEmoji(countryCode: string) {
    if (!countryCode) return '';
    return countryCode
      .toUpperCase()
      .replace(/./g, char =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }

  function formatAddress(addr: any) {
    if (!addr) return null;
    const lines = [
      addr.line1,
      addr.line2,
      [addr.city, addr.state, addr.postal_code].filter(Boolean).join(' '),
      addr.country ? `${addr.country} ${countryFlagEmoji(addr.country)}` : null,
    ].filter(Boolean);
    return lines.map((line, i) => <div key={i}>{line}</div>);
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" bg="gray.50" px={4} py={10}>
      {/* Banner */}
      <Box w="100%" maxW="1200px" mb={8} px={6}>
        <Box bg="#003f2d" color="white" py={6} px={8} borderRadius="2xl" boxShadow="lg" textAlign="center">
          <Box display="flex" alignItems="center" justifyContent="center" gap={3} mb={2}>
            <Heading as="h1" size="xl" fontWeight="bold" letterSpacing="tight" color="white" m={0}>
              Invoices
            </Heading>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={6} mt={2}>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Outstanding</Text>
              <Text fontWeight="bold" fontSize="lg" color="yellow.200" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalOutstanding)}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Paid</Text>
              <Text fontWeight="bold" fontSize="lg" color="green.200" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalPaid)}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Overdue</Text>
              <Text fontWeight="bold" fontSize="lg" color="red.200" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalOverdue)}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Void</Text>
              <Text fontWeight="bold" fontSize="lg" color="yellow.100" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalVoid)}</Text>
            </Box>
          </Box>
        </Box>
      </Box>
      {/* Filter/Search/Date Controls */}
      <Box w="100%" maxW="1200px" mb={4} px={{ base: 1, md: 6 }} display="flex" flexDirection={{ base: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ base: 'stretch', md: 'center' }} flexWrap="wrap" gap={2}>
        <Box display="flex" flexDirection={{ base: 'column', sm: 'row' }} alignItems={{ base: 'stretch', sm: 'center' }} gap={2} w={{ base: '100%', md: 'auto' }}>
          <InputGroup maxW={{ base: '100%', sm: '260px' }}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.400" />
            </InputLeftElement>
            <Input
              placeholder="Search invoices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              bg="white"
              borderColor="#003f2d"
              _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 1px #14543a' }}
              size="md"
            />
          </InputGroup>
          <Select value={dateField} onChange={e => setDateField(e.target.value as 'created' | 'due_date')} size="md" maxW={{ base: '100%', sm: '120px' }} bg="white" borderColor="#003f2d">
            <option value="created">Created</option>
            <option value="due_date">Due</option>
          </Select>
          <Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} size="md" maxW={{ base: '100%', sm: '140px' }} bg="white" borderColor="#003f2d" />
          <Text mx={1} display={{ base: 'none', sm: 'inline' }}>to</Text>
          <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} size="md" maxW={{ base: '100%', sm: '140px' }} bg="white" borderColor="#003f2d" />
          <Checkbox ml={{ base: 0, sm: 4 }} isChecked={hideVoid} onChange={e => setHideVoid(e.target.checked)} colorScheme="green">
            Hide Void
          </Checkbox>
        </Box>
        <ButtonGroup isAttached variant="outline" w={{ base: '100%', md: 'auto' }} size={{ base: 'sm', md: 'md' }}>
          <Button
            onClick={() => setFilter('all')}
            bg={filter === 'all' ? '#003f2d' : 'transparent'}
            color={filter === 'all' ? 'white' : '#003f2d'}
            borderColor="#003f2d"
            _hover={{ bg: filter === 'all' ? '#14543a' : 'rgba(0,63,45,0.08)' }}
            fontWeight="bold"
          >
            All Invoices
          </Button>
          <Button
            onClick={() => setFilter('draft')}
            bg={filter === 'draft' ? '#003f2d' : 'transparent'}
            color={filter === 'draft' ? 'white' : '#003f2d'}
            borderColor="#003f2d"
            _hover={{ bg: filter === 'draft' ? '#14543a' : 'rgba(0,63,45,0.08)' }}
            fontWeight="bold"
          >
            Draft
          </Button>
          <Button
            onClick={() => setFilter('open')}
            bg={filter === 'open' ? '#003f2d' : 'transparent'}
            color={filter === 'open' ? 'white' : '#003f2d'}
            borderColor="#003f2d"
            _hover={{ bg: filter === 'open' ? '#14543a' : 'rgba(0,63,45,0.08)' }}
            fontWeight="bold"
          >
            Open
          </Button>
          <Button
            onClick={() => setFilter('past_due')}
            bg={filter === 'past_due' ? '#003f2d' : 'transparent'}
            color={filter === 'past_due' ? 'white' : '#003f2d'}
            borderColor="#003f2d"
            _hover={{ bg: filter === 'past_due' ? '#14543a' : 'rgba(0,63,45,0.08)' }}
            fontWeight="bold"
          >
            Past Due
          </Button>
          <Button
            onClick={() => setFilter('paid')}
            bg={filter === 'paid' ? '#003f2d' : 'transparent'}
            color={filter === 'paid' ? 'white' : '#003f2d'}
            borderColor="#003f2d"
            _hover={{ bg: filter === 'paid' ? '#14543a' : 'rgba(0,63,45,0.08)' }}
            fontWeight="bold"
          >
            Paid
          </Button>
        </ButtonGroup>
      </Box>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error" mb={6}><AlertIcon />{error}</Alert>
      ) : (
        isMobile ? (
          <VStack w="100%" spacing={4} maxW="500px" mb={8}>
            {paginatedInvoices.map(inv => (
              <GlassCard key={inv.id} w="100%" p={4} borderRadius="lg" boxShadow="md">
                <Box mb={2}>
                  <Text fontSize="xs" color="brand.green" fontWeight="bold">
                    Invoice: {inv.number || inv.id}
                  </Text>
                </Box>
                <VStack align="start" spacing={1} mb={2}>
                  <Text fontWeight="bold">{inv.customer_name || <Text as="span" color="gray.400">(No name)</Text>}</Text>
                  <Text>{inv.customer_email || <Text as="span" color="gray.400">(No email)</Text>}</Text>
                  <Text fontSize="sm" color="gray.600">Created: {formatDate(inv.created)}</Text>
                  <Text fontSize="sm" color="gray.600">Due: {formatDate(inv.due_date)}</Text>
                  <Text fontSize="sm" color="gray.600">Amount: {formatAmount(inv.amount_due)}</Text>
                  <Box display="inline-block" px={2} py={1} borderRadius="md" fontWeight="bold" fontSize="sm" mt={1} {...(() => {
                    const status = getStatus(inv);
                    if (status === 'Past Due') return { bg: 'red.50', border: '1px solid', borderColor: 'red.400', color: 'red.700' };
                    if (status === 'Void') return { bg: 'yellow.50', border: '1px solid', borderColor: 'yellow.400', color: 'yellow.700' };
                    if (status === 'Paid') return { bg: 'green.50', border: '1px solid', borderColor: 'green.400', color: 'green.700' };
                    if (status === 'Open') return { bg: 'blue.50', border: '1px solid', borderColor: 'blue.400', color: 'blue.700' };
                    if (status === 'Draft') return { bg: 'gray.100', border: '1px solid', borderColor: 'gray.400', color: 'gray.700' };
                    return { bg: 'gray.50', border: '1px solid', borderColor: 'gray.300', color: 'gray.600' };
                  })()}>{getStatus(inv)}</Box>
                </VStack>
                <HStack w="100%" spacing={3} mt={2}>
                  {inv.hosted_invoice_url ? (
                    <Button
                      leftIcon={<ExternalLinkIcon />} size="md" colorScheme="green" variant="solid" flex={1}
                      onClick={e => { e.stopPropagation(); handleViewInvoice(inv); }}
                    >View</Button>
                  ) : (
                    <Button size="md" colorScheme="gray" variant="outline" flex={1} isDisabled>
                      N/A
                    </Button>
                  )}
                  {inv.hosted_invoice_url && (
                    <Button
                      leftIcon={<DownloadIcon />} size="md" colorScheme="green" variant="outline" flex={1}
                      as="a"
                      href={inv.hosted_invoice_url + '/pdf'}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      download
                    >PDF</Button>
                  )}
                </HStack>
              </GlassCard>
            ))}
          </VStack>
        ) : (
          <Box w="100%" maxW="1200px" px={{ base: 0, md: 6 }} overflowX="auto" mb={8}>
            <Table variant="simple" size={{ base: 'xs', md: 'sm' }} sx={{ tableLayout: 'fixed', width: '100%' }}>
              <Thead>
                <Tr bg="#003f2d" borderRadius="2xl">
                  <Th color="white" borderTopLeftRadius="2xl" cursor="pointer" onClick={() => handleSort('customer_name')} minW="120px" maxW="180px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontSize={{ base: 'xs', md: 'sm' }}>
                    Customer Name {getSortIcon('customer_name')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('customer_email')} minW="160px" maxW="220px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontSize={{ base: 'xs', md: 'sm' }}>
                    Email {getSortIcon('customer_email')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('created')} minW="90px" maxW="110px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>
                    Created {getSortIcon('created')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('due_date')} minW="90px" maxW="110px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>
                    Due {getSortIcon('due_date')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('amount_due')} minW="80px" maxW="100px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>
                    Amount {getSortIcon('amount_due')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('status')} minW="80px" maxW="100px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>
                    Status {getSortIcon('status')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('number')} minW="100px" maxW="140px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontSize={{ base: 'xs', md: 'sm' }}>
                    Invoice {getSortIcon('number')}
                  </Th>
                  <Th color="white" borderTopRightRadius="2xl" minW="110px" maxW="120px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>View Invoice</Th>
                </Tr>
              </Thead>
              <Tbody fontSize={{ base: 'xs', md: 'sm' }}>
                {paginatedInvoices.map(inv => (
                  <Tr key={inv.id} _hover={{ bg: 'green.50', cursor: 'pointer' }} onClick={() => handleRowClick(inv)}>
                    <Td maxW="180px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{inv.customer_name || <Text color="gray.400">(No name)</Text>}</Td>
                    <Td maxW="220px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{inv.customer_email || <Text color="gray.400">(No email)</Text>}</Td>
                    <Td whiteSpace="nowrap">{formatDate(inv.created)}</Td>
                    <Td whiteSpace="nowrap">{formatDate(inv.due_date)}</Td>
                    <Td whiteSpace="nowrap" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(inv.amount_due)}</Td>
                    <Td whiteSpace="nowrap" textAlign="center" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                      {(() => {
                        const status = getStatus(inv);
                        let badgeProps = {};
                        let badgeText = status;
                        if (status === 'Past Due') {
                          badgeProps = { bg: 'red.50', border: '1px solid', borderColor: 'red.400', color: 'red.700' };
                        } else if (status === 'Void') {
                          badgeProps = { bg: 'yellow.50', border: '1px solid', borderColor: 'yellow.400', color: 'yellow.700' };
                        } else if (status === 'Paid') {
                          badgeProps = { bg: 'green.50', border: '1px solid', borderColor: 'green.400', color: 'green.700' };
                        } else if (status === 'Open') {
                          badgeProps = { bg: 'blue.50', border: '1px solid', borderColor: 'blue.400', color: 'blue.700' };
                        } else if (status === 'Draft') {
                          badgeProps = { bg: 'gray.100', border: '1px solid', borderColor: 'gray.400', color: 'gray.700' };
                        } else {
                          badgeProps = { bg: 'gray.50', border: '1px solid', borderColor: 'gray.300', color: 'gray.600' };
                        }
                        return (
                          <Box display="inline-block" px={2} py={1} borderRadius="md" fontWeight="bold" {...badgeProps} fontSize={{ base: 'xs', md: 'sm' }}>
                            {badgeText}
                          </Box>
                        );
                      })()}
                    </Td>
                    <Td maxW="140px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{inv.number || inv.id}</Td>
                    <Td whiteSpace="nowrap">
                      {inv.hosted_invoice_url ? (
                        <Button size={{ base: 'xs', md: 'sm' }} leftIcon={<ExternalLinkIcon />} colorScheme="green" variant="outline" onClick={e => { e.stopPropagation(); handleViewInvoice(inv); }}>
                          View
                        </Button>
                      ) : (
                        <Text color="gray.400">N/A</Text>
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )
      )}
      {/* Pagination */}
      {pageCount > 1 && (
        <Box w="100%" maxW="1200px" px={6} display="flex" flexDirection="column" alignItems="center" mt={2} gap={2}>
          <Box display="flex" alignItems="center" gap={2}>
            <Button onClick={() => setPage(page - 1)} isDisabled={page === 1} size="sm" leftIcon={<ChevronLeftIcon />}>
              Previous
            </Button>
            <ButtonGroup size="sm" variant="outline">
              {Array.from({ length: pageCount }, (_, i) => (
                <Button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  colorScheme={page === i + 1 ? 'green' : undefined}
                  variant={page === i + 1 ? 'solid' : 'outline'}
                >
                  {i + 1}
                </Button>
              ))}
            </ButtonGroup>
            <Button onClick={() => setPage(page + 1)} isDisabled={page === pageCount} size="sm" rightIcon={<ChevronRightIcon />}>
              Next
            </Button>
          </Box>
          <Box mt={1} display="flex" alignItems="center" gap={2}>
            <Text fontSize="sm">Rows per page:</Text>
            <Select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} size="sm" width="80px">
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </Select>
          </Box>
        </Box>
      )}
      <Button onClick={handleLogout} colorScheme="red" variant="outline" mt={6} isLoading={loggingOut}>
        Logout
      </Button>
      <Button as={Link} href="/admin" leftIcon={<ArrowBackIcon />} colorScheme="red" variant="outline" mt={4}>
        Back
      </Button>
      {/* Invoice Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size={isMobile ? 'full' : 'md'} isCentered>
        <ModalOverlay />
        <ModalContent maxW={isMobile ? 'xs' : undefined}>
          <ModalHeader>Invoice Actions</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedInvoice?.hosted_invoice_url ? (
              <Text mb={4}>You can view or download the invoice using the buttons below.</Text>
            ) : (
              <Text>No invoice available.</Text>
            )}
          </ModalBody>
          <ModalFooter>
            {selectedInvoice?.hosted_invoice_url && (
              <>
                <Button as="a" href={selectedInvoice.hosted_invoice_url} target="_blank" rel="noopener noreferrer" leftIcon={<ExternalLinkIcon />} colorScheme="green" variant="solid" mr={3}>
                  Open Invoice
                </Button>
                <Button as="a" href={selectedInvoice.hosted_invoice_url + '/pdf'} target="_blank" rel="noopener noreferrer" leftIcon={<DownloadIcon />} colorScheme="green" variant="outline" mr={3} download>
                  Download PDF
                </Button>
              </>
            )}
            <Button onClick={handleCloseModal} variant="outline">Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Invoice Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={handleCloseDetails} size={isMobile ? 'full' : 'lg'} isCentered>
        <ModalOverlay />
        <ModalContent maxW={isMobile ? 'xs' : undefined}>
          <ModalHeader>Invoice Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailsInvoice && (
              <Box>
                {/* Status Banner */}
                {(() => {
                  const status = getStatus(detailsInvoice);
                  let bannerProps = {};
                  let bannerText = status;
                  let extra = null;
                  if (status === 'Past Due') {
                    bannerProps = { bg: 'red.500', color: 'white' };
                    if (detailsInvoice.due_date) {
                      const daysOverdue = Math.floor((Date.now() - detailsInvoice.due_date * 1000) / (1000 * 60 * 60 * 24));
                      extra = daysOverdue > 0 ? ` – ${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue` : '';
                    }
                  } else if (status === 'Paid') {
                    bannerProps = { bg: 'green.500', color: 'white' };
                  } else if (status === 'Void') {
                    bannerProps = { bg: 'yellow.400', color: 'black' };
                  } else if (status === 'Open') {
                    bannerProps = { bg: 'blue.500', color: 'white' };
                  } else if (status === 'Draft') {
                    bannerProps = { bg: 'gray.400', color: 'white' };
                  } else {
                    bannerProps = { bg: 'gray.200', color: 'black' };
                  }
                  return (
                    <Box mb={4} p={3} borderRadius="md" fontWeight="bold" fontSize="lg" textAlign="center" {...bannerProps}>
                      {bannerText}{extra}
                    </Box>
                  );
                })()}
                {/* Key Info Section */}
                <Box mb={4} p={4} bg="gray.50" borderRadius="lg">
                  <Box display="flex" flexWrap="wrap" gap={4} mb={2}>
                    <Box flex="1 1 220px">
                      <Text fontWeight="bold" color="gray.600">Invoice Number</Text>
                      <Text>{detailsInvoice.number || detailsInvoice.id}</Text>
                    </Box>
                    {/* Related Quote Section */}
                    {detailsInvoice.quote_id && (
                      <Box flex="1 1 220px">
                        <Text fontWeight="bold" color="gray.600">Related Quote</Text>
                        <Text as="a" href={`https://dashboard.stripe.com/quotes/${detailsInvoice.quote_id}`} target="_blank" rel="noopener noreferrer" color="blue.600" textDecoration="underline">
                          {detailsInvoice.quote_number || detailsInvoice.quote_id}
                        </Text>
                      </Box>
                    )}
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={4}>
                    <Box flex="1 1 220px">
                      <Text fontWeight="bold" color="gray.600">Customer Name</Text>
                      <Text>{detailsInvoice.customer_name}</Text>
                    </Box>
                    <Box flex="1 1 220px">
                      <Text fontWeight="bold" color="gray.600">Customer Email</Text>
                      <Text>{detailsInvoice.customer_email}</Text>
                    </Box>
                  </Box>
                  <Box display="flex" flexWrap="wrap" gap={4} mt={2}>
                    <Box flex="1 1 120px">
                      <Text fontWeight="bold" color="gray.600">Created</Text>
                      <Text>{formatDate(detailsInvoice.created)}</Text>
                    </Box>
                    <Box flex="1 1 120px">
                      <Text fontWeight="bold" color="gray.600">Due</Text>
                      <Text>{formatDate(detailsInvoice.due_date)}</Text>
                    </Box>
                    <Box flex="1 1 120px">
                      <Text fontWeight="bold" color="gray.600">Amount</Text>
                      <Text>{formatAmount(detailsInvoice.amount_due)}</Text>
                    </Box>
                  </Box>
                </Box>
                {/* Notes Section */}
                <Box mb={4}>
                  <Text fontWeight="bold" mb={1} color="gray.700">Notes</Text>
                  {editingNotes ? (
                    <Box>
                      <Input
                        value={notesValue}
                        onChange={e => setNotesValue(e.target.value)}
                        bg="white"
                        borderColor="#003f2d"
                        _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 1px #14543a' }}
                        fontSize="sm"
                        mb={2}
                      />
                      <Button size="sm" colorScheme="green" isLoading={notesLoading} mr={2}
                        onClick={async () => {
                          setNotesLoading(true);
                          try {
                            const res = await fetch('/api/list-stripe-invoices', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ invoiceId: detailsInvoice.id, notes: notesValue }),
                            });
                            const data = await res.json();
                            if (data.success) {
                              toast({ title: 'Notes updated', status: 'success', duration: 2000, isClosable: true });
                              setDetailsInvoice((prev: any) => ({ ...prev, notes: notesValue }));
                              setEditingNotes(false);
                            } else {
                              toast({ title: 'Error updating notes', description: data.error, status: 'error', duration: 3000, isClosable: true });
                            }
                          } catch (err) {
                            toast({ title: 'Error updating notes', status: 'error', duration: 3000, isClosable: true });
                          } finally {
                            setNotesLoading(false);
                          }
                        }}
                      >Save</Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingNotes(false); setNotesValue(detailsInvoice.notes || ''); }}>Cancel</Button>
                    </Box>
                  ) : (
                    <Box display="flex" alignItems="center" gap={2}>
                      {detailsInvoice.notes ? (
                        <Box p={2} bg="gray.100" borderRadius="md" fontSize="sm">{detailsInvoice.notes}</Box>
                      ) : (
                        <Text color="gray.400" fontSize="sm">No notes attached to this invoice.</Text>
                      )}
                      <Button size="xs" variant="outline" onClick={() => setEditingNotes(true)} ml={2}>Edit</Button>
                    </Box>
                  )}
                </Box>
                {/* Line Items Section */}
                {detailsInvoice.lines && detailsInvoice.lines.length > 0 && (
                  <Box mb={4}>
                    <Text fontWeight="bold" mb={2} color="gray.700">Line Items</Text>
                    <Box overflowX="auto">
                      <Table size="sm" variant="simple" bg="white" borderRadius="md" boxShadow="sm">
                        <Thead>
                          <Tr>
                            <Th>Description</Th>
                            <Th isNumeric>Amount</Th>
                            <Th isNumeric>Quantity</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {detailsInvoice.lines.map((item: any, idx: number) => (
                            <Tr key={idx}>
                              <Td>{item.description}</Td>
                              <Td isNumeric>{formatAmount(item.amount)}</Td>
                              <Td isNumeric>{item.quantity || 1}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                )}
                {/* Payment History Section */}
                {detailsInvoice.payments && detailsInvoice.payments.length > 0 && (
                  <Box mb={2}>
                    <Text fontWeight="bold" mb={2} color="gray.700">Payment History</Text>
                    <Box overflowX="auto">
                      <Table size="sm" variant="simple" bg="white" borderRadius="md" boxShadow="sm">
                        <Thead>
                          <Tr>
                            <Th>Date</Th>
                            <Th isNumeric>Amount</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {detailsInvoice.payments.map((p: any, idx: number) => (
                            <Tr key={idx}>
                              <Td>{formatDate(p.date)}</Td>
                              <Td isNumeric>{formatAmount(p.amount)}</Td>
                              <Td>{p.status}</Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </Box>
                )}
                {/* Billing & Shipping Section */}
                <Box mb={4}>
                  <Text fontWeight="bold" mb={1} color="gray.700">Billing Details</Text>
                  {detailsInvoice.customer_address ? (
                    <Box p={2} bg="gray.100" borderRadius="md" fontSize="sm">
                      {detailsInvoice.customer_name && <Box fontWeight="bold">{detailsInvoice.customer_name}</Box>}
                      {detailsInvoice.customer_email && <Box color="gray.600">{detailsInvoice.customer_email}</Box>}
                      {formatAddress(detailsInvoice.customer_address)}
                      {detailsInvoice.customer_address.phone && <Box mt={1}>{detailsInvoice.customer_address.phone}</Box>}
                    </Box>
                  ) : (
                    <Text color="gray.400" fontSize="sm">No billing address on file.</Text>
                  )}
                </Box>
                <Box mb={4}>
                  <Text fontWeight="bold" mb={1} color="gray.700">Shipping Details</Text>
                  {detailsInvoice.customer_shipping ? (
                    <Box p={2} bg="gray.100" borderRadius="md" fontSize="sm">
                      {detailsInvoice.customer_shipping.name && <Box fontWeight="bold">{detailsInvoice.customer_shipping.name}</Box>}
                      {detailsInvoice.customer_shipping.phone && <Box color="gray.600">{detailsInvoice.customer_shipping.phone}</Box>}
                      {formatAddress(detailsInvoice.customer_shipping.address)}
                    </Box>
                  ) : detailsInvoice.shipping_details ? (
                    <Box p={2} bg="gray.100" borderRadius="md" fontSize="sm">
                      {formatAddress(detailsInvoice.shipping_details)}
                    </Box>
                  ) : (
                    <Text color="gray.400" fontSize="sm">No shipping details on file.</Text>
                  )}
                </Box>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseDetails} variant="outline">Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 