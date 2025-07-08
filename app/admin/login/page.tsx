"use client";
import { useState, useEffect } from "react";
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
  Avatar,
  Icon,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { FiUser, FiEye, FiEyeOff } from "react-icons/fi";

const MotionBox = motion(Box);
const MotionButton = motion(Button);
const MotionIcon = motion(Icon);

// Keyframes for animations
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

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 20px rgba(201, 162, 39, 0.3); }
  50% { box-shadow: 0 0 30px rgba(201, 162, 39, 0.6); }
`;

const ripple = keyframes`
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(4); opacity: 0; }
`;

const wink = keyframes`
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.1); }
`;

const borderGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

export default function AdminLoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [spinnerData, setSpinnerData] = useState(null);
  const [checkmarkData, setCheckmarkData] = useState(null);
  const [isMounted, setIsMounted] = useState(false);
  const [showAvatar, setShowAvatar] = useState(false);
  const [rippleEffect, setRippleEffect] = useState(false);
  const [winkEye, setWinkEye] = useState(false);
  const router = useRouter();
  const isMobile = useBreakpointValue({ base: true, md: false });

  // Handle hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Load Lottie animations
  useEffect(() => {
    if (!isMounted) return;
    
    fetch('/login-spinner.json')
      .then((res) => res.json())
      .then(setSpinnerData)
      .catch((err) => console.error('Failed to load spinner animation:', err));
    
    fetch('/login-spinner.json')
      .then((res) => res.json())
      .then(setCheckmarkData)
      .catch((err) => console.error('Failed to load checkmark animation:', err));
  }, [isMounted]);

  // Show avatar when username is typed
  useEffect(() => {
    if (username.trim().length > 0) {
      setShowAvatar(true);
    } else {
      setShowAvatar(false);
    }
  }, [username]);

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
        // Play success chime/vibration
        if (navigator.vibrate) {
          navigator.vibrate([100, 50, 100]);
        }
        // Play audio chime if available
        const audio = new Audio('/success-chime.mp3');
        audio.volume = 0.3;
        audio.play().catch(() => {}); // Ignore if audio fails
        setTimeout(() => {
          setPassword("");
          setUsername("");
          router.push("/admin");
        }, 2000);
      } else {
        setError("Incorrect username or password");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
    setWinkEye(true);
    setTimeout(() => setWinkEye(false), 300);
  };

  const handleInputFocus = () => {
    setRippleEffect(true);
    setTimeout(() => setRippleEffect(false), 600);
  };

  // Generate avatar initials
  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Prevent hydration mismatch
  if (!isMounted) {
    return (
      <Box minH="100vh" bg="white" display="flex" alignItems="center" justifyContent="center">
        <Box
          w="8"
          h="8"
          border="2px solid"
          borderColor="brand.green"
          borderTopColor="transparent"
          borderRadius="full"
          sx={{ animation: `${spin} 1s linear infinite` }}
        />
      </Box>
    );
  }

  return (
    <MotionBox 
      minH="100vh" 
      bg="white" 
      position="relative" 
      overflow="hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Enhanced background effects for glassmorphism */}
      <MotionBox
        position="absolute"
        top="10%"
        right="10%"
        w="300px"
        h="300px"
        bgGradient="radial(ellipse at center, brand.gold 40%, transparent 100%)"
        opacity={0.15}
        zIndex={0}
        filter="blur(40px)"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(60px)" }}
        animate={{ opacity: 0.15, scale: 1, filter: "blur(40px)" }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
        sx={{ animation: `${float} 6s ease-in-out infinite` }}
      />
      
      <MotionBox
        position="absolute"
        bottom="20%"
        left="5%"
        w="200px"
        h="200px"
        bgGradient="radial(ellipse at center, brand.green 50%, transparent 100%)"
        opacity={0.12}
        zIndex={0}
        filter="blur(35px)"
        initial={{ opacity: 0, scale: 0.8, filter: "blur(60px)" }}
        animate={{ opacity: 0.12, scale: 1, filter: "blur(35px)" }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
        sx={{ animation: `${float} 8s ease-in-out infinite reverse` }}
      />

      {/* Main content */}
      <Flex minH="100vh" alignItems="center" justifyContent="center" px={{ base: 1, sm: 4 }} direction="column">
        {/* Logo above the container */}
        <MotionBox 
          mb={isMobile ? 4 : 8}
          initial={{ y: 50, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2,
            type: "spring",
            stiffness: 100,
            damping: 15
          }}
        >
          <Box
            as="img"
            src="/lucky-logic-logo.png"
            alt="Lucky Logic logo"
            height={isMobile ? "120px" : "240px"}
            width="auto"
            maxW={{ base: "70vw", sm: "320px" }}
            objectFit="contain"
            display="block"
            mx="auto"
            style={{ 
              filter: 'drop-shadow(0 4px 12px rgba(0,63,45,0.15))',
              userSelect: 'none',
              WebkitUserSelect: 'none',
              MozUserSelect: 'none',
              msUserSelect: 'none',
              pointerEvents: 'none'
            }}
            draggable={false}
            onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
            onDragStart={(e: React.DragEvent) => e.preventDefault()}
            onMouseDown={(e: React.MouseEvent) => {
              if (e.button === 2) e.preventDefault();
            }}
            sx={{
              '-webkit-touch-callout': 'none',
              '-webkit-user-select': 'none',
              '-khtml-user-select': 'none',
              '-moz-user-select': 'none',
              '-ms-user-select': 'none',
              'user-select': 'none',
              '-webkit-tap-highlight-color': 'transparent',
              'pointer-events': 'none',
              'touch-action': 'none'
            }}
          />
        </MotionBox>
        
        {/* Glassmorphism Login Container */}
        <MotionBox
          initial={{ opacity: 0, y: 100, scale: 0.95 }}
          animate={{ 
            opacity: success ? 0 : 1, 
            y: 0, 
            scale: success ? 0.95 : 1 
          }}
          transition={{ 
            duration: success ? 0.5 : 0.8, 
            ease: "easeOut",
            delay: success ? 0 : 0.4,
            type: "spring",
            stiffness: 80,
            damping: 20
          }}
          bg="rgba(255, 255, 255, 0.1)"
          border="1px solid rgba(255,255,255,0.2)"
          backdropFilter="blur(20px)"
          boxShadow="0 8px 32px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(255,255,255,0.1)"
          borderRadius="2xl"
          p={{ base: 3, sm: 6, md: 10 }}
          minW={{ base: "98vw", sm: "95vw", md: "400px" }}
          maxW={{ base: "98vw", sm: "420px" }}
          position="relative"
          zIndex={1}
          mt={{ base: -8, md: -28 }}
          _before={{
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: 'inherit',
            padding: '1px',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.1))',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            pointerEvents: 'none'
          }}
        >
          <VStack as="form" spacing={{ base: 4, sm: 7 }} align="stretch" onSubmit={handleSubmit}>
            <Heading
              size={{ base: "md", sm: "lg" }}
              color="brand.green"
              textAlign="center"
              fontWeight="extrabold"
              letterSpacing="tight"
              mb={2}
              fontFamily="heading"
              textShadow="0 2px 4px rgba(0,63,45,0.1)"
            >
              Admin Login
            </Heading>
            <Text color="gray.700" textAlign="center" fontSize={{ base: "sm", sm: "md" }} mb={2} fontWeight="medium">
              Secure access to admin console
            </Text>
            {error && (
              <Alert 
                status="error" 
                borderRadius="lg" 
                bg="rgba(220, 38, 38, 0.9)" 
                color="white" 
                border="1px solid rgba(255,255,255,0.2)"
                backdropFilter="blur(10px)"
              >
                <AlertIcon />
                {error}
              </Alert>
            )}
            <FormControl isInvalid={!!error}>
              <FormLabel color="brand.green" fontWeight="semibold" textShadow="0 1px 2px rgba(0,63,45,0.1)">Username</FormLabel>
              <InputGroup position="relative">
                <Input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoFocus
                  placeholder="Enter admin username"
                  disabled={loading || success}
                  bg="rgba(255, 255, 255, 0.8)"
                  border="1px solid rgba(255,255,255,0.3)"
                  color="brand.green"
                  _placeholder={{ color: "rgba(0,63,45,0.6)" }}
                  _focus={{
                    borderColor: "brand.gold",
                    boxShadow: "0 0 0 3px rgba(201, 162, 39, 0.3), 0 4px 12px rgba(0,0,0,0.1)",
                    bg: "rgba(255, 255, 255, 0.95)",
                    transform: "translateY(-1px)"
                  }}
                  _hover={{
                    borderColor: "brand.gold",
                    bg: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-1px)"
                  }}
                  fontWeight="medium"
                  fontSize="md"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="xl"
                  backdropFilter="blur(10px)"
                  onFocus={handleInputFocus}
                  pr={showAvatar ? "60px" : "12px"}
                />
                {/* Ripple Effect */}
                {rippleEffect && (
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    w="2px"
                    h="2px"
                    bg="brand.gold"
                    borderRadius="full"
                    sx={{ animation: `${ripple} 0.6s ease-out` }}
                    pointerEvents="none"
                  />
                )}
              </InputGroup>
            </FormControl>
            <FormControl isInvalid={!!error}>
              <FormLabel color="brand.green" fontWeight="semibold" textShadow="0 1px 2px rgba(0,63,45,0.1)">Password</FormLabel>
              <InputGroup position="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  disabled={loading || success}
                  bg="rgba(255, 255, 255, 0.8)"
                  border="1px solid rgba(255,255,255,0.3)"
                  color="brand.green"
                  _placeholder={{ color: "rgba(0,63,45,0.6)" }}
                  _focus={{
                    borderColor: "brand.gold",
                    boxShadow: "0 0 0 3px rgba(201, 162, 39, 0.3), 0 4px 12px rgba(0,0,0,0.1)",
                    bg: "rgba(255, 255, 255, 0.95)",
                    transform: "translateY(-1px)"
                  }}
                  _hover={{
                    borderColor: "brand.gold",
                    bg: "rgba(255, 255, 255, 0.9)",
                    transform: "translateY(-1px)"
                  }}
                  fontWeight="medium"
                  fontSize="md"
                  transition="all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                  borderRadius="xl"
                  backdropFilter="blur(10px)"
                  onFocus={handleInputFocus}
                  pr="3rem"
                />
                <InputRightElement width="3rem">
                  <Button
                    h="1.75rem"
                    size="sm"
                    variant="ghost"
                    onClick={handlePasswordToggle}
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    color="brand.green"
                    _hover={{ 
                      color: "brand.gold",
                      bg: "rgba(201, 162, 39, 0.1)",
                      transform: "scale(1.1)"
                    }}
                    transition="all 0.2s"
                  >
                    <MotionIcon
                      as={showPassword ? FiEyeOff : FiEye}
                      boxSize="16px"
                      animate={winkEye ? { scaleY: [1, 0.1, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </InputRightElement>
                {/* Ripple Effect */}
                {rippleEffect && (
                  <Box
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    w="2px"
                    h="2px"
                    bg="brand.gold"
                    borderRadius="full"
                    sx={{ animation: `${ripple} 0.6s ease-out` }}
                    pointerEvents="none"
                  />
                )}
              </InputGroup>
              <FormErrorMessage>{error}</FormErrorMessage>
            </FormControl>
            
            {/* Enhanced Glass Button with Animated Border */}
            <MotionButton
              type="submit"
              bg="rgba(255, 255, 255, 0.1)"
              color="brand.green"
              size="lg"
              fontWeight="bold"
              borderRadius="xl"
              h="50px"
              position="relative"
              overflow="hidden"
              backdropFilter="blur(10px)"
              border="1px solid rgba(255,255,255,0.2)"
              _hover={{
                bg: "rgba(255, 255, 255, 0.15)",
                color: "brand.gold",
                transform: "translateY(-2px)",
                boxShadow: "0 8px 25px rgba(201, 162, 39, 0.4), 0 0 0 1px rgba(201, 162, 39, 0.2)"
              }}
              _active={{
                bg: "rgba(255, 255, 255, 0.1)",
                color: "brand.green",
                transform: "translateY(0px)",
                boxShadow: "0 4px 12px rgba(0,63,45,0.3)"
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              disabled={loading || success}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
              whileTap={{ 
                scale: 0.98,
                transition: { duration: 0.1 }
              }}
              _before={{
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)',
                borderRadius: 'inherit',
                pointerEvents: 'none'
              }}
              sx={{
                '&:hover': {
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '-2px',
                    left: '-2px',
                    right: '-2px',
                    bottom: '-2px',
                    background: 'linear-gradient(45deg, #003f2d, #c9a227, #003f2d, #c9a227)',
                    backgroundSize: '400% 400%',
                    borderRadius: 'inherit',
                    zIndex: -1,
                    animation: `${borderGradient} 3s ease infinite`
                  }
                }
              }}
            >
              {loading ? (
                <Flex align="center" justify="center" gap={2}>
                  {spinnerData ? (
                    <Box w="24px" h="24px">
                      <Lottie
                        animationData={spinnerData}
                        loop
                        autoplay
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                  ) : (
                    <Box
                      as="div"
                      w="18px"
                      h="18px"
                      border="2px solid"
                      borderColor="currentColor"
                      borderTopColor="transparent"
                      borderRadius="full"
                      sx={{ animation: `${spin} 1s linear infinite` }}
                    />
                  )}
                  <Text>Authenticating...</Text>
                </Flex>
              ) : success ? (
                <Flex align="center" justify="center" gap={2}>
                  {checkmarkData ? (
                    <Box w="24px" h="24px">
                      <Lottie
                        animationData={checkmarkData}
                        loop={false}
                        autoplay
                        style={{ width: '100%', height: '100%' }}
                      />
                    </Box>
                  ) : (
                    <Box
                      as="div"
                      w="18px"
                      h="18px"
                      color="green.500"
                      sx={{ animation: `${pulse} 1s ease-in-out infinite` }}
                    />
                  )}
                  <Text>Success!</Text>
                </Flex>
              ) : (
                "Login"
              )}
            </MotionButton>
          </VStack>
        </MotionBox>
      </Flex>
    </MotionBox>
  );
} 