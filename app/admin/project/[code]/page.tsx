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
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Checkbox,
  useToast,
  Link as ChakraLink,
  Table,
  Tbody,
  Tr,
  Td,
} from '@chakra-ui/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import NextLink from 'next/link';
import { ArrowBackIcon, EditIcon, DeleteIcon, ChevronRightIcon, AddIcon, ChevronDownIcon, ChevronUpIcon, CheckCircleIcon, HamburgerIcon, SearchIcon, LinkIcon } from '@chakra-ui/icons';
import { useState, useEffect, useCallback, useRef } from 'react';
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
  FaEdit,
} from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import { CopyIcon } from '@chakra-ui/icons';
// Fix import at the top
import StickyNavBar from '../../../../components/StickyNavBar';

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

// Add at the top, after imports
const getCurrentUser = () => 'Current User'; // Replace with real user logic if available
const getNow = () => new Date().toISOString();

function createHistoryEntry(action: string, details: string) {
  return {
    timestamp: getNow(),
    user: getCurrentUser(),
    action,
    details,
  };
}

// Add a helper to diff two tasks and summarize changes
function diffTasks(oldTask: any, newTask: any) {
  if (!oldTask) return 'Task was edited.';
  const changes = [];
  for (const key of Object.keys(newTask)) {
    if (key === 'id') continue;
    if (oldTask[key] !== newTask[key]) {
      changes.push(`${key} changed from "${oldTask[key]}" to "${newTask[key]}"`);
    }
  }
  return changes.length > 0 ? changes.join('; ') : 'Task was edited.';
}

// Add a helper to diff two projects and summarize changes
function diffProjects(oldProject: any, newProject: any) {
  if (!oldProject) return 'Project was edited.';
  const changes = [];
  for (const key of Object.keys(newProject)) {
    if (['updated_at', 'history'].includes(key)) continue;
    if (oldProject[key] !== newProject[key]) {
      changes.push(`${key} changed from "${oldProject[key]}" to "${newProject[key]}"`);
    }
  }
  return changes.length > 0 ? changes.join('; ') : 'Project was edited.';
}

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
    assignee: 'Michael Neeson',
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
  // In component state:
  const [history, setHistory] = useState<any[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyLimit, setHistoryLimit] = useState(5);
  
  // Public token management
  const [publicToken, setPublicToken] = useState<string | null>(null);
  const [isPublicTokenModalOpen, setIsPublicTokenModalOpen] = useState(false);
  const [generatingToken, setGeneratingToken] = useState(false);
  const [revokingToken, setRevokingToken] = useState(false);
  const [expandedTasks, setExpandedTasks] = useState<string[]>([]); // store expanded task ids
  const tasksSectionRef = useRef<HTMLDivElement>(null);
  // At the top, after other refs:
  const updatesSectionRef = useRef<HTMLDivElement>(null);

  // Clone modal state
  const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
  const [selectedTasksToClone, setSelectedTasksToClone] = useState<string[]>([]);
  const [availableProjects, setAvailableProjects] = useState<any[]>([]);
  const [selectedDestinationProject, setSelectedDestinationProject] = useState<string>('');
  const [cloneSearchTerm, setCloneSearchTerm] = useState('');
  const [cloning, setCloning] = useState(false);
  const toast = useToast();

  // Collapsible state for sidebar cards
  const [showTeam, setShowTeam] = useState(true);
  const [showCustomer, setShowCustomer] = useState(true);
  const [showQuotes, setShowQuotes] = useState(true);

  // State for quote linking
  const [customerQuotes, setCustomerQuotes] = useState<any[]>([]);
  const [selectedQuoteId, setSelectedQuoteId] = useState<string>('');
  const [fetchingQuotes, setFetchingQuotes] = useState(false);
  const [linkingQuoteId, setLinkingQuoteId] = useState<string | null>(null);

  // 1. Add state for invoice linking
  const [customerInvoices, setCustomerInvoices] = useState<any[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string>('');
  const [fetchingInvoices, setFetchingInvoices] = useState(false);
  const [linkingInvoiceId, setLinkingInvoiceId] = useState<string | null>(null);

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
          
          // Set public token if available
          setPublicToken(foundProject.public_token || null);
          
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
          
          // Load history if available, initialize as empty array if not
          if (foundProject.history && Array.isArray(foundProject.history)) {
            setHistory(foundProject.history);
          } else {
            setHistory([]);
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

      // Add a helper to diff two projects and summarize changes
      const projectChanges = diffProjects(project, updatedProject);
      if (projectChanges && projectChanges !== 'Project was edited.') {
        const updatedHistory = [
          ...history,
          createHistoryEntry('Project Overview Edited', projectChanges)
        ];
        setHistory(updatedHistory);
        // Also send history in the PUT request
        await fetch(`/api/projects/${projectCode}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...updatedProject, history: updatedHistory }),
        });
      }
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
    
    // If the project hasn't started yet, show 0%
    if (today < startDate) return 0;
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

  // Public token management functions
  const generatePublicToken = async () => {
    setGeneratingToken(true);
    try {
      const response = await fetch(`/api/projects/${projectCode}/public-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      
      if (data.success) {
        const shareUrl = `${window.location.origin}/project/public/${data.publicToken}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
          toast({
            title: 'Public link created!',
            description: 'The link has been copied to your clipboard.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        });
        
        setPublicToken(data.publicToken);
        setIsPublicTokenModalOpen(false);
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate public link',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setGeneratingToken(false);
    }
  };

  const revokePublicToken = async () => {
    setRevokingToken(true);
    try {
      const response = await fetch(`/api/projects/${projectCode}/public-token`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        setPublicToken(null);
        toast({
          title: 'Public access revoked!',
          description: 'The public link has been disabled.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to revoke public access',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setRevokingToken(false);
    }
  };

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
      const updatedHistory = [
        ...history,
        createHistoryEntry('Update Added', `Project update added: "${newUpdateText.trim().slice(0, 40)}..."`)
      ];
      setHistory(updatedHistory);
      
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          updates: updatedUpdates,
          history: updatedHistory
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
      const updatedHistory = [
        ...history,
        createHistoryEntry('Task Created', `Task "${newTask.title}" was created.`)
      ];
      setHistory(updatedHistory);
      
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: updatedTasks,
          history: updatedHistory
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
      const oldTask = tasks.find(task => task.id === editingTask.id);
      const editDetails = `Task "${editingTask.title}" was edited. ${diffTasks(oldTask, editingTask)}`;
      const updatedHistory = [
        ...history,
        createHistoryEntry('Task Edited', editDetails)
      ];
      setHistory(updatedHistory);
      
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tasks: updatedTasks,
          history: updatedHistory
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
      const deletedTask = tasks.find(task => task.id === taskId);
      const updatedHistory = [
        ...history,
        createHistoryEntry('Task Deleted', `Task "${deletedTask?.title || 'Unknown'}" was deleted.`)
      ];
      setHistory(updatedHistory);
      
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: updatedTasks,
          history: updatedHistory
        })
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
      const deletedUpdate = projectUpdates.find(update => update.id === updateId);
      const updatedHistory = [
        ...history,
        createHistoryEntry('Update Deleted', `Project update deleted: "${deletedUpdate?.text?.slice(0, 40)}..."`)
      ];
      setHistory(updatedHistory);
      
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: updatedUpdates,
          history: updatedHistory
        })
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
      const oldUpdate = projectUpdates.find(update => update.id === editingUpdate.id);
      const updatedHistory = [
        ...history,
        createHistoryEntry('Update Edited', `Project update edited. Old: "${oldUpdate?.text?.slice(0, 40)}..." New: "${editUpdateText.slice(0, 40)}..."`)
      ];
      setHistory(updatedHistory);
      
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: updatedUpdates,
          history: updatedHistory
        })
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

  // Clone modal handlers
  const handleOpenCloneModal = async () => {
    setIsCloneModalOpen(true);
    setSelectedTasksToClone([]);
    setSelectedDestinationProject('');
    setCloneSearchTerm('');
    
    // Fetch available projects for destination selection
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();
      if (data.success) {
        // Filter out current project from available destinations
        const otherProjects = data.projects.filter((p: any) => p.code !== projectCode);
        setAvailableProjects(otherProjects);
      }
    } catch (error) {
      console.error('Failed to fetch projects for cloning:', error);
    }
  };

  const handleCloseCloneModal = () => {
    setIsCloneModalOpen(false);
    setSelectedTasksToClone([]);
    setSelectedDestinationProject('');
    setCloneSearchTerm('');
  };

  const handleTaskSelectionChange = (taskId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedTasksToClone(prev => [...prev, taskId]);
    } else {
      setSelectedTasksToClone(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleSelectAllTasks = () => {
    const allTaskIds = tasks.map(task => task.id.toString());
    setSelectedTasksToClone(allTaskIds);
  };

  const handleDeselectAllTasks = () => {
    setSelectedTasksToClone([]);
  };

  const handleCloneTasks = async () => {
    if (selectedTasksToClone.length === 0) {
      toast({
        title: 'No tasks selected',
        description: 'Please select at least one task to clone.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
        variant: 'solid',
      });
      return;
    }
    if (!selectedDestinationProject) {
      toast({
        title: 'No destination project',
        description: 'Please select a destination project.',
        status: 'error',
        duration: 4000,
        isClosable: true,
        position: 'top-right',
        variant: 'solid',
      });
      return;
    }
    setCloning(true);
    try {
      // Get the selected tasks data
      const tasksToClone = tasks.filter(task => selectedTasksToClone.includes(task.id.toString()));
      // Prepare the clone data
      const cloneData = {
        sourceProject: projectCode,
        destinationProject: selectedDestinationProject,
        tasks: tasksToClone.map(task => ({
          title: task.title,
          description: task.description,
          status: 'planned', // Reset status for new project
          priority: task.priority,
          assignee: task.assignee,
          dueDate: '', // Reset due date
          estimatedHours: task.estimatedHours,
          actualHours: 0 // Reset actual hours
        }))
      };
      // Call API to clone tasks
      const response = await fetch('/api/clone-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cloneData),
      });
      const result = await response.json();
      if (result.success) {
        // Add a history entry for cloning (source project)
        const cloneDetails = `Cloned ${tasksToClone.length} task(s) to project ${selectedDestinationProject}`;
        const newHistoryEntry = createHistoryEntry('Tasks Cloned', cloneDetails);
        const updatedHistory = [...history, newHistoryEntry];
        setHistory(updatedHistory);
        // Persist the updated history to the backend (source project)
        try {
          await fetch(`/api/projects/${projectCode}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: updatedHistory })
          });
        } catch (err) {
          // Optionally handle error, e.g., show a toast
        }
        // Add a history entry to the destination project
        try {
          // Fetch destination project to get its current history
          const destRes = await fetch(`/api/projects?code=${selectedDestinationProject}`);
          const destData = await destRes.json();
          const destProject = destData.projects?.find((p: any) => p.code === selectedDestinationProject);
          const destHistory = Array.isArray(destProject?.history) ? destProject.history : [];
          const destEntry = createHistoryEntry('Tasks Received', `Received ${tasksToClone.length} cloned task(s) from project ${projectCode}`);
          const updatedDestHistory = [...destHistory, destEntry];
          await fetch(`/api/projects/${selectedDestinationProject}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ history: updatedDestHistory })
          });
        } catch (err) {
          // Optionally handle error, e.g., show a toast
        }
        toast({
          status: 'success',
          duration: 6000,
          isClosable: true,
          position: 'top-right',
          variant: 'solid',
          render: () => (
            <Box color="white" p={3} bg="green.500" borderRadius="md">
              <Text fontWeight="bold">
                Successfully cloned {tasksToClone.length} task(s) to project {selectedDestinationProject}
              </Text>
              <ChakraLink
                as={NextLink}
                href={`/admin/project/${selectedDestinationProject}`}
                color="white"
                textDecoration="underline"
                fontWeight="semibold"
                _hover={{ color: 'green.200' }}
              >
                Go to the project →
              </ChakraLink>
            </Box>
          ),
        });
        handleCloseCloneModal();
      } else {
        toast({
          title: 'Clone Failed',
          description: result.error || 'Failed to clone tasks.',
          status: 'error',
          duration: 5000,
          isClosable: true,
          position: 'top-right',
          variant: 'solid',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Clone Failed',
        description: error.message || 'Failed to clone tasks. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
        position: 'top-right',
        variant: 'solid',
      });
    } finally {
      setCloning(false);
    }
  };

  // Add this handler in the component:
  const handleToggleTaskCompleted = async (task: any) => {
    const newStatus = task.status === 'completed' ? 'in-progress' : 'completed';
    const updatedTask = { ...task, status: newStatus, completedDate: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null };
    const updatedTasks = tasks.map(t => t.id === task.id ? updatedTask : t);
    setTasks(updatedTasks);
    // Audit log
    const oldTask = tasks.find(t => t.id === task.id);
    const editDetails = `Task "${task.title}" status changed from "${oldTask.status}" to "${newStatus}".`;
    const updatedHistory = [
      ...history,
      createHistoryEntry('Task Status Toggled', editDetails)
    ];
    setHistory(updatedHistory);
    // Save to backend
    try {
      const response = await fetch(`/api/projects/${projectCode}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: updatedTasks, history: updatedHistory })
      });
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to update task status');
      }
    } catch (error: any) {
      setTasks(tasks); // revert
      setError(error.message || 'Failed to update task status. Please try again.');
    }
  };

  // Fetch all quotes for the customer when Quotes & Billings is expanded
  useEffect(() => {
    const fetchQuotes = async () => {
      if (showQuotes && project && project.customer_stripe_id) {
        setFetchingQuotes(true);
        try {
          const res = await fetch(`/api/list-stripe-quotes?customer=${project.customer_stripe_id}`);
          const data = await res.json();
          setCustomerQuotes(data.quotes || []);
        } catch (err) {
          setCustomerQuotes([]);
        } finally {
          setFetchingQuotes(false);
        }
      }
    };
    fetchQuotes();
  }, [showQuotes, project?.customer_stripe_id]);

  // 2. Fetch invoices for the customer when Quotes & Billings is expanded
  useEffect(() => {
    const fetchInvoices = async () => {
      if (project && project.customer_stripe_id) {
        setFetchingInvoices(true);
        try {
          const res = await fetch(`/api/list-stripe-invoices?customer_id=${project.customer_stripe_id}`);
          const data = await res.json();
          setCustomerInvoices(data.invoices || []);
        } catch (err) {
          setCustomerInvoices([]);
        } finally {
          setFetchingInvoices(false);
        }
      }
    };
    fetchInvoices();
  }, [project?.customer_stripe_id]);

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
              <Button 
                onClick={() => setIsPublicTokenModalOpen(true)}
                colorScheme={publicToken ? "orange" : "blue"}
                variant="outline"
                leftIcon={<LinkIcon />}
                size="md"
              >
                {publicToken ? "Manage Public Link" : "Generate Public Link"}
              </Button>
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
      <Container maxW="1400px" py={8} pb={{ base: 16, md: 0 }}>
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
          <Box gridColumn={{ xl: "span 3" }} minW={0}>
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

                {/* Quotes & Billings */}
                <Card shadow="sm" border="1px solid" borderColor="gray.200">
                  <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                    <HStack>
                      <Icon as={FaDollarSign} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Quotes & Billings</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody py={6}>
                    <VStack align="stretch" spacing={4}>
                      {/* Dropdown to select a quote for this customer */}
                      <HStack>
                        <Select
                          placeholder={fetchingQuotes ? 'Loading quotes...' : 'Select a quote to link'}
                          value={selectedQuoteId}
                          onChange={e => setSelectedQuoteId(e.target.value)}
                          isDisabled={fetchingQuotes || customerQuotes.length === 0}
                          size="md"
                        >
                          {customerQuotes.map((quote: any) => {
                            const alreadyLinked = Array.isArray(project.linkedQuotes) && project.linkedQuotes.some((q: any) => q.quoteId === quote.id);
                            return (
                              <option key={quote.id} value={quote.id} disabled={alreadyLinked}>
                                {quote.number || quote.id} {quote.amount ? `- $${quote.amount}` : ''} {alreadyLinked ? '(Linked)' : ''}
                              </option>
                            );
                          })}
                        </Select>
                        <Button
                          leftIcon={<LinkIcon />}
                          colorScheme="green"
                          size="md"
                          isDisabled={!selectedQuoteId || linkingQuoteId === selectedQuoteId || (Array.isArray(project.linkedQuotes) && project.linkedQuotes.some((q: any) => q.quoteId === selectedQuoteId))}
                          isLoading={linkingQuoteId === selectedQuoteId}
                          onClick={async () => {
                            setLinkingQuoteId(selectedQuoteId);
                            const quote = customerQuotes.find((q: any) => q.id === selectedQuoteId);
                            try {
                              const newLinked = Array.isArray(project.linkedQuotes) ? [...project.linkedQuotes] : [];
                              newLinked.push({ 
                                quoteId: quote.id, 
                                quoteNumber: quote.number,
                                amount: quote.amount,
                                status: quote.status,
                                created: quote.created,
                                lines: quote.lines // Save line items (product/price/description/amount/quantity)
                              });
                              // Persist to backend
                              await fetch(`/api/projects/${projectCode}`, {
                                method: 'PUT',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ linkedQuotes: newLinked })
                              });
                              // Update local state
                              setProject((prev: any) => ({ ...prev, linkedQuotes: newLinked }));
                              toast({
                                title: 'Quote linked',
                                description: `Quote ${quote.number || quote.id} linked to this project.`,
                                status: 'success',
                                duration: 4000,
                                isClosable: true,
                                position: 'top-right',
                                variant: 'solid',
                              });
                              setSelectedQuoteId('');
                            } catch (err) {
                              toast({
                                title: 'Failed to link quote',
                                status: 'error',
                                duration: 4000,
                                isClosable: true,
                                position: 'top-right',
                                variant: 'solid',
                              });
                            } finally {
                              setLinkingQuoteId(null);
                            }
                          }}
                        >
                          Link
                        </Button>
                      </HStack>
                      {/* Linked quotes */}
                      <Box>
                        <Text fontWeight="semibold" mb={2}>Linked Quotes:</Text>
                        {Array.isArray(project.linkedQuotes) && project.linkedQuotes.length > 0 ? (
                          <VStack align="stretch" spacing={2}>
                            {project.linkedQuotes.map((q: any, idx: number) => {
                              const quoteTotal = Array.isArray(q.lines)
                                ? q.lines.reduce((sum: number, line: any) => sum + (typeof line.amount_total === 'number' ? line.amount_total : 0), 0)
                                : 0;
                              return (
                                <Box
                                  key={q.quoteId}
                                  bg="white"
                                  borderRadius="lg"
                                  boxShadow="sm"
                                  p={5}
                                  mb={4}
                                  border="1px solid"
                                  borderColor="gray.200"
                                  _hover={{ boxShadow: "md", borderColor: "green.300" }}
                                  transition="box-shadow 0.2s, border-color 0.2s"
                                >
                                  <HStack justify="space-between" align="start" mb={2}>
                                    <Box>
                                      <Text fontWeight="bold" fontSize="lg" color="green.800" letterSpacing="wide">
                                        {q.quoteNumber || q.quoteId}
                                      </Text>
                                      <Text fontSize="sm" color="gray.500" mt={1}>
                                        {q.status && (
                                          <Badge
                                            colorScheme={q.status === 'open' || q.status === 'accepted' ? 'green' : 'gray'}
                                            mr={2}
                                            textTransform="uppercase"
                                            px={2}
                                            py={1}
                                            fontWeight="bold"
                                            fontSize="sm"
                                            letterSpacing="wide"
                                          >
                                            {q.status}
                                          </Badge>
                                        )}
                                        {q.created && <>• {new Date(q.created * 1000).toLocaleDateString()}</>}
                                      </Text>
                                    </Box>
                                    <HStack spacing={2}>
                                      <Button size="sm" colorScheme="red" variant="ghost" onClick={async () => {
                                        const newLinked = project.linkedQuotes.filter((lq: any) => lq.quoteId !== q.quoteId);
                                        await fetch(`/api/projects/${projectCode}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ linkedQuotes: newLinked })
                                        });
                                        setProject((prev: any) => ({ ...prev, linkedQuotes: newLinked }));
                                        toast({
                                          title: 'Quote unlinked',
                                          description: `Quote ${q.quoteNumber || q.quoteId} unlinked from this project.`,
                                          status: 'info',
                                          duration: 4000,
                                          isClosable: true,
                                          position: 'top-right',
                                          variant: 'subtle',
                                        });
                                      }}>
                                        Unlink
                                      </Button>
                                    </HStack>
                                  </HStack>
                                  <Divider mb={3} />
                                  {Array.isArray(q.lines) && q.lines.length > 0 && (
                                    <Box>
                                      <Table size="sm" variant="simple" mb={2}>
                                        <Tbody>
                                          {q.lines.map((line: any, idx: number) => (
                                            <Tr key={idx} _hover={{ bg: "gray.50" }}>
                                              <Td fontWeight="medium" color="gray.800" border="none">
                                                {line.description}
                                              </Td>
                                              <Td color="gray.600" border="none" textAlign="right">
                                                {line.quantity && `x${line.quantity}`}
                                              </Td>
                                              <Td color="gray.600" border="none" textAlign="right">
                                                {typeof line.unit_amount === 'number' && (
                                                  <>@ ${(line.unit_amount / 100).toFixed(2)}</>
                                                )}
                                              </Td>
                                              <Td color="gray.900" border="none" textAlign="right">
                                                {typeof line.amount_total === 'number' && (
                                                  <b>${(line.amount_total / 100).toFixed(2)}</b>
                                                )}
                                              </Td>
                                            </Tr>
                                          ))}
                                        </Tbody>
                                      </Table>
                                      <Flex justify="flex-end">
                                        <Text fontWeight="bold" color="green.700" fontSize="md">
                                          Quote Total: ${(quoteTotal / 100).toFixed(2)}
                                        </Text>
                                      </Flex>
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                          </VStack>
                        ) : (
                          <Text color="gray.400" fontSize="sm">No quotes linked to this project.</Text>
                        )}
                      </Box>
                      {/* 3. In the Quotes & Billings CardBody, after Linked Quotes, add: */}
                      <Box mt={8}>
                        <Text fontWeight="semibold" mb={2}>Linked Invoices:</Text>
                        {/* Invoice search and link UI */}
                        <HStack mb={2}>
                          <Select
                            placeholder={fetchingInvoices ? 'Loading invoices...' : 'Select an invoice to link'}
                            value={selectedInvoiceId}
                            onChange={e => setSelectedInvoiceId(e.target.value)}
                            isDisabled={fetchingInvoices || customerInvoices.length === 0}
                            size="md"
                          >
                            {customerInvoices.map((inv: any) => {
                              const alreadyLinked = Array.isArray(project.linkedInvoices) && project.linkedInvoices.some((i: any) => i.invoiceId === inv.id);
                              return (
                                <option key={inv.id} value={inv.id} disabled={alreadyLinked}>
                                  {inv.number || inv.id} {inv.amount_due ? `- $${(inv.amount_due / 100).toFixed(2)}` : ''} {alreadyLinked ? '(Linked)' : ''}
                                </option>
                              );
                            })}
                          </Select>
                          <Button
                            leftIcon={<LinkIcon />}
                            colorScheme="blue"
                            size="md"
                            isDisabled={!selectedInvoiceId || linkingInvoiceId === selectedInvoiceId || (Array.isArray(project.linkedInvoices) && project.linkedInvoices.some((i: any) => i.invoiceId === selectedInvoiceId))}
                            isLoading={linkingInvoiceId === selectedInvoiceId}
                            onClick={async () => {
                              setLinkingInvoiceId(selectedInvoiceId);
                              const inv = customerInvoices.find((i: any) => i.id === selectedInvoiceId);
                              try {
                                const newLinked = Array.isArray(project.linkedInvoices) ? [...project.linkedInvoices] : [];
                                newLinked.push({
                                  invoiceId: inv.id,
                                  invoiceNumber: inv.number,
                                  amount_due: inv.amount_due,
                                  status: inv.status,
                                  created: inv.created,
                                  due_date: inv.due_date,
                                  hosted_invoice_url: inv.hosted_invoice_url, // <-- add this
                                  invoice_pdf: inv.invoice_pdf, // <-- add this
                                  lines: inv.lines // Save line items
                                });
                                // Persist to backend
                                await fetch(`/api/projects/${projectCode}`, {
                                  method: 'PUT',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ linkedInvoices: newLinked })
                                });
                                setProject((prev: any) => ({ ...prev, linkedInvoices: newLinked }));
                                toast({
                                  title: 'Invoice linked',
                                  description: `Invoice ${inv.number || inv.id} linked to this project.`,
                                  status: 'success',
                                  duration: 4000,
                                  isClosable: true,
                                  position: 'top-right',
                                  variant: 'solid',
                                });
                                setSelectedInvoiceId('');
                              } catch (err) {
                                toast({
                                  title: 'Failed to link invoice',
                                  status: 'error',
                                  duration: 4000,
                                  isClosable: true,
                                  position: 'top-right',
                                });
                              } finally {
                                setLinkingInvoiceId(null);
                              }
                            }}
                          >
                            Link
                          </Button>
                        </HStack>
                        {/* Linked invoices display */}
                        {Array.isArray(project.linkedInvoices) && project.linkedInvoices.length > 0 ? (
                          <VStack align="stretch" spacing={2}>
                            {project.linkedInvoices.map((inv: any, idx: number) => {
                              const invoiceTotal = Array.isArray(inv.lines)
                                ? inv.lines.reduce((sum: number, line: any) => sum + (typeof line.amount === 'number' ? line.amount : 0), 0)
                                : 0;
                              return (
                                <Box
                                  key={inv.invoiceId}
                                  bg="white"
                                  borderRadius="lg"
                                  boxShadow="sm"
                                  p={5}
                                  mb={4}
                                  border="1px solid"
                                  borderColor="gray.200"
                                  _hover={{ boxShadow: "md", borderColor: "blue.300" }}
                                  transition="box-shadow 0.2s, border-color 0.2s"
                                >
                                  <HStack justify="space-between" align="start" mb={2}>
                                    <Box>
                                      <Text fontWeight="bold" fontSize="lg" color="blue.800" letterSpacing="wide">
                                        {inv.invoiceNumber || inv.invoiceId}
                                      </Text>
                                      <Text fontSize="sm" color="gray.500" mt={1}>
                                        {inv.status && (
                                          <Badge
                                            colorScheme={
                                              (inv.status === 'open' && inv.due_date && new Date(inv.due_date * 1000) < new Date()) ? 'red' :
                                              inv.status === 'paid' ? 'green' :
                                              inv.status === 'open' ? 'blue' :
                                              inv.status === 'overdue' ? 'red' :
                                              'gray'
                                            }
                                            mr={2}
                                            textTransform="uppercase"
                                            px={2}
                                            py={1}
                                            fontWeight="bold"
                                            fontSize="sm"
                                            letterSpacing="wide"
                                          >
                                            {(inv.status === 'open' && inv.due_date && new Date(inv.due_date * 1000) < new Date())
                                              ? `OVERDUE — ${Math.ceil((Date.now() - inv.due_date * 1000) / (1000 * 60 * 60 * 24))} days overdue`
                                              : inv.status}
                                          </Badge>
                                        )}
                                        <span style={{ marginLeft: 4 }}>
                                          <b>Created:</b> {inv.created ? new Date(inv.created * 1000).toLocaleDateString() : 'N/A'}
                                          {inv.due_date && (
                                            <>
                                              <span style={{ margin: '0 8px', color: '#bbb' }}>|</span>
                                              <b>Due:</b> <span style={{ color: '#b91c1c', fontWeight: 500 }}>{new Date(inv.due_date * 1000).toLocaleDateString()}</span>
                                            </>
                                          )}
                                        </span>
                                      </Text>
                                    </Box>
                                    <HStack spacing={2}>
                                      {inv.hosted_invoice_url && (
                                        <Button
                                          as="a"
                                          href={inv.hosted_invoice_url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          size="sm"
                                          colorScheme="blue"
                                          variant="outline"
                                        >
                                          View Invoice
                                        </Button>
                                      )}
                                      {inv.invoice_pdf && (
                                        <Button
                                          as="a"
                                          href={inv.invoice_pdf}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          size="sm"
                                          colorScheme="gray"
                                          variant="outline"
                                          download
                                        >
                                          Download PDF
                                        </Button>
                                      )}
                                      <Button size="sm" colorScheme="red" variant="ghost" onClick={async () => {
                                        const newLinked = project.linkedInvoices.filter((li: any) => li.invoiceId !== inv.invoiceId);
                                        await fetch(`/api/projects/${projectCode}`, {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ linkedInvoices: newLinked })
                                        });
                                        setProject((prev: any) => ({ ...prev, linkedInvoices: newLinked }));
                                        toast({
                                          title: 'Invoice unlinked',
                                          description: `Invoice ${inv.invoiceNumber || inv.invoiceId} unlinked from this project.`,
                                          status: 'info',
                                          duration: 4000,
                                          isClosable: true,
                                          position: 'top-right',
                                          variant: 'subtle',
                                        });
                                      }}>
                                        Unlink
                                      </Button>
                                    </HStack>
                                  </HStack>
                                  <Divider mb={3} />
                                  {Array.isArray(inv.lines) && inv.lines.length > 0 && (
                                    <Box>
                                      <Table size="sm" variant="simple" mb={2}>
                                        <Tbody>
                                          {inv.lines.map((line: any, idx: number) => (
                                            <Tr key={idx} _hover={{ bg: "gray.50" }}>
                                              <Td fontWeight="medium" color="gray.800" border="none">
                                                {line.description}
                                              </Td>
                                              <Td color="gray.600" border="none" textAlign="right">
                                                {line.quantity && `x${line.quantity}`}
                                              </Td>
                                              <Td color="gray.900" border="none" textAlign="right">
                                                {typeof line.amount === 'number' && (
                                                  <b>${(line.amount / 100).toFixed(2)}</b>
                                                )}
                                              </Td>
                                            </Tr>
                                          ))}
                                        </Tbody>
                                      </Table>
                                      <Flex justify="flex-end">
                                        <Text fontWeight="bold" color="blue.700" fontSize="md">
                                          Invoice Total: ${(invoiceTotal / 100).toFixed(2)}
                                        </Text>
                                      </Flex>
                                    </Box>
                                  )}
                                </Box>
                              );
                            })}
                          </VStack>
                        ) : (
                          <Text color="gray.400" fontSize="sm">No invoices linked to this project.</Text>
                        )}
                      </Box>
                    </VStack>
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
              <Card ref={updatesSectionRef} shadow="sm" border="1px solid" borderColor="gray.200">
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
                          <Box fontSize="md" color="gray.700" mb={3}>
                            <ReactMarkdown
                              components={{
                                h1: (props) => <Heading as="h2" size="md" mt={4} mb={2} {...props} />,
                                h2: (props) => <Heading as="h3" size="sm" mt={3} mb={1} {...props} />,
                                h3: (props) => <Heading as="h4" size="xs" mt={2} mb={1} {...props} />,
                                ul: (props) => <Box as="ul" pl={5} mb={2} style={{ listStyleType: 'disc' }} {...props} />,
                                ol: (props) => <Box as="ol" pl={5} mb={2} style={{ listStyleType: 'decimal' }} {...props} />,
                                li: (props) => <Box as="li" mb={1} {...props} />,
                                p: (props) => <Box as="p" mb={2} {...props} />,
                                code: (props) => <Box as="code" bg="gray.100" px={1} py={0.5} borderRadius="md" fontSize="sm" {...props} />,
                                blockquote: (props) => <Box as="blockquote" pl={4} borderLeft="4px solid #CBD5E0" color="gray.500" fontStyle="italic" {...props} />,
                              }}
                            >
                            {update.text}
                            </ReactMarkdown>
                          </Box>
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
                <Card ref={tasksSectionRef} shadow="sm" border="1px solid" borderColor="gray.200">
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
                            <Flex align="center" justify="space-between" cursor="pointer" onClick={() => {
                              setExpandedTasks((prev) =>
                                prev.includes(task.id)
                                  ? prev.filter((id) => id !== task.id)
                                  : [...prev, task.id]
                              );
                            }}>
                              <Box>
                                <Text fontWeight="bold" fontSize="md" color="#003f2d">{task.title}</Text>
                                <HStack spacing={3} mt={1}>
                                  <Badge colorScheme={getTaskStatusColor(task.status)}>{task.status}</Badge>
                                  <Badge colorScheme={getTaskPriorityColor(task.priority)}>{task.priority}</Badge>
                                  <Text fontSize="sm" color="gray.600">Assignee: {task.assignee}</Text>
                                  <Text fontSize="sm" color="gray.600">Due: {task.dueDate}</Text>
                              </HStack>
                            </Box>
                              <HStack spacing={1}>
                            <IconButton
                              aria-label="Edit task"
                              icon={<EditIcon />}
                              size="sm"
                              variant="ghost"
                              colorScheme="blue"
                                  onClick={e => { e.stopPropagation(); handleEditTask(task); }}
                              _hover={{ bg: 'blue.50' }}
                            />
                                <IconButton
                                  aria-label="Delete task"
                                  icon={<FaTrash />}
                                  size="sm"
                                  variant="ghost"
                                  colorScheme="red"
                                  ml={2}
                                  onClick={e => { e.stopPropagation(); handleDeleteTask(task.id); }}
                                  _hover={{ bg: 'red.50' }}
                                />
                                <IconButton
                                  aria-label={task.status === 'completed' ? 'Mark as In Progress' : 'Mark as Completed'}
                                  icon={<CheckCircleIcon color={task.status === 'completed' ? 'white' : 'gray.400'} />}
                                  size="sm"
                                  variant={task.status === 'completed' ? 'solid' : 'ghost'}
                                  colorScheme={task.status === 'completed' ? 'green' : 'gray'}
                                  onClick={e => { e.stopPropagation(); handleToggleTaskCompleted(task); }}
                                  _hover={{ bg: task.status === 'completed' ? 'green.100' : 'gray.100' }}
                                  ml={2}
                                />
                                <Icon as={expandedTasks.includes(task.id) ? ChevronUpIcon : ChevronDownIcon} boxSize={5} color="gray.500" />
                              </HStack>
                          </Flex>
                            {expandedTasks.includes(task.id) && (
                              <Box mt={4}>
                                <Box fontSize="sm" color="gray.600" mb={3}>
                                  <ReactMarkdown
                                    components={{
                                      h1: (props) => <Heading as="h2" size="md" mt={4} mb={2} {...props} />,
                                      h2: (props) => <Heading as="h3" size="sm" mt={3} mb={1} {...props} />,
                                      h3: (props) => <Heading as="h4" size="xs" mt={2} mb={1} {...props} />,
                                      ul: (props) => <Box as="ul" pl={5} mb={2} style={{ listStyleType: 'disc' }} {...props} />,
                                      ol: (props) => <Box as="ol" pl={5} mb={2} style={{ listStyleType: 'decimal' }} {...props} />,
                                      li: (props) => <Box as="li" mb={1} {...props} />,
                                      p: (props) => <Box as="p" mb={2} {...props} />,
                                      code: (props) => <Box as="code" bg="gray.100" px={1} py={0.5} borderRadius="md" fontSize="sm" {...props} />,
                                      blockquote: (props) => <Box as="blockquote" pl={4} borderLeft="4px solid #CBD5E0" color="gray.500" fontStyle="italic" {...props} />,
                                    }}
                                  >
                                    {task.description}
                                  </ReactMarkdown>
                                </Box>
                            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4} mb={3}>
                              <Box>
                                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">Assignee</Text>
                                <Text fontSize="sm" fontWeight="medium">{task.assignee}</Text>
                              </Box>
                              <Box>
                                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">Due Date</Text>
                                <Text fontSize="sm" fontWeight="medium">{task.dueDate}</Text>
                              </Box>
                              <Box>
                                    <Text fontSize="xs" color="gray.500" textTransform="uppercase" letterSpacing="wide">Hours</Text>
                                    <Text fontSize="sm" fontWeight="medium">{task.actualHours}/{task.estimatedHours} hrs</Text>
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
          <Box minW={0}>
            <VStack spacing={6} align="stretch">
              {/* Team & Ownership */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={FaUserTie} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Team & Ownership</Heading>
                    </HStack>
                    <IconButton
                      aria-label={showTeam ? 'Collapse' : 'Expand'}
                      icon={showTeam ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowTeam((v) => !v)}
                    />
                  </HStack>
                </CardHeader>
                {showTeam && (
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
                )}
              </Card>

              {/* Customer Information */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={FaUser} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Customer Information</Heading>
                    </HStack>
                    <IconButton
                      aria-label={showCustomer ? 'Collapse' : 'Expand'}
                      icon={showCustomer ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowCustomer((v) => !v)}
                    />
                  </HStack>
                </CardHeader>
                {showCustomer && (
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
                )}
              </Card>

              {/* Quotes & Billings */}
              <Card shadow="sm" border="1px solid" borderColor="gray.200">
                <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
                  <HStack justify="space-between">
                    <HStack>
                      <Icon as={FaDollarSign} color="#003f2d" boxSize={5} />
                      <Heading size="md" color="#003f2d" fontWeight="bold">Quotes & Billings</Heading>
                    </HStack>
                    <IconButton
                      aria-label={showQuotes ? 'Collapse' : 'Expand'}
                      icon={showQuotes ? <ChevronUpIcon /> : <ChevronDownIcon />}
                      size="sm"
                      variant="ghost"
                      onClick={() => setShowQuotes((v) => !v)}
                    />
                  </HStack>
                </CardHeader>
                {showQuotes && (
                  <CardBody py={6}>
                    {Array.isArray(project.linkedQuotes) && project.linkedQuotes.length > 0 ? (
                      <VStack align="stretch" spacing={3}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.700">Linked Quotes</Text>
                          <Badge colorScheme="green">{project.linkedQuotes.length}</Badge>
                        </HStack>
                        <Divider />
                        {/* Calculate grand total of all quotes */}
                        {(() => {
                          const grandTotal = project.linkedQuotes.reduce((sum: number, q: any) => {
                            const quoteTotal = Array.isArray(q.lines)
                              ? q.lines.reduce((s: number, l: any) => s + (typeof l.amount_total === 'number' ? l.amount_total : 0), 0)
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
                              <HStack key={q.quoteId} justify="space-between" bg="gray.50" borderRadius="md" px={2} py={1}>
                                <Text fontWeight="medium" color="gray.800">{q.quoteNumber || q.quoteId}</Text>
                                <Text color="green.700" fontWeight="bold">${(quoteTotal / 100).toFixed(2)}</Text>
                              </HStack>
                            );
                          })}
                        </VStack>
                      </VStack>
                    ) : (
                      <Text color="gray.400" fontSize="sm">No quotes linked to this project.</Text>
                    )}
                    {Array.isArray(project.linkedInvoices) && project.linkedInvoices.length > 0 && (
                      <Box mt={6}>
                        <HStack justify="space-between">
                          <Text fontWeight="semibold" color="gray.700">Linked Invoices</Text>
                          <Badge colorScheme="blue">{project.linkedInvoices.length}</Badge>
                        </HStack>
                        <Divider my={2} />
                        {/* Calculate grand total of all invoices */}
                        {(() => {
                          const grandTotal = project.linkedInvoices.reduce((sum: number, inv: any) => {
                            const invoiceTotal = Array.isArray(inv.lines)
                              ? inv.lines.reduce((s: number, l: any) => s + (typeof l.amount === 'number' ? l.amount : 0), 0)
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
                              <HStack key={inv.invoiceId} justify="space-between" bg="gray.50" borderRadius="md" px={2} py={1}>
                                <Text fontWeight="medium" color="gray.800">{inv.invoiceNumber || inv.invoiceId}</Text>
                                <Text color="blue.700" fontWeight="bold">${(invoiceTotal / 100).toFixed(2)}</Text>
                              </HStack>
                            );
                          })}
                        </VStack>
                      </Box>
                    )}
                  </CardBody>
                )}
              </Card>
            </VStack>
          </Box>
        </SimpleGrid>
      </Container>

      {/* Sticky Action Bar */}
      <StickyNavBar
        showProjectActions
        onTasksClick={() => {
          if (tasksSectionRef.current) {
            tasksSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        onUpdatesClick={() => {
          if (updatesSectionRef.current) {
            updatesSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }}
        onEditClick={handleEdit}
        onCloneClick={handleOpenCloneModal}
      />

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
                bg="#003f2d"
                color="white"
                isLoading={addingUpdate}
                loadingText="Adding..."
                isDisabled={!newUpdateText.trim()}
                _hover={{ bg: '#14543a' }}
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

      {/* Change History */}
      <Card mt={12} shadow="sm" border="1px solid" borderColor="gray.200">
        <CardHeader bg="white" borderBottom="1px solid" borderColor="gray.200" py={6}>
          <HStack justify="space-between">
            <Heading size="md" color="#003f2d" fontWeight="bold">Change History</Heading>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setHistoryOpen((open) => !open)}
              rightIcon={historyOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {historyOpen ? 'Hide' : 'Show'}
            </Button>
          </HStack>
        </CardHeader>
        {historyOpen && (
          <CardBody py={6}>
            <VStack align="stretch" spacing={4}>
              {history && history.length > 0 ? (
                history.slice().reverse().slice(0, historyLimit).map((entry, idx) => (
                  <Box key={idx} p={3} bg="gray.50" borderRadius="md">
                    <Text fontSize="sm" color="gray.600">
                      <b>{entry.user}</b> — {entry.action}
                    </Text>
                    <Text fontSize="xs" color="gray.400">
                      {new Date(entry.timestamp).toLocaleString()}
                    </Text>
                    {entry.details && (
                      <Text fontSize="sm" color="gray.700" mt={1}>{entry.details}</Text>
                    )}
                  </Box>
                ))
              ) : (
                <Text color="gray.400" fontSize="sm">No changes yet.</Text>
              )}
              {history && history.length > historyLimit && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setHistoryLimit((limit) => limit + 5)}
                  alignSelf="center"
                >
                  Show More
                </Button>
              )}
            </VStack>
          </CardBody>
        )}
      </Card>

      {/* Clone Modal */}
      <Modal isOpen={isCloneModalOpen} onClose={handleCloseCloneModal} size="full">
        <ModalOverlay />
        <ModalContent 
          borderRadius="xl" 
          mx={{ base: 2, md: 8 }}
          maxW="5xl"
          bg="white"
          shadow="lg"
        >
          <ModalHeader 
            bg="#003f2d" 
            color="white" 
            borderTopRadius="xl"
            py={6}
            px={{ base: 4, md: 8 }}
          >
            <HStack spacing={4}>
              <Icon as={FaBuilding} boxSize={6} />
              <Heading size="lg" fontWeight="bold">Clone Tasks</Heading>
            </HStack>
          </ModalHeader>
          <ModalCloseButton 
            color="white" 
            bg="whiteAlpha.200"
            borderRadius="full"
            _hover={{ bg: "whiteAlpha.300" }}
            top={8}
            right={8}
          />
          <ModalBody py={10} px={{ base: 4, md: 8 }} maxH="calc(100vh - 200px)" overflowY="auto">
            <Flex direction={{ base: 'column', md: 'row' }} gap={10} align="stretch" minH="400px">
              {/* Left: Tasks to Clone */}
              <Box flex={2} minW={0}>
                <Text fontSize="xl" fontWeight="bold" mb={4} color="#003f2d">Tasks to Clone</Text>
                <Box bg="gray.50" borderRadius="lg" p={6} minH="400px" maxH="60vh" overflowY="auto" boxShadow="sm">
                  <VStack spacing={4} align="stretch">
                    {tasks.length === 0 ? (
                      <Text color="gray.400" fontSize="lg">No tasks available in this project.</Text>
                    ) : (
                      tasks.map(task => (
                        <Checkbox
                          key={task.id}
                          isChecked={selectedTasksToClone.includes(task.id.toString())}
                          onChange={(e) => handleTaskSelectionChange(task.id.toString(), e.target.checked)}
                          colorScheme="green"
                          size="lg"
                        >
                          <VStack align="start" spacing={1}>
                            <Text fontWeight="semibold" fontSize="lg">{task.title}</Text>
                            <Text fontSize="md" color="gray.600" noOfLines={2}>{task.description}</Text>
                          </VStack>
                        </Checkbox>
                      ))
                    )}
                  </VStack>
                </Box>
                <HStack spacing={4} mt={4}>
                  <Button
                    colorScheme="blue"
                    size="md"
                    onClick={handleSelectAllTasks}
                    variant="outline"
                  >
                    Select All
                  </Button>
                  <Button
                    colorScheme="blue"
                    size="md"
                    onClick={handleDeselectAllTasks}
                    variant="outline"
                  >
                    Deselect All
                  </Button>
                </HStack>
              </Box>
              {/* Divider for desktop */}
              <Box display={{ base: 'none', md: 'block' }} mx={2}>
                <Divider orientation="vertical" h="100%" borderColor="gray.200" />
              </Box>
              {/* Right: Project Selection & Actions */}
              <Box flex={1} minW={0}>
                <Text fontSize="xl" fontWeight="bold" mb={4} color="#003f2d">Destination Project</Text>
                <Box mb={8}>
                  <FormLabel fontSize="md" fontWeight="semibold" color="gray.700" mb={2}>
                    Available Projects
                  </FormLabel>
                  <Select
                    value={selectedDestinationProject}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedDestinationProject(e.target.value)}
                    size="lg"
                    fontSize="md"
                    borderWidth="2px"
                    borderColor="gray.200"
                    borderRadius="lg"
                    bg="gray.50"
                    _focus={{ borderColor: '#003f2d', boxShadow: '0 0 0 3px #003f2d22', bg: 'white' }}
                    _hover={{ borderColor: '#003f2d', bg: 'white' }}
                  >
                    <option value="">Select a project</option>
                    {availableProjects.map(project => (
                      <option key={project.code} value={project.code}>{project.name}</option>
                    ))}
                  </Select>
                </Box>
                <Divider my={6} borderColor="gray.200" />
                <HStack spacing={4} justify="flex-end">
                  <Button
                    onClick={handleCloseCloneModal}
                    variant="outline"
                    colorScheme="gray"
                    size="lg"
                    isDisabled={cloning}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCloneTasks}
                    colorScheme="green"
                    size="lg"
                    isLoading={cloning}
                    loadingText="Cloning..."
                    isDisabled={!selectedDestinationProject || selectedTasksToClone.length === 0}
                  >
                    Clone Tasks
                  </Button>
                </HStack>
              </Box>
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Public Token Modal */}
      <Modal isOpen={isPublicTokenModalOpen} onClose={() => setIsPublicTokenModalOpen(false)} size="md">
        <ModalOverlay />
        <ModalContent borderRadius="xl" mx={4} bg="white" shadow="lg">
          <ModalHeader bg="#003f2d" color="white" borderTopRadius="xl" py={4}>
            <HStack spacing={3}>
              <Icon as={FaInfoCircle} boxSize={5} />
              <Heading size="lg" fontWeight="bold">
                {publicToken ? "Manage Public Link" : "Generate Public Link"}
              </Heading>
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
          <ModalBody py={6}>
            <VStack spacing={4} align="stretch">
              {publicToken ? (
                <Box>
                  <Text fontWeight="semibold" color="gray.700" mb={2}>
                    Public Link Active
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    This project is currently accessible via a public link. You can revoke access at any time.
                  </Text>
                  <Box p={3} bg="gray.50" borderRadius="md" border="1px solid" borderColor="gray.200">
                    <Text fontSize="sm" fontFamily="mono" wordBreak="break-all">
                      {`${window.location.origin}/project/public/${publicToken}`}
                    </Text>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Text fontWeight="semibold" color="gray.700" mb={2}>
                    Generate Public Link
                  </Text>
                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Create a secure public link to share this project with others. The link will provide read-only access to project information.
                  </Text>
                  <Alert status="info" borderRadius="lg">
                    <AlertIcon />
                    <Text fontSize="sm">
                      Only whitelisted fields will be visible in the public view. Sensitive information will be hidden.
                    </Text>
                  </Alert>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter py={4}>
            <HStack spacing={3}>
              <Button 
                onClick={() => setIsPublicTokenModalOpen(false)} 
                variant="outline"
              >
                Cancel
              </Button>
              {publicToken ? (
                <Button 
                  onClick={revokePublicToken}
                  colorScheme="red"
                  isLoading={revokingToken}
                  loadingText="Revoking..."
                >
                  Revoke Access
                </Button>
              ) : (
                <Button 
                  onClick={generatePublicToken}
                  bg="#003f2d" 
                  color="white"
                  _hover={{ bg: '#14543a' }}
                  isLoading={generatingToken}
                  loadingText="Generating..."
                >
                  Generate Link
                </Button>
              )}
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 