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
        type: 'image/png',
        secureUrl: 'https://luckylogic.com.au/lucky-logic-logo.png',
      },
    ],
    locale: 'en_AU',
    type: 'website',
    determiner: 'the',
    audio: {
      url: 'https://luckylogic.com.au/audio/podcast.mp3',
      type: 'audio/mpeg',
    },
    videos: [
      {
        url: 'https://luckylogic.com.au/video/demo.mp4',
        type: 'video/mp4',
        width: 1280,
        height: 720,
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lucky Logic | Residential IT Support Services',
    description: 'Professional IT support services in Sydney. We offer computer repairs, network setup, smart home assistance, and more.',
    images: ['https://luckylogic.com.au/lucky-logic-logo.png'],
    creator: '@luckylogicit',
    site: '@luckylogicit',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://www.luckylogic.com.au',
    languages: {
      'en-AU': 'https://www.luckylogic.com.au',
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
    other: {
      rel: 'apple-touch-icon-precomposed',
      url: '/apple-touch-icon-precomposed.png',
    },
  },
  verification: {
    google: 'google-site-verification-code',
    yandex: 'yandex-verification-code',
  },
  category: 'technology',
  classification: 'IT Services',
  referrer: 'origin-when-cross-origin',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
}; 