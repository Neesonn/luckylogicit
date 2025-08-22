'use client';
import { 
  Box, 
  Heading, 
  Text, 
  VStack, 
  HStack,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  Badge,
  Divider,
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
  Alert,
  AlertIcon,
  useToast,
  CircularProgress,
  CircularProgressLabel,
  Tooltip,
  IconButton,
  Collapse,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from '@chakra-ui/react';
import { useParams } from 'next/navigation';
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
  FaPauseCircle,
  FaExclamationCircle,
  FaLock,
  FaLockOpen,
  FaBan,
  FaChevronDown,
  FaChevronUp,
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';

export default function PublicProjectPage() {
  const params = useParams();
  const token = params.token as string;
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const toast = useToast();
  const [blurredUpdates, setBlurredUpdates] = useState<Set<number>>(new Set());
  
  // Collapsible state for sections
  const [tasksExpanded, setTasksExpanded] = useState(false);
  const [updatesExpanded, setUpdatesExpanded] = useState(false);
  
  // Sign-off modal state
  const [showSignOffModal, setShowSignOffModal] = useState(false);

  // Function to get task descriptions for checklist items
  const getTaskDescription = (section: string, taskKey: string): string => {
    const descriptions: { [key: string]: { [key: string]: string } } = {
      preInstallation: {
        confirmTVs: 'Confirm number of TVs required per studio: • 1x Roll Call TV (55" Google OS) • 1–2x Media TVs(65–75" Google OS)',
        confirmSpeakers: 'Confirm Wi-Fi enabled speakers (Sonos or equivalent)',
        confirmiPad: 'Confirm iPad for kiosk software is ready',
        confirmInternet: 'Confirm reliable internet connection is active and tested',
        confirmTimings: 'Confirm TV delivery & installation timings with electricians',
        confirmCabling: 'Ensure backend cabling requirements are completed prior to installation'
      },
      installation: {
        mountTVs: 'Mount TVs securely and confirm functionality',
        configureTVs: 'Connect and configure all TVs to the network',
        configureSpeakers: 'Install and configure Sonos or approved speakers',
        setupiPad: 'Set up iPad with kiosk software and test login',
        confirmCabling: 'Confirm backend cabling is neat and labelled',
        verifyWiFi: 'Verify Wi-Fi strength and stability across all devices'
      },
      postInstallation: {
        demonstrateRollCall: 'Demonstrate operation of Roll Call TV',
        demonstrateMediaTVs: 'Demonstrate operation of Media TVs',
        confirmSpeakers: 'Confirm speakers are connected and tested',
        confirmiPadSoftware: 'Confirm iPad kiosk software is functional',
        validateNetwork: 'Validate network stability and speed tests',
        provideTroubleshooting: 'Provide instructions for basic troubleshooting'
      }
    };
    
    return descriptions[section]?.[taskKey] || taskKey;
  };

  useEffect(() => {
    const fetchPublicProject = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/projects/public/${token}`);
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Project not found or access denied');
        }
        
        setProject(data.project);
        // Blur all updates by default
        if (data.project && Array.isArray(data.project.updates)) {
          const allIds = data.project.updates.map((u: any, idx: number) => u.id || idx);
          setBlurredUpdates(new Set(allIds));
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.message || 'Failed to load project details');
        toast({
          title: 'Error',
          description: 'This project link is invalid or has been revoked',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchPublicProject();
    }
  }, [token, toast]);

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

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'green';
    if (percentage >= 60) return 'orange';
    if (percentage >= 40) return 'yellow';
    return 'red';
  };

  const getBudgetUsagePercentage = () => {
    if (!project || !project.budget) return 0;
    // Calculate budget used from actual hours worked on tasks
    const actualHours = project.tasks ? project.tasks.reduce((total: number, task: any) => total + (task.actualHours || 0), 0) : 0;
    const hourlyRate = project.budget / project.estimatedHours; // Calculate hourly rate
    const budgetUsed = actualHours * hourlyRate;
    return Math.round((budgetUsed / project.budget) * 100);
  };

  const getTaskCompletionPercentage = () => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter((task: any) => task.status === 'completed').length;
    return (completedTasks / project.tasks.length) * 100;
  };

  const getTimeRemainingPercentage = () => {
    if (!project || !project.startDate || !project.endDate) return 0;
    
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    
    // If the project hasn't started yet, show 0%
    if (today < startDate) return 0;
    return Math.round(((totalDays - remainingDays) / totalDays) * 100);
  };

  const toggleBlur = (updateId: number) => {
    setBlurredUpdates(prev => {
      const newSet = new Set(prev);
      if (newSet.has(updateId)) {
        newSet.delete(updateId);
      } else {
        newSet.add(updateId);
      }
      return newSet;
    });
  };

  // Helper to get all update IDs
  const getAllUpdateIds = (): number[] => (project && Array.isArray(project.updates)) ? project.updates.map((u: any, idx: number) => u.id || idx) : [];

  // Blur/Unblur All handler
  const handleToggleAllBlur = () => {
    const allIds = getAllUpdateIds();
    const allBlurred = allIds.every((id: number) => blurredUpdates.has(id));
    if (allBlurred) {
      setBlurredUpdates(new Set()); // Unblur all
    } else {
      setBlurredUpdates(new Set(allIds)); // Blur all
    }
  };

  if (loading) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <VStack spacing={4}>
          <Spinner size="xl" color="#003f2d" />
          <Text color="gray.600">Loading project details...</Text>
        </VStack>
      </Box>
    );
  }

  if (error || !project) {
    return (
      <Box minH="100vh" bg="gray.50" display="flex" alignItems="center" justifyContent="center">
        <Alert status="error" borderRadius="lg" maxW="md">
          <AlertIcon />
          <VStack align="start" spacing={2}>
            <Text fontWeight="bold">Project Not Found</Text>
            <Text fontSize="sm">{error || 'This project link is invalid or has been revoked.'}</Text>
          </VStack>
        </Alert>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg="gray.50">
      {/* Header */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
        <Container maxW="1400px" px={{ base: 4, md: 6 }}>
          {/* Project Header */}
          <VStack spacing={{ base: 3, md: 4 }} align="stretch">
            <VStack spacing={{ base: 3, md: 4 }} align="start">
              <HStack spacing={{ base: 2, md: 3 }} flexWrap="wrap">
                <Badge 
                  colorScheme={getStatusColor(project.status)} 
                  fontSize={{ base: "xs", md: "sm" }} 
                  px={{ base: 2, md: 3 }} 
                  py={{ base: 1, md: 1 }} 
                  borderRadius="full"
                >
                  <Icon as={getStatusIcon(project.status)} mr={2} />
                  {project.status}
                </Badge>
                <Badge 
                  colorScheme={getPriorityColor(project.priority)} 
                  fontSize={{ base: "xs", md: "sm" }} 
                  px={{ base: 2, md: 3 }} 
                  py={{ base: 1, md: 1 }} 
                  borderRadius="full"
                >
                  {project.priority} Priority
                </Badge>
              </HStack>
              <Heading size={{ base: "xl", md: "2xl" }} color="#003f2d" fontWeight="bold">
                {project.name}
              </Heading>
              <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="3xl">
                {project.description}
              </Text>
            </VStack>
            
            {/* Public Access Notice */}
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Text fontSize={{ base: "xs", md: "sm" }}>
                This is a public view of your project. For full access and management, please contact your project administrator.
              </Text>
            </Alert>
          </VStack>
        </Container>
      </Box>

      {/* Progress & Statistics Banner */}
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
        <Container maxW="1400px" px={{ base: 4, md: 6 }}>
          <VStack spacing={{ base: 6, md: 8 }} align="stretch">
            <Heading size={{ base: "md", md: "lg" }} color="#003f2d" fontWeight="bold" textAlign="center">
              Progress & Statistics
            </Heading>
            {/* Animated Progress Bar */}
            <Box>
              <Flex justify="space-between" align="center" mb={3}>
                <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "md", md: "lg" }}>Overall Progress</Text>
                <Text fontWeight="bold" color="#003f2d" fontSize={{ base: "lg", md: "xl" }}>{Math.round(getTaskCompletionPercentage())}%</Text>
              </Flex>
              <Progress 
                value={getTaskCompletionPercentage()} 
                colorScheme={getProgressColor(getTaskCompletionPercentage())} 
                size="lg" 
                borderRadius="full"
                transition="all 1s ease-in-out"
              />
            </Box>
            {/* Statistics Grid with Circular Progress */}
            <Box overflowX="auto" overflowY="hidden">
              <SimpleGrid 
                columns={{ base: 1, sm: 2, md: 4 }} 
                spacing={{ base: 4, md: 6 }} 
                minW={{ base: "280px", sm: "400px", md: "auto" }}
                px={{ base: 0, md: 0 }}
              >
                {/* Tasks Completed */}
                <Box 
                  textAlign="center" 
                  p={{ base: 4, md: 6 }} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH={{ base: "160px", md: "200px" }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide" mb={{ base: 3, md: 4 }}>
                    Tasks Completed
                  </Text>
                  <CircularProgress 
                    value={getTaskCompletionPercentage()} 
                    color={getProgressColor(getTaskCompletionPercentage())} 
                    size={{ base: "60px", md: "80px" }} 
                    thickness="8px"
                    mb={{ base: 2, md: 3 }}
                  >
                    <CircularProgressLabel fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
                      {Math.round(getTaskCompletionPercentage())}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={1}>
                    {project.tasks ? project.tasks.filter((task: any) => task.status === 'completed').length : 0}/{project.tasks ? project.tasks.length : 0}
                  </Text>
                  <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                    {getTaskCompletionPercentage() >= 75 ? 'On track' : 
                     getTaskCompletionPercentage() >= 50 ? 'Warning' : 'Off track'}
                  </Text>
                </Box>
                {/* Budget Used */}
                <Box 
                  textAlign="center" 
                  p={{ base: 4, md: 6 }} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH={{ base: "160px", md: "200px" }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide" mb={{ base: 3, md: 4 }}>
                    Budget Used
                  </Text>
                  <CircularProgress 
                    value={getBudgetUsagePercentage()} 
                    color={getProgressColor(getBudgetUsagePercentage())} 
                    size={{ base: "60px", md: "80px" }} 
                    thickness="8px"
                    mb={{ base: 2, md: 3 }}
                  >
                    <CircularProgressLabel fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
                      {Math.round(getBudgetUsagePercentage())}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={1}>
                    ${(() => {
                      const actualHours = project.tasks ? project.tasks.reduce((total: number, task: any) => total + (task.actualHours || 0), 0) : 0;
                      const hourlyRate = project.budget / project.estimatedHours;
                      const budgetUsed = actualHours * hourlyRate;
                      return Math.round(budgetUsed).toLocaleString();
                    })()}
                  </Text>
                  <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                    ${project.budget ? project.budget.toLocaleString() : 0} total
                  </Text>
                </Box>
                {/* Time Remaining */}
                <Box 
                  textAlign="center" 
                  p={{ base: 4, md: 6 }} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH={{ base: "160px", md: "200px" }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide" mb={{ base: 3, md: 4 }}>
                    Time Remaining
                  </Text>
                  <CircularProgress 
                    value={getTimeRemainingPercentage()} 
                    color={getProgressColor(getTimeRemainingPercentage())} 
                    size={{ base: "60px", md: "80px" }} 
                    thickness="8px"
                    mb={{ base: 2, md: 3 }}
                  >
                    <CircularProgressLabel fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
                      {(() => {
                        if (!project || !project.startDate || !project.endDate) return 'No dates set';
                        const startDate = new Date(project.startDate);
                        const endDate = new Date(project.endDate);
                        const today = new Date();
                        const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                        const remainingDays = Math.max(0, totalDays - elapsedDays);
                        return `${remainingDays} days`;
                      })()}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={1}>
                    {(() => {
                      if (!project || !project.startDate || !project.endDate) return 'N/A';
                      const startDate = new Date(project.startDate);
                      const endDate = new Date(project.endDate);
                      const today = new Date();
                      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                      const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                      const remainingDays = Math.max(0, totalDays - elapsedDays);
                      return `${remainingDays} days`;
                    })()}
                  </Text>
                  <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                    {(() => {
                      if (!project || !project.startDate || !project.endDate) return 'N/A';
                      const startDate = new Date(project.startDate);
                      const endDate = new Date(project.endDate);
                      const today = new Date();
                      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                      const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
                      const remainingDays = Math.max(0, totalDays - elapsedDays);
                      const percentage = Math.round(((totalDays - remainingDays) / totalDays) * 100);
                      if (percentage >= 75) return 'Behind schedule';
                      if (percentage >= 50) return 'On schedule';
                      return 'Ahead of schedule';
                    })()}
                  </Text>
                </Box>
                {/* Team Members */}
                <Box 
                  textAlign="center" 
                  p={{ base: 4, md: 6 }} 
                  bg="gray.50" 
                  borderRadius="xl" 
                  border="1px solid" 
                  borderColor="gray.200"
                  minH={{ base: "160px", md: "200px" }}
                  display="flex"
                  flexDirection="column"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text color="gray.600" fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide" mb={{ base: 3, md: 4 }}>
                    Team Members
                  </Text>
                  <Box position="relative" mb={{ base: 2, md: 3 }}>
                    <CircularProgress 
                      value={100} 
                      color="green" 
                      size={{ base: "60px", md: "80px" }} 
                      thickness="8px"
                    >
                      <CircularProgressLabel fontSize={{ base: "sm", md: "lg" }} fontWeight="bold">
                        {project.team ? project.team.length : 0}
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  <Text color="#003f2d" fontSize={{ base: "md", md: "lg" }} fontWeight="bold" mb={1}>
                    {project.team ? project.team.length : 0} Members
                  </Text>
                  <Text color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
                    {project.team && project.team.length > 5 ? 'Large team' : project.team && project.team.length > 2 ? 'Medium team' : 'Small team'}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1400px" py={{ base: 6, md: 8 }} px={{ base: 4, md: 6 }}>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={{ base: 6, md: 8 }}>
          {/* Left Column - Project Details */}
          <Box gridColumn={{ lg: 'span 2' }}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Project Overview */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
                  <HStack>
                    <Icon as={FaInfoCircle} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                    <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Project Overview</Heading>
                  </HStack>
                </CardHeader>
                <CardBody py={{ base: 4, md: 6 }}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
                    <VStack align="start" spacing={{ base: 3, md: 4 }}>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                          Project Code
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.code}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                          Client
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.client}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                          Category
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium" textTransform="capitalize">{project.category}</Text>
                      </Box>
                    </VStack>
                    <VStack align="start" spacing={{ base: 3, md: 4 }}>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                          Start Date
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                          End Date
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                          Estimated Hours
                        </Text>
                        <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.estimatedHours || 0} hours</Text>
                      </Box>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Progress & Budget */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }}>
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 3, md: 4 }}>
                    <HStack>
                      <Icon as={FaChartLine} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                      <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Project Progress</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="gray.700">Task Completion</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                            {Math.round(getTaskCompletionPercentage())}%
                          </Text>
                        </HStack>
                        <Progress 
                          value={getTaskCompletionPercentage()} 
                          colorScheme={getProgressColor(getTaskCompletionPercentage())}
                          borderRadius="full"
                          size="lg"
                        />
                      </Box>

                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="gray.700">Sign Off Status</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                            {project.sign_off_data ? 'Completed' : 'Not Signed Off'}
                          </Text>
                        </HStack>
                        <HStack spacing={2} align="center">
                          <Icon 
                            as={project.sign_off_data ? FaCheckCircle : FaExclamationCircle} 
                            color={project.sign_off_data ? 'green.500' : 'orange.500'} 
                            boxSize={4} 
                          />
                          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                            {project.sign_off_data ? 
                              `Completed on ${new Date(project.sign_off_data.timestamp).toLocaleDateString()}` : 
                              'Project sign-off pending'
                            }
                          </Text>
                        </HStack>
                        {project.sign_off_data && (
                          <Box mt={3}>
                            <Button
                              onClick={() => setShowSignOffModal(true)}
                              leftIcon={<Icon as={FaCheckCircle} />}
                              colorScheme="green"
                              size="sm"
                              variant="outline"
                              w="full"
                            >
                              View Completed Sign Off
                            </Button>
                          </Box>
                        )}
                      </Box>

                    </VStack>
                  </CardBody>
                </Card>

                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 3, md: 4 }}>
                    <HStack>
                      <Icon as={FaMoneyBillWave} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                      <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Budget Overview</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                      <Stat>
                        <StatLabel fontSize={{ base: "xs", md: "sm" }} color="gray.600">Total Budget</StatLabel>
                        <StatNumber fontSize={{ base: "xl", md: "2xl" }} color="#003f2d" fontWeight="bold">
                          ${project.budget?.toLocaleString() || 0}
                        </StatNumber>
                      </Stat>
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="medium" color="gray.700">Budget Usage</Text>
                          <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="bold" color="gray.700">
                            {Math.round(getBudgetUsagePercentage())}%
                          </Text>
                        </HStack>
                        <Progress 
                          value={getBudgetUsagePercentage()} 
                          colorScheme={getProgressColor(getBudgetUsagePercentage())}
                          borderRadius="full"
                          size="lg"
                        />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>
              </SimpleGrid>

              {/* Tasks */}
              {project.tasks && project.tasks.length > 0 && (
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
                    <HStack justify="space-between" w="full">
                    <HStack>
                      <Icon as={FaTasks} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                      <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Tasks ({project.tasks.length})</Heading>
                      </HStack>
                      <IconButton
                        aria-label={tasksExpanded ? "Collapse tasks" : "Expand tasks"}
                        icon={<Icon as={tasksExpanded ? FaChevronUp : FaChevronDown} />}
                        size="sm"
                        variant="ghost"
                        colorScheme="gray"
                        onClick={() => setTasksExpanded(!tasksExpanded)}
                        _hover={{ bg: 'gray.100' }}
                      />
                    </HStack>
                  </CardHeader>
                  <Collapse in={tasksExpanded} animateOpacity>
                  <CardBody py={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                      {project.tasks.map((task: any, index: number) => {
                        // Flexible regex to match any InLIFE Wellness KIOSK URL
                        const kioskUrlPattern = /https:\/\/central\.inlifewellness\.com\.au\/monitor_board\/getRollCall\/[^\s]+/g;
                        let displayTitle = task.title;
                        if (typeof displayTitle === 'string') {
                          displayTitle = displayTitle.replace(kioskUrlPattern, "[blurred] blur'd for security");
                        }
                        return (
                          <Box 
                            key={task.id || index} 
                            p={{ base: 3, md: 4 }} 
                            border="1px solid" 
                            borderColor="gray.200" 
                            borderRadius="lg"
                            bg="white"
                          >
                            <VStack align="start" spacing={{ base: 2, md: 3 }}>
                              <Text fontWeight="semibold" fontSize={{ base: "md", md: "lg" }}>{displayTitle}</Text>
                              <HStack spacing={{ base: 2, md: 2 }} flexWrap="wrap">
                                <Badge colorScheme={getStatusColor(task.status)} fontSize={{ base: "xs", md: "xs" }}>
                                  {task.status}
                                </Badge>
                                <Badge colorScheme={getPriorityColor(task.priority)} fontSize={{ base: "xs", md: "xs" }}>
                                  {task.priority}
                                </Badge>
                              </HStack>
                              <VStack align="start" spacing={1} fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                                <Text>Assignee: {task.assignee}</Text>
                                {task.dueDate && (
                                  <Text>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
                                )}
                              </VStack>
                            </VStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  </CardBody>
                  </Collapse>
                </Card>
              )}

              {/* Project Updates */}
              {project.updates && project.updates.length > 0 && (
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
                    <VStack align="start" spacing={{ base: 3, md: 4 }}>
                      <HStack justify="space-between" w="full">
                      <HStack>
                        <Icon as={FaInfoCircle} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                        <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Project Updates ({project.updates.length})</Heading>
                      </HStack>
                        <IconButton
                          aria-label={updatesExpanded ? "Collapse updates" : "Expand updates"}
                          icon={<Icon as={updatesExpanded ? FaChevronUp : FaChevronDown} />}
                          size="sm"
                          variant="ghost"
                          colorScheme="gray"
                          onClick={() => setUpdatesExpanded(!updatesExpanded)}
                          _hover={{ bg: 'gray.100' }}
                        />
                      </HStack>
                      {/* Blur/Unblur All Button - Only show when expanded */}
                      {updatesExpanded && (
                      <Box>
                        {(() => {
                          const allIds = getAllUpdateIds();
                          const allBlurred = allIds.every((id: number) => blurredUpdates.has(id));
                          return (
                            <button
                              style={{
                                background: 'none',
                                border: '1px solid #CBD5E0',
                                borderRadius: '8px',
                                padding: '6px 16px',
                                color: '#003f2d',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontSize: '0.875rem',
                                transition: 'background 0.2s, border 0.2s',
                              }}
                              onClick={handleToggleAllBlur}
                            >
                                                              <Icon as={allBlurred ? FaLockOpen : FaLock} boxSize={4} />
                              {allBlurred ? 'Show Updates' : 'Hide Updates'}
                            </button>
                          );
                        })()}
                      </Box>
                      )}
                    </VStack>
                  </CardHeader>
                  <Collapse in={updatesExpanded} animateOpacity>
                  <CardBody py={{ base: 4, md: 6 }}>
                    <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                      {project.updates.map((update: any, index: number) => {
                        const updateId = update.id || index;
                        const isBlurred = blurredUpdates.has(updateId);
                        return (
                          <Box 
                            key={updateId} 
                            p={{ base: 4, md: 6 }} 
                            border="1px solid" 
                            borderColor="gray.200" 
                            borderRadius="lg"
                            bg="white"
                            _hover={{ borderColor: "gray.300", shadow: "sm" }}
                          >
                            {/* Update Header */}
                            <VStack align="start" spacing={{ base: 3, md: 4 }} mb={{ base: 3, md: 4 }}>
                              <HStack justify="space-between" align="start" w="full">
                                <VStack align="start" spacing={1} flex={1}>
                                  {update.title && (
                                    <Text fontWeight="bold" fontSize={{ base: "md", md: "lg" }} color="#003f2d">
                                      {update.title}
                                    </Text>
                                  )}
                                  <VStack align="start" spacing={{ base: 2, md: 4 }} fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                                    <HStack spacing={1}>
                                      <Icon as={FaRegCalendarAlt} boxSize={3} />
                                      <Text>
                                        {update.timestamp || 'Unknown date'}
                                      </Text>
                                    </HStack>
                                    {update.author && (
                                      <HStack spacing={1}>
                                        <Icon as={FaUser} boxSize={3} />
                                        <Text>{update.author}</Text>
                                      </HStack>
                                    )}
                                    {update.type && (
                                      <Badge colorScheme="blue" fontSize="xs" px={2} py={1}>
                                        {update.type}
                                      </Badge>
                                    )}
                                  </VStack>
                                </VStack>
                                {/* Security Lock Icon */}
                                <Box cursor="pointer" onClick={() => toggleBlur(updateId)} ml={4}>
                                  <Icon as={isBlurred ? FaLock : FaLockOpen} color={isBlurred ? 'red.500' : 'gray.400'} boxSize={5} />
                                </Box>
                              </HStack>
                            </VStack>
                            {/* Update Content */}
                            <Box>
                              {update.text && (
                                <Box mb={3}>
                                  <Box
                                    style={{ 
                                      filter: isBlurred ? 'blur(6px)' : 'none', 
                                      transition: 'filter 0.2s',
                                      userSelect: isBlurred ? 'none' : 'auto',
                                      WebkitUserSelect: isBlurred ? 'none' : 'auto',
                                      MozUserSelect: isBlurred ? 'none' : 'auto'
                                    }}
                                    _hover={{ filter: 'none' }}
                                  >
                                    <ReactMarkdown>{update.text}</ReactMarkdown>
                                  </Box>
                                </Box>
                              )}
                              {/* Additional Update Fields (if any) */}
                              {(update.changes || update.attachments || update.comments) && (
                                <VStack align="start" spacing={3} mt={4} pt={4} borderTop="1px solid" borderColor="gray.100">
                                  {update.changes && (
                                    <Box>
                                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="gray.700" mb={2}>
                                        Changes Made:
                                      </Text>
                                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                                        {update.changes}
                                      </Text>
                                    </Box>
                                  )}
                                  {update.attachments && update.attachments.length > 0 && (
                                    <Box>
                                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="gray.700" mb={2}>
                                        Attachments ({update.attachments.length}):
                                      </Text>
                                      <VStack align="start" spacing={1}>
                                        {update.attachments.map((attachment: string, idx: number) => (
                                          <Text key={idx} fontSize={{ base: "xs", md: "sm" }} color="blue.600">
                                            • {attachment}
                                          </Text>
                                        ))}
                                      </VStack>
                                    </Box>
                                  )}
                                  {update.comments && (
                                    <Box>
                                      <Text fontSize={{ base: "xs", md: "sm" }} fontWeight="semibold" color="gray.700" mb={2}>
                                        Comments:
                                      </Text>
                                      <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                                        {update.comments}
                                      </Text>
                                    </Box>
                                  )}
                                </VStack>
                              )}
                            </Box>
                          </Box>
                        );
                      })}
                    </VStack>
                  </CardBody>
                  </Collapse>
                </Card>
              )}
            </VStack>
          </Box>

          {/* Right Column - Sidebar */}
          <Box>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Team & Ownership */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
                  <HStack>
                    <Icon as={FaUserTie} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                    <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Team & Ownership</Heading>
                  </HStack>
                </CardHeader>
                <CardBody py={{ base: 4, md: 6 }}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                        Project Owner
                      </Text>
                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.projectOwner}</Text>
                    </Box>
                    <Divider />
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                        Created By
                      </Text>
                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.createdBy}</Text>
                    </Box>
                    {project.team && project.team.length > 0 && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                            Team
                          </Text>
                          <VStack align="start" spacing={2}>
                            {project.team.map((member: string, index: number) => (
                              <HStack key={index} spacing={2}>
                                <Avatar size={{ base: "xs", md: "xs" }} name={member} />
                                <Text fontSize={{ base: "sm", md: "sm" }}>{member}</Text>
                              </HStack>
                            ))}
                          </VStack>
                        </Box>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Customer Information */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
                  <HStack>
                    <Icon as={FaUser} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                    <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Customer Information</Heading>
                  </HStack>
                </CardHeader>
                <CardBody py={{ base: 4, md: 6 }}>
                  <VStack spacing={{ base: 3, md: 4 }} align="stretch">
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                        Customer Name
                      </Text>
                      <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.customer}</Text>
                    </Box>
                    {project.customerEmail && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                            Email
                          </Text>
                          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.customerEmail}</Text>
                        </Box>
                      </>
                    )}
                    {project.customerPhone && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontWeight="semibold" color="gray.700" mb={2} fontSize={{ base: "xs", md: "sm" }} textTransform="uppercase" letterSpacing="wide">
                            Phone
                          </Text>
                          <Text fontSize={{ base: "md", md: "lg" }} fontWeight="medium">{project.customerPhone}</Text>
                        </Box>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Quotes & Billings */}
              {(Array.isArray(project.linkedQuotes) || Array.isArray(project.linkedInvoices)) && (
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }}>
                    <HStack>
                      <Icon as={FaDollarSign} color="#003f2d" boxSize={{ base: 4, md: 5 }} />
                      <Heading size={{ base: "sm", md: "md" }} color="#003f2d" fontWeight="bold">Quotes & Billings</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={{ base: 4, md: 6 }}>
                    {/* Linked Quotes */}
                    {Array.isArray(project.linkedQuotes) && project.linkedQuotes.length > 0 && (
                      <Box mb={6}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "xs", md: "sm" }}>Linked Quotes</Text>
                          <Badge colorScheme="green" fontSize={{ base: "xs", md: "sm" }}>{project.linkedQuotes.length}</Badge>
                        </HStack>
                        <Divider my={2} />
                        {/* Grand total of all quotes */}
                        {(() => {
                          const grandTotal = project.linkedQuotes.reduce((sum: number, q: any) => {
                            const quoteTotal = Array.isArray(q.lines)
                              ? q.lines.reduce((sum: number, l: any) => sum + (typeof l.amount_total === 'number' ? l.amount_total : 0), 0)
                              : 0;
                            return sum + quoteTotal;
                          }, 0);
                          return (
                            <Text fontWeight="bold" color="green.700" fontSize={{ base: "sm", md: "md" }} mb={2}>
                              Total Value: A${(grandTotal / 100).toFixed(2)} inc GST
                            </Text>
                          );
                        })()}
                        <VStack align="stretch" spacing={1}>
                          {project.linkedQuotes.map((q: any, idx: number) => {
                            const quoteTotal = Array.isArray(q.lines)
                              ? q.lines.reduce((sum: number, l: any) => sum + (typeof l.amount_total === 'number' ? l.amount_total : 0), 0)
                              : 0;
                            // Status logic
                            let status = (q.status || '').toLowerCase();
                            let icon = FaExclamationCircle;
                            let color = 'gray.400';
                            let tooltip = 'Unknown status';
                            if (status === 'open') {
                              // Check for expiry
                              if (q.expires_at && q.expires_at * 1000 < Date.now()) {
                                icon = FaExclamationCircle;
                                color = 'red.500';
                                tooltip = 'Quote expired';
                              } else {
                                icon = FaExclamationTriangle;
                                color = 'orange.400';
                                tooltip = 'Quote sent - pending acceptance';
                              }
                            } else if (status === 'accepted') {
                              icon = FaCheckCircle;
                              color = 'green.500';
                              tooltip = 'Quote accepted';
                            } else if (status === 'expired') {
                              icon = FaExclamationCircle;
                              color = 'red.500';
                              tooltip = 'Quote expired';
                            } else if (status === 'draft') {
                              icon = FaPauseCircle;
                              color = 'gray.400';
                              tooltip = 'Draft quote';
                            } else if (status === 'canceled') {
                              icon = FaBan;
                              color = 'gray.400';
                              tooltip = 'Quote canceled';
                            }
                            return (
                              <HStack key={q.quoteId || idx} justify="space-between" bg="gray.50" borderRadius="md" px={2} py={1}>
                                <HStack>
                                  <Tooltip label={tooltip} hasArrow>
                                    <span><Icon as={icon} color={color} boxSize={4} mr={1} /></span>
                                  </Tooltip>
                                  <Text fontWeight="medium" color="gray.800" fontSize={{ base: "xs", md: "sm" }}>{q.quoteNumber || q.quoteId}</Text>
                                </HStack>
                                <Text color="green.700" fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>${(quoteTotal / 100).toFixed(2)}</Text>
                              </HStack>
                            );
                          })}
                        </VStack>
                      </Box>
                    )}
                    {/* Linked Invoices */}
                    {Array.isArray(project.linkedInvoices) && project.linkedInvoices.length > 0 && (
                      <Box>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.700" fontSize={{ base: "xs", md: "sm" }}>Linked Invoices</Text>
                          <Badge colorScheme="blue" fontSize={{ base: "xs", md: "sm" }}>{project.linkedInvoices.length}</Badge>
                        </HStack>
                        <Divider my={2} />
                        {/* Grand total of all invoices */}
                        {(() => {
                          const grandTotal = project.linkedInvoices.reduce((sum: number, inv: any) => {
                            const invoiceTotal = Array.isArray(inv.lines)
                              ? inv.lines.reduce((sum: number, l: any) => sum + (typeof l.amount === 'number' ? l.amount : 0), 0)
                              : 0;
                            return sum + invoiceTotal;
                          }, 0);
                          return (
                            <Text fontWeight="bold" color="blue.700" fontSize={{ base: "sm", md: "md" }} mb={2}>
                              Total Value: A${(grandTotal / 100).toFixed(2)} inc GST
                            </Text>
                          );
                        })()}
                        <VStack align="stretch" spacing={1}>
                          {project.linkedInvoices.map((inv: any, idx: number) => {
                            const invoiceTotal = Array.isArray(inv.lines)
                              ? inv.lines.reduce((sum: number, l: any) => sum + (typeof l.amount === 'number' ? l.amount : 0), 0)
                              : 0;
                            // Status logic
                            let status = (inv.status || '').toLowerCase();
                            let icon = FaExclamationTriangle;
                            let color = 'gray.400';
                            let tooltip = 'Unknown status';
                            const now = Date.now();
                            const due = inv.due_date ? inv.due_date * 1000 : null;
                            if (status === 'open') {
                              if (due && due < now) {
                                icon = FaExclamationCircle;
                                color = 'red.500';
                                tooltip = 'Invoice overdue';
                              } else {
                                icon = FaExclamationTriangle;
                                color = 'orange.400';
                                tooltip = 'Invoice sent - pending payment';
                              }
                            } else if (status === 'paid') {
                              icon = FaCheckCircle;
                              color = 'green.500';
                              tooltip = 'Invoice paid';
                            } else if (status === 'uncollectible' || status === 'void') {
                              icon = FaBan;
                              color = 'gray.400';
                              tooltip = 'Invoice void/uncollectible';
                            }
                            return (
                              <HStack key={inv.invoiceId || idx} justify="space-between" bg="gray.50" borderRadius="md" px={2} py={1}>
                                <HStack>
                                  <Tooltip label={tooltip} hasArrow>
                                    <span><Icon as={icon} color={color} boxSize={4} mr={1} /></span>
                                  </Tooltip>
                                  <Text fontWeight="medium" color="gray.800" fontSize={{ base: "xs", md: "sm" }}>{inv.invoiceNumber || inv.invoiceId}</Text>
                                </HStack>
                                <Text color="blue.700" fontWeight="bold" fontSize={{ base: "xs", md: "sm" }}>${(invoiceTotal / 100).toFixed(2)}</Text>
                              </HStack>
                            );
                          })}
                        </VStack>
                      </Box>
                    )}
                  </CardBody>
                </Card>
              )}
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Footer */}
      <Box bg="white" borderTop="1px solid" borderColor="gray.200" py={{ base: 4, md: 6 }} mt={{ base: 8, md: 12 }}>
        <Container maxW="1400px" px={{ base: 4, md: 6 }}>
          <Text textAlign="center" color="gray.500" fontSize={{ base: "xs", md: "sm" }}>
            This is a shared project view. For full access and management, please contact your project administrator.
          </Text>
        </Container>
      </Box>

      {/* Sign Off Modal */}
      <Modal isOpen={showSignOffModal} onClose={() => setShowSignOffModal(false)} size="full">
        <ModalOverlay />
        <ModalContent borderRadius="xl" mx={{ base: 1, md: 8 }} maxW="6xl" bg="white" shadow="lg">
          <ModalHeader bg="#003f2d" color="white" borderTopRadius="xl" py={{ base: 3, md: 4 }}>
            <HStack spacing={{ base: 2, md: 3 }}>
              <Icon as={FaCheckCircle} boxSize={{ base: 4, md: 5 }} />
              <Heading size={{ base: "md", md: "lg" }} fontWeight="bold">
                Project Sign Off - Completed
              </Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={{ base: 4, md: 6 }} maxH="85vh" overflowY="auto" onWheel={(e) => e.stopPropagation()}>
            <VStack spacing={{ base: 4, md: 6 }} align="stretch">
              {/* Timestamp */}
              <Box textAlign="center">
                <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" fontWeight="semibold" mb={{ base: 2, md: 3 }}>
                  Sign Off Timestamp
                </Text>
                <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
                  {project?.sign_off_data?.timestamp ? new Date(project.sign_off_data.timestamp).toLocaleString() : 'Loading...'}
                </Text>
              </Box>

              {/* Customer Details */}
              <Box bg="gray.50" p={{ base: 4, md: 6 }} borderRadius="lg" border="1px solid" borderColor="gray.200">
                <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" fontWeight="bold" mb={{ base: 3, md: 4 }}>
                  Customer Details
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 8 }}>
                  <Box>
                    <Text fontWeight="semibold" color="gray.700" mb={1} fontSize={{ base: "sm", md: "md" }} textTransform="uppercase" letterSpacing="wide">
                      Name
                    </Text>
                    <Text fontSize={{ base: "md", md: "lg" }} color="gray.800">
                      {project?.customer || 'N/A'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.700" mb={1} fontSize={{ base: "sm", md: "md" }} textTransform="uppercase" letterSpacing="wide">
                      Email
                    </Text>
                    <Text fontSize={{ base: "md", md: "lg" }} color="gray.800">
                      {project?.customerEmail || 'N/A'}
                    </Text>
                    </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.700" mb={1} fontSize={{ base: "sm", md: "md" }} textTransform="uppercase" letterSpacing="wide">
                      Install Cost
                    </Text>
                    <Text fontSize={{ base: "md", md: "lg" }} color="gray.800" fontWeight="semibold">
                      ${project?.budget ? project.budget.toLocaleString() : 'N/A'}
                    </Text>
                  </Box>
                  <Box>
                    <Text fontWeight="semibold" color="gray.700" mb={1} fontSize={{ base: "sm", md: "md" }} textTransform="uppercase" letterSpacing="wide">
                      Address
                    </Text>
                    <VStack align="start" spacing={1} fontSize={{ base: "md", md: "lg" }}>
                      {project?.customerAddressLine1 && (
                        <Text color="gray.800">{project.customerAddressLine1}</Text>
                      )}
                      {project?.customerAddressLine2 && (
                        <Text color="gray.800">{project.customerAddressLine2}</Text>
                      )}
                      {(project?.customerCity || project?.customerState || project?.customerPostcode) && (
                        <Text color="gray.800">
                          {[project.customerCity, project.customerState, project.customerPostcode].filter(Boolean).join(', ')}
                        </Text>
                      )}
                      {project?.customerCountry && (
                        <Text color="gray.800">{project.customerCountry}</Text>
                      )}
                      {!project?.customerAddressLine1 && !project?.customerAddressLine2 && !project?.customerCity && !project?.customerState && !project?.customerPostcode && !project?.customerCountry && (
                        <Text color="gray.800">No address information available</Text>
                      )}
                    </VStack>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Completed Checklist Summary */}
              <Box>
                <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" fontWeight="semibold" mb={{ base: 3, md: 4 }}>
                  Completed Checklist Summary
                </Text>
                <Box 
                  bg="gray.50" 
                  p={{ base: 4, md: 6 }} 
                  borderRadius="lg" 
                  border="1px solid" 
                  borderColor="gray.200"
                  maxH="400px"
                  overflowY="auto"
                  css={{
                    '&::-webkit-scrollbar': {
                      width: '8px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#c1c1c1',
                      borderRadius: '4px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#a8a8a8',
                    },
                  }}
                >
                  <VStack spacing={{ base: 2, md: 3 }} align="stretch">
                    {(['preInstallation', 'installation', 'postInstallation'] as const).map((section) => {
                      const tasks = project?.sign_off_data?.completedChecklist?.[section];
                      if (!tasks) return null;
                      
                      return (
                        <Box key={section}>
                          <Text fontWeight="semibold" color="gray.700" textTransform="capitalize" mb={{ base: 1, md: 2 }}>
                            {section.replace(/([A-Z])/g, ' $1').trim()}
                          </Text>
                          <VStack spacing={{ base: 1, md: 2 }} align="stretch" ml={{ base: 2, md: 4 }}>
                            {Object.entries(tasks).map(([taskKey, completed]) => (
                              <HStack key={taskKey} spacing={{ base: 2, md: 3 }}>
                                <Icon 
                                  as={completed ? FaCheckCircle : FaExclamationCircle} 
                                  color={completed ? 'green.500' : 'red.500'} 
                                  boxSize={{ base: 4, md: 5 }} 
                                />
                                <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600">
                                  {getTaskDescription(section, taskKey)}
                                </Text>
                              </HStack>
                            ))}
                          </VStack>
                          {/* Section Comment Display */}
                          {project?.sign_off_data?.sectionComments?.[section] && (
                            <Box mt={2} ml={{ base: 2, md: 4 }} bg="blue.50" p={3} borderRadius="md" border="1px solid" borderColor="blue.200">
                              <Text fontSize="xs" color="blue.800" fontWeight="medium" mb={1}>Lucky Logic Comments:</Text>
                              <Text fontSize="xs" color="blue.700" whiteSpace="pre-line">{project.sign_off_data.sectionComments[section]}</Text>
                            </Box>
                          )}
                        </Box>
                      );
                    })}
                  </VStack>
                </Box>
              </Box>

              {/* Digital Signature */}
              <Box>
                <Text fontSize={{ base: "lg", md: "xl" }} color="gray.700" fontWeight="semibold" mb={{ base: 3, md: 4 }}>
                  Digital Signature
                </Text>
                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mb={{ base: 4, md: 6 }}>
                  This is the signature that was submitted with the completed sign-off.
                </Text>
                
                <Box 
                  border="2px dashed" 
                  borderColor="gray.300" 
                  borderRadius="lg" 
                  p={{ base: 3, md: 4 }} 
                  bg="gray.50"
                  position="relative"
                  textAlign="center"
                >
                  {project?.sign_off_data?.signature ? (
                    <img 
                      src={project.sign_off_data.signature} 
                      alt="Digital Signature" 
                      style={{
                        maxWidth: '100%',
                        height: 'auto',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        backgroundColor: 'white'
                      }}
                    />
                  ) : (
                    <Text color="gray.500">No signature available</Text>
                  )}
                </Box>
              </Box>
            </VStack>
          </ModalBody>
          <ModalFooter py={{ base: 3, md: 4 }}>
            <Button 
              onClick={() => setShowSignOffModal(false)} 
              variant="outline"
              size={{ base: "sm", md: "lg" }}
              w="full"
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 