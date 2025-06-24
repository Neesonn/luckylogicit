import { Flex, Text, Box, HStack, Spacer, IconButton, useBreakpointValue, Menu, MenuButton, MenuList, MenuItem } from '@chakra-ui/react';
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
          <NextLink href="/" passHref legacyBehavior>
            <Text
              as="a"
              color="brand.green"
              fontWeight="medium"
              fontSize="md"
              cursor="pointer"
              _focus={{
                outline: '2px solid',
                outlineColor: 'brand.green',
                outlineOffset: '2px',
              }}
            >
              Home
            </Text>
          </NextLink>

          <NextLink href="/about-us" passHref legacyBehavior>
            <Text
              as="a"
              color="brand.green"
              fontWeight="medium"
              fontSize="md"
              cursor="pointer"
              _focus={{
                outline: '2px solid',
                outlineColor: 'brand.green',
                outlineOffset: '2px',
              }}
            >
              About Us
            </Text>
          </NextLink>

          <NextLink href="/services" passHref legacyBehavior>
            <Text
              as="a"
              color="brand.green"
              fontWeight="medium"
              fontSize="md"
              cursor="pointer"
              _focus={{
                outline: '2px solid',
                outlineColor: 'brand.green',
                outlineOffset: '2px',
              }}
            >
              Services
            </Text>
          </NextLink>

          <NextLink href="/troubleshoot" passHref legacyBehavior>
            <Text
              as="a"
              color="brand.green"
              fontWeight="medium"
              fontSize="md"
              cursor="pointer"
              _focus={{
                outline: '2px solid',
                outlineColor: 'brand.green',
                outlineOffset: '2px',
              }}
            >
              Troubleshoot
            </Text>
          </NextLink>

          <NextLink href="/faq" passHref legacyBehavior>
            <Text
              as="a"
              color="brand.green"
              fontWeight="medium"
              fontSize="md"
              cursor="pointer"
              _focus={{
                outline: '2px solid',
                outlineColor: 'brand.green',
                outlineOffset: '2px',
              }}
            >
              FAQ
            </Text>
          </NextLink>

          <NextLink href="/contact-us" passHref legacyBehavior>
            <Text
              as="a"
              color="brand.green"
              fontWeight="medium"
              fontSize="md"
              cursor="pointer"
              _focus={{
                outline: '2px solid',
                outlineColor: 'brand.green',
                outlineOffset: '2px',
              }}
            >
              Contact Us
            </Text>
          </NextLink>
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
            <NextLink href="/" passHref>
              <MenuItem
                _focus={{
                  bg: 'green.50',
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                }}
              >
                Home
              </MenuItem>
            </NextLink>
            <NextLink href="/about-us" passHref>
              <MenuItem
                _focus={{
                  bg: 'green.50',
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                }}
              >
                About Us
              </MenuItem>
            </NextLink>
            <NextLink href="/services" passHref>
              <MenuItem
                _focus={{
                  bg: 'green.50',
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                }}
              >
                Services
              </MenuItem>
            </NextLink>
            <NextLink href="/troubleshoot" passHref>
              <MenuItem
                _focus={{
                  bg: 'green.50',
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                }}
              >
                Troubleshoot
              </MenuItem>
            </NextLink>
            <NextLink href="/faq" passHref>
              <MenuItem
                _focus={{
                  bg: 'green.50',
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                }}
              >
                FAQ
              </MenuItem>
            </NextLink>
            <NextLink href="/contact-us" passHref>
              <MenuItem
                _focus={{
                  bg: 'green.50',
                  outline: '2px solid',
                  outlineColor: 'brand.green',
                  outlineOffset: '2px',
                }}
              >
                Contact Us
              </MenuItem>
            </NextLink>
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