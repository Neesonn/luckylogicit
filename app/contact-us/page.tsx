import { Box, Heading, Text, VStack, Input, Textarea, Button, FormControl, FormLabel, Image } from '@chakra-ui/react';

export default function ContactUsPage() {
  return (
    <Box px={6} py={{ base: 16, md: 24 }} maxW="3xl" mx="auto" color="gray.800">
      <Heading as="h1" size="2xl" mb={6} color="brand.green" textAlign="center">
        Contact Us
      </Heading>

      {/* Static Map with Circle Overlay */}
      <Box
        position="relative"
        mb={4}  // smaller margin bottom to add address text closer
        borderRadius="md"
        overflow="hidden"
        boxShadow="md"
        maxW="500px"
        mx="auto"
      >
        <Image
          src="/kirrawee-map.png"
          alt="Map showing location of Lucky Logic at Kirrawee"
          width="100%"
          height="auto"
          objectFit="cover"
          borderRadius="md"
        />

        {/* Circle Overlay */}
        <Box
          position="absolute"
          top="50%"
          left="55%"
          width="100px"
          height="100px"
          border="3px solid #c9a227"
          borderRadius="50%"
          pointerEvents="none"
          boxShadow="0 0 10px #c9a227"
          transform="translate(-50%, -50%)"
          zIndex={10}
        />
      </Box>

      {/* Address text below map */}
      <Text
        fontSize="md"
        color="gray.700"
        maxW="500px"
        mx="auto"
        mb={8}
        textAlign="center"
        fontWeight="medium"
      >
        580 Princes Highway<br />
        Kirrawee NSW 2232, Sydney Australia
      </Text>

      <Text fontSize="lg" mb={8} textAlign="center">
        Have questions or need assistance? We'd love to hear from you! Please fill out the form below or email us directly at{' '}
        <strong>support@luckylogic.com.au</strong>.
      </Text>

      <VStack as="form" spacing={6} maxW="600px" mx="auto">
        <FormControl isRequired>
          <FormLabel>Your Name</FormLabel>
          <Input placeholder="Enter your full name" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Email Address</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>

        <FormControl>
          <FormLabel>Phone Number</FormLabel>
          <Input type="tel" placeholder="Optional" />
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Message</FormLabel>
          <Textarea placeholder="How can we help you?" rows={6} />
        </FormControl>

        <Button colorScheme="green" size="lg" type="submit" width="full">
          Send Message
        </Button>
      </VStack>
    </Box>
  );
}
