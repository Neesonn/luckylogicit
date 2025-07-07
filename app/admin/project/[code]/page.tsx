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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowBackIcon, EditIcon, DeleteIcon, ChevronRightIcon, AddIcon } from '@chakra-ui/icons';
import { useState, useEffect, useCallback } from 'react';
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
  FaTrash,
  FaEdit
} from 'react-icons/fa';

// Default project data (fallback if localStorage is empty)
const defaultProjects = [
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
  const [projectUpdates, setProjectUpdates] = useState<any[]>([]);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [newUpdateText, setNewUpdateText] = useState('');
  const [addingUpdate, setAddingUpdate] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEditTaskModalOpen, setIsEditTaskModalOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'planned',
    priority: 'medium',
    assignee: '',
    dueDate: '',
    estimatedHours: 0,
    actualHours: 0
  });
  const [editingTask, setEditingTask] = useState<any>(null);
  const [addingTask, setAddingTask] = useState(false);
  const [editingTaskLoading, setEditingTaskLoading] = useState(false);
  const [tasks, setTasks] = useState<any[]>([]);
  // State for editing updates
  const [isEditUpdateModalOpen, setIsEditUpdateModalOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState<any>(null);
  const [editUpdateText, setEditUpdateText] = useState('');
  const [editingUpdateLoading, setEditingUpdateLoading] = useState(false);

  useEffect(() => {
    // Fetch project details from database
    const fetchProject = async () => {
      setLoading(true);
      try {
        // Fetch projects from Supabase API
        const response = await fetch('/api/projects');
        const data = await response.json();
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch projects');
        }
        
        // Find the specific project by code
        const foundProject = data.projects.find((p: any) => p.code === projectCode);
        
        if (foundProject) {
          setProject(foundProject);
          
          // Load project updates if available, initialize as empty array if not
          if (foundProject.updates && Array.isArray(foundProject.updates)) {
            setProjectUpdates(foundProject.updates);
          } else {
            setProjectUpdates([]);
            console.log('No updates found for project, initializing empty array');
          }
          
          // Load tasks if available, initialize as empty array if not
          if (foundProject.tasks && Array.isArray(foundProject.tasks)) {
            setTasks(foundProject.tasks);
          } else {
            setTasks([]);
            console.log('No tasks found for project, initializing empty array');
          }
        } else {
          setError('Project not found');
        }
      } catch (err: any) {
        console.error('Error fetching project:', err);
        setError(err.message || 'Failed to load project details');
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
      // Update the project data
      const updatedProject = { 
        ...editData,
        updated_at: new Date().toISOString()
      };
      
      // Send update to Supabase API
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update project');
      }

      setProject(updatedProject);
      setIsEditing(false);
      setSaveSuccess('Project updated successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => setSaveSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to save project changes');
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
    if (!project || !project.budget) return 0;
    // Calculate budget used from actual hours worked on tasks
    const actualHours = tasks.reduce((total, task) => total + (task.actualHours || 0), 0);
    const hourlyRate = project.budget / project.estimatedHours; // Calculate hourly rate
    const budgetUsed = actualHours * hourlyRate;
    return Math.round((budgetUsed / project.budget) * 100);
  };

  const getTaskCompletionPercentage = () => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  const getTimeRemainingPercentage = () => {
    if (!project || !project.startDate || !project.endDate) return 0;
    
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    const today = new Date();
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const elapsedDays = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const remainingDays = Math.max(0, totalDays - elapsedDays);
    
    return Math.round(((totalDays - remainingDays) / totalDays) * 100);
  };

  const getProjectDuration = () => {
    if (!project || !project.startDate || !project.endDate) return 'N/A';
    
    const startDate = new Date(project.startDate);
    const endDate = new Date(project.endDate);
    
    // Calculate the difference in days (inclusive of both start and end dates)
    const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    
    return `${durationInDays} day${durationInDays !== 1 ? 's' : ''}`;
  };

  const getProjectProgress = () => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Animate progress bar on load
  useEffect(() => {
    if (project) {
      const timer = setTimeout(() => {
        setProgressAnimation(getProjectProgress());
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [project, tasks]);

  // Project update handlers
  const handleAddUpdate = () => {
    setError(''); // Clear any previous errors
    setIsUpdateModalOpen(true);
  };

  const handleSaveUpdate = async () => {
    if (!newUpdateText.trim()) return;
    
    setAddingUpdate(true);
    setError(''); // Clear any previous errors
    try {
      const newUpdate = {
        id: Date.now(),
        text: newUpdateText.trim(),
        timestamp: new Date().toLocaleString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        }),
        author: 'Current User' // This would be the logged-in user
      };
      
      const updatedUpdates = [newUpdate, ...projectUpdates];
      setProjectUpdates(updatedUpdates);
      
      // Save project updates to database
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: updatedUpdates
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save update to database');
      }
      
      setNewUpdateText('');
      setIsUpdateModalOpen(false);
    } catch (err: any) {
      console.error('Failed to add update:', err);
      // Revert the state if save failed
      setProjectUpdates(projectUpdates);
      setError(err.message || 'Failed to save update. Please try again.');
    } finally {
      setAddingUpdate(false);
    }
  };

  const handleCancelUpdate = () => {
    setNewUpdateText('');
    setIsUpdateModalOpen(false);
  };

  const handleAddTask = () => {
    setError(''); // Clear any previous errors
    setIsTaskModalOpen(true);
  };

  const handleCancelTask = () => {
    setNewTask({
      title: '',
      description: '',
      status: 'planned',
      priority: 'medium',
      assignee: '',
      dueDate: '',
      estimatedHours: 0,
      actualHours: 0
    });
    setIsTaskModalOpen(false);
  };

  const handleSaveTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.assignee.trim() || !newTask.dueDate) {
      return;
    }

    setAddingTask(true);
    setError(''); // Clear any previous errors
    
    const taskToAdd = {
      id: Date.now(), // Use timestamp for unique ID
      ...newTask,
      completedDate: newTask.status === 'completed' ? new Date().toISOString().split('T')[0] : null
    };
    
    const updatedTasks = [...tasks, taskToAdd];
    setTasks(updatedTasks);
    
    // Save tasks to database
    try {
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: updatedTasks
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save task to database');
      }
    } catch (error: any) {
      console.error('Error saving tasks to database:', error);
      // Revert the state if save failed
      setTasks(tasks);
      setError(error.message || 'Failed to save task. Please try again.');
      return;
    }
    
    setAddingTask(false);
    handleCancelTask();
  };

  const handleTaskInputChange = useCallback((field: string, value: any) => {
    setNewTask(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleEditTask = (task: any) => {
    setError(''); // Clear any previous errors
    setEditingTask(task);
    setIsEditTaskModalOpen(true);
  };

  const handleCancelEditTask = () => {
    setEditingTask(null);
    setIsEditTaskModalOpen(false);
  };

  const handleSaveEditTask = async () => {
    if (!editingTask.title.trim() || !editingTask.description.trim() || !editingTask.assignee.trim() || !editingTask.dueDate) {
      return;
    }

    setEditingTaskLoading(true);
    setError(''); // Clear any previous errors
    
    const updatedTask = {
      ...editingTask,
      completedDate: editingTask.status === 'completed' ? new Date().toISOString().split('T')[0] : null
    };
    
    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    
    // Save updated tasks to database
    try {
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: updatedTasks
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to save updated task to database');
      }
    } catch (error: any) {
      console.error('Error saving updated tasks to database:', error);
      // Revert the state if save failed
      setTasks(tasks);
      setError(error.message || 'Failed to save updated task. Please try again.');
      setEditingTaskLoading(false);
      return;
    }
    
    setEditingTaskLoading(false);
    handleCancelEditTask();
  };

  const handleEditTaskInputChange = useCallback((field: string, value: any) => {
    setEditingTask((prev: any) => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // Task helper functions
  const getTaskStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green';
      case 'in-progress': return 'orange';
      case 'planned': return 'blue';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  const getTaskPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'red';
      case 'medium': return 'orange';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getTaskProgress = (task: any) => {
    if (task.status === 'completed') return 100;
    if (task.status === 'planned') return 0;
    if (task.status === 'cancelled') return 0;
    
    // For in-progress tasks, calculate based on actual vs estimated hours
    if (task.status === 'in-progress' && task.estimatedHours > 0) {
      const progress = Math.min((task.actualHours / task.estimatedHours) * 100, 100);
      return Math.round(progress);
    }
    
    // Default progress for in-progress tasks without hours
    return 50;
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    try {
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete task from database');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete task. Please try again.');
      setTasks(tasks); // revert
    }
  };

  const handleDeleteUpdate = async (updateId: number) => {
    if (!window.confirm('Are you sure you want to delete this update?')) return;
    const updatedUpdates = projectUpdates.filter(update => update.id !== updateId);
    setProjectUpdates(updatedUpdates);
    try {
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: updatedUpdates })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete update from database');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to delete update. Please try again.');
      setProjectUpdates(projectUpdates); // revert
    }
  };

  const handleEditUpdate = (update: any) => {
    setEditingUpdate(update);
    setEditUpdateText(update.text);
    setIsEditUpdateModalOpen(true);
  };

  const handleSaveEditUpdate = async () => {
    if (!editingUpdate) return;
    setEditingUpdateLoading(true);
    const updatedUpdates = projectUpdates.map(u =>
      u.id === editingUpdate.id ? { ...u, text: editUpdateText } : u
    );
    setProjectUpdates(updatedUpdates);
    try {
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: updatedUpdates })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update project update in database');
      }
      setIsEditUpdateModalOpen(false);
      setEditingUpdate(null);
      setEditUpdateText('');
    } catch (error: any) {
      setError(error.message || 'Failed to update project update. Please try again.');
      setProjectUpdates(projectUpdates); // revert
    } finally {
      setEditingUpdateLoading(false);
    }
  };

  const handleCancelEditUpdate = () => {
    setIsEditUpdateModalOpen(false);
    setEditingUpdate(null);
    setEditUpdateText('');
  };

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
              <HStack spacing={4} mt={2}>
                <Text fontSize="lg" color="gray.600" fontWeight="medium">
                  {project.code}
                </Text>
                <Badge colorScheme={getStatusColor(isEditing ? editData.status : project.status)} size="lg" px={4} py={2} fontSize="sm" fontWeight="semibold">
                  <Icon as={getStatusIcon(isEditing ? editData.status : project.status)} mr={2} />
                  {isEditing ? editData.status : project.status}
                </Badge>
                <Badge colorScheme={getPriorityColor(isEditing ? editData.priority : project.priority)} size="lg" px={4} py={2} fontSize="sm" fontWeight="semibold">
                  {isEditing ? editData.priority : project.priority} Priority
                </Badge>
              </HStack>
            </VStack>
            
            <HStack spacing={3}>
              <Button as={Link} href="/admin/manage-projects" leftIcon={<ArrowBackIcon />} variant="outline" size="md">
                Back
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
                colorScheme={getProgressColor(getProjectProgress())} 
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
                    {tasks.filter(task => task.status === 'completed').length}/{tasks.length}
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
                    ${(() => {
                      const actualHours = tasks.reduce((total, task) => total + (task.actualHours || 0), 0);
                      const hourlyRate = project.budget / project.estimatedHours;
                      const budgetUsed = actualHours * hourlyRate;
                      return Math.round(budgetUsed).toLocaleString();
                    })()}
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
                  <Text color="gray.500" fontSize="sm">
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
                    {project.team.length} Members
                  </Text>
                  <Text color="gray.500" fontSize="sm">
                    {project.team.length > 5 ? 'Large team' : project.team.length > 2 ? 'Medium team' : 'Small team'}
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
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} alignItems="start">
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
                            <option value="residential">Residential</option>
                            <option value="business">Business</option>
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
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Status
                        </Text>
                        {isEditing ? (
                          <Select
                            value={editData.status || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('status', e.target.value)}
                            fontSize="lg"
                            borderWidth="2px"
                            borderColor="gray.200"
                            borderRadius="lg"
                            _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                            _hover={{ borderColor: '#14543a' }}
                          >
                            <option value="planned">Planned</option>
                            <option value="in progress">In Progress</option>
                            <option value="completed">Completed</option>
                            <option value="on hold">On Hold</option>
                          </Select>
                        ) : (
                          <Badge colorScheme={getStatusColor(project.status)} px={3} py={1} fontSize="md" fontWeight="semibold">
                            <Icon as={getStatusIcon(project.status)} mr={2} />
                            {project.status}
                          </Badge>
                        )}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Priority
                        </Text>
                        {isEditing ? (
                          <Select
                            value={editData.priority || ''}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleInputChange('priority', e.target.value)}
                            fontSize="lg"
                            borderWidth="2px"
                            borderColor="gray.200"
                            borderRadius="lg"
                            _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                            _hover={{ borderColor: '#14543a' }}
                          >
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                          </Select>
                        ) : (
                          <Badge colorScheme={getPriorityColor(project.priority)} px={3} py={1} fontSize="md" fontWeight="semibold">
                            {project.priority} Priority
                          </Badge>
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
                    <SimpleGrid columns={1} spacing={4} mb={4}>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={1} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Customer Name
                        </Text>
                        <HStack>
                          <Icon as={FaUser} color="#003f2d" boxSize={4} />
                          <Text fontSize="lg" fontWeight="medium" whiteSpace="normal" wordBreak="break-word">{project.customer}</Text>
                        </HStack>
                        {project.customer_stripe_id && (
                          <Text fontSize="xs" color="gray.400" mt={1} whiteSpace="normal" wordBreak="break-word">
                            Stripe ID: {project.customer_stripe_id}
                          </Text>
                        )}
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={1} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Email Address
                        </Text>
                        <HStack>
                          <Icon as={FaEnvelope} color="#003f2d" boxSize={4} />
                          <Text fontSize="lg" whiteSpace="normal" wordBreak="break-word">{project.customerEmail}</Text>
                        </HStack>
                      </Box>
                      <Box>
                        <Text fontWeight="semibold" color="gray.700" mb={1} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                          Phone Number
                        </Text>
                        <HStack>
                          <Icon as={FaPhone} color="#003f2d" boxSize={4} />
                          <Text fontSize="lg" whiteSpace="normal" wordBreak="break-word">{project.customerPhone}</Text>
                        </HStack>
                      </Box>
                    </SimpleGrid>
                    <Divider my={4} />
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Address
                      </Text>
                      <VStack align="start" spacing={1} fontSize="md">
                        {project.customerAddressLine1 && (
                          <Text>{project.customerAddressLine1}</Text>
                        )}
                        {project.customerAddressLine2 && (
                          <Text>{project.customerAddressLine2}</Text>
                        )}
                        {(project.customerCity || project.customerState || project.customerPostcode) && (
                          <Text>
                            {[project.customerCity, project.customerState, project.customerPostcode].filter(Boolean).join(', ')}
                          </Text>
                        )}
                        {project.customerCountry && (
                          <Text>{project.customerCountry}</Text>
                        )}
                      </VStack>
                    </Box>
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
                          <Text fontSize="lg">{getProjectDuration()}</Text>
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

              {/* Project Updates */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <Icon as={FaTasks} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Project Updates</Heading>
                    </HStack>
                    <Button
                      leftIcon={<AddIcon />}
                      bg="#003f2d"
                      color="white"
                      size="sm"
                      onClick={handleAddUpdate}
                      _hover={{ bg: '#14543a' }}
                      transition="all 0.2s"
                    >
                      Add Update
                    </Button>
                  </Flex>
                </CardHeader>
                <CardBody py={6}>
                  {projectUpdates.length > 0 ? (
                    <VStack spacing={4} align="stretch">
                      {projectUpdates.map((update, index) => (
                        <Box
                          key={update.id}
                          bg="white"
                          border="1px solid #e2e8f0"
                          borderRadius="lg"
                          p={4}
                          boxShadow="sm"
                          _hover={{ boxShadow: "md" }}
                          transition="all 0.2s"
                        >
                          <Text fontSize="md" color="gray.700" mb={3}>
                            {update.text}
                          </Text>
                          <Text fontSize="sm" color="gray.500" mt={1}>
                            🕒 {update.timestamp} • 👤 {update.author}
                          </Text>
                          <HStack spacing={1}>
                            <IconButton
                              aria-label="Edit update"
                              icon={<FaEdit />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                              onClick={() => handleEditUpdate(update)}
                              _hover={{ bg: 'blue.50' }}
                            />
                            <IconButton
                              aria-label="Delete update"
                              icon={<FaTrash />}
                              size="sm"
                              variant="ghost"
                              colorScheme="red"
                              onClick={() => handleDeleteUpdate(update.id)}
                              _hover={{ bg: 'red.50' }}
                            />
                          </HStack>
                          {index < projectUpdates.length - 1 && (
                            <Divider mt={4} borderColor="gray.200" />
                          )}
                        </Box>
                      ))}
                    </VStack>
                  ) : (
                    <Box textAlign="center" py={8}>
                      <Icon as={FaInfoCircle} color="gray.300" boxSize={12} mb={4} />
                      <Text color="gray.500" fontSize="lg" fontWeight="medium" mb={2}>
                        No updates yet
                      </Text>
                      <Text color="gray.400" fontSize="sm" mb={4}>
                        Start tracking project progress by adding your first update.
                      </Text>
                      <Button
                        leftIcon={<AddIcon />}
                        bg="#003f2d"
                        color="white"
                        size="md"
                        onClick={handleAddUpdate}
                        _hover={{ bg: '#14543a' }}
                        transition="all 0.2s"
                      >
                        Add First Update
                      </Button>
                    </Box>
                  )}
                </CardBody>
              </Card>

                {/* Tasks */}
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <Flex justify="space-between" align="center">
                      <HStack>
                        <Icon as={FaTasks} color="#003f2d" boxSize={5} />
                        <Heading size="md" color="#003f2d" fontWeight="bold">Tasks</Heading>
                      </HStack>
                      <HStack spacing={2}>
                        <Text fontSize="sm" color="gray.600">
                          {tasks.filter(t => t.status === 'completed').length}/{tasks.length} completed
                        </Text>
                        <Button
                          leftIcon={<AddIcon />}
                          bg="#003f2d"
                          color="white"
                          size="sm"
                          onClick={handleAddTask}
                          _hover={{ bg: '#14543a' }}
                          transition="all 0.2s"
                        >
                          Add Task
                        </Button>
                      </HStack>
                    </Flex>
                  </CardHeader>
                  <CardBody py={6}>
                    {tasks.length > 0 ? (
                      <VStack spacing={4} align="stretch">
                        {tasks.map((task) => (
                          <Box
                            key={task.id}
                            bg="white"
                            border="1px solid #e2e8f0"
                            borderRadius="lg"
                            p={4}
                            boxShadow="sm"
                            _hover={{ boxShadow: "md", borderColor: '#14543a' }}
                            transition="all 0.2s"
                          >
                            <Flex justify="space-between" align="start" mb={3}>
                              <Box flex="1">
                                <HStack spacing={3} mb={2}>
                                  <Text fontSize="lg" fontWeight="semibold" color="gray.800">
                                    {task.title}
                                  </Text>
                                  <Badge 
                                    colorScheme={getTaskStatusColor(task.status)} 
                                    size="sm"
                                    borderRadius="full"
                                    px={2}
                                    textTransform="lowercase"
                                  >
                                    {task.status.replace('-', ' ')}
                                  </Badge>
                                  <Badge 
                                    colorScheme={getTaskPriorityColor(task.priority)} 
                                    size="sm"
                                    borderRadius="full"
                                    px={2}
                                    textTransform="lowercase"
                                  >
                                    {task.priority}
                                  </Badge>
                                </HStack>
                                <Text fontSize="sm" color="gray.600" mb={3}>
                                  {task.description}
                                </Text>
                              </Box>
                              <IconButton
                                aria-label="Edit task"
                                icon={<EditIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="blue"
                                onClick={() => handleEditTask(task)}
                                _hover={{ bg: 'blue.50' }}
                              />
                              <IconButton
                                aria-label="Delete task"
                                icon={<FaTrash />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                ml={2}
                                onClick={() => handleDeleteTask(task.id)}
                                _hover={{ bg: 'red.50' }}
                              />
                            </Flex>
                            
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={3}>
                              <Box>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                                  Assignee
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">{task.assignee}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                                  Due Date
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">{task.dueDate}</Text>
                              </Box>
                              <Box>
                                <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">
                                  Hours
                                </Text>
                                <Text fontSize="sm" fontWeight="medium">
                                  {task.actualHours}/{task.estimatedHours} hrs
                                </Text>
                              </Box>
                            </SimpleGrid>

                            {task.status === 'in-progress' && (
                              <Box mt={2}>
                                <Text fontSize="xs" color="gray.500" mb={1}>
                                  Progress: {task.actualHours}/{task.estimatedHours} hours ({getTaskProgress(task)}%)
                                </Text>
                                <Progress 
                                  value={getTaskProgress(task)} 
                                  colorScheme="green" 
                                  size="sm" 
                                  borderRadius="md"
                                  height="8px"
                                />
                              </Box>
                            )}

                            {task.status === 'completed' && task.completedDate && (
                              <Box mt={2}>
                                <Text fontSize="xs" color="green.600" fontWeight="medium">
                                  ✅ Completed on {task.completedDate}
                                </Text>
                              </Box>
                            )}
                          </Box>
                        ))}
                      </VStack>
                    ) : (
                      <Box textAlign="center" py={8}>
                        <Icon as={FaTasks} color="gray.300" boxSize={12} mb={4} />
                        <Text color="gray.500" fontSize="lg" fontWeight="medium" mb={2}>
                          No tasks yet
                        </Text>
                        <Text color="gray.400" fontSize="sm" mb={4}>
                          Get started by creating your first task for this project.
                        </Text>
                        <Button
                          leftIcon={<AddIcon />}
                          bg="#003f2d"
                          color="white"
                          size="md"
                          onClick={handleAddTask}
                          _hover={{ bg: '#14543a' }}
                          transition="all 0.2s"
                        >
                          Create First Task
                        </Button>
                      </Box>
                    )}
                  </CardBody>
                </Card>
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
                    <Heading size="md" color="#003f2d" fontWeight="bold">Customer Information</Heading>
                  </HStack>
                </CardHeader>
                <CardBody py={6}>
                  <SimpleGrid columns={1} spacing={4} mb={4}>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={1} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Customer Name
                      </Text>
                      <HStack>
                        <Icon as={FaUser} color="#003f2d" boxSize={4} />
                        <Text fontSize="lg" fontWeight="medium" whiteSpace="normal" wordBreak="break-word">{project.customer}</Text>
                      </HStack>
                      {project.customer_stripe_id && (
                        <Text fontSize="xs" color="gray.400" mt={1} whiteSpace="normal" wordBreak="break-word">
                          Stripe ID: {project.customer_stripe_id}
                        </Text>
                      )}
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={1} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Email Address
                      </Text>
                      <HStack>
                        <Icon as={FaEnvelope} color="#003f2d" boxSize={4} />
                        <Text fontSize="lg" whiteSpace="normal" wordBreak="break-word">{project.customerEmail}</Text>
                      </HStack>
                    </Box>
                    <Box>
                      <Text fontWeight="semibold" color="gray.700" mb={1} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                        Phone Number
                      </Text>
                      <HStack>
                        <Icon as={FaPhone} color="#003f2d" boxSize={4} />
                        <Text fontSize="lg" whiteSpace="normal" wordBreak="break-word">{project.customerPhone}</Text>
                      </HStack>
                    </Box>
                  </SimpleGrid>
                  <Divider my={4} />
                  <Box>
                    <Text fontWeight="semibold" color="gray.700" mb={2} fontSize="sm" textTransform="uppercase" letterSpacing="wide">
                      Address
                    </Text>
                    <VStack align="start" spacing={1} fontSize="md">
                      {project.customerAddressLine1 && (
                        <Text>{project.customerAddressLine1}</Text>
                      )}
                      {project.customerAddressLine2 && (
                        <Text>{project.customerAddressLine2}</Text>
                      )}
                      {(project.customerCity || project.customerState || project.customerPostcode) && (
                        <Text>
                          {[project.customerCity, project.customerState, project.customerPostcode].filter(Boolean).join(', ')}
                        </Text>
                      )}
                      {project.customerCountry && (
                        <Text>{project.customerCountry}</Text>
                      )}
                    </VStack>
                  </Box>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <Heading size="md" color="#003f2d" fontWeight="bold">Quick Actions</Heading>
                </CardHeader>
                <CardBody py={6}>
                  <VStack spacing={3} align="stretch">
                    <Button 
                      leftIcon={<EditIcon />} 
                      colorScheme="blue" 
                      variant="outline" 
                      size="md"
                      onClick={handleEdit}
                    >
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

      {/* Sticky Action Bar */}
      <Box position="sticky" bottom={0} bg="white" zIndex={10} py={4} px={6} boxShadow="sm" borderTop="1px solid" borderColor="gray.200">
        <HStack justify="center">
          {!isEditing ? (
            <Button leftIcon={<EditIcon />} colorScheme="green" size="md" onClick={handleEdit}>
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
        </HStack>
      </Box>

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

      {/* Add Update Modal */}
      <Modal isOpen={isUpdateModalOpen} onClose={handleCancelUpdate} size="md">
        <ModalOverlay />
        <ModalContent 
          borderRadius="xl"
          mx={4}
          bg="white"
          shadow="lg"
        >
          <ModalHeader 
            bg="#003f2d" 
            color="white" 
            borderTopRadius="xl"
            py={4}
          >
            <HStack spacing={3}>
              <Icon as={FaInfoCircle} boxSize={5} />
              <Heading size="lg" fontWeight="bold">Add Project Update</Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            bg="whiteAlpha.200"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.300" }}
            top={6}
            right={6}
          />
          
          <ModalBody py={6} px={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">
                  Update Details
                </FormLabel>
                <Textarea
                  value={newUpdateText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewUpdateText(e.target.value)}
                  placeholder="Enter project update details..."
                  rows={4}
                  fontSize="lg"
                  borderWidth="2px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  bg="gray.50"
                  _focus={{ 
                    borderColor: '#14543a', 
                    boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                    bg: 'white' 
                  }}
                  _hover={{ borderColor: '#14543a', bg: 'white' }}
                  _placeholder={{ color: 'gray.400' }}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50" borderBottomRadius="xl">
            <HStack spacing={3}>
              <Button
                onClick={handleCancelUpdate}
                variant="outline"
                colorScheme="gray"
                isDisabled={addingUpdate}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveUpdate}
                colorScheme="blue"
                isLoading={addingUpdate}
                loadingText="Adding..."
                isDisabled={!newUpdateText.trim()}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                Add Update
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Add Task Modal */}
      <Modal isOpen={isTaskModalOpen} onClose={handleCancelTask} size="xl">
        <ModalOverlay />
        <ModalContent 
          borderRadius="xl" 
          mx={4}
          bg="white"
          shadow="lg"
        >
          <ModalHeader 
            bg="#003f2d" 
            color="white" 
            borderTopRadius="xl"
            py={4}
          >
            <HStack spacing={3}>
              <Icon as={FaTasks} boxSize={5} />
              <Heading size="lg" fontWeight="bold">Create New Task</Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            bg="whiteAlpha.200"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.300" }}
            top={6}
            right={6}
          />
          
          <ModalBody py={6} px={6}>
            <VStack spacing={6} align="stretch">
              {/* Task Title */}
              <Box>
                                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700" mb={2}>
                    Task Title *
                  </FormLabel>
                  <Input
                    value={newTask.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTaskInputChange('title', e.target.value)}
                    placeholder="Enter task title..."
                    size="md"
                    borderWidth="1px"
                    borderColor="gray.300"
                    borderRadius="md"
                    _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 1px #14543a' }}
                  />
              </Box>

              {/* Description */}
              <Box>
                <FormLabel 
                  fontSize="sm" 
                  fontWeight="bold" 
                  color="gray.700" 
                  textTransform="uppercase" 
                  letterSpacing="wide"
                  mb={3}
                >
                  Description *
                </FormLabel>
                <Textarea
                  value={newTask.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleTaskInputChange('description', e.target.value)}
                  placeholder="Provide detailed description of the task..."
                  rows={4}
                  size="lg"
                  fontSize="md"
                  borderWidth="2px"
                  borderColor="gray.200"
                  borderRadius="xl"
                  bg="gray.50"
                  resize="vertical"
                  _focus={{ 
                    borderColor: '#14543a', 
                    boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                    bg: 'white' 
                  }}
                  _hover={{ borderColor: '#14543a', bg: 'white' }}
                  _placeholder={{ color: 'gray.400' }}
                />
              </Box>

              {/* Status and Priority */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                    mb={3}
                  >
                    Status *
                  </FormLabel>
                  <Select
                    value={newTask.status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTaskInputChange('status', e.target.value)}
                    size="lg"
                    fontSize="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                    _focus={{ 
                      borderColor: '#14543a', 
                      boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                      bg: 'white' 
                    }}
                    _hover={{ borderColor: '#14543a', bg: 'white' }}
                  >
                    <option value="planned">📋 Planned</option>
                    <option value="in-progress">🔄 In Progress</option>
                    <option value="completed">✅ Completed</option>
                    <option value="cancelled">❌ Cancelled</option>
                  </Select>
                </Box>

                <Box>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                    mb={3}
                  >
                    Priority *
                  </FormLabel>
                  <Select
                    value={newTask.priority}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleTaskInputChange('priority', e.target.value)}
                    size="lg"
                    fontSize="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                    _focus={{ 
                      borderColor: '#14543a', 
                      boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                      bg: 'white' 
                    }}
                    _hover={{ borderColor: '#14543a', bg: 'white' }}
                  >
                    <option value="low">🟢 Low</option>
                    <option value="medium">🟡 Medium</option>
                    <option value="high">🔴 High</option>
                  </Select>
                </Box>
              </SimpleGrid>

              {/* Assignee and Due Date */}
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Box>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                    mb={3}
                  >
                    Assignee *
                  </FormLabel>
                  <Input
                    value={newTask.assignee}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTaskInputChange('assignee', e.target.value)}
                    placeholder="Enter team member name..."
                    size="lg"
                    fontSize="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                    _focus={{ 
                      borderColor: '#14543a', 
                      boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                      bg: 'white' 
                    }}
                    _hover={{ borderColor: '#14543a', bg: 'white' }}
                    _placeholder={{ color: 'gray.400' }}
                  />
                </Box>

                <Box>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                    mb={3}
                  >
                    Due Date *
                  </FormLabel>
                  <Input
                    type="date"
                    value={newTask.dueDate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTaskInputChange('dueDate', e.target.value)}
                    size="lg"
                    fontSize="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                    _focus={{ 
                      borderColor: '#14543a', 
                      boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                      bg: 'white' 
                    }}
                    _hover={{ borderColor: '#14543a', bg: 'white' }}
                  />
                </Box>
              </SimpleGrid>

              {/* Hours Tracking */}
              <Box>
                <Text 
                  fontSize="sm" 
                  fontWeight="bold" 
                  color="gray.700" 
                  textTransform="uppercase" 
                  letterSpacing="wide"
                  mb={4}
                >
                  Time Tracking
                </Text>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <FormLabel 
                      fontSize="xs" 
                      fontWeight="semibold" 
                      color="gray.600"
                      mb={2}
                    >
                      Estimated Hours
                    </FormLabel>
                    <Input
                      type="number"
                      value={newTask.estimatedHours}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTaskInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      size="md"
                      fontSize="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      bg="gray.50"
                      _focus={{ 
                        borderColor: '#14543a', 
                        boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                        bg: 'white' 
                      }}
                      _hover={{ borderColor: '#14543a', bg: 'white' }}
                      _placeholder={{ color: 'gray.400' }}
                    />
                  </Box>

                  <Box>
                    <FormLabel 
                      fontSize="xs" 
                      fontWeight="semibold" 
                      color="gray.600"
                      mb={2}
                    >
                      Actual Hours (if started)
                    </FormLabel>
                    <Input
                      type="number"
                      value={newTask.actualHours}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTaskInputChange('actualHours', parseFloat(e.target.value) || 0)}
                      placeholder="0"
                      size="md"
                      fontSize="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="lg"
                      bg="gray.50"
                      _focus={{ 
                        borderColor: '#14543a', 
                        boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                        bg: 'white' 
                      }}
                      _hover={{ borderColor: '#14543a', bg: 'white' }}
                      _placeholder={{ color: 'gray.400' }}
                    />
                  </Box>
                </SimpleGrid>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200">
            <HStack spacing={3} w="full" justify="flex-end">
              <Button
                onClick={handleCancelTask}
                variant="outline"
                colorScheme="gray"
                size="md"
                isDisabled={addingTask}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTask}
                colorScheme="green"
                size="md"
                isLoading={addingTask}
                loadingText="Creating..."
                isDisabled={!newTask.title.trim() || !newTask.description.trim() || !newTask.assignee.trim() || !newTask.dueDate}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                Create Task
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Task Modal */}
      <Modal isOpen={isEditTaskModalOpen} onClose={handleCancelEditTask} size="xl">
        <ModalOverlay />
        <ModalContent 
          borderRadius="xl" 
          mx={4}
          bg="white"
          shadow="lg"
        >
          <ModalHeader 
            bg="#003f2d" 
            color="white" 
            borderTopRadius="xl"
            py={4}
          >
            <HStack spacing={3}>
              <Icon as={FaTasks} boxSize={5} />
              <Heading size="lg" fontWeight="bold">Edit Task</Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            bg="whiteAlpha.200"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.300" }}
            top={6}
            right={6}
          />
          
          <ModalBody py={6} px={6}>
            {editingTask && (
              <VStack spacing={6} align="stretch">
                {/* Task Title */}
                <Box>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                    mb={3}
                  >
                    Task Title *
                  </FormLabel>
                  <Input
                    value={editingTask.title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEditTaskInputChange('title', e.target.value)}
                    placeholder="Enter a descriptive task title..."
                    size="lg"
                    fontSize="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                    _focus={{ 
                      borderColor: '#14543a', 
                      boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                      bg: 'white' 
                    }}
                    _hover={{ borderColor: '#14543a', bg: 'white' }}
                    _placeholder={{ color: 'gray.400' }}
                  />
                </Box>

                {/* Description */}
                <Box>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                    mb={3}
                  >
                    Description *
                  </FormLabel>
                  <Textarea
                    value={editingTask.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleEditTaskInputChange('description', e.target.value)}
                    placeholder="Provide detailed description of the task..."
                    rows={4}
                    size="lg"
                    fontSize="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="xl"
                    bg="gray.50"
                    resize="vertical"
                    _focus={{ 
                      borderColor: '#14543a', 
                      boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                      bg: 'white' 
                    }}
                    _hover={{ borderColor: '#14543a', bg: 'white' }}
                    _placeholder={{ color: 'gray.400' }}
                  />
                </Box>

                {/* Status and Priority */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <FormLabel 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="gray.700" 
                      textTransform="uppercase" 
                      letterSpacing="wide"
                      mb={3}
                    >
                      Status *
                    </FormLabel>
                    <Select
                      value={editingTask.status}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditTaskInputChange('status', e.target.value)}
                      size="lg"
                      fontSize="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ 
                        borderColor: '#14543a', 
                        boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                        bg: 'white' 
                      }}
                      _hover={{ borderColor: '#14543a', bg: 'white' }}
                    >
                      <option value="planned">📋 Planned</option>
                      <option value="in-progress">🔄 In Progress</option>
                      <option value="completed">✅ Completed</option>
                      <option value="cancelled">❌ Cancelled</option>
                    </Select>
                  </Box>

                  <Box>
                    <FormLabel 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="gray.700" 
                      textTransform="uppercase" 
                      letterSpacing="wide"
                      mb={3}
                    >
                      Priority *
                    </FormLabel>
                    <Select
                      value={editingTask.priority}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleEditTaskInputChange('priority', e.target.value)}
                      size="lg"
                      fontSize="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ 
                        borderColor: '#14543a', 
                        boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                        bg: 'white' 
                      }}
                      _hover={{ borderColor: '#14543a', bg: 'white' }}
                    >
                      <option value="low">🟢 Low</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="high">🔴 High</option>
                    </Select>
                  </Box>
                </SimpleGrid>

                {/* Assignee and Due Date */}
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  <Box>
                    <FormLabel 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="gray.700" 
                      textTransform="uppercase" 
                      letterSpacing="wide"
                      mb={3}
                    >
                      Assignee *
                    </FormLabel>
                    <Input
                      value={editingTask.assignee}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEditTaskInputChange('assignee', e.target.value)}
                      placeholder="Enter team member name..."
                      size="lg"
                      fontSize="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ 
                        borderColor: '#14543a', 
                        boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                        bg: 'white' 
                      }}
                      _hover={{ borderColor: '#14543a', bg: 'white' }}
                      _placeholder={{ color: 'gray.400' }}
                    />
                  </Box>

                  <Box>
                    <FormLabel 
                      fontSize="sm" 
                      fontWeight="bold" 
                      color="gray.700" 
                      textTransform="uppercase" 
                      letterSpacing="wide"
                      mb={3}
                    >
                      Due Date *
                    </FormLabel>
                    <Input
                      type="date"
                      value={editingTask.dueDate}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEditTaskInputChange('dueDate', e.target.value)}
                      size="lg"
                      fontSize="md"
                      borderWidth="2px"
                      borderColor="gray.200"
                      borderRadius="xl"
                      bg="gray.50"
                      _focus={{ 
                        borderColor: '#14543a', 
                        boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                        bg: 'white' 
                      }}
                      _hover={{ borderColor: '#14543a', bg: 'white' }}
                    />
                  </Box>
                </SimpleGrid>

                {/* Hours Tracking */}
                <Box>
                  <Text 
                    fontSize="sm" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textTransform="uppercase" 
                    letterSpacing="wide"
                    mb={4}
                  >
                    Time Tracking
                  </Text>
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Box>
                      <FormLabel 
                        fontSize="xs" 
                        fontWeight="semibold" 
                        color="gray.600"
                        mb={2}
                      >
                        Estimated Hours
                      </FormLabel>
                      <Input
                        type="number"
                        value={editingTask.estimatedHours}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEditTaskInputChange('estimatedHours', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        size="md"
                        fontSize="md"
                        borderWidth="2px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        bg="gray.50"
                        _focus={{ 
                          borderColor: '#14543a', 
                          boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                          bg: 'white' 
                        }}
                        _hover={{ borderColor: '#14543a', bg: 'white' }}
                        _placeholder={{ color: 'gray.400' }}
                      />
                    </Box>

                    <Box>
                      <FormLabel 
                        fontSize="xs" 
                        fontWeight="semibold" 
                        color="gray.600"
                        mb={2}
                      >
                        Actual Hours (if started)
                      </FormLabel>
                      <Input
                        type="number"
                        value={editingTask.actualHours}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleEditTaskInputChange('actualHours', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        size="md"
                        fontSize="md"
                        borderWidth="2px"
                        borderColor="gray.200"
                        borderRadius="lg"
                        bg="gray.50"
                        _focus={{ 
                          borderColor: '#14543a', 
                          boxShadow: '0 0 0 3px rgba(20, 84, 58, 0.1)', 
                          bg: 'white' 
                        }}
                        _hover={{ borderColor: '#14543a', bg: 'white' }}
                        _placeholder={{ color: 'gray.400' }}
                      />
                    </Box>
                  </SimpleGrid>
                </Box>
              </VStack>
            )}
          </ModalBody>

          <ModalFooter bg="gray.50" borderTop="1px solid" borderColor="gray.200">
            <HStack spacing={3} w="full" justify="flex-end">
              <Button
                onClick={handleCancelEditTask}
                variant="outline"
                colorScheme="gray"
                size="md"
                isDisabled={editingTaskLoading}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEditTask}
                colorScheme="blue"
                size="md"
                isLoading={editingTaskLoading}
                loadingText="Updating..."
                isDisabled={!editingTask?.title?.trim() || !editingTask?.description?.trim() || !editingTask?.assignee?.trim() || !editingTask?.dueDate}
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                Update Task
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Edit Update Modal */}
      <Modal isOpen={isEditUpdateModalOpen} onClose={handleCancelEditUpdate} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="xl">
          <ModalHeader bg="#003f2d" color="white" borderTopRadius="xl">Edit Project Update</ModalHeader>
          <ModalCloseButton color="white" />
          <ModalBody py={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel fontSize="lg" fontWeight="medium" color="gray.700">
                  Update Details
                </FormLabel>
                <Textarea
                  value={editUpdateText}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setEditUpdateText(e.target.value)}
                  rows={4}
                  fontSize="lg"
                  borderWidth="2px"
                  borderColor="gray.200"
                  borderRadius="lg"
                  _focus={{ borderColor: '#14543a', boxShadow: '0 0 0 2px #14543a' }}
                  _hover={{ borderColor: '#14543a' }}
                />
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter bg="gray.50" borderBottomRadius="xl">
            <HStack spacing={3}>
              <Button onClick={handleCancelEditUpdate} variant="outline" colorScheme="gray" isDisabled={editingUpdateLoading}>
                Cancel
              </Button>
              <Button onClick={handleSaveEditUpdate} colorScheme="blue" isLoading={editingUpdateLoading} loadingText="Saving..." isDisabled={!editUpdateText.trim()}>
                Save
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 