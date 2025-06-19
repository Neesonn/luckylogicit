'use client';
import { useEffect, useState } from 'react';
import { Box, Heading, Text, Spinner, Alert, AlertIcon, Table, Thead, Tbody, Tr, Th, Td, Button, Input, Select, IconButton, VStack, HStack, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, ModalCloseButton, FormControl, FormLabel } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { EditIcon, CheckIcon, CloseIcon } from '@chakra-ui/icons';

export default function ViewCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const [editId, setEditId] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const countries = [
    { code: '', name: 'Choose a country...' },
    { code: 'AU', name: 'Australia' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    // ...add more as needed
  ];

  useEffect(() => {
    fetch('/api/list-stripe-customers')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setCustomers(data.customers);
        } else {
          setError(data.error || 'Failed to fetch customers.');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Something went wrong.');
        setLoading(false);
      });
  }, []);

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  const startEdit = (customer: any) => {
    setEditId(customer.id);
    setEditData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: {
        line1: customer.address?.line1 || '',
        city: customer.address?.city || '',
        state: customer.address?.state || '',
        postal_code: customer.address?.postal_code || '',
        country: customer.address?.country || '',
      },
    });
    setIsEditModalOpen(true);
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditData({});
    setIsEditModalOpen(false);
  };

  const handleEditChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleEditAddressChange = (field: string, value: string) => {
    setEditData((prev: any) => ({ ...prev, address: { ...prev.address, [field]: value } }));
  };

  const saveEdit = async (id: string) => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/update-stripe-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...editData }),
      });
      const data = await res.json();
      if (data.success) {
        setCustomers((prev) => prev.map((c) => (c.id === id ? data.customer : c)));
        setEditId(null);
        setEditData({});
        setIsEditModalOpen(false);
      } else {
        setError(data.error || 'Failed to update customer.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box minH="100vh" bg="gray.50" px={4} py={10} display="flex" flexDirection="column" alignItems="center">
      <Heading as="h1" size="xl" mb={8} color="brand.green">
        Stripe Customers
      </Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error" mb={6}><AlertIcon />{error}</Alert>
      ) : (
        <Box w="100%" maxW="1200px" px={6} overflowX="auto" mb={8}>
          <Table variant="simple" size="md">
            <Thead>
              <Tr>
                <Th>Customer ID</Th>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Address</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((c) => (
                <Tr key={c.id}>
                  <Td>{c.id}</Td>
                  <Td>
                    {editId === c.id ? (
                      <Input size="sm" value={editData.name} onChange={e => handleEditChange('name', e.target.value)} />
                    ) : c.name || <Text color="gray.400">(No name)</Text>}
                  </Td>
                  <Td>
                    {editId === c.id ? (
                      <Input size="sm" value={editData.email} onChange={e => handleEditChange('email', e.target.value)} />
                    ) : c.email || <Text color="gray.400">(No email)</Text>}
                  </Td>
                  <Td>
                    {editId === c.id ? (
                      <Input size="sm" value={editData.phone || ''} onChange={e => handleEditChange('phone', e.target.value)} />
                    ) : c.phone || <Text color="gray.400">(No phone)</Text>}
                  </Td>
                  <Td>
                    {editId === c.id ? (
                      <VStack align="start" spacing={1}>
                        <Input size="sm" placeholder="Line 1" value={editData.address?.line1} onChange={e => handleEditAddressChange('line1', e.target.value)} />
                        <Input size="sm" placeholder="City" value={editData.address?.city} onChange={e => handleEditAddressChange('city', e.target.value)} />
                        <Input size="sm" placeholder="State" value={editData.address?.state} onChange={e => handleEditAddressChange('state', e.target.value)} />
                        <Input size="sm" placeholder="Postal Code" value={editData.address?.postal_code} onChange={e => handleEditAddressChange('postal_code', e.target.value)} />
                        <Select size="sm" value={editData.address?.country} onChange={e => handleEditAddressChange('country', e.target.value)}>
                          {countries.map(cn => (
                            <option key={cn.code} value={cn.code}>{cn.name}</option>
                          ))}
                        </Select>
                      </VStack>
                    ) : c.address ? (
                      <span>
                        {[c.address.line1, c.address.city, c.address.state, c.address.country, c.address.postal_code]
                          .filter(Boolean)
                          .join(', ') || <Text color="gray.400">(No address)</Text>}
                      </span>
                    ) : <Text color="gray.400">(No address)</Text>}
                  </Td>
                  <Td>
                    <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" onClick={() => startEdit(c)} />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      )}
      <Button onClick={handleLogout} colorScheme="red" variant="outline">
        Logout
      </Button>
      <Modal isOpen={isEditModalOpen} onClose={cancelEdit} isCentered>
        <ModalOverlay bg="blackAlpha.300" backdropFilter="blur(8px)" />
        <ModalContent>
          <ModalHeader>Edit Customer</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="start" spacing={3}>
              <FormControl>
                <FormLabel>Name</FormLabel>
                <Input value={editData.name} onChange={e => handleEditChange('name', e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input value={editData.email} onChange={e => handleEditChange('email', e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Phone Number</FormLabel>
                <Input value={editData.phone} onChange={e => handleEditChange('phone', e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Address Line 1</FormLabel>
                <Input value={editData.address?.line1} onChange={e => handleEditAddressChange('line1', e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>City</FormLabel>
                <Input value={editData.address?.city} onChange={e => handleEditAddressChange('city', e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>State</FormLabel>
                <Input value={editData.address?.state} onChange={e => handleEditAddressChange('state', e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Postal Code</FormLabel>
                <Input value={editData.address?.postal_code} onChange={e => handleEditAddressChange('postal_code', e.target.value)} />
              </FormControl>
              <FormControl>
                <FormLabel>Country</FormLabel>
                <Select value={editData.address?.country} onChange={e => handleEditAddressChange('country', e.target.value)}>
                  {countries.map(cn => (
                    <option key={cn.code} value={cn.code}>{cn.name}</option>
                  ))}
                </Select>
              </FormControl>
            </VStack>
            {error && <Alert status="error" mt={4}><AlertIcon />{error}</Alert>}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="green" mr={3} isLoading={saving} onClick={() => saveEdit(editId!)}>
              Save
            </Button>
            <Button variant="ghost" onClick={cancelEdit}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
} 