import { Box } from '@chakra-ui/react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import ServiceGrid from '../components/ServiceGrid';
import GoogleHead from '../components/GoogleHead'; // ✅ NEW

export const metadata = {
  metadataBase: new URL('https://www.luckylogic.com.au'),
  title: 'Lucky Logic | Residential IT Support Services',
  description: 'Expert in-home IT support for households and home businesses. Network setup, computer repairs, smart home assistance and more.',
  openGraph: {
    title: 'Lucky Logic | Residential IT Support Services',
    description: 'Expert in-home IT support for households and home businesses. Network setup, computer repairs, smart home assistance and more.',
    url: '/',
    siteName: 'Lucky Logic',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lucky Logic Services',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucky Logic | Residential IT Support Services',
    description: 'In-home IT support you can count on — from networking to smart home setup.',
    images: ['/og-image.jpg'],
  },
};

export default function Home() {
  return (
    <>
      <GoogleHead /> {/* ✅ Injects Google verification into <head> */}
      <Box>
        <Navbar />
        <Hero />
        <ServiceGrid />
        <Footer />
      </Box>
    </>
  );
}
