// components/GlassCard.tsx
'use client';

import { Box, BoxProps } from '@chakra-ui/react';

export default function GlassCard({ children, ...props }: BoxProps) {
  return (
    <Box
      bg="whiteAlpha.200"
      backdropFilter="blur(12px)"
      borderRadius="xl"
      boxShadow="lg"
      p={6}
      border="1px solid"
      borderColor="whiteAlpha.300"
      _hover={{ transform: 'scale(1.02)', transition: '0.3s ease' }}
      transition="all 0.2s ease"
      {...props}
    >
      {children}
    </Box>
  );
}
