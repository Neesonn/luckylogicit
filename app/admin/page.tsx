'use client';
import { Box, Heading, Text, Button, HStack, Tooltip, Skeleton, SkeletonText, Badge, IconButton, SimpleGrid } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaUsers, FaFileInvoiceDollar, FaMoneyBillWave, FaBoxOpen, FaLock, FaUnlock, FaProjectDiagram, FaFile } from 'react-icons/fa';
import { Icon } from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { useLock } from '../../components/LockContext';
import { useStripeData } from '../../components/StripeDataContext';
import supabase from '../services/supabaseClient';
import StickyNavBar from '../../components/StickyNavBar';
import AdminSessionTimeout from '../../components/AdminSessionTimeout';

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
  const { customers, invoices, quotes, loading, error, refresh } = useStripeData();
  const { metricsLocked, setMetricsLocked } = useLock();
  const [productCount, setProductCount] = useState<number>(0);

  // Outstanding invoices calculation
  const outstanding = invoices
    ?.filter(inv => ['open', 'past_due'].includes(inv.status))
    .reduce((sum, inv) => sum + (inv.amount_due || 0), 0);

  // Open quotes calculation
  const getQuoteStatus = (quote: any) => {
    if (quote.status === 'open' && quote.expires_at && quote.expires_at * 1000 < Date.now()) {
      return 'Expired';
    }
    return quote.status.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());
  };

  const openQuotes = quotes?.filter(quote => getQuoteStatus(quote) === 'Open') || [];
  const openQuotesCount = openQuotes.length;
  const openQuotesTotal = openQuotes.reduce((sum, quote) => sum + (quote.amount_total || 0), 0);

  const animatedCustomers = useCountUp(customers?.length ?? 0, 1000);
  const animatedOutstanding = useCountUp(Math.round(outstanding / 100), 1200); // show dollars only
  const animatedOpenQuotesCount = useCountUp(openQuotesCount, 1000);
  const animatedOpenQuotesTotal = useCountUp(Math.round(openQuotesTotal / 100), 1200); // show dollars only

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
    router.push('/admin/login');
  };

  return (
    <>
      <AdminSessionTimeout />
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
            <Heading as="h1" size="2xl" color="gray.900" fontWeight="extrabold" mb={2} letterSpacing="tight">
              Welcome back!, {adminName}
            </Heading>
            <IconButton
              aria-label={metricsLocked ? 'Unlock metrics' : 'Lock metrics'}
              icon={metricsLocked ? <FaLock /> : <FaUnlock />}
              onClick={() => setMetricsLocked(!metricsLocked)}
              size="md"
              colorScheme={metricsLocked ? 'gray' : 'green'}
              variant={metricsLocked ? 'outline' : 'solid'}
              ml={2}
              boxShadow="md"
              _hover={{
                transform: 'translateY(-1px)',
                boxShadow: 'lg',
              }}
            />
          </Box>
          <Text fontSize="xl" color="gray.700" fontWeight="medium" mb={8} lineHeight="tall">
            Manage your customers, finances, and products from one place.
          </Text>
          
          {/* Enhanced Metrics summary row with tooltips */}
          <Box w="100%" maxW="1200px" mx="auto" mb={10}>
            <HStack spacing={8} justify="center" align="center" flexWrap="wrap">
              {/* Each metric card: fixed width, height, and vertical centering */}
              <Tooltip label="Total number of customers in your system." fontSize="md" borderRadius="md" bg="gray.700" color="white" hasArrow>
                <Box 
                  display="flex" 
                  flexDirection="column"
                  alignItems="center" 
                  justifyContent="center"
                  bg="white" 
                  boxShadow="lg" 
                  borderRadius="xl" 
                  w="240px"
                  h="120px"
                  border="2px solid"
                  borderColor="green.200"
                  _hover={{
                    boxShadow: 'xl',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Icon as={FaUsers} color="green.600" boxSize={7} mb={1} />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Total Customers</Text>
                  {loading ? (
                    <Skeleton height="32px" width="48px" borderRadius="md" />
                  ) : (
                    <Text fontSize="2xl" fontWeight="bold" color="green.700"
                      style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                      {animatedCustomers}
                    </Text>
                  )}
                </Box>
              </Tooltip>
              <Tooltip label="Total value of all outstanding invoices (not yet paid)." fontSize="md" borderRadius="md" bg="gray.700" color="white" hasArrow>
                <Box 
                  display="flex" 
                  flexDirection="column"
                  alignItems="center" 
                  justifyContent="center"
                  bg="white" 
                  boxShadow="lg" 
                  borderRadius="xl" 
                  w="240px"
                  h="120px"
                  border="2px solid"
                  borderColor="orange.200"
                  _hover={{
                    boxShadow: 'xl',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Icon as={FaMoneyBillWave} color="orange.600" boxSize={7} mb={1} />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Outstanding Invoices</Text>
                  {loading ? (
                    <Skeleton height="32px" width="80px" borderRadius="md" />
                  ) : (
                    <Text fontSize="2xl" fontWeight="bold" color="orange.700"
                      style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                      ${animatedOutstanding.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Text>
                  )}
                </Box>
              </Tooltip>
              <Tooltip label="Total value of all open quotes awaiting client action." fontSize="md" borderRadius="md" bg="gray.700" color="white" hasArrow>
                <Box 
                  display="flex" 
                  flexDirection="column"
                  alignItems="center" 
                  justifyContent="center"
                  bg="white" 
                  boxShadow="lg" 
                  borderRadius="xl" 
                  w="240px"
                  h="120px"
                  border="2px solid"
                  borderColor="blue.200"
                  _hover={{
                    boxShadow: 'xl',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Icon as={FaFile} color="blue.600" boxSize={7} mb={1} />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Open Quotes</Text>
                  {loading ? (
                    <Skeleton height="32px" width="80px" borderRadius="md" />
                  ) : (
                    <Text fontSize="2xl" fontWeight="bold" color="blue.700"
                      style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                      ${animatedOpenQuotesTotal.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </Text>
                  )}
                </Box>
              </Tooltip>
              <Tooltip label="Number of products currently in your catalogue." fontSize="md" borderRadius="md" bg="gray.700" color="white" hasArrow>
                <Box 
                  display="flex" 
                  flexDirection="column"
                  alignItems="center" 
                  justifyContent="center"
                  bg="white" 
                  boxShadow="lg" 
                  borderRadius="xl" 
                  w="240px"
                  h="120px"
                  border="2px solid"
                  borderColor="purple.200"
                  _hover={{
                    boxShadow: 'xl',
                    transform: 'translateY(-2px)',
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  <Icon as={FaBoxOpen} color="purple.600" boxSize={7} mb={1} />
                  <Text fontSize="sm" color="gray.600" fontWeight="medium" mb={1}>Products in Catalogue</Text>
                  <Text fontSize="2xl" fontWeight="bold" color="purple.700"
                    style={metricsLocked ? { filter: 'blur(8px)' } : {}}>
                    {productCount}
                  </Text>
                </Box>
              </Tooltip>
            </HStack>
          </Box>
          
          {/* Quick Actions as SimpleGrid for alignment */}
          <Box w="100%" maxW="1200px" mx="auto" mb={10}>
            <Heading as="h2" size="lg" color="gray.800" fontWeight="bold" mb={6} textAlign="center">
              Quick Actions
            </Heading>
            <SimpleGrid 
              columns={{ base: 1, md: 2 }}
              spacing={8}
              w="100%"
            >
              {/* Customers Card - Enhanced */}
              <Box
                flex="1"
                className="dashboard-card"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="380px"
                bg="white"
                boxShadow="xl"
                borderRadius="2xl"
                p={8}
                border="2px solid"
                borderColor="green.200"
                boxSizing="border-box"
                _hover={{
                  boxShadow: '2xl',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                  borderColor: 'green.300',
                }}
              >
                <Box display="flex" alignItems="center" w="100%" mb={6}>
                  <Box w="6px" h="40px" bg="green.500" borderRadius="full" mr={4} />
                  <Heading as="h3" size="lg" color="green.700" fontWeight="bold" display="flex" alignItems="center" gap={3}>
                    <Icon as={FaUsers} boxSize={7} color="green.600" /> Customers
                  </Heading>
                </Box>
                <Text fontSize="lg" color="gray.600" mb={6} textAlign="center" lineHeight="tall">
                  Manage your customer base and view detailed customer information.
                </Text>
                <Box mt="auto" w="100%">
                  <Button as={Link} href="/admin/create-customer" leftIcon={<Icon as={FaUserPlus} />} 
                    bg="green.600" color="white"
                    _hover={{ bg: 'green.700', transform: 'translateY(-1px)' }}
                    _focus={{ bg: 'green.700' }}
                    size="lg" w="100%" mb={3}
                    boxShadow="md"
                    borderRadius="lg">
                    Create new customer
                  </Button>
                  <Button as={Link} href="/admin/view-customers" leftIcon={<Icon as={FaUsers} />} 
                    bg="white" color="green.600" border="2px solid" borderColor="green.600"
                    _hover={{ bg: 'green.50', transform: 'translateY(-1px)' }}
                    _focus={{ bg: 'green.50' }}
                    size="lg" w="100%"
                    boxShadow="sm"
                    borderRadius="lg">
                    View customers
                  </Button>
                </Box>
              </Box>
              {/* Products Card - Enhanced */}
              <Box
                flex="1"
                className="dashboard-card"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="380px"
                bg="white"
                boxShadow="xl"
                borderRadius="2xl"
                p={8}
                border="2px solid"
                borderColor="purple.200"
                boxSizing="border-box"
                _hover={{
                  boxShadow: '2xl',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                  borderColor: 'purple.300',
                }}
              >
                <Box display="flex" alignItems="center" w="100%" mb={6}>
                  <Box w="6px" h="40px" bg="purple.500" borderRadius="full" mr={4} />
                  <Heading as="h3" size="lg" color="purple.700" fontWeight="bold" display="flex" alignItems="center" gap={3}>
                    <Icon as={FaBoxOpen} boxSize={7} color="purple.600" /> Products
                  </Heading>
                </Box>
                <Text fontSize="lg" color="gray.600" mb={6} textAlign="center" lineHeight="tall">
                  Manage your product catalogue and internal products.
                </Text>
                <Box mt="auto" w="100%">
                  <Button as={Link} href="/admin/products" leftIcon={<Icon as={FaBoxOpen} />} 
                    bg="purple.600" color="white"
                    _hover={{ bg: 'purple.700', transform: 'translateY(-1px)' }}
                    _focus={{ bg: 'purple.700' }}
                    size="lg" w="100%" mb={3}
                    boxShadow="md"
                    borderRadius="lg">
                    Products
                  </Button>
                  <Button as={Link} href="/admin/internal-products" leftIcon={<Icon as={FaBoxOpen} />} 
                    bg="white" color="purple.600" border="2px solid" borderColor="purple.600"
                    _hover={{ bg: 'purple.50', transform: 'translateY(-1px)' }}
                    _focus={{ bg: 'purple.50' }}
                    size="lg" w="100%"
                    boxShadow="sm"
                    borderRadius="lg">
                    Internal Products
                  </Button>
                </Box>
              </Box>
              {/* Transactions Card - Merged */}
              <Box
                flex="1"
                className="dashboard-card"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="380px"
                bg="white"
                boxShadow="xl"
                borderRadius="2xl"
                p={8}
                border="2px solid"
                borderColor="orange.200"
                boxSizing="border-box"
                _hover={{
                  boxShadow: '2xl',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                  borderColor: 'orange.300',
                }}
              >
                <Box display="flex" alignItems="center" w="100%" mb={6}>
                  <Box w="6px" h="40px" bg="orange.500" borderRadius="full" mr={4} />
                  <Heading as="h3" size="lg" color="orange.700" fontWeight="bold" display="flex" alignItems="center" gap={3}>
                    <Icon as={FaMoneyBillWave} boxSize={7} color="orange.600" /> Transactions
                  </Heading>
                </Box>
                <Text fontSize="lg" color="gray.600" mb={6} textAlign="center" lineHeight="tall">
                  Manage all outgoing and incoming transactions.
                </Text>
                <Box mt="auto" w="100%">
                  <Box mb={4}>
                    <Text fontSize="md" color="orange.700" fontWeight="bold" mb={2}>Outgoing</Text>
                    <Tooltip label="View and manage all invoices you have sent to clients." fontSize="sm" borderRadius="md" bg="gray.700" color="white" hasArrow>
                      <Button as={Link} href="/admin/invoices" leftIcon={<Icon as={FaFileInvoiceDollar} />} 
                        bg="orange.600" color="white"
                        _hover={{ bg: 'orange.700', transform: 'translateY(-1px)' }}
                        _focus={{ bg: 'orange.700' }}
                        size="lg" w="100%" mb={3}
                        boxShadow="md"
                        borderRadius="lg">
                        Invoices
                      </Button>
                    </Tooltip>
                    <Tooltip label="View and manage all quotes sent to clients." fontSize="sm" borderRadius="md" bg="gray.700" color="white" hasArrow>
                      <Button as={Link} href="/admin/quotes" leftIcon={<Icon as={FaFile} />} 
                        bg="white" color="orange.600" border="2px solid" borderColor="orange.600"
                        _hover={{ bg: 'orange.50', transform: 'translateY(-1px)' }}
                        _focus={{ bg: 'orange.50' }}
                        size="lg" w="100%"
                        boxShadow="sm"
                        borderRadius="lg">
                        Quotes
                      </Button>
                    </Tooltip>
                  </Box>
                  <Box>
                    <Text fontSize="md" color="orange.700" fontWeight="bold" mb={2}>Incoming</Text>
                    <Tooltip label="View and manage all bills and payments you have received." fontSize="sm" borderRadius="md" bg="gray.700" color="white" hasArrow>
                      <Button as={Link} href="/admin/billings" leftIcon={<Icon as={FaMoneyBillWave} />} 
                        bg="white" color="orange.600" border="2px solid" borderColor="orange.600"
                        _hover={{ bg: 'orange.50', transform: 'translateY(-1px)' }}
                        _focus={{ bg: 'orange.50' }}
                        size="lg" w="100%"
                        boxShadow="sm"
                        borderRadius="lg">
                        Billings & Payments
                      </Button>
                    </Tooltip>
                  </Box>
                </Box>
              </Box>
              {/* Projects Card - Restored */}
              <Box
                flex="1"
                className="dashboard-card"
                display="flex"
                flexDirection="column"
                alignItems="center"
                minH="380px"
                bg="white"
                boxShadow="xl"
                borderRadius="2xl"
                p={8}
                border="2px solid"
                borderColor="blue.200"
                boxSizing="border-box"
                _hover={{
                  boxShadow: '2xl',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease-in-out',
                  borderColor: 'blue.300',
                }}
              >
                <Box display="flex" alignItems="center" w="100%" mb={6}>
                  <Box w="6px" h="40px" bg="blue.500" borderRadius="full" mr={4} />
                  <Heading as="h3" size="lg" color="blue.700" fontWeight="bold" display="flex" alignItems="center" gap={3}>
                    <Icon as={FaProjectDiagram} boxSize={7} color="blue.600" /> Projects
                  </Heading>
                </Box>
                <Text fontSize="lg" color="gray.600" mb={6} textAlign="center" lineHeight="tall">
                  Manage client projects and track deliverables.
                </Text>
                <Box mt="auto" w="100%">
                  <Tooltip label="View and manage all client projects and deliverables." fontSize="sm" borderRadius="md" bg="gray.700" color="white" hasArrow>
                    <Button as={Link} href="/admin/manage-projects" leftIcon={<Icon as={FaProjectDiagram} />} 
                      bg="blue.600" color="white"
                      _hover={{ bg: 'blue.700', transform: 'translateY(-1px)' }}
                      _focus={{ bg: 'blue.700' }}
                      size="lg" w="100%"
                      boxShadow="md"
                      borderRadius="lg">
                      Manage Projects
                    </Button>
                  </Tooltip>
                </Box>
              </Box>
            </SimpleGrid>
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
            <Box flex="1" display="flex" justifyContent="center" alignItems="flex-end" opacity={0.10}>
              <Image src="/logo.png" alt="Lucky Logic Logo" width={120} height={40} style={{ objectFit: 'contain' }} />
            </Box>
          </Box>
        </Box>
        <StickyNavBar />
      </Box>
    </>
  );
} 