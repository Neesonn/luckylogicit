# 💻 Lucky Logic Website

Lucky Logic is a boutique residential IT support service based in Sydney, Australia. This website showcases the company's offerings and facilitates customer contact.

## 📑 Table of Contents
- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies](#technologies)
- [Setup & Development](#setup--development)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [SEO & Analytics](#seo--analytics)
- [Legal](#legal)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview
Lucky Logic was founded in 2024 to address a gap in residential IT services in Sydney. The site offers information about services, contact forms, privacy and terms policies, cookie consent, and analytics integrations — all styled using Chakra UI and Next.js 14.

## ✨ Features
- 🎨 Responsive homepage with animated hero section
- 📄 About Us, Contact Us, Privacy Policy, Terms & Conditions, Cookie Policy pages
- 🗺️ Google Maps static map showing office location
- 🍪 Cookie consent banner with preference controls
- 🔍 SEO optimized with Open Graph and Twitter meta tags
- 📊 Google Analytics (GA4) integration
- 🧭 Navigation bar with active links and logo
- 📝 Easy contact form for customer inquiries

## 🛠️ Technologies
- ⚛️ Next.js 14 (app router)
- ⚡ React 18
- 📘 TypeScript
- 🎨 Chakra UI
- 🎭 Framer Motion (animations)
- 🎬 Lottie (animation player)
- 🗺️ Google Maps Static API
- 📊 Google Analytics (GA4)
- 🚀 Netlify (hosting & CI/CD)

## 🚀 Setup & Development
1. Clone the repository:
```bash
git clone https://github.com/Neesonn/luckylogicit.git
cd luckylogicit
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root with necessary environment variables (see below).

4. Run the development server:
```bash
npm run dev
```

Open http://localhost:3000 to view the site locally.

## 🔑 Environment Variables
Add the following to `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

Replace `your-google-maps-api-key` with your actual API key.
Replace `G-XXXXXXXXXX` with your Google Analytics measurement ID.

## 🚀 Deployment
The site is deployed on Netlify using the following build commands:

- Build command: `npm run build`
- Publish directory: `.next`

Make sure to add environment variables in the Netlify dashboard for Google Maps and Analytics.

## 🔍 SEO & Analytics
- 📝 Metadata set in `app/page.tsx` includes titles, descriptions, Open Graph and Twitter card data
- 📊 Google Analytics GA4 tracking added in `app/layout.tsx`
- 🗺️ Sitemap and robots.txt are configured for search engine indexing
- 🍪 Cookie consent banner controls cookie preferences in compliance with GDPR and Australian regulations

## ⚖️ Legal
- 📜 Privacy Policy, Terms & Conditions, and Cookie Policy pages included with content tailored for Australian standards
- 🍪 Cookie consent banner with accept/decline and preferences management

## 🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request. For major changes, open an issue first to discuss what you'd like to change.

## 📄 License
This project is licensed under the MIT License.

## 📞 Support
If you need help or have questions, please reach out at support@luckylogic.com.au.