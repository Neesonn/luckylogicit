'use client';

import AdminSessionTimeout from '../../../components/AdminSessionTimeout';

export const dynamic = 'force-dynamic';
import { Box, Heading, Text, Button, HStack, Input, Select, Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Spacer, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Textarea, useDisclosure, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Divider, useToast, SimpleGrid, useBreakpointValue, VStack } from '@chakra-ui/react';
import { AddIcon, SearchIcon, EditIcon, InfoOutlineIcon, DeleteIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import supabase from '../../services/supabaseClient';
import GlassCard from '../../../components/GlassCard';

type Product = {
  id?: number;
  name: string;
  vendor: string;
  description: string;
  category: string;
  distributor: string;
  vendorSku: string;
  distributorSku: string;
  rrp: number;
  cost: number;
  costGstType: string;
  markup: number;
  sell: number;
  createdAt?: string;
  updatedAt?: string;
};

const mockProducts = [
  {
    name: 'Synology NAS',
    vendor: 'Synology',
    description: 'Network Attached Storage device',
    category: 'Storage',
    distributor: 'Dicker Data',
    vendorSku: 'SYNO-NAS-001',
    distributorSku: 'DD-12345',
    rrp: 1200,
    cost: 850,
    costGstType: 'ex GST',
    markup: 15,
    sell: 977.5,
    margin: 127.5,
  },
  {
    name: 'Cisco Switch',
    vendor: 'Cisco',
    description: '24-port managed switch',
    category: 'Networking',
    distributor: 'Synnex',
    vendorSku: 'CISCO-SW-24',
    distributorSku: 'SX-54321',
    rrp: 350,
    cost: 210,
    costGstType: 'ex GST',
    markup: 20,
    sell: 252,
    margin: 42,
  },
];

// Helper to calculate margin rating and label
function getMarginRating(cost: number, sell: number, rrp: number) {
  let marginRating = 0;
  let marginLabel = '';
  let marginPercent = 0;
  if (rrp > cost && sell > cost) {
    marginPercent = ((sell - cost) / (rrp - cost)) * 100;
    marginRating = Math.max(1, Math.min(10, Math.round((marginPercent / 100) * 10)));
    if (marginRating <= 3) marginLabel = 'Poor';
    else if (marginRating <= 6) marginLabel = 'Fair';
    else if (marginRating <= 8) marginLabel = 'Good';
    else marginLabel = 'Excellent';
  }
  return { marginRating, marginLabel };
}

export default function ProductsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [distributor, setDistributor] = useState('');
  const [products, setProducts] = useState<Product[]>([]);

  // Fetch products from Supabase on mount
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, vendor, description, category, distributor, vendorSku, distributorSku, rrp, cost, costGstType, markup, sell, createdAt, updatedAt')
        .order('createdAt', { ascending: false });
      if (error) {
        console.error('❌ Supabase fetch error:', error.message, error.details);
      }
      if (!error) setProducts(data || []);
    };
    fetchProducts();
  }, []);

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<{
    id?: number;
    name: string;
    vendor: string;
    description: string;
    category: string;
    distributor: string;
    vendorSku: string;
    distributorSku: string;
    rrp: string;
    cost: string;
    costGstType: string;
    markup: string;
    sell: string;
  }>({
    id: undefined,
    name: '',
    vendor: '',
    description: '',
    category: '',
    distributor: '',
    vendorSku: '',
    distributorSku: '',
    rrp: '',
    cost: '',
    costGstType: 'ex GST',
    markup: '',
    sell: '',
  });
  const [profit, setProfit] = useState(0);
  const [lastChanged, setLastChanged] = useState<'markup' | 'sell'>('markup');
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Live calculation
  const handleCalc = (costVal: any, markupVal: any, sellVal: any, changed: 'markup' | 'sell') => {
    const cost = parseFloat(costVal) || 0;
    let markup = parseFloat(markupVal);
    let sell = parseFloat(sellVal);
    if (changed === 'markup') {
      if (!isNaN(markup)) {
        sell = cost * (1 + markup / 100);
      } else {
        sell = 0;
      }
    } else if (changed === 'sell') {
      if (cost > 0 && !isNaN(sell)) {
        markup = ((sell / cost) - 1) * 100;
      } else {
        markup = 0;
      }
    }
    setForm(f => ({ ...f, markup: markup.toString(), sell: sell.toString() }));
    setProfit(sell - cost);
  };

  const handleFormChange = (e: any) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'cost') {
      handleCalc(value, form.markup, form.sell, lastChanged);
    } else if (name === 'markup') {
      setLastChanged('markup');
      handleCalc(form.cost, value, form.sell, 'markup');
    } else if (name === 'sell') {
      setLastChanged('sell');
      handleCalc(form.cost, form.markup, value, 'sell');
    }
  };

  const handleAddProduct = () => {
    setForm({ id: undefined, name: '', vendor: '', description: '', category: '', distributor: '', vendorSku: '', distributorSku: '', rrp: '', cost: '', costGstType: 'ex GST', markup: '', sell: '' });
    setProfit(0);
    setEditIndex(null);
    setErrors({});
    setLastChanged('markup');
    onOpen();
  };

  const handleEditProduct = (idx: number) => {
    const p: Product = products[idx];
    setForm({
      id: p.id,
      name: p.name,
      vendor: p.vendor || '',
      description: p.description || '',
      category: p.category || '',
      distributor: p.distributor || '',
      vendorSku: p.vendorSku || '',
      distributorSku: p.distributorSku || '',
      rrp: p.rrp !== undefined && p.rrp !== null ? p.rrp.toString() : '',
      cost: p.cost.toString(),
      costGstType: p.costGstType || 'ex GST',
      markup: p.markup.toString(),
      sell: p.sell !== undefined && p.sell !== null ? p.sell.toString() : '',
    });
    setProfit(p.sell - p.cost);
    setEditIndex(idx);
    setErrors({});
    setLastChanged('markup');
    onOpen();
  };

  // Delete product handler
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deleteIdx, setDeleteIdx] = useState<number | null>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const toast = useToast();
  const [deleting, setDeleting] = useState(false);

  const handleDeleteProduct = (idx: number) => {
    setDeleteIdx(idx);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    if (deleteIdx !== null) {
      const id = products[deleteIdx].id;
      console.log('Deleting product with id:', id, 'Type:', typeof id);
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (!error) {
        setProducts((prev: Product[]) => prev.filter((_, i) => i !== deleteIdx));
        // Dispatch custom event for live update
        window.dispatchEvent(new Event('products-updated'));
        toast({ title: 'Product deleted', status: 'success', duration: 3000, isClosable: true });
      } else {
        toast({ title: 'Error deleting product', description: error.message, status: 'error', duration: 4000, isClosable: true });
      }
    }
    setIsDeleteOpen(false);
    setDeleteIdx(null);
    setDeleting(false);
  };

  const cancelDelete = () => {
    setIsDeleteOpen(false);
    setDeleteIdx(null);
  };

  // Validation logic
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required.';
    if (!form.vendor.trim()) newErrors.vendor = 'Vendor is required.';
    if (!form.category) newErrors.category = 'Category is required.';
    if (!form.distributor) newErrors.distributor = 'Distributor is required.';
    if (!form.cost || isNaN(Number(form.cost)) || Number(form.cost) <= 0) newErrors.cost = 'Enter a valid positive cost.';
    if (!form.markup || isNaN(Number(form.markup)) || Number(form.markup) < 0) newErrors.markup = 'Enter a valid markup % (0 or more).';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;
    const productData = {
      ...form,
      rrp: parseFloat(form.rrp) || 0,
      cost: parseFloat(form.cost) || 0,
      markup: parseFloat(form.markup) || 0,
      sell: parseFloat(form.sell) || 0,
      costGstType: form.costGstType,
    };
    const insertData = { ...productData };
    delete insertData.id;
    if (editIndex === null) {
      // Add product to Supabase
      const { error } = await supabase.from('products').insert([insertData]);
      if (!error) {
        const { data: fetchedData, error: fetchError } = await supabase
          .from('products')
          .select('id, name, vendor, description, category, distributor, vendorSku, distributorSku, rrp, cost, costGstType, markup, sell, createdAt, updatedAt')
          .order('createdAt', { ascending: false });
        if (fetchError) {
          console.error('❌ Supabase fetch error:', fetchError.message, fetchError.details);
        }
        setProducts(fetchedData || []);
        // Dispatch custom event for live update
        window.dispatchEvent(new Event('products-updated'));
        onClose();
      } else {
        console.error('❌ Supabase insert/update error:', error.message, error.details);
      }
    } else {
      // Update product in Supabase
      const id = products[editIndex].id;
      const { error } = await supabase.from('products').update(productData).eq('id', id);
      if (!error) {
        const { data: fetchedData, error: fetchError } = await supabase
          .from('products')
          .select('id, name, vendor, description, category, distributor, vendorSku, distributorSku, rrp, cost, costGstType, markup, sell, createdAt, updatedAt')
          .order('createdAt', { ascending: false });
        if (fetchError) {
          console.error('❌ Supabase fetch error:', fetchError.message, fetchError.details);
        }
        setProducts(fetchedData || []);
        // Dispatch custom event for live update
        window.dispatchEvent(new Event('products-updated'));
        onClose();
      }
    }
  };

  // Filter products based on search, category, and distributor
  const filteredProducts = products.filter((p: Product) => {
    // Category filter
    if (category && p.category !== category) return false;
    // Distributor filter
    if (distributor && p.distributor !== distributor) return false;
    // Search filter
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return [
      p.vendor,
      p.name,
      p.distributor,
      p.rrp?.toString(),
      p.vendorSku,
      p.distributorSku,
      p.cost?.toString(),
      p.costGstType,
      p.markup?.toString(),
      p.sell?.toString(),
      p.description,
      p.category,
    ].some(f => (f || '').toLowerCase().includes(term));
  });

  // Calculate margin rating (1-10) based on RRP, Buy, and Sell
  let marginRating = 0;
  let marginLabel = '';
  let marginPercent = 0;
  const costNum = parseFloat(form.cost || '0');
  const sellNum = parseFloat(form.sell || '0');
  const rrpNum = parseFloat(form.rrp || '0');
  if (rrpNum > costNum && sellNum > costNum) {
    marginPercent = ((sellNum - costNum) / (rrpNum - costNum)) * 100;
    marginRating = Math.max(1, Math.min(10, Math.round((marginPercent / 100) * 10)));
    if (marginRating <= 3) marginLabel = 'Poor';
    else if (marginRating <= 6) marginLabel = 'Fair';
    else if (marginRating <= 8) marginLabel = 'Good';
    else marginLabel = 'Excellent';
  }

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <AdminSessionTimeout />
      <Box minH="100vh" bg="gray.50" px={4} py={10}>
        {/* Header */}
        <Box maxW="1200px" mx="auto" mb={6}>
          <Heading as="h1" size="xl" color="#003f2d" fontWeight="bold" mb={1}>
            Product Catalogue
          </Heading>
          <Text fontSize="md" color="gray.700" fontWeight="semibold" mt={2}>
            Products in Catalogue: {products.length}
          </Text>
          <Text fontSize="lg" color="gray.600">
            Track, price, and manage your IT product listings.
          </Text>
        </Box>
        {/* Toolbar */}
        <Flex maxW="1200px" mx="auto" mb={4} align="center" gap={2} flexWrap="wrap">
          <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleAddProduct}>
            Add New Product
          </Button>
          <Select placeholder="Filter by Category" w="200px" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="Networking">Networking</option>
            <option value="Storage">Storage</option>
            <option value="Accessories">Accessories</option>
          </Select>
          <Select placeholder="Filter by Distributor" w="200px" value={distributor} onChange={e => setDistributor(e.target.value)}>
            <option value="Synnex">Synnex</option>
            <option value="Dicker Data">Dicker Data</option>
            <option value="BlueChip IT">BlueChip IT</option>
          </Select>
          <Spacer />
          <Box display="flex" alignItems="center" gap={2}>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              w="220px"
              bg="white"
            />
            <IconButton aria-label="Search" icon={<SearchIcon />} colorScheme="gray" />
          </Box>
        </Flex>
        {/* Static Table */}
        {isMobile ? (
          <VStack w="100%" spacing={4} maxW="500px" mx="auto" mb={8}>
            {filteredProducts.map((p: Product, idx: number) => (
              <GlassCard key={idx} w="100%" p={4} borderRadius="lg" boxShadow="md">
                <Text fontWeight="bold" fontSize="lg">{p.name}</Text>
                <Text>Vendor: {p.vendor}</Text>
                <Text>Category: {p.category}</Text>
                <Text>Distributor: {p.distributor}</Text>
                <Text>RRP: ${p.rrp}</Text>
                <Text>Buy: ${p.cost}</Text>
                <Text>Markup: {p.markup}%</Text>
                <Text>Sell: ${p.sell}</Text>
                <Text>Margin: ${((p.sell || 0) - (p.cost || 0)).toFixed(2)}</Text>
                <Text>Rating: {getMarginRating(p.cost, p.sell, p.rrp).marginLabel}</Text>
                <HStack spacing={2} mt={2}>
                  <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" colorScheme="green" onClick={() => handleEditProduct(idx)} />
                  <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" colorScheme="red" onClick={() => handleDeleteProduct(idx)} />
                </HStack>
              </GlassCard>
            ))}
          </VStack>
        ) : (
          <Box maxW="1200px" mx="auto" bg="white" boxShadow="md" borderRadius="2xl" p={0}>
            <Table variant="simple" size="sm" sx={{ 'th, td': { whiteSpace: 'nowrap', fontSize: '14px', px: 2, py: 1, verticalAlign: 'middle' } }} layout="auto">
              <Thead bg="gray.100">
                <Tr>
                  <Th fontSize="15px">Vendor</Th>
                  <Th fontSize="15px">Category</Th>
                  <Th fontSize="15px">Product Name</Th>
                  <Th fontSize="15px">Distributor</Th>
                  <Th isNumeric fontSize="15px">RRP$</Th>
                  <Th isNumeric fontSize="15px">Buy</Th>
                  <Th isNumeric fontSize="15px">Markup %</Th>
                  <Th isNumeric fontSize="15px">Sell $</Th>
                  <Th isNumeric fontSize="15px">Margin $</Th>
                  <Th fontSize="15px">Rating</Th>
                  <Th fontSize="15px">Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredProducts.map((p: Product, idx: number) => (
                  <Tr key={idx}>
                    <Td>
                      {p.vendor}
                      <Popover placement="right" trigger="click">
                        <PopoverTrigger>
                          <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" aria-label="Show Vendor SKU" />
                        </PopoverTrigger>
                        <PopoverContent w="auto" fontSize="sm">
                          <PopoverArrow />
                          <PopoverBody>
                            <b>Vendor SKU:</b> {p.vendorSku || 'No SKU available'}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>{p.category}</Td>
                    <Td>
                      {p.name}
                      <Popover placement="right" trigger="click">
                        <PopoverTrigger>
                          <InfoOutlineIcon
                            ml={2}
                            boxSize={3.5}
                            color="gray.500"
                            cursor="pointer"
                            aria-label="Show Description"
                          />
                        </PopoverTrigger>
                        <PopoverContent w="auto" fontSize="sm">
                          <PopoverArrow />
                          <PopoverBody>
                            <b>Description:</b> {p.description || 'No description'}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td>
                      {p.distributor}
                      <Popover placement="right" trigger="click">
                        <PopoverTrigger>
                          <InfoOutlineIcon
                            ml={2}
                            boxSize={3.5}
                            color="gray.500"
                            cursor="pointer"
                            aria-label="Show Distributor SKU"
                          />
                        </PopoverTrigger>
                        <PopoverContent w="auto" fontSize="sm">
                          <PopoverArrow />
                          <PopoverBody>
                            <b>Distributor SKU:</b> {p.distributorSku || 'No SKU available'}
                          </PopoverBody>
                        </PopoverContent>
                      </Popover>
                    </Td>
                    <Td isNumeric>{p.rrp ? `$${Number(p.rrp).toFixed(2)}` : '-'}</Td>
                    <Td isNumeric>${p.cost.toFixed(2)}</Td>
                    <Td isNumeric>{isNaN(Number(p.markup)) ? '0.00%' : (Math.round(Number(p.markup) * 100) / 100).toFixed(2) + '%'}</Td>
                    <Td isNumeric>${p.sell.toFixed(2)}</Td>
                    <Td isNumeric>${(p.sell - p.cost).toFixed(2)}</Td>
                    <Td>
                      {(() => {
                        const { marginRating } = getMarginRating(p.cost, p.sell, p.rrp);
                        return (
                          <Box display="flex" gap={0.5} alignItems="center">
                            {[...Array(10)].map((_, i) => (
                              <Box key={i} w={3} h={3} borderRadius="full" bg={
                                i < marginRating
                                  ? marginRating >= 8
                                    ? 'green.400'
                                    : marginRating >= 5
                                      ? 'yellow.400'
                                      : 'red.400'
                                  : 'gray.200'
                              } border={i < marginRating ? '2px solid #14543a' : '1px solid #e2e8f0'} />
                            ))}
                          </Box>
                        );
                      })()}
                    </Td>
                    <Td>
                      <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" colorScheme="blue" variant="outline" onClick={() => handleEditProduct(products.indexOf(p))} mr={2} />
                      <IconButton aria-label="Delete" icon={<DeleteIcon />} size="sm" colorScheme="red" variant="outline" onClick={() => handleDeleteProduct(products.indexOf(p))} />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
        {/* Pagination and Footer (Placeholder) */}
        <Flex maxW="1200px" mx="auto" mt={4} align="center" justify="space-between" color="gray.600">
          <Text>Rows per page: 10</Text>
          <Text>Total margin this page: ${filteredProducts.reduce((sum: number, p: Product) => sum + (p.sell - p.cost), 0).toFixed(2)}</Text>
        </Flex>
        {/* Add/Edit Product Modal */}
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent maxW="1000px">
            <ModalHeader>{editIndex !== null ? 'Edit Product' : 'Add New Product'}</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
              <ModalBody pb={4}>
                {/* Product Info Section */}
                <Heading as="h6" size="xs" color="gray.700" mb={3} mt={1} fontWeight="bold" letterSpacing="wide">Product Info</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
                  <FormControl isRequired isInvalid={!!errors.vendor}>
                    <FormLabel>Vendor</FormLabel>
                    <Input name="vendor" value={form.vendor} onChange={handleFormChange} autoFocus borderColor={errors.vendor ? 'red.400' : undefined} w="100%" />
                    {errors.vendor && <Text color="red.500" fontSize="sm">{errors.vendor}</Text>}
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.name}>
                    <FormLabel>Product Name</FormLabel>
                    <Input name="name" value={form.name} onChange={handleFormChange} borderColor={errors.name ? 'red.400' : undefined} w="100%" />
                    {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.category}>
                    <FormLabel>Category</FormLabel>
                    <Select name="category" value={form.category} onChange={handleFormChange} borderColor={errors.category ? 'red.400' : undefined} w="100%">
                      <option value="">Select category</option>
                      <option value="Networking">Networking</option>
                      <option value="Storage">Storage</option>
                      <option value="Accessories">Accessories</option>
                    </Select>
                    {errors.category && <Text color="red.500" fontSize="sm">{errors.category}</Text>}
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.distributor}>
                    <FormLabel>Distributor</FormLabel>
                    <Select name="distributor" value={form.distributor} onChange={handleFormChange} borderColor={errors.distributor ? 'red.400' : undefined} w="100%">
                      <option value="">Select distributor</option>
                      <option value="Synnex">Synnex</option>
                      <option value="Dicker Data">Dicker Data</option>
                      <option value="BlueChip IT">BlueChip IT</option>
                    </Select>
                    {errors.distributor && <Text color="red.500" fontSize="sm">{errors.distributor}</Text>}
                  </FormControl>
                </SimpleGrid>
                <FormControl mb={3}>
                  <FormLabel>Description</FormLabel>
                  <Textarea name="description" value={form.description} onChange={handleFormChange} w="100%" />
                </FormControl>
                <Divider my={3} />
                {/* Identifiers Section */}
                <Heading as="h6" size="xs" color="gray.700" mb={3} fontWeight="bold" letterSpacing="wide">Identifiers</Heading>
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={2}>
                  <FormControl mb={3}>
                    <FormLabel>Vendor SKU / Part Number</FormLabel>
                    <Input name="vendorSku" value={form.vendorSku} onChange={handleFormChange} w="100%" />
                  </FormControl>
                  <FormControl mb={3}>
                    <FormLabel>Distributor SKU / Part Number</FormLabel>
                    <Input name="distributorSku" value={form.distributorSku} onChange={handleFormChange} w="100%" />
                  </FormControl>
                </SimpleGrid>
                <Divider my={3} />
                {/* Pricing Section */}
                <Heading as="h6" size="xs" color="gray.700" mb={3} fontWeight="bold" letterSpacing="wide">Pricing</Heading>
                <SimpleGrid minChildWidth="200px" spacing={4} mb={2} alignItems="end">
                  <FormControl isRequired isInvalid={!!errors.cost} minW="200px" mb={0}>
                    <FormLabel>Buy Price</FormLabel>
                    <HStack>
                      <NumberInput min={0} precision={2} value={form.cost} onChange={(valueString) => handleFormChange({ target: { name: 'cost', value: valueString } })} step={0.01} w="100%" onWheel={e => (e.target as HTMLInputElement).blur()}>
                        <NumberInputField name="cost" borderColor={errors.cost ? 'red.400' : undefined} />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Select name="costGstType" value={form.costGstType} onChange={handleFormChange} w="110px">
                        <option value="ex GST">ex GST</option>
                        <option value="inc GST">inc GST</option>
                      </Select>
                    </HStack>
                    {errors.cost && <Text color="red.500" fontSize="sm">{errors.cost}</Text>}
                  </FormControl>
                  <FormControl minW="200px" mb={0} isInvalid={isNaN(Number(form.sell)) || Number(form.sell) < 0}>
                    <FormLabel>Sell Price</FormLabel>
                    <Input name="sell" value={form.sell} onChange={handleFormChange} type="number" min="0" step="0.01" w="100%" bg="#f0fdf4" fontWeight="bold" color="#14543a" />
                  </FormControl>
                  <FormControl isRequired isInvalid={!!errors.markup} minW="200px" mb={0}>
                    <FormLabel>Markup %</FormLabel>
                    <NumberInput min={0} precision={2} value={form.markup} onChange={(valueString) => handleFormChange({ target: { name: 'markup', value: valueString } })} step={0.01} w="100%" onWheel={e => (e.target as HTMLInputElement).blur()}>
                      <NumberInputField name="markup" borderColor={errors.markup ? 'red.400' : undefined} />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                    {errors.markup && <Text color="red.500" fontSize="sm">{errors.markup}</Text>}
                  </FormControl>
                  <FormControl minW="200px" mb={0}>
                    <FormLabel>
                      RRP
                    </FormLabel>
                    <Input name="rrp" value={form.rrp} onChange={handleFormChange} type="number" min="0" step="0.01" onWheel={e => (e.target as HTMLInputElement).blur()} w="100%" />
                  </FormControl>
                </SimpleGrid>
                <Divider my={3} />
                {/* Calculated Section */}
                <Box bg="#f0fdf4" borderRadius="md" p={3} mb={2} display="flex" flexDir={{ base: 'column', sm: 'row' }} alignItems={{ sm: 'center' }} justifyContent="space-between" gap={4}>
                  <Text fontWeight="bold">Buy Price: <span style={{ color: '#003f2d' }}>${parseFloat(form.cost || '0').toFixed(2)}</span></Text>
                  <Text fontWeight="bold">Sell Price: <span style={{ color: '#14543a' }}>${parseFloat(form.sell || '0').toFixed(2)}</span></Text>
                  <Text fontWeight="bold">Markup: <span style={{ color: '#14543a' }}>
                    {isNaN(Number(form.markup)) ? '0.00' : (Math.round(Number(form.markup) * 100) / 100).toFixed(2)}%
                  </span></Text>
                  <Text fontWeight="bold" color="green.600">Profit: ${profit.toFixed(2)}</Text>
                </Box>
                {/* Margin Rating Visualization */}
                <Box display="flex" flexDir="column" alignItems="center" mb={2}>
                  <Heading as="h6" size="xs" color="gray.700" mb={1} fontWeight="bold" letterSpacing="wide">Product Profit Rating</Heading>
                  <Box display="flex" gap={1} mb={1}>
                    {[...Array(10)].map((_, i) => (
                      <Box key={i} w={5} h={5} borderRadius="full" bg={
                        i < marginRating
                          ? marginRating >= 8
                            ? 'green.400'
                            : marginRating >= 5
                              ? 'yellow.400'
                              : 'red.400'
                          : 'gray.200'
                      } border={i < marginRating ? '2px solid #14543a' : '1px solid #e2e8f0'} />
                    ))}
                  </Box>
                  <Text fontSize="sm" color={
                    marginRating >= 8 ? 'green.600' : marginRating >= 5 ? 'yellow.700' : 'red.600'
                  } fontWeight="bold">
                    {rrpNum > costNum && sellNum > costNum ? `${marginRating}/10 (${marginLabel})` : 'No RRP or invalid values'}
                  </Text>
                  {/* Recommended Markup if score < 7 */}
                  {rrpNum > costNum && sellNum > costNum && marginRating < 7 && (
                    (() => {
                      // To get 7/10, need marginPercent = 70
                      // marginPercent = ((sell - cost) / (rrp - cost)) * 100
                      // solve for sell: sell = cost + ((rrp - cost) * 0.7)
                      const targetMarginPercent = 70;
                      const targetSell = costNum + ((rrpNum - costNum) * (targetMarginPercent / 100));
                      const recommendedMarkup = costNum > 0 ? ((targetSell / costNum) - 1) * 100 : 0;
                      if (recommendedMarkup > 0 && isFinite(recommendedMarkup)) {
                        return (
                          <Text fontSize="sm" color="blue.600" fontWeight="semibold" mt={1}>
                            Recommended Markup: {recommendedMarkup.toFixed(2)}%
                          </Text>
                        );
                      }
                      return null;
                    })()
                  )}
                </Box>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="green" mr={3} type="submit">
                  {editIndex !== null ? 'Save Changes' : 'Add Product'}
                </Button>
                <Button onClick={onClose} variant="ghost">Cancel</Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
        <AlertDialog
          isOpen={isDeleteOpen}
          leastDestructiveRef={cancelRef}
          onClose={cancelDelete}
          isCentered
        >
          <AlertDialogOverlay />
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Product
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to delete this product? <br />
              <b>This action cannot be undone.</b>
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={cancelDelete}>
                No
              </Button>
              <Button colorScheme="red" onClick={confirmDelete} ml={3} isLoading={deleting} isDisabled={deleting}>
                Yes, Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Box>
    </>
  );
} 