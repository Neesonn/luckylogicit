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

// Mock customer data (replace with real fetch/API call)
const mockCustomers = [
  {
    id: 1,
    name: 'Alice Smith',
    email: 'alice@example.com',
    phone: '0412 345 678',
    address: {
      line1: '123 Main St',
      line2: '',
      city: 'Sydney',
      state: 'NSW',
      postalCode: '2000',
      country: 'Australia',
    },
  },
  {
    id: 2,
    name: 'Bob Johnson',
    email: 'bob@example.com',
    phone: '0400 111 222',
    address: {
      line1: '456 King St',
      line2: 'Apt 5',
      city: 'Melbourne',
      state: 'VIC',
      postalCode: '3000',
      country: 'Australia',
    },
  },
  {
    id: 3,
    name: 'Charlie Lee',
    email: 'charlie@example.com',
    phone: '0433 222 333',
    address: {
      line1: '789 Queen St',
      line2: '',
      city: 'Brisbane',
      state: 'QLD',
      postalCode: '4000',
      country: 'Australia',
    },
  },
];

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
    projectOwner: '',
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
  const [customerResults, setCustomerResults] = useState<typeof mockCustomers>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<typeof mockCustomers[0] | null>(null);

  // Place projects state here
  const [projects, setProjects] = useState([
    { code: 'LLPR-010', name: 'Demo Project', customer: 'Alice Smith', status: 'Planned', startDate: '2024-06-01', priority: 'High' },
    { code: 'LLPR-011', name: 'Website Redesign', customer: 'Bob Johnson', status: 'In Progress', startDate: '2024-06-10', priority: 'Medium' },
  ]);

  useEffect(() => {
    if (customerQuery.trim() === '') {
      setCustomerResults([]);
      return;
    }
    setCustomerResults(
      mockCustomers.filter(c =>
        c.name.toLowerCase().includes(customerQuery.toLowerCase())
      )
    );
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      // Add new project to state
      setProjects(prev => [
        ...prev,
        {
          code: formData.projectCode,
          name: formData.projectName,
          customer: selectedCustomer ? selectedCustomer.name : '',
          status: formData.status,
          startDate: formData.startDate,
          priority: formData.priority,
          budget: Number(formData.budget),
          estimatedHours: Number(formData.estimatedHours),
        },
      ]);
      setSuccess('Project created successfully!');
      setTimeout(() => {
        onClose();
        setSuccess('');
        resetForm();
        setSelectedCustomer(null);
      }, 1000);
    } catch (err) {
      setError('Failed to create project. Please try again.');
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
      projectOwner: '',
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
        <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={3} color="brand.green" fontWeight="bold">
          Manage Projects
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="500px" mb={6}>
          View and manage all client projects
        </Text>
        <Button 
          onClick={onOpen}
          bg="#003f2d" 
          color="white" 
          size="lg"
          px={8}
          py={3}
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
        <Box bg="white" borderRadius="xl" boxShadow="md" border="1px solid #e2e8f0" p={6} overflow="visible">
          <Heading size="md" color="#14543a" fontWeight="bold" mb={4} display="flex" alignItems="center" gap={2}>
            <FaInfoCircle /> Projects
          </Heading>
          <Table variant="simple" size="md" w="100%">
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
        </Box>
        
      </VStack>
      
      <HStack spacing={4} mt={6}>
        <Button onClick={handleLogout} colorScheme="red" variant="outline" size={{ base: "sm", md: "md" }}>
          Logout
        </Button>
        <Button as={Link} href="/admin" leftIcon={<ArrowBackIcon />} colorScheme="red" variant="outline" size={{ base: "sm", md: "md" }}>
          Back
        </Button>
      </HStack>

      {/* Create Project Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent maxW="800px" p={2} borderRadius="2xl">
          <ModalHeader bg="#003f2d" color="white" borderTopRadius="2xl" fontSize="2xl" fontWeight="bold">
            Create New Project
          </ModalHeader>
          <ModalCloseButton color="white" />
          
          <ModalBody py={6}>
            <VStack spacing={0} align="stretch">
              {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
              {success && <Alert status="success" borderRadius="md"><AlertIcon />{success}</Alert>}
              
              <Box textAlign="center" mb={4}>
                <Button
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    // Pick the first customer for demo
                    setSelectedCustomer(mockCustomers[0]);
                    setFormData(prev => ({
                      ...prev,
                      projectName: 'Sample Project',
                      description: 'This is a sample project for testing.',
                      status: 'planned',
                      startDate: '2024-07-01',
                      endDate: '2024-07-15',
                      priority: 'High',
                      projectOwner: 'Alice Smith',
                      client: 'Acme Corp',
                      budget: '5000',
                      category: 'internal',
                      estimatedHours: '40',
                    }));
                  }}
                  _hover={{
                    transform: 'translateY(-1px)',
                    boxShadow: '0 4px 12px rgba(66, 153, 225, 0.3)'
                  }}
                  transition="all 0.2s ease-in-out"
                >
                  Generate Dummy Data
                </Button>
              </Box>
              
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
                <FormControl mb={4}>
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
                  />
                </FormControl>
                <FormControl>
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
                <FormControl mb={4} position="relative">
                  <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Customer Name</FormLabel>
                  <Input
                    value={selectedCustomer ? selectedCustomer.name : customerQuery}
                    onChange={e => {
                      setCustomerQuery(e.target.value);
                      setSelectedCustomer(null);
                    }}
                    placeholder="Search for customer name..."
                    fontSize="lg"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                    _hover={{ borderColor: '#14543a' }}
                    autoComplete="off"
                  />
                  {/* Dropdown results */}
                  {customerQuery && !selectedCustomer && customerResults.length > 0 && (
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
                          }}
                        >
                          {c.name}
                        </Box>
                      ))}
                    </Box>
                  )}
                </FormControl>
                {/* Populated fields if customer is selected */}
                {selectedCustomer && (
                  <Box mt={2}>
                    <FormControl mb={2}>
                      <FormLabel fontSize="md" color="gray.600">Email</FormLabel>
                      <Input value={selectedCustomer.email} isReadOnly bg="gray.100" fontSize="md" />
                    </FormControl>
                    <FormControl mb={2}>
                      <FormLabel fontSize="md" color="gray.600">Mobile Number</FormLabel>
                      <Input value={selectedCustomer.phone} isReadOnly bg="gray.100" fontSize="md" />
                    </FormControl>
                    <Box borderWidth="2px" borderColor="gray.200" borderRadius="lg" p={4} bg="gray.50" mb={2}>
                      <Heading as="h3" size="sm" mb={3} color="#14543a" fontWeight="semibold">Address Information</Heading>
                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Address Line 1</FormLabel>
                          <Input value={selectedCustomer.address.line1 || ''} isReadOnly bg="gray.100" fontSize="md" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Address Line 2</FormLabel>
                          <Input value={selectedCustomer.address.line2 || ''} isReadOnly bg="gray.100" fontSize="md" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Suburb / City</FormLabel>
                          <Input value={selectedCustomer.address.city || ''} isReadOnly bg="gray.100" fontSize="md" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Postal Code</FormLabel>
                          <Input value={selectedCustomer.address.postalCode || ''} isReadOnly bg="gray.100" fontSize="md" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>State</FormLabel>
                          <Input value={selectedCustomer.address.state || ''} isReadOnly bg="gray.100" fontSize="md" />
                        </FormControl>
                        <FormControl>
                          <FormLabel fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>Country</FormLabel>
                          <Input value={selectedCustomer.address.country || ''} isReadOnly bg="gray.100" fontSize="md" />
                        </FormControl>
                      </SimpleGrid>
                    </Box>
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
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">Client</FormLabel>
                    <Input
                      value={formData.client}
                      onChange={(e) => handleInputChange('client', e.target.value)}
                      placeholder="Enter client name"
                      fontSize="lg"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                      _hover={{ borderColor: '#14543a' }}
                    />
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
                    >
                      <option value="internal">Internal</option>
                      <option value="external">External</option>
                      <option value="rnd">R&D</option>
                      <option value="infrastructure">Infrastructure</option>
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