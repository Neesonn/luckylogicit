// components/GlassCard.tsx
'use client';

import { Box, BoxProps } from '@chakra-ui/react';

export default function GlassCard({ children, ...props }: BoxProps) {
  return (
    <Box
      bg="whiteAlpha.200"
      backdropFilter="blur(20px)"
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      border="1.5px solid"
      borderColor="whiteAlpha.400"
      position="relative"
      _hover={{ transform: 'scale(1.02)', transition: '0.3s ease' }}
      transition="all 0.2s ease"
      {...props}
    >
      <Box
        position="absolute"
        inset={0}
        borderRadius="inherit"
        pointerEvents="none"
        zIndex={0}
        bgGradient="linear(to-br, whiteAlpha.200, transparent 80%)"
      />
      {children}
    </Box>
  );
}
