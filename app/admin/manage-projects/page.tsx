'use client';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Checkbox,
  CheckboxGroup,
  Stack,
  SimpleGrid,
  useDisclosure,
  Alert,
  AlertIcon,
  Spinner,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowBackIcon, AddIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { FaInfoCircle, FaRegCalendarAlt, FaUserTie, FaMoneyBillWave, FaUser } from 'react-icons/fa';

// Customer search functionality using live Stripe data

export default function ManageProjectsPage() {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    description: '',
    status: '',
    startDate: '',
    endDate: '',
    priority: '',
    projectOwner: 'Michael Neeson',
    client: '',
    budget: '',
    category: '',
    projectCode: '',
    createdBy: 'Admin', // Auto-filled based on logged in user
    notes: '',
    estimatedHours: '',
    dependencies: [] as string[]
  });

  const [customerQuery, setCustomerQuery] = useState('');
  const [customerResults, setCustomerResults] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);
  const [customerSearchLoading, setCustomerSearchLoading] = useState(false);

  // Place projects state here
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  // Load projects from Supabase on component mount
  useEffect(() => {
    const fetchProjects = async () => {
      setProjectsLoading(true);
      setProjectsError('');
      try {
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        if (data.success) {
          setProjects(data.projects || []);
        } else {
          setProjectsError(data.error || 'Failed to load projects');
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjectsError('Failed to load projects');
        setProjects([]);
      } finally {
        setProjectsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Live customer search using Stripe API
  useEffect(() => {
    const searchCustomers = async () => {
      if (customerQuery.trim() === '') {
        setCustomerResults([]);
        return;
      }

      setCustomerSearchLoading(true);
      try {
        const response = await fetch(`/api/search-customers?name=${encodeURIComponent(customerQuery)}`);
        const data = await response.json();
        
        if (data.success) {
          setCustomerResults(data.customers || []);
        } else {
          console.error('Failed to search customers:', data.error);
          setCustomerResults([]);
        }
      } catch (error) {
        console.error('Error searching customers:', error);
        setCustomerResults([]);
      } finally {
        setCustomerSearchLoading(false);
      }
    };

    // Debounce the search to avoid too many API calls
    const timeoutId = setTimeout(searchCustomers, 300);
    return () => clearTimeout(timeoutId);
  }, [customerQuery]);

  useEffect(() => {
    if (isOpen) {
      const numbers = projects
        .map(p => parseInt(p.code.replace('LLPR-', ''), 10))
        .filter(n => !isNaN(n));
      const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 10;
      const nextCode = `LLPR-${String(nextNum).padStart(3, '0')}`;
      setFormData(prev => ({ ...prev, projectCode: nextCode }));
    }
    // eslint-disable-next-line
  }, [isOpen, projects]);

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  const clearAllProjects = () => {
    if (window.confirm('Are you sure you want to clear all projects? This action cannot be undone.')) {
      // Note: This would need a DELETE endpoint in production
      // For now, just clear the local state
      setProjects([]);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!formData.projectName.trim()) {
      setError('Project name is required');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      // Debug log for selected customer
      console.log('Selected customer:', selectedCustomer);
      // Create full project object with all required fields
      const newProject = {
        code: formData.projectCode,
        name: formData.projectName,
        description: formData.description,
        customer: selectedCustomer ? selectedCustomer.name : 'Unassigned',
        customerEmail: selectedCustomer ? selectedCustomer.email : '',
        customerPhone: selectedCustomer ? selectedCustomer.phone : '',
        customer_stripe_id: selectedCustomer ? selectedCustomer.id : '',
        customerAddressLine1: selectedCustomer?.address?.line1 || '',
        customerAddressLine2: selectedCustomer?.address?.line2 || '',
        customerCity: selectedCustomer?.address?.city || '',
        customerState: selectedCustomer?.address?.state || '',
        customerPostcode: selectedCustomer?.address?.postal_code || '',
        customerCountry: selectedCustomer?.address?.country || '',
        status: formData.status || 'Planned',
        startDate: formData.startDate,
        endDate: formData.endDate,
        priority: formData.priority || 'Medium',
        projectOwner: formData.projectOwner || 'Admin',
        client: formData.client || 'Internal',
        budget: Number(formData.budget) || 0,
        category: formData.category || 'internal',
        estimatedHours: Number(formData.estimatedHours) || 0,
        createdBy: formData.createdBy,
        team: [formData.projectOwner || 'Admin'],
        tasks: [], // Empty tasks array for new projects
        updates: [], // Empty updates array for new projects
      };

      // Send to Supabase API
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProject),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong');
      }

      // Add new project to state
      setProjects(prev => [result.project, ...prev]);
      setSuccess('Project created successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
        resetForm();
        setSelectedCustomer(null);
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'Failed to create project. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      projectName: '',
      description: '',
      status: '',
      startDate: '',
      endDate: '',
      priority: '',
      projectOwner: 'Michael Neeson',
      client: '',
      budget: '',
      category: '',
      projectCode: '',
      createdBy: 'Admin',
      notes: '',
      estimatedHours: '',
      dependencies: []
    });
    setError('');
    setSuccess('');
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50" px={{ base: 3, md: 4 }} py={{ base: 4, md: 0 }}>
      <Box textAlign="center" mb={{ base: 6, md: 8 }} px={{ base: 2, md: 0 }}>
        <Heading as="h1" size={{ base: 'lg', md: '2xl' }} mb={3} color="brand.green" fontWeight="bold">
          Manage Projects
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="500px" mb={6}>
          View and manage all client projects
        </Text>
        <Button 
          onClick={onOpen}
          bg="#003f2d" 
          color="white" 
          size={{ base: 'md', md: 'lg' }}
          px={{ base: 4, md: 8 }}
          py={{ base: 2, md: 3 }}
          fontSize="md"
          fontWeight="semibold"
          leftIcon={<AddIcon />}
          _focus={{ bg: '#14543a' }}
          _active={{ bg: '#0a2e1f' }}
          transition="all 0.2s ease-in-out"
          _hover={{ 
            transform: 'translateY(-2px)', 
            boxShadow: '0 4px 12px rgba(0, 63, 45, 0.3)',
            bg: '#14543a'
          }}
        >
          Create new project
        </Button>
      </Box>
      
      <VStack spacing={{ base: 6, md: 8 }} w="100%" maxW="1200px" bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow="xl" align="stretch" mb={6}>
        
        {/* Projects Table */}
        <Box bg="white" borderRadius="xl" boxShadow="md" border="1px solid #e2e8f0" p={6} overflowX={{ base: 'auto', md: 'visible' }}>
          <Heading size="md" color="#14543a" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
            <FaInfoCircle /> Projects
          </Heading>
          
          {projectsLoading ? (
            <Box textAlign="center" py={8}>
              <Spinner size="lg" color="#003f2d" />
              <Text mt={4} color="gray.600">Loading projects...</Text>
            </Box>
          ) : projectsError ? (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {projectsError}
            </Alert>
          ) : projects.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="gray.500" fontSize="lg">No projects found</Text>
              <Text color="gray.400" fontSize="md" mt={2}>Create your first project to get started</Text>
            </Box>
          ) : (
            <Table variant="simple" size="md" w="100%" minW={{ base: '600px', md: '100%' }}>
              <Thead bg="#003f2d">
                <Tr>
                  <Th w="12%" whiteSpace="nowrap" color="white" fontWeight="bold">Project Code</Th>
                  <Th w="28%" whiteSpace="nowrap" color="white" fontWeight="bold">Name</Th>
                  <Th w="22%" whiteSpace="nowrap" color="white" fontWeight="bold">Customer</Th>
                  <Th w="12%" whiteSpace="nowrap" color="white" fontWeight="bold">Status</Th>
                  <Th w="16%" whiteSpace="nowrap" color="white" fontWeight="bold">Start Date</Th>
                  <Th w="10%" whiteSpace="nowrap" color="white" fontWeight="bold">Priority</Th>
                </Tr>
              </Thead>
              <Tbody>
                {projects.map((proj, idx) => (
                  <Tr key={proj.code + idx} _hover={{ bg: 'gray.50' }} cursor="pointer">
                    <Td fontWeight="bold">
                      <Link href={`/admin/project/${proj.code}`} style={{ textDecoration: 'none' }}>
                        <Text color="#003f2d" _hover={{ color: '#14543a', textDecoration: 'underline' }}>
                          {proj.code}
                        </Text>
                      </Link>
                    </Td>
                    <Td>{proj.name}</Td>
                    <Td>{proj.customer}</Td>
                    <Td>{proj.status}</Td>
                    <Td>{proj.startDate}</Td>
                    <Td>{proj.priority}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
        
      </VStack>
      
      <HStack spacing={4} mt={6} flexWrap="wrap" justifyContent={{ base: 'center', md: 'flex-start' }}>
        <Button onClick={handleLogout} colorScheme="red" variant="outline" size={{ base: "sm", md: "md" }}>
          Logout
        </Button>
        <Button as={Link} href="/admin" leftIcon={<ArrowBackIcon />} colorScheme="red" variant="outline" size={{ base: "sm", md: "md" }}>
          Back
        </Button>
        <Button onClick={clearAllProjects} colorScheme="orange" variant="outline" size={{ base: "sm", md: "md" }}>
          Clear All Projects
        </Button>
      </HStack>

      {/* Create Project Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW={{ base: '98vw', md: '800px' }} p={2} borderRadius="2xl">
          <ModalHeader bg="#003f2d" color="white" borderTopRadius="2xl" fontSize="2xl" fontWeight="bold">
            Create New Project
          </ModalHeader>
          <ModalCloseButton color="white" />
          
          <ModalBody py={6}>
            <VStack spacing={0} align="stretch" w="100%">
              {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
              {success && <Alert status="success" borderRadius="md"><AlertIcon />{success}</Alert>}
              
              {/* General Information */}
              <Box bg="white" borderRadius="xl" boxShadow="md" border="1px solid #e2e8f0" p={6} mb={6}>
                <Heading size="md" color="#14543a" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
                  <FaInfoCircle /> General Information
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Project Code/ID</FormLabel>
                    <Input
                      value={formData.projectCode}
                      isReadOnly
                      placeholder="LLPR-010"
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      bg="gray.100"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>auto-generated</Text>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Created By</FormLabel>
                    <Input
                      value={formData.createdBy}
                      isReadOnly
                      placeholder="Auto-filled based on logged in user"
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      bg="gray.100"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                    />
                    <Text fontSize="xs" color="gray.500" mt={1}>auto-generated</Text>
                  </FormControl>
                </SimpleGrid>
                <FormControl mb={4} w="100%">
                  <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Project Name</FormLabel>
                  <Input
                    value={formData.projectName}
                    onChange={(e) => handleInputChange('projectName', e.target.value)}
                    placeholder="Enter project name"
                    fontSize="lg"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                    _hover={{ borderColor: '#14543a' }}
                    w="100%"
                  />
                </FormControl>
                <FormControl w="100%">
                  <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Description</FormLabel>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Brief project description"
                    rows={3}
                    fontSize="lg"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                    _hover={{ borderColor: '#14543a' }}
                    w="100%"
                  />
                </FormControl>
              </Box>
              <Divider mb={6} />
              {/* Customer Information */}
              <Box bg="white" borderRadius="xl" boxShadow="md" border="1px solid #e2e8f0" p={6} mb={6}>
                <Heading size="md" color="#14543a" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
                  <FaUser /> Customer Information
                </Heading>
                {/* Searchable Customer Selector */}
                <FormControl mb={4} position="relative" w="100%">
                  <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Customer Name</FormLabel>
                  <Input
                    value={selectedCustomer ? selectedCustomer.name : customerQuery}
                    onChange={e => {
                      setCustomerQuery(e.target.value);
                      setSelectedCustomer(null);
                      // Clear the client field when customer selection is cleared
                      if (!e.target.value) {
                        setFormData(prev => ({ ...prev, client: '' }));
                      }
                    }}
                    placeholder="Search for customer name..."
                    fontSize="lg"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                    _hover={{ borderColor: '#14543a' }}
                    autoComplete="off"
                    w="100%"
                  />
                  {/* Loading indicator */}
                  {customerQuery && !selectedCustomer && customerSearchLoading && (
                    <Box position="absolute" zIndex={10} bg="white" border="1px solid #e2e8f0" borderRadius="md" mt={1} w="100%" p={4} textAlign="center">
                      <Spinner size="sm" mr={2} />
                      Searching customers...
                    </Box>
                  )}
                  
                  {/* Dropdown results */}
                  {customerQuery && !selectedCustomer && !customerSearchLoading && customerResults.length > 0 && (
                    <Box position="absolute" zIndex={10} bg="white" border="1px solid #e2e8f0" borderRadius="md" mt={1} w="100%" boxShadow="lg" maxH="180px" overflowY="auto">
                      {customerResults.map(c => (
                        <Box
                          key={c.id}
                          px={4}
                          py={2}
                          cursor="pointer"
                          _hover={{ bg: '#e6f2ed' }}
                          onClick={() => {
                            setSelectedCustomer(c);
                            setCustomerQuery('');
                            // Auto-populate the client field with the customer name
                            setFormData(prev => ({ ...prev, client: c.name }));
                          }}
                        >
                          <Text fontWeight="medium">{c.name}</Text>
                          {c.email && <Text fontSize="sm" color="gray.600">{c.email}</Text>}
                        </Box>
                      ))}
                    </Box>
                  )}
                  
                  {/* No results */}
                  {customerQuery && !selectedCustomer && !customerSearchLoading && customerResults.length === 0 && (
                    <Box position="absolute" zIndex={10} bg="white" border="1px solid #e2e8f0" borderRadius="md" mt={1} w="100%" p={4} textAlign="center" color="gray.500">
                      No customers found
                    </Box>
                  )}
                </FormControl>
                {/* Populated fields if customer is selected */}
                {selectedCustomer && (
                  <Box mt={2}>
                    <FormControl mb={2}>
                      <FormLabel fontSize="md" color="gray.600">Email</FormLabel>
                      <Input value={selectedCustomer.email} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                    </FormControl>
                    <FormControl mb={2}>
                      <FormLabel fontSize="md" color="gray.600">Mobile Number</FormLabel>
                      <Input value={selectedCustomer.phone} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                    </FormControl>
                    <Box borderWidth="2px" borderColor="gray.200" borderRadius="lg" p={4} bg="gray.50" mb={2}>
                      <Heading as="h3" size="sm" mb={3} color="#14543a" fontWeight="semibold">Address Information</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Address Line 1</FormLabel>
                          <Input value={selectedCustomer.address.line1 || ''} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Address Line 2</FormLabel>
                          <Input value={selectedCustomer.address.line2 || ''} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Suburb / City</FormLabel>
                          <Input value={selectedCustomer.address.city || ''} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Postal Code</FormLabel>
                          <Input value={selectedCustomer.address.postalCode || ''} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>State</FormLabel>
                          <Input value={selectedCustomer.address.state || ''} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Country</FormLabel>
                          <Input value={selectedCustomer.address.country || ''} isReadOnly bg="gray.100" fontSize="md" w="100%" />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
                    {selectedCustomer && selectedCustomer.id && (
                      <Text fontSize="sm" color="gray.400" mt={1}>
                        Stripe ID: {selectedCustomer.id}
                      </Text>
                    )}
                  </Box>
                )}
              </Box>
              <Divider mb={6} />
              {/* Timeline & Status */}
              <Box bg="white" borderRadius="xl" boxShadow="md" border="1px solid #e2e8f0" p={6} mb={6}>
                <Heading size="md" color="#14543a" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
                  <FaRegCalendarAlt /> Timeline & Status
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Start Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange('startDate', e.target.value)}
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                      w="100%"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">End Date</FormLabel>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange('endDate', e.target.value)}
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                      w="100%"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Priority</FormLabel>
                    <Select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      placeholder="Select priority"
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                      w="100%"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
                <FormControl>
                  <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Status</FormLabel>
                  <Select
                    value={formData.status}
                    onChange={(e) => handleInputChange('status', e.target.value)}
                    placeholder="Select status"
                    fontSize="lg"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                    _hover={{ borderColor: '#14543a' }}
                    w="100%"
                  >
                    <option value="planned">Planned</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </Select>
                </FormControl>
              </Box>
              <Divider mb={6} />
              {/* Ownership & Client */}
              <Box bg="white" borderRadius="xl" boxShadow="md" border="1px solid #e2e8f0" p={6} mb={6}>
                <Heading size="md" color="#14543a" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
                  <FaUserTie /> Ownership & Client
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Project Owner</FormLabel>
                    <Input
                      value={formData.projectOwner}
                      onChange={(e) => handleInputChange('projectOwner', e.target.value)}
                      placeholder="Enter project owner"
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                      w="100%"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Client</FormLabel>
                    <Input
                      value={formData.client}
                      onChange={(e) => handleInputChange('client', e.target.value)}
                      placeholder={selectedCustomer ? "Auto-populated from customer" : "Enter client name"}
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor={selectedCustomer ? "gray.300" : "gray.200"}
                      borderRadius="lg"
                      bg={selectedCustomer ? "gray.50" : "white"}
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                      w="100%"
                    />
                    {selectedCustomer && (
                      <Text fontSize="xs" color="gray.500" mt={1}>Auto-populated from selected customer</Text>
                    )}
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Category/Type</FormLabel>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      placeholder="Select category"
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                      w="100%"
                    >
                      <option value="residential">Residential</option>
                      <option value="business">Business</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>
              </Box>
              <Divider mb={6} />
              {/* Resources & Budget */}
              <Box bg="white" borderRadius="xl" boxShadow="md" border="1px solid #e2e8f0" p={6} mb={6}>
                <Heading size="md" color="#14543a" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
                  <FaMoneyBillWave /> Resources & Budget
                </Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Budget</FormLabel>
                    <InputGroup>
                      <InputLeftAddon children="$" />
                      <NumberInput
                        value={formData.budget}
                        onChange={(value) => handleInputChange('budget', value)}
                        min={0}
                        precision={2}
                        clampValueOnBlur={true}
                      >
                        <NumberInputField
                          placeholder="Enter budget amount"
                          fontSize="lg"
                          borderWidth="2px"
                          borderColor="gray.200"
                          borderRadius="lg"
                          _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                          _hover={{ borderColor: '#14543a' }}
                          w="100%"
                        />
                      </NumberInput>
                    </InputGroup>
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Estimated Hours</FormLabel>
                    <InputGroup>
                      <NumberInput
                        value={formData.estimatedHours}
                        onChange={(value) => handleInputChange('estimatedHours', value)}
                        min={0}
                        precision={1}
                        clampValueOnBlur={true}
                      >
                        <NumberInputField
                          placeholder="Enter estimated hours"
                          fontSize="lg"
                          borderWidth="2px"
                          borderColor="gray.200"
                          borderRadius="lg"
                          _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                          _hover={{ borderColor: '#14543a' }}
                          w="100%"
                        />
                      </NumberInput>
                      <InputRightAddon children="hrs" />
                    </InputGroup>
                    <Text fontSize="xs" color="gray.500" mt={1}>For tracking effort</Text>
                  </FormControl>
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50" borderBottomRadius="2xl">
            <HStack spacing={3}>
              <Button
                onClick={resetForm}
                variant="outline"
                colorScheme="gray"
              >
                Reset
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                colorScheme="red"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                bg="#003f2d"
                color="white"
                _hover={{ bg: '#14543a' }}
                isLoading={loading}
                loadingText="Creating..."
                leftIcon={<AddIcon />}
              >
                Create Project
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>


    </Box>
  );
} 