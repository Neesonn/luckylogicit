'use client';
import { Box, Heading, Text, Button, HStack, Tooltip, Skeleton, SkeletonText, Badge, IconButton } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaUsers, FaFileInvoiceDollar, FaMoneyBillWave, FaBoxOpen, FaLock, FaUnlock } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useLock } from '../../components/LockContext';
import { useStripeData } from '../../components/StripeDataContext';
import supabase from '../services/supabaseClient';

// Animated counter hook
function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const raf = useRef<number | null>(null);
  useEffect(() => {
    let start: number | null = null;
    function step(ts: number) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        setCount(target);
      }
    }
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current !== null) cancelAnimationFrame(raf.current);
    };
  }, [target, duration]);
  return count;
}

export default function AdminDashboard() {
  const router = useRouter();
  const adminName = 'Admin'; // Replace with dynamic name if available
  const { customers, invoices, loading, error, refresh } = useStripeData();
  const { metricsLocked, setMetricsLocked } = useLock();
  const [productCount, setProductCount] = useState<number>(0);

  // Outstanding invoices calculation
  const outstanding = invoices
    ?.filter(inv => ['open', 'past_due'].includes(inv.status))
    .reduce((sum, inv) => sum + (inv.amount_due || 0), 0);

  const animatedCustomers = useCountUp(customers?.length ?? 0, 1000);
  const animatedOutstanding = useCountUp(Math.round(outstanding / 100), 1200); // show dollars only

  useEffect(() => {
    async function fetchProductCount() {
      const { count, error } = await supabase
        .from('products')
        .select('id', { count: 'exact', head: true });
      if (!error && typeof count === 'number') {
        setProductCount(count);
      }
    }
    fetchProductCount();
    // Listen for live updates
    const handler = () => fetchProductCount();
    window.addEventListener('products-updated', handler);
    return () => window.removeEventListener('products-updated', handler);
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <Box minH="100vh"
      bgGradient="linear(to-b, white, gray.50 90%)"
      position="relative"
      fontFamily="'Inter', 'Roboto', 'Open Sans', sans-serif"
      display="flex" flexDirection="column" justifyContent="space-between"
      _before={{
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: 0.08,
        backgroundImage: `url('/logo.png')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: { base: '300px', md: '500px' },
        pointerEvents: 'none',
      }}
      _after={{
        content: '""',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        opacity: 0.07,
        backgroundImage: `repeating-linear-gradient(135deg, #e6f2ed 0 2px, transparent 2px 40px)`,
        pointerEvents: 'none',
      }}
    >
      <Box position="relative" zIndex={1} w="100%" maxW="1200px" mx="auto" px={4} py={8}>
        <Box mb={8} display="flex" alignItems="center" gap={3}>
          <Heading as="h1" size="xl" color="#003f2d" fontWeight="bold" mb={2} letterSpacing="tight">
            Welcome back, {adminName}
          </Heading>
          <IconButton
            aria-label={metricsLocked ? 'Unlock metrics' : 'Lock metrics'}
            icon={metricsLocked ? <FaLock /> : <FaUnlock />}
            onClick={() => setMetricsLocked(!metricsLocked)}
            size="sm"
            colorScheme={metricsLocked ? 'gray' : 'green'}
            variant={metricsLocked ? 'outline' : 'solid'}
            ml={2}
          />
        </Box>
        <Text fontSize="lg" color="gray.600">
          Manage your customers, finances, and products from one place.
        </Text>
        {/* Metrics summary row */}
        <Box w="100%" maxW="1200px" mx="auto" mb={8}>
          <HStack spacing={4} justify="center" flexWrap="wrap">
            <Box display="flex" alignItems="center" bg="white" boxShadow="md" borderRadius="full" px={5} py={2} minW="200px">
              <Icon as={FaUsers} color="#003f2d" boxSize={5} mr={2} />
              <Text fontWeight="bold" color="#003f2d" mr={2}>Total Customers:</Text>
              {loading ? (
                <Skeleton height="24px" width="32px" borderRadius="full" />
              ) : (
                <Badge colorScheme="green" fontSize="md" px={3} py={1} borderRadius="full"
                  style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                  {animatedCustomers}
                </Badge>
              )}
            </Box>
            <Box display="flex" alignItems="center" bg="white" boxShadow="md" borderRadius="full" px={5} py={2} minW="240px">
              <Icon as={FaMoneyBillWave} color="#003f2d" boxSize={5} mr={2} />
              <Text fontWeight="bold" color="#003f2d" mr={2}>Outstanding Invoices:</Text>
              {loading ? (
                <Skeleton height="24px" width="80px" borderRadius="full" />
              ) : (
                <Badge colorScheme="yellow" fontSize="md" px={3} py={1} borderRadius="full"
                  style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                  ${animatedOutstanding.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </Badge>
              )}
            </Box>
            <Box display="flex" alignItems="center" bg="white" boxShadow="md" borderRadius="full" px={5} py={2} minW="220px">
              <Icon as={FaBoxOpen} color="#003f2d" boxSize={5} mr={2} />
              <Text fontWeight="bold" color="#003f2d" mr={2}>Products in Catalogue:</Text>
              <Badge colorScheme="gray" fontSize="md" px={3} py={1} borderRadius="full"
                style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                {productCount}
              </Badge>
            </Box>
          </HStack>
        </Box>
        <Box
          className="dashboard-container"
          display="flex"
          flexDirection={{ base: 'column', md: 'row' }}
          gap={8}
          py={{ base: 2, md: 0 }}
        >
          {/* Customers Card */}
          <Box
            className="dashboard-card"
            flex="1"
            bg="white"
            boxShadow="md"
            borderRadius="2xl"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            minH="260px"
            border="1px solid #e2e8f0"
            boxSizing="border-box"
            _hover={{
              boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            }}
            mb={{ base: 4, md: 0 }}
          >
            <Box display="flex" alignItems="center" w="100%" mb={4}>
              <Box w="4px" h="32px" bg="#003f2d" borderRadius="full" mr={3} />
              <Heading as="h2" size="md" color="#003f2d" fontWeight="bold" display="flex" alignItems="center" gap={2}>
                <Icon as={FaUsers} boxSize={6} color="#003f2d" /> Customers
              </Heading>
            </Box>
            <Text fontSize="md" color="gray.600" mb={3} textAlign="center">
              Manage your customer base and view details.
            </Text>
            <Button as={Link} href="/admin/create-customer" leftIcon={<Icon as={FaUserPlus} />} bg="#003f2d" color="white"
              _hover={{ bg: '#14543a' }}
              _focus={{ bg: '#14543a' }}
              size="lg" w="100%" mb={2} mt={1}>
              Create new customer
            </Button>
            <Button as={Link} href="/admin/view-customers" leftIcon={<Icon as={FaUsers} />} bg="#003f2d" color="white"
              _hover={{ bg: 'white', color: '#003f2d', border: '2px solid #003f2d' }}
              _focus={{ bg: 'white', color: '#003f2d', border: '2px solid #003f2d' }}
              size="lg" w="100%">
              View customers
            </Button>
          </Box>
          {/* Divider */}
          <Box display={{ base: 'none', md: 'block' }} width="1px" bg="gray.200" mx={2} borderRadius="full" />
          {/* Financial Card */}
          <Box
            className="dashboard-card"
            flex="1"
            bg="white"
            boxShadow="md"
            borderRadius="2xl"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            minH="260px"
            border="1px solid #e2e8f0"
            boxSizing="border-box"
            _hover={{
              boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            }}
            mb={{ base: 4, md: 0 }}
          >
            <Box display="flex" alignItems="center" w="100%" mb={4}>
              <Box w="4px" h="32px" bg="#003f2d" borderRadius="full" mr={3} />
              <Heading as="h2" size="md" color="#003f2d" fontWeight="bold" display="flex" alignItems="center" gap={2}>
                <Icon as={FaMoneyBillWave} boxSize={6} color="#003f2d" /> Financial
              </Heading>
            </Box>
            <Text fontSize="md" color="gray.600" mb={3} textAlign="center">
              View and manage invoices and billing.
            </Text>
            <Button as={Link} href="/admin/invoices" leftIcon={<Icon as={FaFileInvoiceDollar} />} bg="#003f2d" color="white"
              _hover={{ bg: '#14543a' }}
              _focus={{ bg: '#14543a' }}
              size="lg" w="100%" mb={2} mt={1}>
              Invoices
            </Button>
            <Button as={Link} href="/admin/billings" leftIcon={<Icon as={FaMoneyBillWave} />} bg="#003f2d" color="white"
              _hover={{ bg: 'white', color: '#003f2d', border: '2px solid #003f2d' }}
              _focus={{ bg: 'white', color: '#003f2d', border: '2px solid #003f2d' }}
              size="lg" w="100%">
              Billings
            </Button>
          </Box>
          {/* Divider */}
          <Box display={{ base: 'none', md: 'block' }} width="1px" bg="gray.200" mx={2} borderRadius="full" />
          {/* Products Card */}
          <Box
            className="dashboard-card"
            flex="1"
            bg="white"
            boxShadow="md"
            borderRadius="2xl"
            p={6}
            display="flex"
            flexDirection="column"
            alignItems="center"
            minH="260px"
            border="1px solid #e2e8f0"
            boxSizing="border-box"
            _hover={{
              boxShadow: '0 6px 12px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
              transition: 'all 0.2s ease-in-out',
            }}
            mb={{ base: 4, md: 0 }}
          >
            <Box display="flex" alignItems="center" w="100%" mb={4}>
              <Box w="4px" h="32px" bg="#003f2d" borderRadius="full" mr={3} />
              <Heading as="h2" size="md" color="#003f2d" fontWeight="bold" display="flex" alignItems="center" gap={2}>
                <Icon as={FaBoxOpen} boxSize={6} color="#003f2d" /> Products
              </Heading>
            </Box>
            <Text fontSize="md" color="gray.600" mb={3} textAlign="center">
              Manage your product catalogue and inventory.
            </Text>
            <Button
              as={Link}
              href="/admin/products"
              leftIcon={<Icon as={FaBoxOpen} />}
              bg="#003f2d"
              color="white"
              _hover={{ bg: '#14543a' }}
              _focus={{ bg: '#14543a' }}
              size="lg"
              w="100%"
              mb={2}
              mt={1}
              >
              Products
              </Button>
          </Box>
        </Box>
        {/* Card footers with faded logo */}
        <Box w="100%" display="flex" flexDirection={{ base: 'column', md: 'row' }} gap={8} mt={8}>
          <Box flex="1" display="flex" justifyContent="center" alignItems="flex-end" opacity={0.10}>
            <Image src="/logo.png" alt="Lucky Logic Logo" width={120} height={40} style={{ objectFit: 'contain' }} />
          </Box>
          <Box flex="1" display="flex" justifyContent="center" alignItems="flex-end" opacity={0.10}>
            <Image src="/logo.png" alt="Lucky Logic Logo" width={120} height={40} style={{ objectFit: 'contain' }} />
          </Box>
          <Box flex="1" display="flex" justifyContent="center" alignItems="flex-end" opacity={0.10}>
            <Image src="/logo.png" alt="Lucky Logic Logo" width={120} height={40} style={{ objectFit: 'contain' }} />
          </Box>
        </Box>
      </Box>
      <Box w="100%" maxW="1200px" mx="auto" px={4} pb={8} display="flex" justifyContent="center">
        <Button onClick={handleLogout} colorScheme="red" variant="outline" size="lg" w={{ base: '100%', md: 'auto' }}
          _hover={{ bg: 'red.50', color: 'red.600', border: '2px solid', borderColor: 'red.300' }}
          _focus={{ bg: 'red.50', color: 'red.600', border: '2px solid', borderColor: 'red.300' }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );
} 