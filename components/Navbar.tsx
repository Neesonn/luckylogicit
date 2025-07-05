import { Flex, Text, Box, HStack, Spacer, IconButton, useBreakpointValue, Menu, MenuButton, MenuList, MenuItem, Button, Accordion, AccordionItem, AccordionButton, AccordionPanel, AccordionIcon } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaWhatsapp, FaInstagram, FaFacebook, FaBars, FaLinkedin } from 'react-icons/fa';
import React from 'react';

export default function Navbar() {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return (
    <Flex
      as="nav"
      direction="row"
      width="100%"
      height="80px"
      px={4}
      py={3}
      bg="white"
      boxShadow="md"
      position="fixed"
      top={0}
      left={0}
      zIndex={10}
      align="center"
    >
      {/* Logo */}
      <NextLink href="/" passHref legacyBehavior>
        <Box
          as="img"
          src="/lucky-logic-logo.png"
          alt="Lucky Logic logo"
          height="200px"
          width="auto"
          objectFit="contain"
          display="block"
          cursor="pointer"
          onContextMenu={(e: React.MouseEvent) => e.preventDefault()}
          tabIndex={0}
          _focus={{
            outline: '2px solid',
            outlineColor: 'brand.green',
            outlineOffset: '2px',
          }}
        />
      </NextLink>

      <Spacer />

      {/* Navigation Links (Desktop) / Hamburger Menu (Mobile) */}
      {!isMobile ? (
        <HStack spacing={6} ml={6} align="center">
          <Text as={NextLink} href="/" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer" _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Home</Text>
          <Text as={NextLink} href="/about-us" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer" _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>About Us</Text>
          <Menu isLazy>
            <MenuButton as={Text} color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer" _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>
              Services
            </MenuButton>
            <MenuList zIndex={20}>
              <MenuItem as={NextLink} href="/services" color="brand.green" fontWeight="medium" fontSize="md" _hover={{ bg: 'green.50', color: 'green.700' }} _focus={{ bg: 'green.50', color: 'green.700' }}>IT Services</MenuItem>
              <MenuItem as={NextLink} href="/travel-assistance" color="brand.green" fontWeight="medium" fontSize="md" _hover={{ bg: 'green.50', color: 'green.700' }} _focus={{ bg: 'green.50', color: 'green.700' }}>Frequent Flyer Help</MenuItem>
            </MenuList>
          </Menu>
          <Text as={NextLink} href="/troubleshoot" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer" _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Troubleshoot</Text>
          <Text as={NextLink} href="/faq" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer" _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>FAQ</Text>
          <Text as={NextLink} href="/invoice-search" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer" _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Pay Invoice</Text>
          <Text as={NextLink} href="/contact-us" color="brand.green" fontWeight="medium" fontSize="md" cursor="pointer" _focus={{ outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Contact Us</Text>
        </HStack>
      ) : (
        <Menu>
          <MenuButton
            as={IconButton}
            aria-label="Open navigation menu"
            icon={<FaBars />}
            variant="outline"
            size="lg"
            colorScheme="green"
            _focus={{
              outline: '2px solid',
              outlineColor: 'brand.green',
              outlineOffset: '2px',
            }}
          />
          <MenuList>
            <MenuItem as={NextLink} href="/" _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Home</MenuItem>
            <MenuItem as={NextLink} href="/about-us" _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>About Us</MenuItem>
            <Accordion allowToggle reduceMotion={true} borderColor="transparent">
              <AccordionItem border="none">
                {({ isExpanded }) => (
                  <>
                    <AccordionButton _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }} px={4} py={2}>
                      <Box flex="1" textAlign="left">Services</Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={2} pl={4}>
                      <MenuItem as={NextLink} href="/services" color="brand.green" fontWeight="medium" fontSize="md" _hover={{ bg: 'green.50', color: 'green.700' }} _focus={{ bg: 'green.50', color: 'green.700' }}>IT Services</MenuItem>
                      <MenuItem as={NextLink} href="/travel-assistance" color="brand.green" fontWeight="medium" fontSize="md" _hover={{ bg: 'green.50', color: 'green.700' }} _focus={{ bg: 'green.50', color: 'green.700' }}>Frequent Flyer Help</MenuItem>
                    </AccordionPanel>
                  </>
                )}
              </AccordionItem>
            </Accordion>
            <MenuItem as={NextLink} href="/troubleshoot" _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Troubleshoot</MenuItem>
            <MenuItem as={NextLink} href="/faq" _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>FAQ</MenuItem>
            <MenuItem as={NextLink} href="/invoice-search" _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Pay Invoice</MenuItem>
            <MenuItem as={NextLink} href="/contact-us" _focus={{ bg: 'green.50', outline: '2px solid', outlineColor: 'brand.green', outlineOffset: '2px' }}>Contact Us</MenuItem>
          </MenuList>
        </Menu>
      )}

      {/* Social Media Icons */}
      <HStack spacing={2} ml={{ base: 4, md: 6 }}>
        <IconButton
          as="a"
          href="https://wa.me/61426901209"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact us on WhatsApp"
          icon={<FaWhatsapp />}
          colorScheme="whatsapp"
          size="lg"
          fontSize="24px"
          variant="ghost"
          _hover={{ transform: 'scale(1.1)' }}
          _focus={{
            outline: '2px solid',
            outlineColor: 'brand.green',
            outlineOffset: '2px',
            transform: 'scale(1.1)',
          }}
          transition="transform 0.2s"
        />
        <IconButton
          as="a"
          href="https://instagram.com/luckylogicit"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Instagram"
          icon={<FaInstagram />}
          colorScheme="pink"
          size="lg"
          fontSize="24px"
          variant="ghost"
          _hover={{ transform: 'scale(1.1)' }}
          _focus={{
            outline: '2px solid',
            outlineColor: 'brand.green',
            outlineOffset: '2px',
            transform: 'scale(1.1)',
          }}
          transition="transform 0.2s"
        />
        <IconButton
          as="a"
          href="https://www.facebook.com/luckylogicIT/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on Facebook"
          icon={<FaFacebook />}
          colorScheme="facebook"
          size="lg"
          fontSize="24px"
          variant="ghost"
          _hover={{ transform: 'scale(1.1)' }}
          _focus={{
            outline: '2px solid',
            outlineColor: 'brand.green',
            outlineOffset: '2px',
            transform: 'scale(1.1)',
          }}
          transition="transform 0.2s"
        />
        <IconButton
          as="a"
          href="https://www.linkedin.com/company/lucky-logic-it"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Follow us on LinkedIn"
          icon={<FaLinkedin />}
          colorScheme="linkedin"
          size="lg"
          fontSize="24px"
          variant="ghost"
          _hover={{ transform: 'scale(1.1)' }}
          _focus={{
            outline: '2px solid',
            outlineColor: 'brand.green',
            outlineOffset: '2px',
            transform: 'scale(1.1)',
          }}
          transition="transform 0.2s"
        />
      </HStack>
    </Flex>
  );
}