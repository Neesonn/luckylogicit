"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Heading,
  VStack,
  InputGroup,
  InputRightElement,
  Alert,
  AlertIcon,
  Flex,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import { FiCheck, FiLoader } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

// Keyframes for loading animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!username.trim() || !password.trim()) {
      setError("Username and password are required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          setPassword("");
          setUsername("");
          router.push("/admin");
        }, 1500);
      } else {
        setError("Incorrect username or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100vh" bg="white" position="relative" overflow="hidden">
      {/* Olive green floating shape for depth */}
      <Box
        position="absolute"
        top="-120px"
        right="-120px"
        w="340px"
        h="340px"
        bgGradient="radial(ellipse at center, brand.green 60%, transparent 100%)"
        opacity={0.10}
        zIndex={0}
        filter="blur(8px)"
      />
      <Box
        position="absolute"
        bottom="-100px"
        left="-100px"
        w="260px"
        h="260px"
        bgGradient="radial(ellipse at center, brand.gold 60%, transparent 100%)"
        opacity={0.08}
        zIndex={0}
        filter="blur(12px)"
      />

      {/* Main content */}
      <Flex minH="100vh" alignItems="center" justifyContent="center" px={4} direction="column">
        {/* Logo above the container */}
        <Box mb={isMobile ? 6 : 8}>
          <Box
            as="img"
            src="/lucky-logic-logo.png"
            alt="Lucky Logic logo"
            height={isMobile ? "240px" : "320px"}
            width="auto"
            objectFit="contain"
            display="block"
            mx="auto"
            style={{ filter: 'drop-shadow(0 2px 8px rgba(0,63,45,0.10))' }}
          />
        </Box>
        {/* Login container */}
        <MotionBox
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          bg="white"
          borderRadius="2xl"
          boxShadow="0 8px 32px rgba(0,63,45,0.10), 0 1.5px 0 #003f2d"
          border="2px solid"
          borderColor="brand.green"
          p={{ base: 6, sm: 10 }}
          minW={{ base: "95vw", sm: "400px" }}
          maxW="420px"
          position="relative"
          zIndex={1}
          mt={{ base: -16, md: -28 }}
        >
          <VStack as="form" spacing={7} align="stretch" onSubmit={handleSubmit}>
            <Heading
              size="lg"
              color="brand.green"
              textAlign="center"
              fontWeight="extrabold"
              letterSpacing="tight"
              mb={2}
              fontFamily="heading"
            >
              Admin Login
            </Heading>
            <Text color="gray.600" textAlign="center" fontSize="md" mb={2}>
              Secure access to admin console
            </Text>
            {error && (
              <Alert status="error" borderRadius="lg" bg="red.500" color="white" border="1px solid rgba(255,255,255,0.2)">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl isInvalid={!!error}>
              <FormLabel color="brand.green" fontWeight="semibold">Username</FormLabel>
              <Input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                autoFocus
                placeholder="Enter admin username"
                disabled={loading || success}
                bg="white"
                border="1.5px solid"
                borderColor="brand.green"
                color="brand.green"
                _placeholder={{ color: "#b2b2b2" }}
                _focus={{
                  borderColor: "brand.gold",
                  boxShadow: "0 0 0 2px #c9a22755",
                  bg: "#f8f8f8"
                }}
                _hover={{
                  borderColor: "brand.gold",
                  bg: "#f8f8f8"
                }}
                fontWeight="medium"
                fontSize="md"
                transition="all 0.2s"
              />
            </FormControl>
            <FormControl isInvalid={!!error}>
              <FormLabel color="brand.green" fontWeight="semibold">Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={loading || success}
                  bg="white"
                  border="1.5px solid"
                  borderColor="brand.green"
                  color="brand.green"
                  _placeholder={{ color: "#b2b2b2" }}
                  _focus={{
                    borderColor: "brand.gold",
                    boxShadow: "0 0 0 2px #c9a22755",
                    bg: "#f8f8f8"
                  }}
                  _hover={{
                    borderColor: "brand.gold",
                    bg: "#f8f8f8"
                  }}
                  fontWeight="medium"
                  fontSize="md"
                  transition="all 0.2s"
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    color="brand.green"
                    _hover={{ color: "brand.gold" }}
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            <MotionButton
              type="submit"
              bg="brand.green"
              color="white"
              isLoading={loading}
              loadingText=""
              size="lg"
              fontWeight="bold"
              borderRadius="xl"
              h="50px"
              position="relative"
              overflow="hidden"
              _hover={{
                bg: "brand.gold",
                color: "brand.green",
                boxShadow: "0 0 0 2px #c9a22755, 0 8px 25px #003f2d22"
              }}
              _active={{
                bg: "brand.green",
                color: "white"
              }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              disabled={success}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? (
                <Flex align="center" gap={2}>
                  <Box
                    as={FiLoader}
                    size="18px"
                    sx={{ animation: `${spin} 1s linear infinite` }}
                  />
                  <Text>Authenticating...</Text>
                </Flex>
              ) : success ? (
                <Flex align="center" gap={2}>
                  <Box
                    as={FiCheck}
                    size="18px"
                    sx={{ animation: `${pulse} 1s ease-in-out infinite` }}
                  />
                  <Text>Success!</Text>
                </Flex>
              ) : (
                "Login"
              )}
            </MotionButton>
          </VStack>
        </MotionBox>
      </Flex>
    </Box>
  );
} 