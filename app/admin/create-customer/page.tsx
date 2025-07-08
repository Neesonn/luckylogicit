'use client';
import { Box, Heading, Text, Button, FormControl, FormLabel, Input, VStack, Alert, AlertIcon, Spinner, Select, HStack, SimpleGrid, Icon, Checkbox, CheckboxGroup } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowBackIcon, AddIcon, RepeatIcon } from '@chakra-ui/icons';
import InputMask from 'react-input-mask';
import { useStripeData } from '../../../components/StripeDataContext';
import StickyNavBar from '../../../components/StickyNavBar';

export default function CreateCustomerPage() {
  const router = useRouter();
  const { refresh } = useStripeData();
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
  const [country, setCountry] = useState('AU');
  const [phone, setPhone] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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

  const generateDummyData = () => {
    const dummyData = {
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '0412345678',
      line1: '123 Main Street',
      line2: 'Unit 4B',
      city: 'Sydney',
      state: 'New South Wales',
      postalCode: '2000',
      country: 'AU'
    };

    setName(dummyData.name);
    setEmail(dummyData.email);
    setPhone(dummyData.phone);
    setLine1(dummyData.line1);
    setLine2(dummyData.line2);
    setCity(dummyData.city);
    setState(dummyData.state);
    setPostalCode(dummyData.postalCode);
    setCountry(dummyData.country);
    setAgreedToTerms(true);
    
    // Clear any existing messages
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('You must agree to the Terms and Conditions and Privacy Policy to proceed.');
      return;
    }
    
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
        
        // Clear form
        setName('');
        setEmail('');
        setLine1('');
        setLine2('');
        setCity('');
        setState('');
        setPostalCode('');
        setCountry('');
        setPhone('');
        setAgreedToTerms(false);
        
        // Refresh the customer data in the context
        // This will update the view-customers page automatically
        await refresh();
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
    <Box minH="100vh" display="flex" flexDirection="column" alignItems="center" justifyContent="center" bg="gray.50" px={{ base: 3, md: 4 }} py={{ base: 4, md: 0 }}>
      <Box textAlign="center" mb={{ base: 6, md: 8 }} px={{ base: 2, md: 0 }}>
        <Heading as="h1" size={{ base: "xl", md: "2xl" }} mb={3} color="brand.green" fontWeight="bold">
          Create New Customer
        </Heading>
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600" maxW="500px">
          Enter customer details to create a new account in our system
        </Text>
      </Box>
      
      <VStack as="form" spacing={{ base: 6, md: 8 }} w="100%" maxW="700px" bg="white" p={{ base: 6, md: 8 }} borderRadius="xl" boxShadow="xl" align="stretch" onSubmit={handleSubmit} mb={6}>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="100%">
          <FormControl isRequired>
            <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Name</FormLabel>
            <Input 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="Full Name" 
              size={{ base: "md", md: "lg" }}
              borderWidth="2px"
              borderColor="gray.200"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
              _hover={{ borderColor: 'gray.300' }}
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Account Email</FormLabel>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              placeholder="email@example.com" 
              size={{ base: "md", md: "lg" }}
              borderWidth="2px"
              borderColor="gray.200"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
              _hover={{ borderColor: 'gray.300' }}
            />
          </FormControl>
          <FormControl>
            <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Mobile number</FormLabel>
            <Input 
              as={InputMask} 
              mask="(9999) 999 999" 
              maskChar=" " 
              value={phone} 
              onChange={e => setPhone(e.target.value)} 
              placeholder="(0412) 345 678" 
              size={{ base: "md", md: "lg" }}
              borderWidth="2px"
              borderColor="gray.200"
              _placeholder={{ color: 'gray.400' }}
              _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
              _hover={{ borderColor: 'gray.300' }}
            />
          </FormControl>
        </SimpleGrid>
        
        <Box borderWidth="2px" borderColor="gray.200" borderRadius="lg" p={{ base: 4, md: 6 }} bg="gray.50">
          <Heading as="h3" size={{ base: "sm", md: "md" }} mb={{ base: 3, md: 4 }} color="brand.green" fontWeight="semibold">Address Information</Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={{ base: 4, md: 6 }} w="100%">
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Address Line 1</FormLabel>
              <Input 
                value={line1} 
                onChange={e => setLine1(e.target.value)} 
                placeholder="123 Main St" 
                size={{ base: "md", md: "lg" }}
                borderWidth="2px"
                borderColor="gray.200"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                _hover={{ borderColor: 'gray.300' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Address Line 2</FormLabel>
              <Input 
                value={line2} 
                onChange={e => setLine2(e.target.value)} 
                placeholder="Apartment, suite, etc. (optional)" 
                size={{ base: "md", md: "lg" }}
                borderWidth="2px"
                borderColor="gray.200"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                _hover={{ borderColor: 'gray.300' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Suburb / City</FormLabel>
              <Input 
                value={city} 
                onChange={e => setCity(e.target.value)} 
                placeholder="Suburb / City" 
                size={{ base: "md", md: "lg" }}
                borderWidth="2px"
                borderColor="gray.200"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                _hover={{ borderColor: 'gray.300' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Postal Code</FormLabel>
              <Input 
                value={postalCode} 
                onChange={e => setPostalCode(e.target.value)} 
                placeholder="Postal Code" 
                size={{ base: "md", md: "lg" }}
                borderWidth="2px"
                borderColor="gray.200"
                _placeholder={{ color: 'gray.400' }}
                _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                _hover={{ borderColor: 'gray.300' }}
              />
            </FormControl>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>State</FormLabel>
              {/* TODO: Replace with Chakra Autocomplete if available */}
              <Select 
                value={state} 
                onChange={e => setState(e.target.value)} 
                placeholder="Select a state"
                size={{ base: "md", md: "lg" }}
                borderWidth="2px"
                borderColor="gray.200"
                _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                _hover={{ borderColor: 'gray.300' }}
              >
                {australianStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel fontSize={{ base: "sm", md: "md" }} fontWeight="semibold" color="gray.700" mb={2}>Country</FormLabel>
              {/* TODO: Replace with Chakra Autocomplete if available */}
              <Select 
                value={country} 
                onChange={e => setCountry(e.target.value)} 
                required 
                placeholder="Select a country"
                size={{ base: "md", md: "lg" }}
                borderWidth="2px"
                borderColor="gray.200"
                _focus={{ borderColor: 'brand.green', boxShadow: '0 0 0 1px var(--chakra-colors-brand-green)' }}
                _hover={{ borderColor: 'gray.300' }}
              >
                {countries.map(c => (
                  <option key={c.code} value={c.code}>{c.name}</option>
                ))}
              </Select>
            </FormControl>
          </SimpleGrid>
        </Box>
        
        {/* Legal Notice Block */}
        <Box 
          bg="gray.100" 
          borderWidth="1px" 
          borderColor="gray.300" 
          borderRadius="md" 
          p={{ base: 4, md: 5 }}
          mt={2}
        >
          <Text fontSize={{ base: "xs", md: "sm" }} color="gray.600" textAlign="center" mb={3}>
            By creating a customer account, you acknowledge that you have read and agree to the{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#003f2d', textDecoration: 'underline' }}>Terms and Conditions</a>
            {' '}and the{' '}
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#003f2d', textDecoration: 'underline' }}>Privacy Policy</a>.
            {' '}From time to time, Lucky Logic may contact you with offers, promotions, or other communications. If you prefer not to receive these messages, you may unsubscribe at any time by emailing us at <a href="mailto:support@luckylogic.com.au" style={{ color: '#003f2d', textDecoration: 'underline' }}>support@luckylogic.com.au</a>.
          </Text>
          
          <FormControl isRequired>
            <Checkbox 
              isChecked={agreedToTerms} 
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              colorScheme="green"
              size={{ base: "md", md: "lg" }}
            >
              <Text fontSize={{ base: "sm", md: "md" }} fontWeight="medium" color="gray.700">
                I agree to the Terms and Conditions and Privacy Policy
              </Text>
            </Checkbox>
          </FormControl>
        </Box>
        
        <Button 
          type="submit" 
          colorScheme="green" 
          isLoading={loading} 
          w="full" 
          size={{ base: "md", md: "lg" }}
          height={{ base: "50px", md: "60px" }}
          fontSize={{ base: "md", md: "lg" }}
          fontWeight="bold"
          leftIcon={<AddIcon />}
          _hover={{ 
            transform: 'translateY(-2px)', 
            boxShadow: '0 8px 25px rgba(0, 63, 45, 0.3)',
            bg: 'green.600'
          }}
          _active={{ 
            transform: 'translateY(0)', 
            boxShadow: '0 4px 15px rgba(0, 63, 45, 0.2)'
          }}
          transition="all 0.2s ease-in-out"
        >
          {loading ? <Spinner size="sm" /> : 'Create Customer'}
        </Button>
        
        {success && <Alert status="success" borderRadius="md"><AlertIcon />{success}</Alert>}
        {error && <Alert status="error" borderRadius="md"><AlertIcon />{error}</Alert>}
      </VStack>
      
      <StickyNavBar />
    </Box>
  );
} 