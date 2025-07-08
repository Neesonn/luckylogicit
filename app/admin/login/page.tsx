"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Input, FormControl, FormLabel, FormErrorMessage, Heading, VStack, InputGroup, InputRightElement, Icon, Alert, AlertIcon } from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
        setPassword("");
        setUsername("");
        router.push("/admin");
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
    <Box minH="100vh" display="flex" alignItems="center" justifyContent="center" bg="gray.50">
      <Box bg="white" p={8} borderRadius="xl" boxShadow="lg" minW={{ base: "90vw", sm: "400px" }}>
        <VStack as="form" spacing={6} align="stretch" onSubmit={handleSubmit}>
          <Heading size="lg" color="#003f2d" textAlign="center">Admin Login</Heading>
          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}
          <FormControl isInvalid={!!error}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              autoFocus
              placeholder="Enter admin username"
              disabled={loading}
            />
          </FormControl>
          <FormControl isInvalid={!!error}>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter admin password"
                disabled={loading}
              />
              <InputRightElement width="3rem">
                <Button
                  h="1.75rem"
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
          <Button
            type="submit"
            colorScheme="green"
            isLoading={loading}
            loadingText="Logging in..."
            size="lg"
            fontWeight="bold"
          >
            Login
          </Button>
        </VStack>
      </Box>
    </Box>
  );
} 