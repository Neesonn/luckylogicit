'use client';

import { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { useRouter } from 'next/navigation';

const MotionBox = motion(Box);
const MotionHeading = motion(Heading);
const MotionText = motion(Text);
const MotionButton = motion(Button);

export default function Hero() {
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [animationData, setAnimationData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/it-animation.json')
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((err) => console.error('Failed to load animation:', err));
  }, []);

  const handleGetInTouchClick = () => {
    router.push('/contact-us');
  };

  return (
    <Box position="relative" bg="white" zIndex={1} px={{ base: 4, md: 8 }} pt={{ base: 16, md: 28 }} pb={{ base: 10, md: 16 }}>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align="stretch"
        justify="center"
        gap={{ base: 6, md: 0 }}
      >
        {/* Left: Text Content */}
        <MotionBox
          flex="1"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          px={{ base: 0, md: 10 }}
          mb={{ base: 8, md: 0 }}
          zIndex={2}
        >
          <MotionHeading
            fontSize={{ base: '2xl', sm: '3xl', md: '4xl' }}
            color="brand.green"
            mb={4}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Expert Residential IT Support
          </MotionHeading>

          <MotionText
            fontSize={{ base: 'md', sm: 'lg', md: 'xl' }}
            color="gray.700"
            mb={8}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            maxW={{ base: '100%', md: '80%' }}
          >
            Delivering reliable in-home technology solutions from network
            setup and device troubleshooting to smart home integration and
            ongoing tech support.
          </MotionText>

          <MotionButton
            size="lg"
            bg="brand.gold"
            color="white"
            width={{ base: '100%', md: 'auto' }}
            alignSelf={{ base: 'center', md: 'flex-start' }}
            _hover={{ bg: '#b38d1c' }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300 }}
            onClick={handleGetInTouchClick}
          >
            Get In Touch
          </MotionButton>
        </MotionBox>

        {/* Vertical Divider (desktop only) */}
        {!isMobile && (
          <Box
            width="1px"
            bg="gray.200"
            mx={4}
            alignSelf="stretch"
            boxShadow="0 0 4px rgba(0, 0, 0, 0.05)"
          />
        )}

        {/* Right: Lottie Animation */}
        {!isMobile && animationData && (
          <Box
            flex="1"
            display="flex"
            justifyContent="center"
            alignItems="center"
            pr={{ md: 10 }}
            zIndex={2}
            maxW="500px"
            maxH="400px"
          >
            <Lottie
              animationData={animationData}
              loop
              autoplay
              style={{ width: '100%', height: 'auto' }}
            />
          </Box>
        )}
      </Flex>

      {/* SVG Wave Transition */}
      <Box
        position="absolute"
        bottom={0}
        left={0}
        width="100%"
        height="auto"
        zIndex={0}
        pointerEvents="none"
      >
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path
            fill="#e9f5f1"
            d="M0,0 C600,100 840,20 1440,100 L1440,120 L0,120 Z"
          />
        </svg>
      </Box>
    </Box>
  );
}
