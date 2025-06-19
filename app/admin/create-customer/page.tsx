'use client';
import { Box, Heading, Text, Button, FormControl, FormLabel, Input, VStack, Alert, AlertIcon, Spinner, Select, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowBackIcon } from '@chakra-ui/icons';

export default function CreateCustomerPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
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

  const australianStates = [
    'Australian Capital Territory',
    'New South Wales',
    'Northern Territory',
    'Queensland',
    'South Australia',
    'Tasmania',
    'Victoria',
    'Western Australia',
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
            line2,
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
        setLine2('');
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
      <Heading as="h1" size="2xl" mb={8} color="brand.green">
        Create New Customer
      </Heading>
      <VStack as="form" spacing={6} w="100%" maxW="420px" bg="white" p={8} borderRadius="lg" boxShadow="lg" align="stretch" onSubmit={handleSubmit} mb={6}>
        <FormControl isRequired>
          <FormLabel>Name</FormLabel>
          <Input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Account Email</FormLabel>
          <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="email@example.com" />
        </FormControl>
        <FormControl>
          <FormLabel>Mobile number</FormLabel>
          <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Mobile number" />
        </FormControl>
        <FormControl>
          <FormLabel>Address Line 1</FormLabel>
          <Input value={line1} onChange={e => setLine1(e.target.value)} placeholder="123 Main St" />
        </FormControl>
        <FormControl>
          <FormLabel>Address Line 2</FormLabel>
          <Input value={line2} onChange={e => setLine2(e.target.value)} placeholder="Apartment, suite, etc. (optional)" />
        </FormControl>
        <FormControl>
          <FormLabel>Suburb / City</FormLabel>
          <Input value={city} onChange={e => setCity(e.target.value)} placeholder="Suburb / City" />
        </FormControl>
        <FormControl>
          <FormLabel>State</FormLabel>
          <Select value={state} onChange={e => setState(e.target.value)} placeholder="Select a state">
            {australianStates.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Postal Code</FormLabel>
          <Input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Postal Code" />
        </FormControl>
        <FormControl>
          <FormLabel>Country</FormLabel>
          <Select value={country} onChange={e => setCountry(e.target.value)} required placeholder="Select a country">
            {countries.map(c => (
              <option key={c.code} value={c.code}>{c.name}</option>
            ))}
          </Select>
        </FormControl>
        <Button type="submit" colorScheme="green" isLoading={loading} w="full" size="lg">
          {loading ? <Spinner size="sm" /> : 'Create Customer'}
        </Button>
        {success && <Alert status="success"><AlertIcon />{success}</Alert>}
        {error && <Alert status="error"><AlertIcon />{error}</Alert>}
      </VStack>
      <Button onClick={handleLogout} colorScheme="red" variant="outline" mt={6}>
        Logout
      </Button>
      <Button as={Link} href="/admin" leftIcon={<ArrowBackIcon />} colorScheme="red" variant="outline" mt={4}>
        Back
      </Button>
    </Box>
  );
} 