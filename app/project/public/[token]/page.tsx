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
    const spent = project.actualCost || 0;
    return Math.min((spent / project.budget) * 100, 100);
  };

  const getTaskCompletionPercentage = () => {
    if (!project || !project.tasks || project.tasks.length === 0) return 0;
    const completedTasks = project.tasks.filter((task: any) => task.status === 'completed').length;
    return (completedTasks / project.tasks.length) * 100;
  };

  const getTimeElapsedPercentage = () => {
    if (!project || !project.startDate || !project.endDate) return 0;
    const start = new Date(project.startDate);
    const end = new Date(project.endDate);
    const now = new Date();
    if (now < start) return 0;
    if (now > end) return 100;
    const total = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    if (total <= 0) return 0;
    return Math.round((elapsed / total) * 100);
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
      <Box bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
        <Container maxW="1400px">
          {/* Project Header */}
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="start">
              <VStack align="start" spacing={2}>
                <HStack spacing={3}>
                  <Badge 
                    colorScheme={getStatusColor(project.status)} 
                    fontSize="sm" 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                  >
                    <Icon as={getStatusIcon(project.status)} mr={2} />
                    {project.status}
                  </Badge>
                  <Badge 
                    colorScheme={getPriorityColor(project.priority)} 
                    fontSize="sm" 
                    px={3} 
                    py={1} 
                    borderRadius="full"
                  >
                    {project.priority} Priority
                  </Badge>
                </HStack>
                <Heading size="2xl" color="#003f2d" fontWeight="bold">
                  {project.name}
                </Heading>
                <Text fontSize="lg" color="gray.600" maxW="3xl">
                  {project.description}
                </Text>
              </VStack>
            </HStack>
            
            {/* Public Access Notice */}
            <Alert status="info" borderRadius="lg">
              <AlertIcon />
              <Text fontSize="sm">
                This is a public view of your project. For full access and management, please contact your project administrator.
              </Text>
            </Alert>
          </VStack>
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
                <Text fontWeight="bold" color="#003f2d" fontSize="xl">{Math.round(getTaskCompletionPercentage())}%</Text>
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
                      {Math.round(getTaskCompletionPercentage())}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    {project.tasks ? project.tasks.filter((task: any) => task.status === 'completed').length : 0}/{project.tasks ? project.tasks.length : 0}
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
                      {Math.round(getBudgetUsagePercentage())}%
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    ${project.budget ? project.budget.toLocaleString() : 0}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {project.budget ? `$${project.budget.toLocaleString()} total` : 'No budget set'}
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
                    value={getTimeElapsedPercentage()} 
                    color={getProgressColor(getTimeElapsedPercentage())} 
                    size="80px" 
                    thickness="8px"
                    mb={3}
                  >
                    <CircularProgressLabel fontSize="lg" fontWeight="bold">
                      {(() => {
                        const percent = getTimeElapsedPercentage();
                        if (!project.startDate || !project.endDate) return 'No dates set';
                        if (percent === 0) return 'Not started';
                        if (percent === 100) return 'Complete';
                        return `${percent}% elapsed`;
                      })()}
                    </CircularProgressLabel>
                  </CircularProgress>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    {project.startDate && project.endDate ? `${project.startDate} - ${project.endDate}` : 'N/A'}
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {(() => {
                      const percent = getTimeElapsedPercentage();
                      if (!project.startDate || !project.endDate) return 'No dates set';
                      if (percent === 0) return 'Not started';
                      if (percent === 100) return 'Complete';
                      return `${percent}% elapsed`;
                    })()}
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
                        {project.team ? project.team.length : 0}
                      </CircularProgressLabel>
                    </CircularProgress>
                  </Box>
                  <Text color="#003f2d" fontSize="lg" fontWeight="bold" mb={1}>
                    {project.team ? project.team.length : 0} Members
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {project.team && project.team.length > 5 ? 'Large team' : project.team && project.team.length > 2 ? 'Medium team' : 'Small team'}
                  </Text>
                </Box>
              </SimpleGrid>
            </Box>
          </VStack>
        </Container>
      </Box>

      {/* Main Content */}
      <Container maxW="1400px" py={8}>
        <SimpleGrid columns={{ base: 1, lg: 3 }} spacing={8}>
          {/* Left Column - Project Details */}
          <Box gridColumn={{ lg: 'span 2' }}>
            <VStack spacing={6} align="stretch">
              {/* Project Overview */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <HStack>
                    <Icon as={FaInfoCircle} color="#003f2d" boxSize={5} />
                    <Heading size="md" color="#003f2d" fontWeight="bold">Project Overview</Heading>
                  </HStack>
                </CardHeader>
                <CardBody py={6}>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <VStack align="start" spacing={4}>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Project Code
                        </Text>
                        <Text fontSize="lg" fontWeight="medium">{project.code}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Client
                        </Text>
                        <Text fontSize="lg" fontWeight="medium">{project.client}</Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Category
                        </Text>
                        <Text fontSize="lg" fontWeight="medium" textTransform="capitalize">{project.category}</Text>
                      </Box>
                    </VStack>
                    <VStack align="start" spacing={4}>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Start Date
                        </Text>
                        <Text fontSize="lg" fontWeight="medium">
                          {project.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          End Date
                        </Text>
                        <Text fontSize="lg" fontWeight="medium">
                          {project.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set'}
                        </Text>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Estimated Hours
                        </Text>
                        <Text fontSize="lg" fontWeight="medium">{project.estimatedHours || 0} hours</Text>
                      </Box>
                    </VStack>
                  </SimpleGrid>
                </CardBody>
              </Card>

              {/* Progress & Budget */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={4}>
                    <HStack>
                      <Icon as={FaChartLine} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Project Progress</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">Task Completion</Text>
                          <Text fontSize="sm" fontWeight="bold" color="gray.700">
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
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">Time Progress</Text>
                          <Text fontSize="sm" fontWeight="bold" color="gray.700">
                            {Math.round(getTimeElapsedPercentage())}%
                          </Text>
                        </HStack>
                        <Progress 
                          value={getTimeElapsedPercentage()} 
                          colorScheme={getProgressColor(getTimeElapsedPercentage())}
                          borderRadius="full"
                          size="lg"
                        />
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={4}>
                    <HStack>
                      <Icon as={FaMoneyBillWave} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Budget Overview</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <VStack spacing={4} align="stretch">
                      <Stat>
                        <StatLabel fontSize="sm" color="gray.600">Total Budget</StatLabel>
                        <StatNumber fontSize="2xl" color="#003f2d" fontWeight="bold">
                          ${project.budget?.toLocaleString() || 0}
                        </StatNumber>
                      </Stat>
                      <Box>
                        <HStack justify="space-between" mb={2}>
                          <Text fontSize="sm" fontWeight="medium" color="gray.700">Budget Usage</Text>
                          <Text fontSize="sm" fontWeight="bold" color="gray.700">
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
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack>
                      <Icon as={FaTasks} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Tasks ({project.tasks.length})</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <VStack spacing={4} align="stretch">
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
                            p={4} 
                            border="1px solid" 
                            borderColor="gray.200" 
                            borderRadius="lg"
                            bg="white"
                          >
                            <HStack justify="space-between" align="start" mb={3}>
                              <VStack align="start" spacing={1} flex={1}>
                                <Text fontWeight="semibold" fontSize="lg">{displayTitle}</Text>
                              </VStack>
                              <HStack spacing={2}>
                                <Badge colorScheme={getStatusColor(task.status)} fontSize="xs">
                                  {task.status}
                                </Badge>
                                <Badge colorScheme={getPriorityColor(task.priority)} fontSize="xs">
                                  {task.priority}
                                </Badge>
                              </HStack>
                            </HStack>
                            <HStack justify="space-between" fontSize="sm" color="gray.600">
                              <Text>Assignee: {task.assignee}</Text>
                              {task.dueDate && (
                                <Text>Due: {new Date(task.dueDate).toLocaleDateString()}</Text>
                              )}
                            </HStack>
                          </Box>
                        );
                      })}
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {/* Project Updates */}
              {project.updates && project.updates.length > 0 && (
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack justify="space-between">
                      <HStack>
                        <Icon as={FaInfoCircle} color="#003f2d" boxSize={5} />
                        <Heading size="md" color="#003f2d" fontWeight="bold">Project Updates ({project.updates.length})</Heading>
                      </HStack>
                      {/* Blur/Unblur All Button */}
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
                                fontSize: '1rem',
                                transition: 'background 0.2s, border 0.2s',
                              }}
                              onClick={handleToggleAllBlur}
                            >
                              <Icon as={allBlurred ? FaLock : FaLockOpen} boxSize={4} />
                              {allBlurred ? 'Unblur All' : 'Blur All'}
                            </button>
                          );
                        })()}
                      </Box>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <VStack spacing={4} align="stretch">
                      {project.updates.map((update: any, index: number) => {
                        const updateId = update.id || index;
                        const isBlurred = blurredUpdates.has(updateId);
                        return (
                          <Box 
                            key={updateId} 
                            p={6} 
                            border="1px solid" 
                            borderColor="gray.200" 
                            borderRadius="lg"
                            bg="white"
                            _hover={{ borderColor: "gray.300", shadow: "sm" }}
                          >
                            {/* Update Header */}
                            <HStack justify="space-between" mb={4} align="start">
                              <VStack align="start" spacing={1} flex={1}>
                                {update.title && (
                                  <Text fontWeight="bold" fontSize="lg" color="#003f2d">
                                    {update.title}
                                  </Text>
                                )}
                                <HStack spacing={4} fontSize="sm" color="gray.600">
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
                                </HStack>
                              </VStack>
                              {/* Security Lock Icon */}
                              <Box cursor="pointer" onClick={() => toggleBlur(updateId)} ml={4}>
                                <Icon as={isBlurred ? FaLock : FaLockOpen} color={isBlurred ? 'red.500' : 'gray.400'} boxSize={5} />
                              </Box>
                            </HStack>
                            {/* Update Content */}
                            <Box>
                              {update.text && (
                                <Box mb={3}>
                                  <Box
                                    style={{ filter: isBlurred ? 'blur(6px)' : 'none', transition: 'filter 0.2s' }}
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
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                        Changes Made:
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
                                        {update.changes}
                                      </Text>
                                    </Box>
                                  )}
                                  {update.attachments && update.attachments.length > 0 && (
                                    <Box>
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                        Attachments ({update.attachments.length}):
                                      </Text>
                                      <VStack align="start" spacing={1}>
                                        {update.attachments.map((attachment: string, idx: number) => (
                                          <Text key={idx} fontSize="sm" color="blue.600">
                                            • {attachment}
                                          </Text>
                                        ))}
                                      </VStack>
                                    </Box>
                                  )}
                                  {update.comments && (
                                    <Box>
                                      <Text fontSize="sm" fontWeight="semibold" color="gray.700" mb={2}>
                                        Comments:
                                      </Text>
                                      <Text fontSize="sm" color="gray.600">
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
                </Card>
              )}
            </VStack>
          </Box>

          {/* Right Column - Sidebar */}
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
                    {project.team && project.team.length > 0 && (
                      <>
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
                      </>
                    )}
                  </VStack>
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
                  <VStack spacing={4} align="stretch">
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Customer Name
                      </Text>
                      <Text fontSize="lg" fontWeight="medium">{project.customer}</Text>
                    </Box>
                    {project.customerEmail && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                            Email
                          </Text>
                          <Text fontSize="lg" fontWeight="medium">{project.customerEmail}</Text>
                        </Box>
                      </>
                    )}
                    {project.customerPhone && (
                      <>
                        <Divider />
                        <Box>
                          <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                            Phone
                          </Text>
                          <Text fontSize="lg" fontWeight="medium">{project.customerPhone}</Text>
                        </Box>
                      </>
                    )}
                  </VStack>
                </CardBody>
              </Card>

              {/* Quotes & Billings */}
              {(Array.isArray(project.linkedQuotes) || Array.isArray(project.linkedInvoices)) && (
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack>
                      <Icon as={FaDollarSign} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Quotes & Billings</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    {/* Linked Quotes */}
                    {Array.isArray(project.linkedQuotes) && project.linkedQuotes.length > 0 && (
                      <Box mb={6}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.700">Linked Quotes</Text>
                          <Badge colorScheme="green">{project.linkedQuotes.length}</Badge>
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
                            <Text fontWeight="bold" color="green.700" fontSize="md" mb={2}>
                              Total Value: A${(grandTotal / 100).toFixed(2)} inc GST
                            </Text>
                          );
                        })()}
                        <VStack align="stretch" spacing={1}>
                          {project.linkedQuotes.map((q: any, idx: number) => {
                            const quoteTotal = Array.isArray(q.lines)
                              ? q.lines.reduce((sum: number, l: any) => sum + (typeof l.amount_total === 'number' ? l.amount_total : 0), 0)
                              : 0;
                            return (
                              <HStack key={q.quoteId || idx} justify="space-between" bg="gray.50" borderRadius="md" px={2} py={1}>
                                <Text fontWeight="medium" color="gray.800">{q.quoteNumber || q.quoteId}</Text>
                                <Text color="green.700" fontWeight="bold">${(quoteTotal / 100).toFixed(2)}</Text>
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
                          <Text fontWeight="semibold" color="gray.700">Linked Invoices</Text>
                          <Badge colorScheme="blue">{project.linkedInvoices.length}</Badge>
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
                            <Text fontWeight="bold" color="blue.700" fontSize="md" mb={2}>
                              Total Value: A${(grandTotal / 100).toFixed(2)} inc GST
                            </Text>
                          );
                        })()}
                        <VStack align="stretch" spacing={1}>
                          {project.linkedInvoices.map((inv: any, idx: number) => {
                            const invoiceTotal = Array.isArray(inv.lines)
                              ? inv.lines.reduce((sum: number, l: any) => sum + (typeof l.amount === 'number' ? l.amount : 0), 0)
                              : 0;
                            return (
                              <HStack key={inv.invoiceId || idx} justify="space-between" bg="gray.50" borderRadius="md" px={2} py={1}>
                                <Text fontWeight="medium" color="gray.800">{inv.invoiceNumber || inv.invoiceId}</Text>
                                <Text color="blue.700" fontWeight="bold">${(invoiceTotal / 100).toFixed(2)}</Text>
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
      <Box bg="white" borderTop="1px solid" borderColor="gray.200" py={6} mt={12}>
        <Container maxW="1400px">
          <Text textAlign="center" color="gray.500" fontSize="sm">
            This is a shared project view. For full access and management, please contact your project administrator.
          </Text>
        </Container>
      </Box>
    </Box>
  );
} 