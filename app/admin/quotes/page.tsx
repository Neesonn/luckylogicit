'use client';
import { useEffect, useState } from 'react';
import { Box, Heading, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, Text, Button, ButtonGroup, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, Input, InputGroup, InputLeftElement, Select, Checkbox, useToast, IconButton, useBreakpointValue, VStack, HStack, Tooltip } from '@chakra-ui/react';
import { ArrowBackIcon, ExternalLinkIcon, DownloadIcon, SearchIcon, TriangleDownIcon, TriangleUpIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import { FaLock, FaUnlock } from 'react-icons/fa';
import { useLock } from '../../../components/LockContext';
import { useStripeData } from '../../../components/StripeDataContext';
import GlassCard from '../../../components/GlassCard';
import StickyNavBar from '../../../components/StickyNavBar';

export default function QuotesPage() {
  const { quotes, loading, error, refresh, products } = useStripeData();
  const [loggingOut, setLoggingOut] = useState(false);
  const [filter, setFilter] = useState('all');
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('created');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [dateField, setDateField] = useState<'created' | 'expires_at'>('created');
  const [dateStart, setDateStart] = useState<string>('');
  const [dateEnd, setDateEnd] = useState<string>('');
  const [hideCanceled, setHideCanceled] = useState(true);
  const [detailsQuote, setDetailsQuote] = useState<any | null>(null);
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

  function getStatus(quote: any) {
    if (quote.status === 'open' && quote.expires_at && quote.expires_at * 1000 < Date.now()) {
      return 'Expired';
    }
    return quote.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  }

  // Filtered quotes
  const filteredQuotes = (quotes ?? []).filter(quote => {
    // Hide Canceled filter
    if (hideCanceled && getStatus(quote) === 'Canceled') return false;
    // Status filter
    if (filter !== 'all') {
      if (filter === 'expired' && getStatus(quote) !== 'Expired') return false;
      if (filter !== 'expired' && getStatus(quote).toLowerCase() !== filter.replace('_', ' ')) return false;
    }
    // Date range filter
    if (dateStart || dateEnd) {
      const ts = quote[dateField] ? new Date(quote[dateField] * 1000) : null;
      if (dateStart && (!ts || ts < new Date(dateStart))) return false;
      if (dateEnd && (!ts || ts > new Date(dateEnd + 'T23:59:59'))) return false;
    }
    // Search filter
    if (search.trim() !== '') {
      const term = search.trim().toLowerCase();
      const fields = [
        quote.customer_name,
        quote.customer_email,
        quote.number,
        quote.id,
        getStatus(quote),
        formatDate(quote.created),
        formatDate(quote.expires_at),
        formatAmount(quote.amount_total),
      ];
      if (!fields.some(f => (f || '').toString().toLowerCase().includes(term))) return false;
    }
    return true;
  });
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(filteredQuotes.length / pageSize);

  // Summary calculations
  const totalOpen = (filteredQuotes ?? []).filter(quote => getStatus(quote) === 'Open').reduce((sum, quote) => sum + quote.amount_total, 0);
  const totalExpired = (filteredQuotes ?? []).filter(quote => getStatus(quote) === 'Expired').reduce((sum, quote) => sum + quote.amount_total, 0);
  const totalAccepted = (filteredQuotes ?? []).filter(quote => getStatus(quote) === 'Accepted').reduce((sum, quote) => sum + quote.amount_total, 0);
  const totalDraft = (filteredQuotes ?? []).filter(quote => getStatus(quote) === 'Draft').reduce((sum, quote) => sum + quote.amount_total, 0);

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

  // Sort filteredQuotes before paginating
  const sortedQuotes = [...(filteredQuotes ?? [])].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    if (sortBy === 'customer_name' || sortBy === 'customer_email' || sortBy === 'status' || sortBy === 'number') {
      aVal = (aVal || '').toString().toLowerCase();
      bVal = (bVal || '').toString().toLowerCase();
    }
    if (sortBy === 'amount_total') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    if (sortBy === 'created' || sortBy === 'expires_at') {
      aVal = Number(aVal);
      bVal = Number(bVal);
    }
    if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedQuotes = sortedQuotes.slice((page - 1) * pageSize, page * pageSize);

  const handleLogout = async () => {
    setLoggingOut(true);
    await fetch('/api/admin-logout', { method: 'POST' });
    window.location.href = '/';
  };

  // Reset page to 1 when filter changes
  useEffect(() => { setPage(1); }, [filter, quotes]);

  const handleViewQuote = (quote: any) => {
    setSelectedQuote(quote);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedQuote(null);
  };

  const handleRowClick = (quote: any) => {
    setDetailsQuote(quote);
    setIsDetailsOpen(true);
  };
  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setDetailsQuote(null);
  };

  useEffect(() => {
    if (detailsQuote) {
      setNotesValue(detailsQuote.description || '');
      setEditingNotes(false);
    }
  }, [detailsQuote]);

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

  // Add helper function for days until expiry
  function getDaysUntilExpiry(quote: any) {
    if (!quote.expires_at) return null;
    const expiry = new Date(quote.expires_at * 1000);
    const today = new Date();
    expiry.setHours(0,0,0,0);
    today.setHours(0,0,0,0);
    const diff = Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  }

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start" bg="gray.50" px={4} py={10}>
      {/* Banner */}
      <Box w="100%" maxW="1200px" mb={8} px={6}>
        <Box bg="#003f2d" color="white" py={6} px={8} borderRadius="2xl" boxShadow="lg" textAlign="center">
          <Box display="flex" alignItems="center" justifyContent="center" gap={3} mb={2}>
            <Heading as="h1" size="xl" fontWeight="bold" letterSpacing="tight" color="white" m={0}>
              Quotes
            </Heading>
          </Box>
          <Box display="flex" flexWrap="wrap" justifyContent="center" gap={6} mt={2}>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Open</Text>
              <Text fontWeight="bold" fontSize="lg" color="yellow.200" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalOpen)}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Accepted</Text>
              <Text fontWeight="bold" fontSize="lg" color="green.200" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalAccepted)}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Expired</Text>
              <Text fontWeight="bold" fontSize="lg" color="red.200" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalExpired)}</Text>
            </Box>
            <Box>
              <Text fontSize="sm" color="gray.200">Total Draft</Text>
              <Text fontWeight="bold" fontSize="lg" color="yellow.100" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(totalDraft)}</Text>
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
              placeholder="Search quotes..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              bg="white"
              borderColor="#003f2d"
              _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 1px #14543a' }}
              size="md"
            />
          </InputGroup>
          <Select value={dateField} onChange={e => setDateField(e.target.value as 'created' | 'expires_at')} size="md" maxW={{ base: '100%', sm: '120px' }} bg="white" borderColor="#003f2d">
            <option value="created">Created</option>
            <option value="expires_at">Expires</option>
          </Select>
          <Input type="date" value={dateStart} onChange={e => setDateStart(e.target.value)} size="md" maxW={{ base: '100%', sm: '140px' }} bg="white" borderColor="#003f2d" />
          <Text mx={1} display={{ base: 'none', sm: 'inline' }}>to</Text>
          <Input type="date" value={dateEnd} onChange={e => setDateEnd(e.target.value)} size="md" maxW={{ base: '100%', sm: '140px' }} bg="white" borderColor="#003f2d" />
          <Checkbox ml={{ base: 0, sm: 4 }} isChecked={hideCanceled} onChange={e => setHideCanceled(e.target.checked)} colorScheme="green">
            Hide Canceled
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
            All Quotes
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
            onClick={() => setFilter('expired')}
            bg={filter === 'expired' ? '#003f2d' : 'transparent'}
            color={filter === 'expired' ? 'white' : '#003f2d'}
            borderColor="#003f2d"
            _hover={{ bg: filter === 'expired' ? '#14543a' : 'rgba(0,63,45,0.08)' }}
            fontWeight="bold"
          >
            Expired
          </Button>
          <Button
            onClick={() => setFilter('accepted')}
            bg={filter === 'accepted' ? '#003f2d' : 'transparent'}
            color={filter === 'accepted' ? 'white' : '#003f2d'}
            borderColor="#003f2d"
            _hover={{ bg: filter === 'accepted' ? '#14543a' : 'rgba(0,63,45,0.08)' }}
            fontWeight="bold"
          >
            Accepted
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
            {paginatedQuotes.map(quote => (
              <GlassCard key={quote.id} w="100%" p={4} borderRadius="lg" boxShadow="md">
                <Box mb={2}>
                  <Text fontSize="xs" color="brand.green" fontWeight="bold">
                    Quote: {quote.number || quote.id}
                  </Text>
                </Box>
                <VStack align="start" spacing={1} mb={2}>
                  <Text fontWeight="bold">{quote.customer_name || <Text as="span" color="gray.400">(No name)</Text>}</Text>
                  <Text>{quote.customer_email || <Text as="span" color="gray.400">(No email)</Text>}</Text>
                  <Text fontSize="sm" color="gray.600">Created: {formatDate(quote.created)}</Text>
                  <Text fontSize="sm" color="gray.600">Expires: {formatDate(quote.expires_at)}</Text>
                  <Text fontSize="sm" color="gray.600">Amount: {formatAmount(quote.amount_total)}</Text>
                  <Box display="inline-block" px={2} py={1} borderRadius="md" fontWeight="bold" fontSize="sm" mt={1} {...(() => {
                    const status = getStatus(quote);
                    if (status === 'Expired') return { bg: 'red.50', border: '1px solid', borderColor: 'red.400', color: 'red.700' };
                    if (status === 'Canceled') return { bg: 'gray.50', border: '1px solid', borderColor: 'gray.400', color: 'gray.700' };
                    if (status === 'Draft') return { bg: 'yellow.50', border: '1px solid', borderColor: 'yellow.400', color: 'yellow.700' };
                    if (status === 'Accepted') return { bg: 'green.50', border: '1px solid', borderColor: 'green.400', color: 'green.700' };
                    if (status === 'Open') return { bg: 'blue.50', border: '1px solid', borderColor: 'blue.400', color: 'blue.700' };
                    return { bg: 'gray.50', border: '1px solid', borderColor: 'gray.300', color: 'gray.600' };
                  })()}>{getStatus(quote)}</Box>
                </VStack>
                <HStack w="100%" spacing={3} mt={2}>
                  {quote.hosted_quote_url ? (
                    <Button
                      leftIcon={<ExternalLinkIcon />} size="md" colorScheme="green" variant="solid" flex={1}
                      onClick={e => { e.stopPropagation(); handleViewQuote(quote); }}
                    >View</Button>
                  ) : (
                    <Button size="md" colorScheme="gray" variant="outline" flex={1} isDisabled>
                      N/A
                    </Button>
                  )}
                  {quote.hosted_quote_url && (
                    <Button
                      leftIcon={<DownloadIcon />} size="md" colorScheme="green" variant="outline" flex={1}
                      as="a"
                      href={quote.hosted_quote_url + '/pdf'}
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
                  <Th color="white" cursor="pointer" onClick={() => handleSort('expires_at')} minW="90px" maxW="110px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>
                    Expires {getSortIcon('expires_at')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('amount_total')} minW="80px" maxW="100px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>
                    Amount {getSortIcon('amount_total')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('status')} minW="80px" maxW="100px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>
                    Status {getSortIcon('status')}
                  </Th>
                  <Th color="white" cursor="pointer" onClick={() => handleSort('number')} minW="100px" maxW="140px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" fontSize={{ base: 'xs', md: 'sm' }}>
                    Quote {getSortIcon('number')}
                  </Th>
                  <Th color="white" borderTopRightRadius="2xl" minW="110px" maxW="120px" whiteSpace="nowrap" fontSize={{ base: 'xs', md: 'sm' }}>View Quote</Th>
                </Tr>
              </Thead>
              <Tbody fontSize={{ base: 'xs', md: 'sm' }}>
                {paginatedQuotes.map((quote, idx) => {
                  return (
                    <Tr key={quote.id} _hover={{ bg: 'green.50', cursor: 'pointer' }} onClick={() => handleRowClick(quote)}>
                      <Td maxW="180px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{quote.customer_name || <Text color="gray.400">(No name)</Text>}</Td>
                      <Td maxW="220px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{quote.customer_email || <Text color="gray.400">(No email)</Text>}</Td>
                      <Td whiteSpace="nowrap">{formatDate(quote.created)}</Td>
                      <Td whiteSpace="nowrap">{formatDate(quote.expires_at)}</Td>
                      <Td whiteSpace="nowrap" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(quote.amount_total)}</Td>
                      <Td whiteSpace="nowrap" textAlign="center" style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                        {(() => {
                          const status = getStatus(quote);
                          let badgeProps = {};
                          if (status === 'Expired') badgeProps = { bg: 'red.50', border: '1px solid', borderColor: 'red.400', color: 'red.700' };
                          else if (status === 'Canceled') badgeProps = { bg: 'gray.50', border: '1px solid', borderColor: 'gray.400', color: 'gray.700' };
                          else if (status === 'Draft') badgeProps = { bg: 'yellow.50', border: '1px solid', borderColor: 'yellow.400', color: 'yellow.700' };
                          else if (status === 'Accepted') badgeProps = { bg: 'green.50', border: '1px solid', borderColor: 'green.400', color: 'green.700' };
                          else if (status === 'Open') badgeProps = { bg: 'blue.50', border: '1px solid', borderColor: 'blue.400', color: 'blue.700' };
                          else badgeProps = { bg: 'gray.50', border: '1px solid', borderColor: 'gray.300', color: 'gray.600' };
                          return <Box display="inline-block" px={2} py={1} borderRadius="md" fontWeight="bold" fontSize="xs" {...badgeProps}>{status}</Box>;
                        })()}
                      </Td>
                      <Td maxW="140px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">{quote.number || quote.id}</Td>
                      <Td whiteSpace="nowrap">
                        {quote.status === 'open' ? (
                          <HStack spacing={2}>
                            <Tooltip label="View Quote" hasArrow>
                              <IconButton
                                as="a"
                                href={quote.hosted_quote_url || `https://dashboard.stripe.com/quotes/${quote.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="View Quote"
                                icon={<ExternalLinkIcon />}
                                size="sm"
                                colorScheme="green"
                                variant="solid"
                              />
                            </Tooltip>
                            {quote.hosted_quote_url ? (
                              <Tooltip label="Download PDF" hasArrow>
                                <IconButton
                                  as="a"
                                  href={quote.hosted_quote_url + '/pdf'}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  aria-label="Download PDF"
                                  icon={<DownloadIcon />}
                                  size="sm"
                                  colorScheme="blue"
                                  variant="outline"
                                />
                              </Tooltip>
                            ) : (
                              <Tooltip label="PDF download only available for finalized quotes." hasArrow>
                                <IconButton
                                  aria-label="Download PDF"
                                  icon={<DownloadIcon />}
                                  size="sm"
                                  colorScheme="gray"
                                  variant="outline"
                                  isDisabled
                                />
                              </Tooltip>
                            )}
                          </HStack>
                        ) : (
                          <Button size="sm" colorScheme="gray" variant="outline" isDisabled>
                            N/A
                          </Button>
                        )}
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </Box>
        )
      )}
      {/* Pagination */}
      {!loading && !error && filteredQuotes.length > 0 && (
        <Box w="100%" maxW="1200px" px={{ base: 0, md: 6 }} mb={8}>
          <HStack justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600">
              Showing {((page - 1) * pageSize) + 1} to {Math.min(page * pageSize, filteredQuotes.length)} of {filteredQuotes.length} quotes
            </Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                onClick={() => setPage(page - 1)}
                isDisabled={page === 1}
                leftIcon={<ChevronLeftIcon />}
              >
                Previous
              </Button>
              <Text fontSize="sm" color="gray.600">
                Page {page} of {pageCount}
              </Text>
              <Button
                size="sm"
                onClick={() => setPage(page + 1)}
                isDisabled={page === pageCount}
                rightIcon={<ChevronRightIcon />}
              >
                Next
              </Button>
            </HStack>
          </HStack>
        </Box>
      )}

      {/* Quote Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={handleCloseDetails} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Quote Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {detailsQuote && (
              <VStack align="stretch" spacing={4}>
                <Box>
                  <Text fontWeight="bold" color="gray.700">Quote Number</Text>
                  <Text>{detailsQuote.number || detailsQuote.id}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.700">Customer</Text>
                  <Text>{detailsQuote.customer_name || '(No name)'}</Text>
                  <Text color="gray.600">{detailsQuote.customer_email || '(No email)'}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.700">Amount</Text>
                  <Text style={metricsLocked ? { filter: 'blur(8px)' } : {}}>{formatAmount(detailsQuote.amount_total)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.700">Status</Text>
                  <Box display="inline-block" px={2} py={1} borderRadius="md" fontWeight="bold" fontSize="sm" {...(() => {
                    const status = getStatus(detailsQuote);
                    if (status === 'Expired') return { bg: 'red.50', border: '1px solid', borderColor: 'red.400', color: 'red.700' };
                    if (status === 'Draft') return { bg: 'yellow.50', border: '1px solid', borderColor: 'yellow.400', color: 'yellow.700' };
                    if (status === 'Accepted') return { bg: 'green.50', border: '1px solid', borderColor: 'green.400', color: 'green.700' };
                    if (status === 'Open') return { bg: 'blue.50', border: '1px solid', borderColor: 'blue.400', color: 'blue.700' };
                    return { bg: 'gray.50', border: '1px solid', borderColor: 'gray.300', color: 'gray.600' };
                  })()}>{getStatus(detailsQuote)}</Box>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.700">Created</Text>
                  <Text>{formatDate(detailsQuote.created)}</Text>
                </Box>
                <Box>
                  <Text fontWeight="bold" color="gray.700">Expires</Text>
                  <Text>{formatDate(detailsQuote.expires_at)}</Text>
                </Box>
                {detailsQuote.description && (
                  <Box>
                    <Text fontWeight="bold" color="gray.700">Description</Text>
                    <Text>{detailsQuote.description}</Text>
                  </Box>
                )}
                {detailsQuote.customer_address && (
                  <Box>
                    <Text fontWeight="bold" color="gray.700">Customer Address</Text>
                    <Box>{formatAddress(detailsQuote.customer_address)}</Box>
                  </Box>
                )}
                {detailsQuote.lines && detailsQuote.lines.length > 0 && (
                  <Box>
                    <Text fontWeight="bold" color="gray.700">Line Items</Text>
                    <VStack align="stretch" spacing={2}>
                      {detailsQuote.lines.map((line: any, index: number) => {
                        // Try to match by product ID, default_price, or name/description
                        const matchedProduct = products?.find(
                          p =>
                            (line.price && p.default_price && (typeof p.default_price === 'string'
                              ? p.default_price === line.price
                              : p.default_price.id === line.price)) ||
                            (line.product && p.id === line.product) ||
                            (p.name === line.description)
                        );
                        return (
                          <Box key={index} p={3} border="1px solid" borderColor="gray.200" borderRadius="md">
                            <Text fontWeight="medium">
                              {matchedProduct ? (
                                <>
                                  {matchedProduct.name}{' '}
                                  <a
                                    href={`https://dashboard.stripe.com/products/${matchedProduct.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ color: '#3182ce', textDecoration: 'underline', fontSize: '0.9em' }}
                                  >
                                    (View in Stripe)
                                  </a>
                                </>
                              ) : (
                                line.description
                              )}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Quantity: {line.quantity} × {matchedProduct ? matchedProduct.price_formatted : (line.amount ? `$${(line.amount / 100).toFixed(2)}` : '')}
                            </Text>
                            {matchedProduct && (
                              <Text fontSize="sm" color="gray.500">
                                {matchedProduct.description}
                              </Text>
                            )}
                          </Box>
                        );
                      })}
                    </VStack>
                  </Box>
                )}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseDetails}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* View Quote Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>View Quote</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedQuote && selectedQuote.hosted_quote_url && (
              <Box>
                <Text mb={4}>Opening quote in new window...</Text>
                <Button
                  as="a"
                  href={selectedQuote.hosted_quote_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  colorScheme="green"
                  leftIcon={<ExternalLinkIcon />}
                >
                  Open Quote
                </Button>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleCloseModal}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <StickyNavBar />
    </Box>
  );
} 