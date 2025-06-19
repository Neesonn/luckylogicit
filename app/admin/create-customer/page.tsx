'use client';
import { Box, Heading, Text, Button, FormControl, FormLabel, Input, VStack, Alert, AlertIcon, Spinner, Select } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [phone, setPhone] = useState('');

  const countries = [
    { code: '', name: 'Choose a country...' },
    { code: 'AU', name: 'Australia' },
    { code: 'US', name: 'United States' },
    { code: 'GB', name: 'United Kingdom' },
    // ...add more as needed
  ];

  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');
    try {
      const res = await fetch('/api/create-stripe-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          address: {
            line1,
            city,
            state,
            postal_code: postalCode,
            country,
          },
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess('Customer created successfully!');
        setName('');
        setEmail('');
        setLine1('');
        setCity('');
        setState('');
        setPostalCode('');
        setCountry('');
        setPhone('');
      } else {
        setError(data.error || 'Failed to create customer.');
      }
    } catch (err) {
      setError('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50" px={4}>
      <Heading as="h1" size="2xl" mb={4} color="brand.green">
        Create New Customer
      </Heading>
      <VStack as="form" spacing={4} w="100%" maxW="400px" onSubmit={handleSubmit} mb={6}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Account Email</FormLabel>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
        </FormControl>
        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" />
        </FormControl>
        <FormControl>
          <FormLabel>Address Line 1</FormLabel>
          <Input value={line1} onChange={e => setLine1(e.target.value)} placeholder="123 Main St" />
        </FormControl>
        <FormControl>
          <FormLabel>City</FormLabel>
          <Input value={city} onChange={e => setCity(e.target.value)} placeholder="City" />
        </FormControl>
        <FormControl>
          <FormLabel>State</FormLabel>
          <Input value={state} onChange={e => setState(e.target.value)} placeholder="State" />
        </FormControl>
        <FormControl>
          <FormLabel>Postal Code</FormLabel>
          <Input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Postal Code" />
        </FormControl>
        <FormControl>
          <FormLabel>Country</FormLabel>
          <Select value={country} onChange={e => setCountry(e.target.value)} required>
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="green" isLoading={loading} w="full">
          {loading ? <Spinner size="sm" /> : 'Create Customer'}
        </Button>
        {success && <Alert status="success"><AlertIcon />{success}</Alert>}
        {error && <Alert status="error"><AlertIcon />{error}</Alert>}
      </VStack>
      <Button onClick={handleLogout} colorScheme="red" variant="outline" mt={6}>
        Logout
      </Button>
    </Box>
  );
} 