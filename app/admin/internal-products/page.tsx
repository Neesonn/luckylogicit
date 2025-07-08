'use client';

import AdminSessionTimeout from '../../../components/AdminSessionTimeout';

export const dynamic = 'force-dynamic';
import { Box, Heading, Text, Button, HStack, Input, Select, Table, Thead, Tbody, Tr, Th, Td, IconButton, Flex, Spacer, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel, Textarea, useDisclosure, NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper, Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverArrow, PopoverBody, Divider, useToast, SimpleGrid, useBreakpointValue, VStack } from '@chakra-ui/react';
import { AddIcon, SearchIcon, EditIcon, InfoOutlineIcon, DeleteIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { useState, useEffect, useRef } from 'react';
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';
import { useStripeData } from '../../../components/StripeDataContext';
import GlassCard from '../../../components/GlassCard';

type StripeProduct = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  created: number;
  updated: number;
  metadata: any;
  images: string[];
  price_amount: number;
  price_currency: string;
  price_formatted: string;
  category: string;
  vendor: string;
  sku: string;
  distributor: string;
  distributor_sku: string;
  rrp: number;
  cost: number;
  markup: number;
  sell: number;
};

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

export default function InternalProductsPage() {
  const { products, loading, error, refresh } = useStripeData();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [vendor, setVendor] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modal state
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [form, setForm] = useState<{
    id?: string;
    name: string;
    description: string;
    tax_code: string;
    amount: string;
    include_tax: boolean;
    active: boolean;
    set_as_default_price: boolean;
  }>({
    id: undefined,
    name: '',
    description: '',
    tax_code: 'txcd_1234567890',
    amount: '',
    include_tax: true,
    active: true,
    set_as_default_price: true,
  });
  const [profit, setProfit] = useState(0);
  const [lastChanged, setLastChanged] = useState<'markup' | 'sell'>('markup');
  const [editProduct, setEditProduct] = useState<StripeProduct | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toast = useToast();

  // Live calculation for amount
  const handleAmountChange = (amountVal: string) => {
    const amount = parseFloat(amountVal) || 0;
    setForm(f => ({ ...f, amount: amountVal }));
  };

  const handleFormChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    setForm(f => ({ ...f, [name]: val }));
    if (name === 'amount') {
      handleAmountChange(value);
    }
  };

  const handleAddProduct = () => {
    setForm({
      id: undefined,
      name: '',
      description: '',
      tax_code: 'txcd_1234567890',
      amount: '',
      include_tax: true,
      active: true,
      set_as_default_price: true,
    });
    setEditProduct(null);
    setErrors({});
    onOpen();
  };

  const handleEditProduct = (product: StripeProduct) => {
    setForm({
      id: product.id,
      name: product.name,
      description: product.description || '',
      tax_code: product.metadata?.tax_code || 'txcd_1234567890',
      amount: product.price_amount ? (product.price_amount / 100).toString() : '',
      include_tax: product.metadata?.include_tax !== 'false',
      active: product.active,
      set_as_default_price: true,
    });
    setEditProduct(product);
    setErrors({});
    onOpen();
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!form.name.trim()) newErrors.name = 'Product name is required';
    if (!form.amount || parseFloat(form.amount) <= 0) newErrors.amount = 'Amount must be greater than 0';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validate()) return;

    const metadata = {
      tax_code: form.tax_code,
      include_tax: form.include_tax.toString(),
    };

    try {
      if (editProduct) {
        // Update existing product
        const response = await fetch('/api/list-stripe-products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            productId: form.id,
            metadata,
            active: form.active,
            set_as_default_price: form.set_as_default_price,
          }),
        });
        
        if (response.ok) {
          toast({
            title: 'Product updated',
            description: 'Product has been updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          refresh();
          onClose();
        } else {
          throw new Error('Failed to update product');
        }
      } else {
        // Create new product
        const response = await fetch('/api/create-stripe-product', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: form.name,
            description: form.description,
            amount: form.amount,
            include_tax: form.include_tax,
            active: form.active,
            set_as_default_price: form.set_as_default_price,
          }),
        });
        
        if (response.ok) {
          toast({
            title: 'Product created',
            description: 'Product has been created successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          refresh();
          onClose();
        } else {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create product');
        }
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  // Filter products based on search, category, vendor, and active status
  const filteredProducts = (products ?? []).filter((p: StripeProduct) => {
    // Category filter
    if (category && p.category !== category) return false;
    // Vendor filter
    if (vendor && p.vendor !== vendor) return false;
    // Active filter
    if (activeFilter === 'active' && !p.active) return false;
    if (activeFilter === 'inactive' && p.active) return false;
    // Search filter
    if (!search.trim()) return true;
    const term = search.trim().toLowerCase();
    return [
      p.vendor,
      p.name,
      p.distributor,
      p.rrp?.toString(),
      p.sku,
      p.distributor_sku,
      p.cost?.toString(),
      p.markup?.toString(),
      p.sell?.toString(),
      p.description,
      p.category,
    ].some(f => (f || '').toLowerCase().includes(term));
  });

  // Get unique categories and vendors for filters
  const categories = (products ?? []).map(p => p.category).filter(Boolean).filter((value, index, self) => self.indexOf(value) === index);
  const vendors = (products ?? []).map(p => p.vendor).filter(Boolean).filter((value, index, self) => self.indexOf(value) === index);

  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <>
      <AdminSessionTimeout />
      <Box minH="100vh" bg="gray.50" px={4} py={10}>
        {/* Header */}
        <Box maxW="1200px" mx="auto" mb={6}>
          <Heading as="h1" size="xl" color="#003f2d" fontWeight="bold" mb={1}>
            Internal Products
          </Heading>
          <Text fontSize="md" color="gray.700" fontWeight="semibold" mt={2}>
            Products in Catalogue: {products?.length || 0}
          </Text>
          <Text fontSize="lg" color="gray.600">
            Manage your internal product catalog from Stripe.
          </Text>
        </Box>
        {/* Toolbar */}
        <Flex maxW="1200px" mx="auto" mb={4} align="center" gap={2} flexWrap="wrap">
          <Button leftIcon={<AddIcon />} colorScheme="green" onClick={handleAddProduct}>
            Add New Product
          </Button>
          <Select placeholder="Filter by Category" w="200px" value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
          <Select placeholder="Filter by Vendor" w="200px" value={vendor} onChange={e => setVendor(e.target.value)}>
            {vendors.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
          <Select placeholder="Filter by Status" w="150px" value={activeFilter} onChange={e => setActiveFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
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
        {/* Loading and Error States */}
        {loading && (
          <Box textAlign="center" py={8}>
            <Text>Loading products...</Text>
          </Box>
        )}
        {error && (
          <Box textAlign="center" py={8}>
            <Text color="red.500">Error: {error}</Text>
          </Box>
        )}
        {/* Products Table/Cards */}
        {!loading && !error && (
          isMobile ? (
            <VStack w="100%" spacing={4} maxW="500px" mx="auto" mb={8}>
              {filteredProducts.map((p: StripeProduct, idx: number) => (
                               <GlassCard key={p.id} w="100%" p={4} borderRadius="lg" boxShadow="md">
                 <Text fontWeight="bold" fontSize="lg">{p.name}</Text>
                 <Text fontSize="sm" color="gray.600" mb={2}>{p.description || 'No description'}</Text>
                                   <Text fontWeight="semibold">Price: {p.price_formatted || 'A$0.00'}</Text>
                 <Text>Status: {p.active ? 'Active' : 'Inactive'}</Text>
                 <HStack spacing={2} mt={2}>
                   <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" colorScheme="green" onClick={() => handleEditProduct(p)} />
                   <Tooltip label="View in Stripe" hasArrow>
                     <IconButton
                       as="a"
                       href={`https://dashboard.stripe.com/products/${p.id}`}
                       target="_blank"
                       rel="noopener noreferrer"
                       aria-label="View in Stripe"
                       icon={<ExternalLinkIcon />}
                       size="sm"
                       colorScheme="blue"
                       variant="outline"
                     />
                   </Tooltip>
                 </HStack>
               </GlassCard>
              ))}
            </VStack>
          ) : (
            <Box maxW="1200px" mx="auto" bg="white" boxShadow="md" borderRadius="2xl" p={0}>
              <Table variant="simple" size="sm" sx={{ 'th, td': { whiteSpace: 'nowrap', fontSize: '14px', px: 2, py: 1, verticalAlign: 'middle' } }} layout="auto">
                <Thead bg="gray.100">
                                   <Tr>
                     <Th fontSize="15px">Product Name</Th>
                     <Th fontSize="15px">Description</Th>
                     <Th isNumeric fontSize="15px">Price</Th>
                     <Th fontSize="15px">Status</Th>
                     <Th fontSize="15px">Actions</Th>
                   </Tr>
                </Thead>
                <Tbody>
                                   {filteredProducts.map((p: StripeProduct, idx: number) => (
                     <Tr key={p.id}>
                       <Td>
                         {p.name}
                         <Popover placement="right" trigger="click">
                           <PopoverTrigger>
                             <InfoOutlineIcon ml={1} color="gray.400" cursor="pointer" aria-label="Show Description" />
                           </PopoverTrigger>
                           <PopoverContent w="auto" fontSize="sm">
                             <PopoverArrow />
                             <PopoverBody>
                               <b>Description:</b> {p.description || 'No description available'}
                             </PopoverBody>
                           </PopoverContent>
                         </Popover>
                       </Td>
                       <Td maxW="200px" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">
                         {p.description || 'No description'}
                       </Td>
                       <Td isNumeric>{p.price_formatted || 'A$0.00'}</Td>
                       <Td>
                         <Box display="inline-block" px={2} py={1} borderRadius="md" fontWeight="bold" fontSize="xs" 
                           bg={p.active ? 'green.50' : 'gray.50'}
                           color={p.active ? 'green.700' : 'gray.700'}
                           border="1px solid"
                           borderColor={p.active ? 'green.400' : 'gray.400'}>
                           {p.active ? 'Active' : 'Inactive'}
                         </Box>
                       </Td>
                       <Td>
                         <HStack spacing={2}>
                           <IconButton
                             aria-label="Edit"
                             icon={<EditIcon />}
                             size="sm"
                             colorScheme="green"
                             onClick={() => handleEditProduct(p)}
                           />
                           <Tooltip label="View in Stripe" hasArrow>
                             <IconButton
                               as="a"
                               href={`https://dashboard.stripe.com/products/${p.id}`}
                               target="_blank"
                               rel="noopener noreferrer"
                               aria-label="View in Stripe"
                               icon={<ExternalLinkIcon />}
                               size="sm"
                               colorScheme="blue"
                               variant="outline"
                             />
                           </Tooltip>
                         </HStack>
                       </Td>
                     </Tr>
                   ))}
                </Tbody>
              </Table>
            </Box>
          )
        )}
        {/* Add/Edit Product Modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>{editProduct ? 'Edit Product' : 'Add New Product'}</ModalHeader>
            <ModalCloseButton />
            <form onSubmit={handleSubmit}>
                                   <ModalBody>
                 <VStack spacing={4}>
                   <FormControl isRequired isInvalid={!!errors.name}>
                     <FormLabel>Name (required)</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>Name of the product or service, visible to customers.</Text>
                     <Input name="name" value={form.name} onChange={handleFormChange} />
                     {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
                   </FormControl>
                   
                   <FormControl>
                     <FormLabel>Description</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>Appears at checkout, on the customer portal, and in quotes.</Text>
                     <Textarea name="description" value={form.description} onChange={handleFormChange} rows={3} />
                   </FormControl>
                   
                   <FormControl>
                     <FormLabel>Product tax code</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>SET TO Use preset: General - Services</Text>
                     <Input value="General - Services" isReadOnly bg="gray.50" />
                   </FormControl>
                   
                   <FormControl>
                     <FormLabel>Product type</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>It's a One-off product</Text>
                     <Input value="One-off product" isReadOnly bg="gray.50" />
                   </FormControl>
                   
                   <FormControl isRequired isInvalid={!!errors.amount}>
                     <FormLabel>Amount (required)</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>A$</Text>
                     <NumberInput name="amount" value={form.amount} onChange={(value) => {
                       setForm(f => ({ ...f, amount: value }));
                       handleAmountChange(value);
                     }}>
                       <NumberInputField />
                       <NumberInputStepper>
                         <NumberIncrementStepper />
                         <NumberDecrementStepper />
                       </NumberInputStepper>
                     </NumberInput>
                     {errors.amount && <Text color="red.500" fontSize="sm">{errors.amount}</Text>}
                   </FormControl>
                   
                   <FormControl>
                     <FormLabel>Include tax in price</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>Yes</Text>
                     <input type="checkbox" name="include_tax" checked={form.include_tax} onChange={handleFormChange} />
                   </FormControl>
                   
                   <FormControl>
                     <FormLabel>Status</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>
                       {form.active ? 'Active - Product is visible and available for purchase' : 'Inactive - Product is archived and not available'}
                     </Text>
                     <input type="checkbox" name="active" checked={form.active} onChange={handleFormChange} />
                     <Text fontSize="sm" color="gray.500" mt={1}>
                       {form.active ? '✓ Active' : '✗ Inactive (Archived in Stripe)'}
                     </Text>
                   </FormControl>
                   
                   <FormControl>
                     <FormLabel>Set as default price</FormLabel>
                     <Text fontSize="sm" color="gray.600" mb={2}>
                       If checked, this price will be set as the default price for this product in Stripe.
                     </Text>
                     <input type="checkbox" name="set_as_default_price" checked={form.set_as_default_price} onChange={handleFormChange} />
                   </FormControl>
                 </VStack>
               </ModalBody>
              <ModalFooter>
                <Button variant="ghost" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme="green" type="submit">
                  {editProduct ? 'Update Product' : 'Add Product'}
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        </Modal>
      </Box>
    </>
  );
} 