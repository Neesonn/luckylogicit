import { HStack, Button, Menu, MenuButton, MenuList, MenuItem, IconButton } from '@chakra-ui/react';
import { HamburgerIcon, EditIcon, CopyIcon } from '@chakra-ui/icons';
import { FaTasks, FaInfoCircle } from 'react-icons/fa';
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiLogOut } from 'react-icons/fi';
import { motion } from 'framer-motion';

interface StickyNavBarProps {
  showProjectActions?: boolean;
  onTasksClick?: () => void;
  onUpdatesClick?: () => void;
  onEditClick?: () => void;
  onCloneClick?: () => void;
}

const StickyNavBar: React.FC<StickyNavBarProps> = ({
  showProjectActions = false,
  onTasksClick,
  onUpdatesClick,
  onEditClick,
  onCloneClick,
}) => {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch('/api/admin-logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (err) {
      setLoggingOut(false);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <HStack
      position="fixed"
      left={0}
      bottom={0}
      width="100vw"
      bg="white"
      zIndex={100}
      py={4}
      px={6}
      boxShadow="0 -4px 24px rgba(0,0,0,0.08), 0 -1px 0 #e2e8f0"
      borderTop="1px solid"
      borderColor="gray.200"
      justify="center"
      spacing={4}
    >
      <Button
        as={motion.button}
        colorScheme="red"
        size="md"
        fontWeight="bold"
        onClick={handleLogout}
        isLoading={loggingOut}
        loadingText="Logging out..."
        mr={6}
        aria-label="Logout"
        leftIcon={<FiLogOut size={22} />}
        whileHover={{ x: 6, boxShadow: '0 4px 16px rgba(220,38,38,0.18)' }}
        _hover={{ bg: 'red.600', color: 'white' }}
      >
        Logout
      </Button>
      <Menu>
        <MenuButton
          as={Button}
          leftIcon={<HamburgerIcon />} 
          colorScheme="orange"
          bg="orange.500"
          color="white"
          size="md"
          mr={2}
          aria-label="Quick Links"
          variant="solid"
          fontWeight="bold"
          borderRadius="lg"
          boxShadow="sm"
          _hover={{ bg: 'orange.600', color: 'white', boxShadow: 'md' }}
          _active={{ bg: 'orange.700' }}
          px={6}
          py={2}
          letterSpacing="wide"
        >
          Quick Links
        </MenuButton>
        <MenuList zIndex={20} borderRadius="lg" boxShadow="lg" bg="white" border="1px solid" borderColor="orange.100">
          <MenuItem as={Link} href="/admin/view-customers" fontWeight="semibold" _hover={{ bg: 'orange.100', color: 'orange.700' }}>View Customers</MenuItem>
          <MenuItem as={Link} href="/admin/create-customer" fontWeight="semibold" _hover={{ bg: 'orange.100', color: 'orange.700' }}>Create Customer</MenuItem>
          <MenuItem as={Link} href="/admin/manage-projects" fontWeight="semibold" _hover={{ bg: 'orange.100', color: 'orange.700' }}>Manage Projects</MenuItem>
          <MenuItem as={Link} href="/admin/quotes" fontWeight="semibold" _hover={{ bg: 'orange.100', color: 'orange.700' }}>Quotes</MenuItem>
          <MenuItem as={Link} href="/admin/invoices" fontWeight="semibold" _hover={{ bg: 'orange.100', color: 'orange.700' }}>Invoices</MenuItem>
          <MenuItem as={Link} href="/admin" fontWeight="semibold" _hover={{ bg: 'orange.100', color: 'orange.700' }}>Admin Home</MenuItem>
        </MenuList>
      </Menu>
      {showProjectActions && (
        <>
          <Button
            leftIcon={<FaTasks />}
            colorScheme="teal"
            size="md"
            onClick={onTasksClick}
            _hover={{ bg: 'teal.700' }}
            transition="all 0.2s"
          >
            Tasks
          </Button>
          <Button
            leftIcon={<FaInfoCircle />}
            colorScheme="purple"
            size="md"
            onClick={onUpdatesClick}
            _hover={{ bg: 'purple.700' }}
            transition="all 0.2s"
          >
            Updates
          </Button>
          <Button
            leftIcon={<EditIcon />}
            bg="#003f2d"
            color="white"
            size="md"
            onClick={onEditClick}
            _hover={{ bg: '#14543a' }}
            transition="all 0.2s"
          >
            Edit
          </Button>
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Other actions"
              icon={<HamburgerIcon />} 
              size="md"
              bg="red.600"
              color="white"
              _hover={{ bg: 'red.700' }}
              transition="all 0.2s"
            />
            <MenuList bg="red.600" color="white" border="none">
              <MenuItem
                icon={<CopyIcon />}
                onClick={onCloneClick}
                _hover={{ bg: 'red.700', color: 'white' }}
                fontWeight="semibold"
                bg="red.600"
              >
                Clone
              </MenuItem>
            </MenuList>
          </Menu>
        </>
      )}
    </HStack>
  );
};

export default StickyNavBar; 