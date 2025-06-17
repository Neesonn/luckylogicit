import { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.luckylogic.com.au'),
  title: 'Lucky Logic | Residential IT Support Services',
  description: 'Professional IT support services in Sydney. We offer computer repairs, network setup, smart home assistance, and more. Fast, reliable, and affordable IT solutions for your home.',
  keywords: 'IT support Sydney, computer repairs, network setup, smart home, tech support, residential IT, computer maintenance, Sydney IT services',
  openGraph: {
    title: 'Lucky Logic | Residential IT Support Services',
    description: 'Professional IT support services in Sydney. We offer computer repairs, network setup, smart home assistance, and more.',
    url: 'https://www.luckylogic.com.au',
    siteName: 'Lucky Logic IT',
    images: [
      {
        url: 'https://luckylogic.com.au/lucky-logic-logo.png',
        width: 800,
        height: 600,
        alt: 'Lucky Logic IT Logo',
      },
    ],
    locale: 'en_AU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucky Logic | Residential IT Support Services',
    description: 'Professional IT support services in Sydney. We offer computer repairs, network setup, smart home assistance, and more.',
    images: ['https://luckylogic.com.au/lucky-logic-logo.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}; 