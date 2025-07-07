'use client';
import { 
  Box, 
  Heading, 
  Text, 
  Button, 
  VStack, 
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Divider,
  useDisclosure,
  Alert,
  AlertIcon,
  Spinner,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
  Flex,
  Container,
  Progress,
  Avatar,
  AvatarGroup,
  IconButton,
  Tooltip,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Input,
  Textarea,
  Select,
  CircularProgress,
  CircularProgressLabel,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowBackIcon, EditIcon, DeleteIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';
import { 
  FaInfoCircle, 
  FaRegCalendarAlt, 
  FaUserTie, 
  FaMoneyBillWave, 
  FaUser,
  FaClock,
  FaChartLine,
  FaTasks,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBuilding,
  FaCalendarDay,
  FaHourglassHalf,
  FaDollarSign,
  FaUsers,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPauseCircle
} from 'react-icons/fa';

// Mock project data (replace with real API call)
const mockProjects = [
  {
    code: 'LLPR-010',
    name: 'Demo Project',
    description: 'This is a comprehensive demonstration project designed to showcase the full capabilities of our project management system. It includes various features and functionalities that demonstrate best practices in project execution.',
    customer: 'Alice Smith',
    customerEmail: 'alice@example.com',
    customerPhone: '0412 345 678',
    status: 'Planned',
    startDate: '2024-06-01',
    endDate: '2024-06-15',
    priority: 'High',
    projectOwner: 'John Doe',
    client: 'Acme Corp',
    budget: 5000,
    category: 'internal',
    estimatedHours: 40,
    createdBy: 'Admin',
    progress: 25,
    tasksCompleted: 3,
    totalTasks: 12,
    budgetUsed: 1250,
    team: ['John Doe', 'Jane Smith', 'Mike Johnson'],
  },
  {
    code: 'LLPR-011',
    name: 'Website Redesign',
    description: 'Complete redesign of the company website with modern UI/UX principles, responsive design, and enhanced user experience. This project aims to improve conversion rates and user engagement.',
    customer: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    customerPhone: '0400 111 222',
    status: 'In Progress',
    startDate: '2024-06-10',
    endDate: '2024-07-10',
    priority: 'Medium',
    projectOwner: 'Jane Smith',
    client: 'Tech Solutions',
    budget: 15000,
    category: 'external',
    estimatedHours: 120,
    createdBy: 'Admin',
    progress: 45,
    tasksCompleted: 8,
    totalTasks: 18,
    budgetUsed: 6750,
    team: ['Jane Smith', 'Alex Brown', 'Sarah Wilson'],
  },
];

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const projectCode = params.code as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [progressAnimation, setProgressAnimation] = useState(0);

  useEffect(() => {
    // Simulate API call to fetch project details
    const fetchProject = async () => {
      setLoading(true);
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundProject = mockProjects.find(p => p.code === projectCode);
        if (foundProject) {
          setProject(foundProject);
        } else {
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project details');
      } finally {
        setLoading(false);
      }
    };

    if (projectCode) {
      fetchProject();
    }
  }, [projectCode]);

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planned': return 'blue';
      case 'in progress': return 'orange';
      case 'completed': return 'green';
      case 'on hold': return 'red';
      default: return 'gray';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'planned': return FaClock;
      case 'in progress': return FaChartLine;
      case 'completed': return FaCheckCircle;
      case 'on hold': return FaPauseCircle;
      default: return FaExclamationTriangle;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const handleEdit = () => {
    setEditData({ ...project });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
    setSaveSuccess('');
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess('');
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update the project data
      setProject({ ...editData });
      setIsEditing(false);
      setSaveSuccess('Project updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err) {
      setError('Failed to save project changes');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setEditData((prev: any) => ({
      ...prev,
      [field]: value
    }));
  };

  // Helper functions for color coding and progress calculations
  const getProgressColor = (percentage: number) => {
    if (percentage >= 75) return 'green';
    if (percentage >= 50) return 'yellow';
    return 'red';
  };

  const getBudgetUsagePercentage = () => {
    return Math.round((project.budgetUsed / project.budget) * 100);
  };

  const getTaskCompletionPercentage = () => {
    return Math.round((project.tasksCompleted / project.totalTasks) * 100);
  };

  const getTimeRemainingPercentage = () => {
    // Calculate based on project duration (simplified)
    const totalDays = 15; // This would be calculated from start/end dates
    const remainingDays = 8;
    return Math.round(((totalDays - remainingDays) / totalDays) * 100);
  };

  // Animate progress bar on load
  useEffect(() => {
    if (project) {
      const timer = setTimeout(() => {
        setProgressAnimation(project.progress);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [project]);

  if (loading) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <VStack spacing={6}>
          <Spinner size="xl" color="#003f2d" thickness="4px" />
          <Text fontSize="lg" color="gray.600" fontWeight="medium">Loading project details...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
        <VStack spacing={6} textAlign="center" maxW="500px" px={6}>
          <Alert status="error" borderRadius="xl" py={6}>
            <AlertIcon />
            <Text fontWeight="medium">{error || 'Project not found'}</Text>
          </Alert>
          <Button as={Link} href="/admin/manage-projects" leftIcon={<ArrowBackIcon />} colorScheme="red" variant="outline" size="lg">
            Back to Projects
          </Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
        <Container maxW="1400px">
          {/* Breadcrumb */}
          <Breadcrumb spacing="8px" separator={<ChevronRightIcon color="gray.500" />} mb={4}>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/admin" color="gray.500" _hover={{ color: "#003f2d" }}>
                Admin
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={Link} href="/admin/manage-projects" color="gray.500" _hover={{ color: "#003f2d" }}>
                Projects
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink color="#003f2d" fontWeight="medium">{project.code}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>

          {/* Project Header */}
          <Flex justify="space-between" align="start" flexWrap="wrap" gap={4}>
            <VStack align="start" spacing={2}>
              <Heading as="h1" size="2xl" color="#003f2d" fontWeight="bold">
                {project.name}
              </Heading>
              <HStack spacing={4}>
                <Text fontSize="lg" color="gray.600" fontWeight="medium">
                  {project.code}
                </Text>
                <Badge colorScheme={getStatusColor(project.status)} size="lg" px={4} py={2} fontSize="sm" fontWeight="semibold">
                  <Icon as={getStatusIcon(project.status)} mr={2} />
                  {project.status}
                </Badge>
                <Badge colorScheme={getPriorityColor(project.priority)} size="lg" px={4} py={2} fontSize="sm" fontWeight="semibold">
                  {project.priority} Priority
                </Badge>
              </HStack>
            </VStack>
            
            <HStack spacing={3}>
              <Button as={Link} href="/admin/manage-projects" leftIcon={<ArrowBackIcon />} variant="outline" size="md">
                Back
              </Button>
              {!isEditing ? (
                <Button leftIcon={<EditIcon />} colorScheme="blue" size="md" onClick={handleEdit}>
                  Edit
                </Button>
              ) : (
                <>
                  <Button 
                    colorScheme="green" 
                    size="md" 
                    onClick={handleSave}
                    isLoading={saving}
                    loadingText="Saving..."
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="md" 
                    onClick={handleCancel}
                    isDisabled={saving}
                  >
                    Cancel
                  </Button>
                </>
              )}
              <Button leftIcon={<DeleteIcon />} colorScheme="red" variant="outline" size="md">
                Delete
              </Button>
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Progress & Statistics Banner */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
        <Container maxW="1400px">
          <VStack spacing={8} align="stretch">
            <Heading size="lg" color="#003f2d" fontWeight="bold" textAlign="center">
              Progress & Statistics
            </Heading>
            
            {/* Animated Progress Bar */}
            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="semibold" color="gray.700" fontSize="lg">Overall Progress</Text>
                <Text fontWeight="bold" color="#003f2d" fontSize="xl">{progressAnimation}%</Text>
              </Flex>
              <Progress 
                value={progressAnimation} 
                colorScheme={getProgressColor(project.progress)} 
                size="lg" 
                borderRadius="full"
                transition="all 1s ease-in-out"
              />
            </Box>
            
            {/* Statistics Grid with Circular Progress */}
            <Box overflowX="auto" overflowY="hidden">
              <SimpleGrid 
                columns={{ base: 2, md: 4 }} 
                spacing={6} 
                minW={{ base: "400px", md: "auto" }}
                px={{ base: 2, md: 0 }}
              >
                {/* Tasks Completed */}
                <Box 
                  textAlign="center" 
                  p={6} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH="200px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={4}>
                    Tasks Completed
                  </Text>
                  <CircularProgress 
                    value={getTaskCompletionPercentage()} 
                    color={getProgressColor(getTaskCompletionPercentage())} 
                    size="80px" 
                    thickness="8px"
                    mb={3}
                  >
                    <CircularProgressLabel fontSize="lg" fontWeight="bold">
                      {getTaskCompletionPercentage()}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    {project.tasksCompleted}/{project.totalTasks}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {getTaskCompletionPercentage() >= 75 ? 'On track' : 
                     getTaskCompletionPercentage() >= 50 ? 'Warning' : 'Off track'}
                  </Text>
                </Box>
                
                {/* Budget Used */}
                <Box 
                  textAlign="center" 
                  p={6} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH="200px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={4}>
                    Budget Used
                  </Text>
                  <CircularProgress 
                    value={getBudgetUsagePercentage()} 
                    color={getProgressColor(getBudgetUsagePercentage())} 
                    size="80px" 
                    thickness="8px"
                    mb={3}
                  >
                    <CircularProgressLabel fontSize="lg" fontWeight="bold">
                      {getBudgetUsagePercentage()}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    ${project.budgetUsed.toLocaleString()}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    ${project.budget.toLocaleString()} total
                  </Text>
                </Box>
                
                {/* Time Remaining */}
                <Box 
                  textAlign="center" 
                  p={6} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH="200px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={4}>
                    Time Remaining
                  </Text>
                  <CircularProgress 
                    value={getTimeRemainingPercentage()} 
                    color={getProgressColor(getTimeRemainingPercentage())} 
                    size="80px" 
                    thickness="8px"
                    mb={3}
                  >
                    <CircularProgressLabel fontSize="lg" fontWeight="bold">
                      {getTimeRemainingPercentage()}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    8 days
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    On schedule
                  </Text>
                </Box>
                
                {/* Team Members */}
                <Box 
                  textAlign="center" 
                  p={6} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH="200px"
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize="sm" textTransform="uppercase" letterSpacing="wide" mb={4}>
                    Team Members
                  </Text>
                  <Box position="relative" mb={3}>
                    <CircularProgress 
                      value={100} 
                      color="green" 
                      size="80px" 
                      thickness="8px"
                    >
                      <CircularProgressLabel fontSize="lg" fontWeight="bold">
                        {project.team.length}
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    Active
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    Team size
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1400px" py={8}>
        {/* Success/Error Messages */}
        {saveSuccess && (
          <Alert status="success" borderRadius="lg" mb={6}>
            <AlertIcon />
            {saveSuccess}
          </Alert>
        )}
        {error && (
          <Alert status="error" borderRadius="lg" mb={6}>
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        <SimpleGrid columns={{ base: 1, xl: 4 }} spacing={8}>
          {/* Main Content Area */}
          <Box gridColumn={{ xl: "span 3" }}>
                          <VStack spacing={8} align="stretch">
                {/* Project Overview */}
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack>
                      <Icon as={FaInfoCircle} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Project Overview</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <Box mb={6}>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Description
                      </Text>
                      {isEditing ? (
                        <Textarea
                          value={editData.description || ''}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleInputChange('description', e.target.value)}
                          fontSize="lg"
                          borderWidth="2px"
                          borderColor="gray.200"
                          borderRadius="lg"
                          _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                          _hover={{ borderColor: '#14543a' }}
                          rows={4}
                        />
                      ) : (
                        <Text fontSize="lg" color="gray.700" lineHeight="tall">
                          {project.description}
                        </Text>
                      )}
                    </Box>
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Category
                        </Text>
                        {isEditing ? (
                          <Select
                            value={editData.category || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('category', e.target.value)}
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
                        ) : (
                          <Text fontSize="lg" textTransform="capitalize">{project.category}</Text>
                        )}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Client
                        </Text>
                        {isEditing ? (
                          <Input
                            value={editData.client || ''}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('client', e.target.value)}
                            fontSize="lg"
                            borderWidth="2px"
                            borderColor="gray.200"
                            borderRadius="lg"
                            _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                            _hover={{ borderColor: '#14543a' }}
                          />
                        ) : (
                          <Text fontSize="lg">{project.client}</Text>
                        )}
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {/* Customer Information */}
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack>
                      <Icon as={FaUser} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Customer Information</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Customer Name
                        </Text>
                        <HStack>
                          <Icon as={FaUser} color="#003f2d" boxSize={4} />
                          <Text fontSize="lg" fontWeight="medium">{project.customer}</Text>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Email Address
                        </Text>
                        <HStack>
                          <Icon as={FaEnvelope} color="#003f2d" boxSize={4} />
                          <Text fontSize="lg">{project.customerEmail}</Text>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Phone Number
                        </Text>
                        <HStack>
                          <Icon as={FaPhone} color="#003f2d" boxSize={4} />
                          <Text fontSize="lg">{project.customerPhone}</Text>
                        </HStack>
                      </Box>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                

              {/* Timeline & Resources */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
                {/* Timeline */}
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack>
                      <Icon as={FaRegCalendarAlt} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Timeline</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Start Date
                        </Text>
                        {isEditing ? (
                          <HStack>
                            <Icon as={FaCalendarDay} color="#003f2d" />
                            <Input
                              type="date"
                              value={editData.startDate || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('startDate', e.target.value)}
                              fontSize="lg"
                              borderWidth="2px"
                              borderColor="gray.200"
                              borderRadius="lg"
                              _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                              _hover={{ borderColor: '#14543a' }}
                            />
                          </HStack>
                        ) : (
                          <HStack>
                            <Icon as={FaCalendarDay} color="#003f2d" />
                            <Text fontSize="lg">{project.startDate}</Text>
                          </HStack>
                        )}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          End Date
                        </Text>
                        {isEditing ? (
                          <HStack>
                            <Icon as={FaCalendarDay} color="#003f2d" />
                            <Input
                              type="date"
                              value={editData.endDate || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('endDate', e.target.value)}
                              fontSize="lg"
                              borderWidth="2px"
                              borderColor="gray.200"
                              borderRadius="lg"
                              _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                              _hover={{ borderColor: '#14543a' }}
                            />
                          </HStack>
                        ) : (
                          <HStack>
                            <Icon as={FaCalendarDay} color="#003f2d" />
                            <Text fontSize="lg">{project.endDate}</Text>
                          </HStack>
                        )}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Duration
                        </Text>
                        <HStack>
                          <Icon as={FaHourglassHalf} color="#003f2d" />
                          <Text fontSize="lg">15 days</Text>
                        </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                {/* Resources */}
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack>
                      <Icon as={FaMoneyBillWave} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Resources</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Budget
                        </Text>
                        {isEditing ? (
                          <HStack>
                            <Icon as={FaDollarSign} color="#003f2d" />
                            <Input
                              type="number"
                              value={editData.budget || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('budget', e.target.value)}
                              fontSize="lg"
                              borderWidth="2px"
                              borderColor="gray.200"
                              borderRadius="lg"
                              _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                              _hover={{ borderColor: '#14543a' }}
                              min="0"
                              step="0.01"
                              placeholder="Enter budget amount"
                            />
                          </HStack>
                        ) : (
                          <HStack>
                            <Icon as={FaDollarSign} color="#003f2d" />
                            <Text fontSize="lg" fontWeight="bold" color="#003f2d">${project.budget.toLocaleString()}</Text>
                          </HStack>
                        )}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Estimated Hours
                        </Text>
                        {isEditing ? (
                          <HStack>
                            <Icon as={FaClock} color="#003f2d" />
                            <Input
                              type="number"
                              value={editData.estimatedHours || ''}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange('estimatedHours', e.target.value)}
                              fontSize="lg"
                              borderWidth="2px"
                              borderColor="gray.200"
                              borderRadius="lg"
                              _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                              _hover={{ borderColor: '#14543a' }}
                              min="0"
                              step="0.1"
                              placeholder="Enter estimated hours"
                            />
                          </HStack>
                        ) : (
                          <HStack>
                            <Icon as={FaClock} color="#003f2d" />
                            <Text fontSize="lg" fontWeight="bold" color="#003f2d">{project.estimatedHours} hrs</Text>
                          </HStack>
                        )}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Team Members
                        </Text>
                                                 <HStack>
                           <Icon as={FaUsers} color="#003f2d" />
                           <AvatarGroup size="sm" max={3}>
                             {project.team.map((member: string, index: number) => (
                               <Avatar key={index} name={member} />
                             ))}
                           </AvatarGroup>
                           <Text fontSize="sm" color="gray.600">{project.team.length} members</Text>
                         </HStack>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>
            </VStack>
          </Box>

          {/* Sidebar */}
          <Box>
            <VStack spacing={6} align="stretch">
              {/* Team & Ownership */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <HStack>
                    <Icon as={FaUserTie} color="#003f2d" boxSize={5} />
                    <Heading size="md" color="#003f2d" fontWeight="bold">Team & Ownership</Heading>
                  </HStack>
                </CardHeader>
                <CardBody py={6}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Project Owner
                      </Text>
                      <Text fontSize="lg" fontWeight="medium">{project.projectOwner}</Text>
                    </Box>
                    <Divider />
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Created By
                      </Text>
                      <Text fontSize="lg" fontWeight="medium">{project.createdBy}</Text>
                    </Box>
                    <Divider />
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Team
                      </Text>
                                             <VStack align="start" spacing={2}>
                         {project.team.map((member: string, index: number) => (
                           <HStack key={index} spacing={2}>
                             <Avatar size="xs" name={member} />
                             <Text fontSize="sm">{member}</Text>
                           </HStack>
                         ))}
                       </VStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Customer Information */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <HStack>
                    <Icon as={FaUser} color="#003f2d" boxSize={5} />
                    <Heading size="md" color="#003f2d" fontWeight="bold">Customer</Heading>
                  </HStack>
                </CardHeader>
                <CardBody py={6}>
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Name
                      </Text>
                      <Text fontSize="lg" fontWeight="medium">{project.customer}</Text>
                    </Box>
                    <Divider />
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Email
                      </Text>
                      <HStack>
                        <Icon as={FaEnvelope} color="#003f2d" boxSize={4} />
                        <Text fontSize="lg">{project.customerEmail}</Text>
                      </HStack>
                    </Box>
                    <Divider />
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Phone
                      </Text>
                      <HStack>
                        <Icon as={FaPhone} color="#003f2d" boxSize={4} />
                        <Text fontSize="lg">{project.customerPhone}</Text>
                      </HStack>
                    </Box>
                  </VStack>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <Heading size="md" color="#003f2d" fontWeight="bold">Quick Actions</Heading>
                </CardHeader>
                <CardBody py={6}>
                  <VStack spacing={3} align="stretch">
                    <Button leftIcon={<EditIcon />} colorScheme="blue" variant="outline" size="md">
                      Edit Project
                    </Button>
                    <Button leftIcon={<FaTasks />} colorScheme="green" variant="outline" size="md">
                      View Tasks
                    </Button>
                    <Button leftIcon={<FaChartLine />} colorScheme="purple" variant="outline" size="md">
                      View Reports
                    </Button>
                  </VStack>
                </CardBody>
              </Card>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box bg="white" borderTop="1px solid" borderColor="gray.200" py={6} mt={12}>
        <Container maxW="1400px">
          <Flex justify="center" align="center" gap={4}>
            <Button onClick={handleLogout} colorScheme="red" variant="outline" size="md">
              Logout
            </Button>
            <Button as={Link} href="/admin" colorScheme="red" variant="outline" size="md">
              Back to Admin
            </Button>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
} 