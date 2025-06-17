# Lucky Logic - IT Support & Computer Services

A modern, responsive website for Lucky Logic, a professional IT support and computer services company based in Australia. Built with Next.js 14, TypeScript, and Chakra UI.

## 🎯 Project Overview

Lucky Logic provides comprehensive IT support and computer services, including:
- Network Setup & Troubleshooting
- Computer Repairs & Maintenance
- Smart Home Solutions
- Business IT Support

## 🚀 Features

- **Modern Tech Stack**
  - Next.js 14 with App Router
  - TypeScript for type safety
  - Chakra UI for beautiful, accessible components
  - Jest & React Testing Library for unit testing

- **Key Components**
  - Responsive navigation with mobile menu
  - Interactive service cards and accordions
  - Contact form with WhatsApp integration
  - Google Maps integration
  - Cookie consent management
  - SEO optimization with metadata
  - Error boundaries and 404 handling

- **Performance & SEO**
  - Server-side rendering
  - Optimized images and assets
  - Structured data (JSON-LD)
  - Sitemap generation
  - Google Analytics integration

## 🛠️ Development

### Prerequisites
- Node.js 18.17 or later
- npm or yarn

### Installation
```bash
# Clone the repository
git clone [repository-url]

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
npm test          # Run unit tests
```

## 📁 Project Structure

```
├── app/                  # Next.js app directory
│   ├── about-us/        # About page
│   ├── contact-us/      # Contact page
│   ├── services/        # Services page
│   ├── privacy-policy/  # Privacy policy
│   ├── cookie-policy/   # Cookie policy
│   └── terms/          # Terms of service
├── components/          # Reusable components
│   ├── Navbar.tsx      # Navigation component
│   ├── Hero.tsx        # Hero section
│   ├── ContactForm.tsx # Contact form
│   └── Footer.tsx      # Footer component
├── theme/              # Chakra UI theme
├── public/            # Static assets
└── types/            # TypeScript types
```

## 🔒 Security & Privacy

- Cookie consent management
- Privacy policy
- Terms of service
- Secure form handling
- GDPR compliance

## 📞 Support

If you need help or have questions, please reach out at support@luckylogic.com.au.

## 📄 License

This project is proprietary and confidential. All rights reserved.

## 🔑 Environment Variables

The following environment variables are required for the application to function properly. Create a `.env.local` file in the root directory and add these variables:

```env
# Google Maps API Key for location services
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Google Analytics ID for tracking
NEXT_PUBLIC_GA_ID=your-ga-id

# UptimeRobot API Key for monitoring
UPTIMEROBOT_READONLY_API_KEY=your-uptimerobot-readonly-api-key
```

### Required Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | API key for Google Maps integration | Yes | `AIza...` |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID | Yes | `G-XXXXXXXXXX` |
| `UPTIMEROBOT_READONLY_API_KEY` | API key for UptimeRobot monitoring | Yes | `ur...` |

### Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Fill in the required values in `.env.local`

3. Never commit `.env.local` to version control

### Production Setup

For production deployment:
1. Add these environment variables to your hosting platform (e.g., Vercel, Netlify)
2. Ensure all required variables are set
3. Keep API keys secure and rotate them periodically

### Security Notes

- All API keys should be kept secure and never exposed in client-side code
- The `NEXT_PUBLIC_` prefix indicates variables that are exposed to the browser
- Use appropriate API key restrictions in Google Cloud Console
- Regularly rotate API keys and monitor for unauthorized usage