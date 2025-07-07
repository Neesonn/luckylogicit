'use client';
import { useEffect, useState, useMemo } from 'react';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, IconButton, VStack, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, SimpleGrid, Badge, useToast, Tooltip, Checkbox, Skeleton } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { EditIcon, CheckIcon, CloseIcon, ArrowBackIcon, DeleteIcon, AddIcon, SearchIcon, ChevronUpIcon, ChevronDownIcon, ExternalLinkIcon, EmailIcon, PhoneIcon, InfoOutlineIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import NextLink from 'next/link';
import { useStripeData } from '../../../components/StripeDataContext';
import GlassCard from '../../../components/GlassCard';
import { FaAddressCard, FaUser } from 'react-icons/fa';
import React from 'react';

type SortField = 'name' | 'email' | 'created' | null;
type SortDirection = 'asc' | 'desc';

function getStatusColor(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'planned': return 'blue';
    case 'in progress': return 'orange';
    case 'completed': return 'green';
    case 'on hold': return 'red';
    default: return 'gray';
  }
}

function getInvoiceStatus(inv: any) {
  if (inv.status === 'void') return 'Void';
  if (inv.status === 'paid') return 'Paid';
  if (inv.status === 'open' && inv.due_date && inv.due_date * 1000 < Date.now()) return 'Past Due';
  if (inv.status === 'open') return 'Open';
  return inv.status ? inv.status.charAt(0).toUpperCase() + inv.status.slice(1) : 'Unknown';
}

function getInvoiceStatusColor(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'paid': return 'green.400';
    case 'open': return 'yellow.400';
    case 'past due': return 'red.400';
    case 'void': return 'gray.400';
    default: return 'gray.300';
  }
}

function getDaysOverdue(inv: any) {
  if (!inv.due_date) return null;
  const due = new Date(inv.due_date * 1000);
  const now = new Date();
  const diff = Math.floor((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

const ProjectCard = React.memo(({ proj }: { proj: any }) => (
  <Box p={3} mb={2} borderWidth="1px" borderRadius="md" borderColor="gray.200" bg="gray.50">
    <HStack justify="space-between" align="center">
      <Box>
        <Text fontWeight="semibold" color="gray.700">{proj.name || proj.project_name}</Text>
        <Text fontSize="sm" color="gray.500">Code: {proj.code}</Text>
        <Badge colorScheme={getStatusColor(proj.status)} fontSize="xs" mt={1}>{proj.status}</Badge>
      </Box>
      <Button as={NextLink} href={`/admin/project/${proj.code}`} size="sm" colorScheme="green" variant="outline">
        View
      </Button>
    </HStack>
  </Box>
));

const InvoiceCard = React.memo(({ inv }: { inv: any }) => (
  <Box p={3} mb={2} borderWidth="1px" borderRadius="md" borderColor="gray.200" bg="gray.50">
    <HStack justify="space-between" align="center">
      <Box>
        <Text fontWeight="semibold" color="gray.700">Invoice #{inv.number || inv.id}</Text>
        <Text fontSize="sm" color="gray.500">{inv.created ? new Date(inv.created * 1000).toLocaleDateString() : 'Unknown date'}</Text>
      </Box>
      <Box textAlign="right">
        <Text fontWeight="bold" color="brand.green" fontSize="lg">${(inv.amount_due / 100).toFixed(2)}</Text>
        {inv.hosted_invoice_url && (
          <Button as={NextLink} href={inv.hosted_invoice_url} target="_blank" size="sm" leftIcon={<ExternalLinkIcon />} colorScheme="green" variant="outline" mt={1}>
            View
          </Button>
        )}
      </Box>
    </HStack>
    <Box mb={2}>
      <Box
        display="inline-block"
        px={3}
        py={1}
        borderRadius="md"
        fontWeight="bold"
        fontSize="sm"
        color={getInvoiceStatus(inv) === 'Void' ? 'gray.800' : 'white'}
        bg={getInvoiceStatusColor(getInvoiceStatus(inv))}
        mb={1}
      >
        {getInvoiceStatus(inv)}
        {getInvoiceStatus(inv) === 'Past Due' && getDaysOverdue(inv) !== null && (
          <span> – {getDaysOverdue(inv)} day{getDaysOverdue(inv) !== 1 ? 's' : ''} overdue</span>
        )}
      </Box>
    </Box>
  </Box>
));

export default function ViewCustomersPage() {
  const { customers, loading, error, refresh } = useStripeData();
  const router = useRouter();
  const toast = useToast();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [bulkDeleting, setBulkDeleting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [invoicesLoading, setInvoicesLoading] = useState(false);
  const [invoicesError, setInvoicesError] = useState<string | null>(null);
  const [customerProjects, setCustomerProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectsError, setProjectsError] = useState('');
  const [projectsCache, setProjectsCache] = useState<Record<string, any[]>>({});
  const [invoicesCache, setInvoicesCache] = useState<Record<string, any[]>>({});

  const countries = [
    { code: '', name: 'Choose a country...' },
    { code: 'AU', name: 'Australia' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    // ...add more as needed
  ];

  const australianStates = [
    'Australian Capital Territory',
    'New South Wales',
    'Northern Territory',
    'Queensland',
    'South Australia',
    'Tasmania',
    'Victoria',
    'Western Australia',
  ];

  // Sort and filter customers
  const getSortedAndFilteredCustomers = () => {
    if (!customers) return [];

    let filtered = customers.filter(customer => {
      const matchesSearch = 
        customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = filterStatus === 'all' || 
        (filterStatus === 'withPhone' && customer.phone) ||
        (filterStatus === 'withAddress' && customer.address && 
         (customer.address.line1 || customer.address.city || customer.address.state)) ||
        (filterStatus === 'complete' && customer.name && customer.email && customer.phone && 
         customer.address && (customer.address.line1 || customer.address.city));

      return matchesSearch && matchesStatus;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sortField) {
          case 'name':
            aValue = (a.name || '').toLowerCase();
            bValue = (b.name || '').toLowerCase();
            break;
          case 'email':
            aValue = (a.email || '').toLowerCase();
            bValue = (b.email || '').toLowerCase();
            break;
          case 'created':
            aValue = new Date(a.created * 1000);
            bValue = new Date(b.created * 1000);
            break;
          default:
            return 0;
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return undefined;
    return sortDirection === 'asc' ? <ChevronUpIcon /> : <ChevronDownIcon />;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSortField(null);
    setSortDirection('asc');
    setFilterStatus('all');
  };

  // Bulk action functions
  const handleSelectCustomer = (customerId: string) => {
    const newSelected = new Set(selectedCustomers);
    if (newSelected.has(customerId)) {
      newSelected.delete(customerId);
    } else {
      newSelected.add(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedCustomers.size === filteredCustomers.length) {
      setSelectedCustomers(new Set());
    } else {
      setSelectedCustomers(new Set(filteredCustomers.map(c => c.id)));
    }
  };

  const exportToCSV = () => {
    const headers = ['Customer ID', 'Name', 'Email', 'Phone', 'Address', 'Created Date'];
    const csvData = filteredCustomers.map(customer => [
      customer.id,
      customer.name || '',
      customer.email || '',
      customer.phone || '',
      customer.address ? 
        [customer.address.line1, customer.address.line2, customer.address.city, customer.address.state, customer.address.country, customer.address.postal_code]
          .filter(Boolean)
          .join(', ') : '',
      customer.created ? new Date(customer.created * 1000).toLocaleDateString() : ''
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `customers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: 'CSV Exported',
      description: `Exported ${filteredCustomers.length} customers to CSV file.`,
      status: 'success',
      duration: 3000,
      isClosable: true,
    });
  };

  const startBulkDelete = () => {
    if (selectedCustomers.size === 0) return;
    setIsBulkDeleteModalOpen(true);
  };

  const cancelBulkDelete = () => {
    setIsBulkDeleteModalOpen(false);
  };

  const confirmBulkDelete = async () => {
    if (selectedCustomers.size === 0) return;
    setBulkDeleting(true);
    
    try {
      const deletePromises = Array.from(selectedCustomers).map(id =>
        fetch('/api/delete-stripe-customer', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id }),
        }).then(r => r.json())
      );

      const results = await Promise.all(deletePromises);
      const successCount = results.filter(r => r.success).length;
      const failedCount = results.length - successCount;

      setSelectedCustomers(new Set());
      setIsBulkDeleteModalOpen(false);
      await refresh();

      if (failedCount === 0) {
        toast({
          title: 'Bulk Delete Successful',
          description: `Successfully deleted ${successCount} customers.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Bulk Delete Partial',
          description: `Deleted ${successCount} customers, ${failedCount} failed.`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Bulk Delete Failed',
        description: 'Something went wrong during bulk deletion.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setBulkDeleting(false);
    }
  };

  const filteredCustomers = getSortedAndFilteredCustomers();

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  const startEdit = (customer: any) => {
    setEditId(customer.id);
    setEditData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: {
        line1: customer.address?.line1 || '',
        line2: customer.address?.line2 || '',
        city: customer.address?.city || '',
        state: customer.address?.state || '',
        postal_code: customer.address?.postal_code || '',
        country: customer.address?.country || '',
      },
    });
    setIsEditModalOpen(true);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
    setIsEditModalOpen(false);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditAddressChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    try {
      const res = await fetch('/api/update-stripe-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editData }),
      });
      const data = await res.json();
      if (data.success) {
        setEditId(null);
        setEditData({});
        setIsEditModalOpen(false);
        await refresh();
        toast({
          title: 'Customer Updated',
          description: 'Customer information has been successfully updated.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Update Failed',
          description: data.error || 'Failed to update customer.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Update Failed',
        description: 'Something went wrong while updating the customer.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setSaving(false);
    }
  };

  const startDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const cancelDelete = () => {
    setDeleteId(null);
    setIsDeleteModalOpen(false);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await fetch('/api/delete-stripe-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteId }),
      });
      const data = await res.json();
      if (data.success) {
        setDeleteId(null);
        setIsDeleteModalOpen(false);
        
        // Refresh the customer data in the context
        // This will update the view-customers page automatically
        await refresh();
        
        toast({
          title: 'Customer Deleted',
          description: 'Customer has been successfully deleted.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: 'Delete Failed',
          description: data.error || 'Failed to delete customer.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: 'Something went wrong while deleting the customer.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    if (isProfileModalOpen && selectedCustomer?.id) {
      setProjectsLoading(true);
      setInvoicesLoading(true);
      setProjectsError('');
      setInvoicesError(null);

      // Check cache first
      const cachedProjects = projectsCache[selectedCustomer.id];
      const cachedInvoices = invoicesCache[selectedCustomer.id];
      if (cachedProjects) {
        setCustomerProjects(cachedProjects);
        setProjectsLoading(false);
      }
      if (cachedInvoices) {
        setInvoices(cachedInvoices);
        setInvoicesLoading(false);
      }
      if (cachedProjects && cachedInvoices) return;

      Promise.all([
        cachedProjects ? Promise.resolve({ success: true, projects: cachedProjects }) : fetch(`/api/projects?customer_stripe_id=${selectedCustomer.id}`).then(res => res.json()),
        cachedInvoices ? Promise.resolve({ success: true, invoices: cachedInvoices }) : fetch(`/api/list-stripe-invoices?customer_id=${selectedCustomer.id}`).then(res => res.json())
      ]).then(([projectsData, invoicesData]) => {
        // handle projects
        if (projectsData.success) {
          setCustomerProjects(projectsData.projects || []);
          setProjectsCache(prev => ({ ...prev, [selectedCustomer.id]: projectsData.projects || [] }));
        } else {
          setProjectsError(projectsData.error || 'Failed to load projects');
          setCustomerProjects([]);
        }
        setProjectsLoading(false);

        // handle invoices
        if (invoicesData.success) {
          setInvoices(invoicesData.invoices || []);
          setInvoicesCache(prev => ({ ...prev, [selectedCustomer.id]: invoicesData.invoices || [] }));
        } else {
          setInvoicesError(invoicesData.error || 'Failed to load invoices');
          setInvoices([]);
        }
        setInvoicesLoading(false);
      });
    } else {
      setCustomerProjects([]);
      setInvoices([]);
    }
  }, [isProfileModalOpen, selectedCustomer]);

  const displayedProjects = useMemo(() => customerProjects.slice(0, 5), [customerProjects]);
  const displayedInvoices = useMemo(() => invoices.slice(0, 5), [invoices]);

  return (
    <Box minH="100vh" bg="gray.50" px={{ base: 3, md: 4 }} py={{ base: 6, md: 10 }} display="flex" flexDirection="column" alignItems="center">
      {/* Header Section */}
      <Box textAlign="center" mb={{ base: 6, md: 8 }} px={{ base: 2, md: 0 }}>
        <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={3} color="brand.green" fontWeight="bold">
          Customer Management
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="600px">
          View, edit, and manage your customer accounts and billing information
        </Text>
      </Box>

      {loading ? (
        <Box textAlign="center" py={20}>
          <Spinner size="xl" color="brand.green" thickness="4px" />
          <Text mt={4} color="gray.600" fontSize="lg">Loading customers...</Text>
        </Box>
      ) : error ? (
        <GlassCard maxW="600px" w="100%">
          <Alert status="error" borderRadius="lg">
            <AlertIcon />
            <Text fontWeight="medium">{error}</Text>
          </Alert>
        </GlassCard>
      ) : (
        <GlassCard w="100%" maxW="1400px" p={{ base: 4, md: 6 }}>
          {/* Search, Sort, and Filter Bar */}
          <VStack spacing={4} align="stretch" mb={6}>
            {/* Search and Actions Row */}
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <Box flex="1" minW="250px">
                <HStack>
                  <Box position="relative" flex="1">
                    <Input
                      placeholder="Search customers by name, email, or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      pl={10}
                      size="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                      _hover={{ borderColor: 'gray.300' }}
                    />
                    <SearchIcon position="absolute" left={3} top="50%" transform="translateY(-50%)" color="gray.400" />
                  </Box>
                </HStack>
              </Box>
              <Button
                as={Link}
                href="/admin/create-customer"
                leftIcon={<AddIcon />}
                colorScheme="green"
                size={{ base: "md", md: "lg" }}
                _hover={{ 
                  transform: 'translateY(-1px)', 
                  boxShadow: '0 4px 12px rgba(0, 63, 45, 0.3)'
                }}
                transition="all 0.2s ease-in-out"
              >
                Add Customer
              </Button>
            </HStack>

            {/* Sort and Filter Row */}
            <HStack justify="space-between" flexWrap="wrap" gap={4}>
              <HStack spacing={4} flexWrap="wrap">
                {/* Sort Options */}
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">Sort by:</Text>
                  <Button
                    size="sm"
                    variant={sortField === 'name' ? 'solid' : 'outline'}
                    colorScheme={sortField === 'name' ? 'blue' : 'gray'}
                    onClick={() => handleSort('name')}
                    rightIcon={getSortIcon('name')}
                  >
                    Name
                  </Button>
                  <Button
                    size="sm"
                    variant={sortField === 'email' ? 'solid' : 'outline'}
                    colorScheme={sortField === 'email' ? 'blue' : 'gray'}
                    onClick={() => handleSort('email')}
                    rightIcon={getSortIcon('email')}
                  >
                    Email
                  </Button>
                  <Button
                    size="sm"
                    variant={sortField === 'created' ? 'solid' : 'outline'}
                    colorScheme={sortField === 'created' ? 'blue' : 'gray'}
                    onClick={() => handleSort('created')}
                    rightIcon={getSortIcon('created')}
                  >
                    Date Created
                  </Button>
                </HStack>

                {/* Filter Options */}
                <HStack spacing={2}>
                  <Text fontSize="sm" color="gray.600" fontWeight="medium">Filter:</Text>
                  <Select
                    size="sm"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    borderWidth="2px"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    maxW="200px"
                  >
                    <option value="all">All Customers</option>
                    <option value="withPhone">With Phone</option>
                    <option value="withAddress">With Address</option>
                    <option value="complete">Complete Profile</option>
                  </Select>
                </HStack>
              </HStack>

              {/* Clear Filters Button */}
              {(searchTerm || sortField || filterStatus !== 'all') && (
                <Button
                  size="sm"
                  variant="ghost"
                  color="gray.500"
                  onClick={clearFilters}
                  _hover={{ color: 'gray.700' }}
                >
                  Clear Filters
                </Button>
              )}
            </HStack>
          </VStack>

          {/* Bulk Actions Bar */}
          <Box mb={4} p={3} bg="blue.50" borderWidth="1px" borderColor="blue.200" borderRadius="md">
            <HStack justify="space-between" align="center">
              <HStack spacing={4} align="center">
                <Checkbox
                  isChecked={selectedCustomers.size === filteredCustomers.length && filteredCustomers.length > 0}
                  isIndeterminate={selectedCustomers.size > 0 && selectedCustomers.size < filteredCustomers.length}
                  onChange={handleSelectAll}
                  colorScheme="blue"
                  size="md"
                >
                  <Text fontSize="sm" color="blue.700" fontWeight="medium">
                    Select All ({filteredCustomers.length} customers)
                  </Text>
                </Checkbox>
                {selectedCustomers.size > 0 && (
                  <Text fontSize="sm" color="blue.700" fontWeight="medium">
                    • {selectedCustomers.size} selected
                  </Text>
                )}
              </HStack>
              {selectedCustomers.size > 0 && (
                <HStack spacing={3}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    variant="outline"
                    onClick={exportToCSV}
                    _hover={{ transform: 'translateY(-1px)' }}
                    transition="all 0.2s ease-in-out"
                  >
                    Export Selected
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    onClick={startBulkDelete}
                    _hover={{ transform: 'translateY(-1px)' }}
                    transition="all 0.2s ease-in-out"
                  >
                    Delete Selected
                  </Button>
                </HStack>
              )}
            </HStack>
          </Box>

          {/* Customer Count and Export All */}
          <HStack justify="space-between" mb={4}>
            <Text fontSize="sm" color="gray.600" fontWeight="medium">
              {filteredCustomers.length} customer{filteredCustomers.length !== 1 ? 's' : ''} found
              {customers && customers.length !== filteredCustomers.length && (
                <Text as="span" color="gray.400"> (of {customers.length} total)</Text>
              )}
            </Text>
            {filteredCustomers.length > 0 && (
              <Button
                size="sm"
                colorScheme="green"
                variant="outline"
                onClick={exportToCSV}
                _hover={{ transform: 'translateY(-1px)' }}
                transition="all 0.2s ease-in-out"
              >
                Export All
              </Button>
            )}
          </HStack>

          {/* Desktop Table View */}
          <Box display={{ base: 'none', lg: 'block' }} overflowX="auto">
          <Table variant="simple" size="md">
            <Thead>
                <Tr bg="brand.green">
                  <Th color="white" borderTopLeftRadius="lg" fontSize="sm" fontWeight="bold" textAlign="center"></Th>
                  <Th color="white" fontSize="sm" fontWeight="bold" textAlign="center">Customer ID</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold" cursor="pointer" onClick={() => handleSort('name')}>
                    <HStack spacing={1}>
                      <Text>Name</Text>
                      {getSortIcon('name')}
                    </HStack>
                  </Th>
                  <Th color="white" fontSize="sm" fontWeight="bold" cursor="pointer" onClick={() => handleSort('email')}>
                    <HStack spacing={1}>
                      <Text>Email</Text>
                      {getSortIcon('email')}
                    </HStack>
                  </Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Phone</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold">Address</Th>
                  <Th color="white" fontSize="sm" fontWeight="bold" cursor="pointer" onClick={() => handleSort('created')}>
                    <HStack spacing={1}>
                      <Text>Created</Text>
                      {getSortIcon('created')}
                    </HStack>
                  </Th>
                  <Th color="white" borderTopRightRadius="lg" fontSize="sm" fontWeight="bold" textAlign="center">Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
                {filteredCustomers.map((c) => (
                  <Tr
                    key={c.id}
                    _hover={{ bg: 'gray.100', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                    borderBottom="1px solid #E2E8F0"
                    transition="background 0.2s, box-shadow 0.2s"
                  >
                    <Td textAlign="center">
                      <Checkbox
                        isChecked={selectedCustomers.has(c.id)}
                        onChange={() => handleSelectCustomer(c.id)}
                        colorScheme="green"
                        size="md"
                      />
                    </Td>
                    <Td>
                      <Button
                        variant="link"
                        color="brand.green"
                        fontWeight="500"
                        fontSize="sm"
                        rightIcon={<ExternalLinkIcon mx="2px" />}
                        onClick={() => { setSelectedCustomer(c); setIsProfileModalOpen(true); }}
                        _hover={{ textDecoration: 'underline', color: 'green.700' }}
                      >
                      {c.id}
                      </Button>
                  </Td>
                  <Td>
                    {editId === c.id ? (
                        <Input 
                          size="sm" 
                          value={editData.name} 
                          onChange={e => handleEditChange('name', e.target.value)}
                          borderWidth="2px"
                          borderColor="gray.200"
                          _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                        />
                      ) : (
                        <Text fontWeight="medium" color={c.name ? 'gray.800' : 'gray.400'}>
                          {c.name || '(No name)'}
                        </Text>
                      )}
                  </Td>
                  <Td>
                    {editId === c.id ? (
                        <Input 
                          size="sm" 
                          value={editData.email} 
                          onChange={e => handleEditChange('email', e.target.value)}
                          borderWidth="2px"
                          borderColor="gray.200"
                          _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                        />
                      ) : (
                        <Text color={c.email ? 'gray.700' : 'gray.400'} fontSize="sm">
                          {c.email || '(No email)'}
                        </Text>
                      )}
                  </Td>
                  <Td>
                    {editId === c.id ? (
                        <Input 
                          size="sm" 
                          value={editData.phone || ''} 
                          onChange={e => handleEditChange('phone', e.target.value)}
                          borderWidth="2px"
                          borderColor="gray.200"
                          _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                        />
                      ) : (
                        c.phone ? (
                          <a 
                            href={`tel:${c.phone.replace(/\s+/g, '')}`}
                            style={{ 
                              color: '#003f2d', 
                              textDecoration: 'underline',
                              fontSize: '14px',
                              cursor: 'pointer'
                            }}
                          >
                            {c.phone}
                          </a>
                        ) : (
                          <Text color="gray.400" fontSize="sm" fontStyle="italic">Not provided</Text>
                        )
                      )}
                  </Td>
                  <Td>
                    {editId === c.id ? (
                      <VStack align="start" spacing={1}>
                        <Input size="sm" placeholder="Line 1" value={editData.address?.line1} onChange={e => handleEditAddressChange('line1', e.target.value)} />
                        <Input size="sm" placeholder="Line 2" value={editData.address?.line2 || ''} onChange={e => handleEditAddressChange('line2', e.target.value)} />
                        <Input size="sm" placeholder="City" value={editData.address?.city} onChange={e => handleEditAddressChange('city', e.target.value)} />
                        <Input size="sm" placeholder="State" value={editData.address?.state} onChange={e => handleEditAddressChange('state', e.target.value)} />
                        <Input size="sm" placeholder="Postal Code" value={editData.address?.postal_code} onChange={e => handleEditAddressChange('postal_code', e.target.value)} />
                        <Select size="sm" value={editData.address?.country} onChange={e => handleEditAddressChange('country', e.target.value)}>
                          {countries.map(cn => (
                            <option key={cn.code} value={cn.code}>{cn.name}</option>
                          ))}
                        </Select>
                      </VStack>
                    ) : c.address ? (
                        <Text fontSize="sm" color="gray.700" maxW="200px" noOfLines={2}>
                        {[c.address.line1, c.address.line2, c.address.city, c.address.state, c.address.country, c.address.postal_code]
                          .filter(Boolean)
                            .join(', ') || 'Not provided'}
                        </Text>
                      ) : (
                        <Text color="gray.400" fontSize="sm" fontStyle="italic">Not provided</Text>
                      )}
                  </Td>
                  <Td>
                      <Text fontSize="sm" color="gray.600">
                        {c.created ? new Date(c.created * 1000).toLocaleDateString() : 'Unknown'}
                      </Text>
                    </Td>
                    <Td textAlign="center">
                      <HStack justify="center" spacing={2}>
                        {editId === c.id ? (
                          <>
                            <Tooltip label="Save Changes" placement="top" hasArrow>
                              <IconButton 
                                aria-label="Save" 
                                icon={<CheckIcon />} 
                                size="sm" 
                                colorScheme="green" 
                                onClick={() => saveEdit(c.id)}
                                isLoading={saving}
                              />
                            </Tooltip>
                            <Tooltip label="Cancel Edit" placement="top" hasArrow>
                              <IconButton 
                                aria-label="Cancel" 
                                icon={<CloseIcon />} 
                                size="sm" 
                                variant="outline"
                                onClick={cancelEdit}
                              />
                            </Tooltip>
                          </>
                        ) : (
                          <>
                            <Tooltip label="Edit Customer" placement="top" hasArrow>
                              <IconButton 
                                aria-label="Edit" 
                                icon={<EditIcon />} 
                                size="sm" 
                                colorScheme="blue" 
                                onClick={() => startEdit(c)}
                                _hover={{ transform: 'scale(1.05)' }}
                                transition="transform 0.2s"
                              />
                            </Tooltip>
                            <Tooltip label="Delete Customer" placement="top" hasArrow>
                              <IconButton 
                                aria-label="Delete" 
                                icon={<DeleteIcon />} 
                                size="sm" 
                                colorScheme="red" 
                                onClick={() => startDelete(c.id)}
                                _hover={{ transform: 'scale(1.05)' }}
                                transition="transform 0.2s"
                              />
                            </Tooltip>
                          </>
                        )}
                      </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>

          {/* Mobile Card View */}
          <Box display={{ base: 'block', lg: 'none' }}>
            <VStack spacing={5} align="stretch">
              {filteredCustomers.map((c) => (
                <GlassCard key={c.id} p={{ base: 4, md: 5 }}>
                  <VStack align="stretch" spacing={4}>
                    <HStack justify="space-between" align="start">
                      <HStack spacing={3} align="center">
                        <Checkbox
                          isChecked={selectedCustomers.has(c.id)}
                          onChange={() => handleSelectCustomer(c.id)}
                          colorScheme="green"
                          size="lg"
                        />
                        <Box flex="1">
                          <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>Customer ID</Text>
                          <Button
                            variant="link"
                            color="brand.green"
                            fontWeight="500"
                            fontSize="sm"
                            rightIcon={<ExternalLinkIcon mx="2px" />}
                            onClick={() => { setSelectedCustomer(c); setIsProfileModalOpen(true); }}
                            _hover={{ textDecoration: 'underline', color: 'green.700' }}
                          >
                            {c.id}
                          </Button>
                        </Box>
                      </HStack>
                      <HStack spacing={3}>
                        <Tooltip label="Edit Customer" placement="top" hasArrow>
                          <IconButton 
                            aria-label="Edit" 
                            icon={<EditIcon />} 
                            size="md" 
                            colorScheme="blue" 
                            onClick={() => startEdit(c)}
                            minW="44px"
                            minH="44px"
                          />
                        </Tooltip>
                        <Tooltip label="Delete Customer" placement="top" hasArrow>
                          <IconButton 
                            aria-label="Delete" 
                            icon={<DeleteIcon />} 
                            size="md" 
                            colorScheme="red" 
                            onClick={() => startDelete(c.id)}
                            minW="44px"
                            minH="44px"
                          />
                        </Tooltip>
                      </HStack>
                    </HStack>
                    
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>Name</Text>
                      <Text fontWeight="medium" color={c.name ? 'gray.800' : 'gray.400'}>
                        {c.name || '(No name)'}
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>Email</Text>
                      <Text color={c.email ? 'gray.700' : 'gray.400'} fontSize="sm">
                        {c.email || '(No email)'}
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>Phone</Text>
                      {c.phone ? (
                        <a 
                          href={`tel:${c.phone.replace(/\s+/g, '')}`}
                          style={{ 
                            color: '#003f2d', 
                            textDecoration: 'underline',
                            fontSize: '14px',
                            cursor: 'pointer'
                          }}
                        >
                          {c.phone}
                        </a>
                      ) : (
                        <Text color="gray.400" fontSize="sm" fontStyle="italic">Not provided</Text>
                      )}
                    </Box>
                    
                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>Address</Text>
                      <Text fontSize="sm" color="gray.700">
                        {c.address ? 
                          [c.address.line1, c.address.line2, c.address.city, c.address.state, c.address.country, c.address.postal_code]
                            .filter(Boolean)
                            .join(', ') || 'Not provided'
                          : 'Not provided'
                        }
                      </Text>
                    </Box>

                    <Box>
                      <Text fontSize="xs" color="gray.500" fontWeight="medium" mb={1}>Created</Text>
                      <Text fontSize="sm" color="gray.600">
                        {c.created ? new Date(c.created * 1000).toLocaleDateString() : 'Unknown'}
                      </Text>
                    </Box>
                  </VStack>
                </GlassCard>
              ))}
            </VStack>
          </Box>

          {filteredCustomers.length === 0 && (
            <Box textAlign="center" py={12}>
              <Text color="gray.500" fontSize="lg">
                {searchTerm || filterStatus !== 'all' ? 'No customers found matching your criteria.' : 'No customers found.'}
              </Text>
              {(searchTerm || filterStatus !== 'all') && (
                <Button 
                  variant="link" 
                  color="brand.green" 
                  onClick={clearFilters}
                  mt={2}
                >
                  Clear filters
                </Button>
              )}
            </Box>
          )}
        </GlassCard>
      )}

      {/* Navigation Buttons */}
      <HStack spacing={4} mt={8}>
        <Button onClick={handleLogout} colorScheme="red" variant="outline" size={{ base: "sm", md: "md" }}>
        Logout
      </Button>
        <Button as={Link} href="/admin" leftIcon={<ArrowBackIcon />} colorScheme="red" variant="outline" size={{ base: "sm", md: "md" }}>
        Back
      </Button>
      </HStack>

      {/* Edit Modal */}
      <Modal isOpen={isEditModalOpen} onClose={cancelEdit} isCentered size='md' motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader color="brand.green" fontWeight="bold">Edit Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={4}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Name</FormLabel>
                  <Input 
                    value={editData.name} 
                    onChange={e => handleEditChange('name', e.target.value)}
                    size="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                  />
              </FormControl>
              <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Email</FormLabel>
                  <Input 
                    value={editData.email} 
                    onChange={e => handleEditChange('email', e.target.value)}
                    size="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                  />
              </FormControl>
              <FormControl>
                  <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Mobile number</FormLabel>
                  <Input 
                    value={editData.phone} 
                    onChange={e => handleEditChange('phone', e.target.value)}
                    size="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                  />
              </FormControl>
              </SimpleGrid>
              
              <Box borderWidth="1px" borderColor="gray.200" borderRadius="lg" p={4} bg="gray.50">
                <Text fontSize="sm" fontWeight="semibold" color="brand.green" mb={3}>Address Information</Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
              <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Address Line 1</FormLabel>
                    <Input 
                      value={editData.address?.line1} 
                      onChange={e => handleEditAddressChange('line1', e.target.value)}
                      size="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    />
              </FormControl>
              <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Address Line 2</FormLabel>
                    <Input 
                      value={editData.address?.line2 || ''} 
                      onChange={e => handleEditAddressChange('line2', e.target.value)}
                      size="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    />
              </FormControl>
              <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Suburb / City</FormLabel>
                    <Input 
                      value={editData.address?.city} 
                      onChange={e => handleEditAddressChange('city', e.target.value)}
                      size="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    />
              </FormControl>
              <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">State</FormLabel>
                    <Select 
                      value={editData.address?.state} 
                      onChange={e => handleEditAddressChange('state', e.target.value)}
                      size="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    >
                      <option value="">Select a state</option>
                      {australianStates.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </Select>
              </FormControl>
              <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Postal Code</FormLabel>
                    <Input 
                      value={editData.address?.postal_code} 
                      onChange={e => handleEditAddressChange('postal_code', e.target.value)}
                      size="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    />
              </FormControl>
              <FormControl>
                    <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700">Country</FormLabel>
                    <Select 
                      value={editData.address?.country} 
                      onChange={e => handleEditAddressChange('country', e.target.value)}
                      size="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                    >
                  {countries.map(cn => (
                    <option key={cn.code} value={cn.code}>{cn.name}</option>
                  ))}
                </Select>
              </FormControl>
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="green" 
              mr={3} 
              isLoading={saving} 
              onClick={() => saveEdit(editId!)}
              _hover={{ transform: 'translateY(-1px)' }}
              transition="all 0.2s ease-in-out"
            >
              Save Changes
            </Button>
            <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={cancelDelete} isCentered size='md' motionPreset="slideInBottom">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
        <ModalContent borderRadius="xl">
          <ModalHeader color="red.500" fontWeight="bold">Delete Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4} borderRadius="lg">
              <AlertIcon />
              <Box>
                <Text fontWeight="medium" mb={1}>This action cannot be undone</Text>
                <Text fontSize="sm">
                  This will permanently remove the customer's billing information and immediately cancel any current subscriptions. Past payments or invoices associated with the customer will still remain.
                </Text>
              </Box>
            </Alert>
          </ModalBody>
          <ModalFooter>
            <Button 
              colorScheme="red" 
              mr={3} 
              isLoading={deleting} 
              onClick={confirmDelete}
              _hover={{ transform: 'translateY(-1px)' }}
              transition="all 0.2s ease-in-out"
            >
              Delete Customer
            </Button>
            <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Profile Modal */}
      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} isCentered size="3xl">
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
        <ModalContent borderRadius="xl" bg="transparent" boxShadow="none" maxW="3xl">
          <GlassCard p={{ base: 8, md: 12 }} maxW="3xl" mx="auto" bg="whiteAlpha.900" borderColor="whiteAlpha.700" boxShadow="2xl" position="relative">
            <Box position="absolute" inset={0} borderRadius="inherit" bg="white" opacity={0.85} zIndex={0} />
            <Box position="relative" zIndex={1}>
              <ModalHeader color="brand.green" fontWeight="bold" fontSize="2xl" px={0} pb={2}>
                <HStack spacing={3}>
                  <InfoOutlineIcon color="brand.green" boxSize={6} />
                  <span>Customer Profile</span>
                </HStack>
              </ModalHeader>
              <ModalCloseButton top={4} right={4} zIndex={2} />
              <ModalBody px={0} pt={0}>
                {selectedCustomer ? (
                  <VStack align="stretch" spacing={5} divider={<Box borderBottom="1px solid" borderColor="gray.200" />}> 
                    <HStack spacing={3}>
                      <FaUser color="#003f2d" size={20} />
                      <Box>
                        <Text fontSize="sm" color="gray.500" fontWeight="medium">Customer ID</Text>
                        <Text fontWeight="bold" color="brand.green" fontSize="md">{selectedCustomer.id}</Text>
                      </Box>
                    </HStack>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                      <HStack align="start" spacing={3}>
                        <FaUser color="#003f2d" size={18} />
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Name</Text>
                          <Text fontWeight="medium" color={selectedCustomer.name ? 'gray.800' : 'gray.400'} fontStyle={!selectedCustomer.name ? 'italic' : undefined}>
                            {selectedCustomer.name || 'Not provided'}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack align="start" spacing={3}>
                        <EmailIcon color="#003f2d" boxSize={5} />
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Email</Text>
                          <Text color={selectedCustomer.email ? 'gray.700' : 'gray.400'} fontSize="sm" fontStyle={!selectedCustomer.email ? 'italic' : undefined}>
                            {selectedCustomer.email || 'Not provided'}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack align="start" spacing={3}>
                        <PhoneIcon color="#003f2d" boxSize={5} />
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Phone</Text>
                          <Text color={selectedCustomer.phone ? 'gray.700' : 'gray.400'} fontSize="sm" fontStyle={!selectedCustomer.phone ? 'italic' : undefined}>
                            {selectedCustomer.phone || 'Not provided'}
                          </Text>
                        </Box>
                      </HStack>
                      <HStack align="start" spacing={3}>
                        <FaAddressCard color="#003f2d" size={18} />
                        <Box>
                          <Text fontSize="xs" color="gray.500" fontWeight="medium">Address</Text>
                          <Text color={selectedCustomer.address ? 'gray.700' : 'gray.400'} fontSize="sm" fontStyle={!selectedCustomer.address ? 'italic' : undefined}>
                            {selectedCustomer.address ? [selectedCustomer.address.line1, selectedCustomer.address.line2, selectedCustomer.address.city, selectedCustomer.address.state, selectedCustomer.address.country, selectedCustomer.address.postal_code].filter(Boolean).join(', ') : 'Not provided'}
                          </Text>
                        </Box>
                      </HStack>
                    </SimpleGrid>
                    <HStack spacing={3}>
                      <InfoOutlineIcon color="#003f2d" boxSize={5} />
                      <Box>
                        <Text fontSize="xs" color="gray.500" fontWeight="medium">Created</Text>
                        <Text fontSize="sm" color="gray.600">
                          {selectedCustomer.created ? new Date(selectedCustomer.created * 1000).toLocaleDateString() : 'Unknown'}
                        </Text>
                      </Box>
                    </HStack>
                    <Box pt={2}>
                      <Text fontSize="lg" fontWeight="bold" color="brand.green" mb={2}>Projects</Text>
                      {projectsLoading && customerProjects.length === 0 ? (
                        <>
                          {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} height="40px" mb={2} borderRadius="md" />
                          ))}
                        </>
                      ) : projectsError ? (
                        <Text color="red.500">{projectsError}</Text>
                      ) : customerProjects.length === 0 ? (
                        <Text color="gray.500" fontStyle="italic">No projects found for this customer.</Text>
                      ) : (
                        <Box maxH="200px" overflowY="auto" transition="none" opacity={projectsLoading ? 0.5 : 1}>
                          {displayedProjects.map(proj => (
                            <ProjectCard key={proj.id} proj={proj} />
                          ))}
                          {customerProjects.length > 5 && (
                            <Button as={NextLink} href={`/admin/manage-projects?customer_stripe_id=${selectedCustomer.id}`} size="sm" colorScheme="green" variant="ghost" mt={2}>
                              View All Projects
                            </Button>
                          )}
                        </Box>
                      )}
                    </Box>
                    <Box pt={2}>
                      <Text fontSize="lg" fontWeight="bold" color="brand.green" mb={2}>Billings</Text>
                      {invoicesLoading && invoices.length === 0 ? (
                        <>
                          {[...Array(2)].map((_, i) => (
                            <Skeleton key={i} height="40px" mb={2} borderRadius="md" />
                          ))}
                        </>
                      ) : invoicesError ? (
                        <Text color="red.500">{invoicesError}</Text>
                      ) : invoices.length === 0 ? (
                        <Text color="gray.500" fontStyle="italic">No invoices found for this customer.</Text>
                      ) : (
                        <Box maxH="200px" overflowY="auto" transition="none" opacity={invoicesLoading ? 0.5 : 1}>
                          {displayedInvoices.map(inv => (
                            <InvoiceCard key={inv.id} inv={inv} />
                          ))}
                          {invoices.length > 5 && (
                            <Button as={NextLink} href={`https://dashboard.stripe.com/customers/${selectedCustomer.id}`} target="_blank" size="sm" colorScheme="green" variant="ghost" mt={2}>
                              View All Invoices
                            </Button>
                          )}
                        </Box>
                      )}
                    </Box>
                    <Button
                      as={NextLink}
                      href={`https://dashboard.stripe.com/customers/${selectedCustomer.id}`}
                      target="_blank"
                      leftIcon={<ExternalLinkIcon />}
                      colorScheme="green"
                      variant="solid"
                      size="lg"
                      alignSelf="flex-end"
                      mt={2}
                      boxShadow="md"
                    >
                      View in Stripe Dashboard
                    </Button>
                  </VStack>
                ) : (
                  <Text>No customer selected.</Text>
                )}
              </ModalBody>
            </Box>
          </GlassCard>
        </ModalContent>
      </Modal>
    </Box>
  );
} 