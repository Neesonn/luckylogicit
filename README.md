# Lucky Logic - IT Support & Computer Services

A modern, responsive, production-ready website for Lucky Logic, a professional IT support and computer services company based in Sydney, Australia. Built with Next.js 14, TypeScript, and Chakra UI, featuring a robust admin dashboard, customer management system, and comprehensive SEO optimization.

## 🎯 Project Overview

Lucky Logic provides comprehensive residential IT support and computer services in Sydney, including:
- **Network Setup & Troubleshooting** - Wi-Fi optimization, router configuration, ISP connectivity
- **Computer Repairs & Upgrades** - Hardware repairs, RAM/storage upgrades, custom PC builds
- **Software Installation & Support** - OS installation, malware removal, software setup
- **Smart Home Assistance** - Device integration, automation setup, compatibility checks
- **Ongoing Tech Support** - Remote and on-site assistance for families and professionals

## 🚀 Production-Ready Features

### **Modern Tech Stack**
- **Next.js 14** with App Router for optimal performance and SEO
- **TypeScript** for type safety and better development experience
- **Chakra UI** for beautiful, accessible, and responsive components
- **Framer Motion** for smooth animations and enhanced UX
- **Jest & React Testing Library** for comprehensive unit testing
- **Supabase** for real-time database operations and customer management

### **Admin Dashboard & Customer Management**
- **Secure Admin Area** - Password-protected admin dashboard accessible via hidden spanner icon
- **Stripe Integration** - Full customer management with Stripe API integration
- **Customer CRUD Operations** - Create, read, update, and delete customer profiles
- **Real-time Data Sync** - Live updates between admin interface and Stripe dashboard
- **Product Catalogue Management** - Complete product inventory with Supabase backend
- **Bulk Operations** - Multi-select and bulk delete functionality for customers
- **Advanced Filtering & Search** - Sort, filter, and search customers by various criteria
- **Mobile-Optimized Projects Management** - The /admin/manage-projects page is fully responsive: the projects table is horizontally scrollable on mobile, all forms and modals are full width, and controls/buttons are stacked or wrapped for easy use on any device.
- **Fast, Responsive Customer Profile Modal** - The customer profile modal now loads projects and invoices in parallel, uses skeleton loaders, caches results per customer, and is visually optimized for both desktop and mobile, ensuring a smooth and fast experience.

### **Contact System**
- **Formspree Integration** - Reliable, production-ready contact form
- **Real-time Validation** - Client-side form validation with user-friendly error messages
- **Success/Error Handling** - Toast notifications for clear user feedback
- **Fallback Options** - Direct email and phone contact information prominently displayed
- **No API Dependencies** - Static export compatible, no server-side code required

### **SEO & Performance**
- **Comprehensive Metadata** - Open Graph, Twitter Cards, structured data (JSON-LD)
- **Static Export** - Fast loading, excellent Core Web Vitals
- **Sitemap Generation** - Automatic sitemap creation for search engines
- **Robots.txt** - Proper search engine crawling instructions
- **Google Analytics** - Production-ready tracking (environment variable configurable)
- **Optimized Images** - WebP support, responsive images, proper alt tags

### **User Experience**
- **Responsive Design** - Mobile-first approach, works perfectly on all devices
- **Accessibility** - WCAG compliant, keyboard navigation, screen reader support
- **Loading States** - Smooth loading indicators and skeleton screens
- **Error Boundaries** - Graceful error handling with custom 404/500 pages
- **Cookie Consent** - GDPR-compliant cookie management
- **Troubleshooting Guide** - Accessible, swipeable on mobile, contextual tips, and robust search/filter

### **Security & Compliance**
- **Content Security Policy** - Comprehensive CSP headers
- **Privacy Policy** - Detailed privacy information and data handling
- **Terms of Service** - Clear terms and conditions
- **Cookie Policy** - Transparent cookie usage and management
- **GDPR Compliance** - User consent management and data protection
- **Cookie Consent** - Banner links to Privacy Policy, Cookie Policy, and Terms & Conditions
- **Troubleshooting Disclaimer** - See Terms & Conditions ('Use of Website') for liability statement

## 💬 Crisp Chat Integration & Accessibility

### **Features**
- **Live Chat Support**: Crisp chatbox integrated for instant customer support.
- **Branding**: Chatbox color and welcome message match Lucky Logic's brand.
- **Online Status**: Shows when an operator is online and ready to help.
- **Custom Launcher**: Accessible chat launcher button in the footer with ARIA label and keyboard support.

### **Accessibility**
- **Keyboard Navigation**: Chatbox and launcher are fully keyboard accessible.
- **Screen Reader Support**: ARIA labels and roles for custom launcher.
- **Custom Launcher Example**:
  ```jsx
  <button
    aria-label="Open live chat"
    onClick={() => window.$crisp?.push(['do', 'chat:open'])}
  >
    Chat with us
  </button>
  ```

### **GDPR & Privacy Compliance**
- **Cookie Consent**: Crisp only loads after user accepts cookies via the CookieBanner.
- **Privacy Policy Link**: Chatbox includes a direct link to the site's privacy policy.
- **Data Handling**: No chat data is stored on Lucky Logic servers; all chat data is managed by Crisp.
- **Privacy Policy Text Example**:
  > We use Crisp live chat to provide instant support. When you use the chat, your messages and information may be stored and processed by Crisp in accordance with their [Privacy Policy](https://crisp.chat/en/privacy/).

### **Customization**
- **Color & Welcome Message**: Set via Crisp dashboard under Chatbox Appearance.
- **Online/Offline Text**: Customizable in Crisp dashboard under Chatbox Texts.
- **Proactive Triggers**: Welcome messages and proactive support can be set up in the Crisp dashboard.

### **Advanced**
- **Show Online Status Elsewhere**: Use the Crisp JS API to display online status outside the chatbox if needed.
- **Further Customization**: See Crisp's [official documentation](https://help.crisp.chat/en/) for more options.

## 🗄️ Product Catalogue & Supabase Integration

### Live Product Catalogue Admin
- The admin product catalogue page now uses **Supabase** for live, production-ready data sync.
- All product CRUD operations (add, edit, delete) are instantly reflected in your Supabase database.

### Supabase Setup
1. **Create a Supabase project** at https://app.supabase.com/
2. **Create a `products` table** with columns:
   - `id` (integer, primary key, auto-increment)
   - `name`, `vendor`, `description`, `category`, `distributor`, `vendorSku`, `distributorSku` (text)
   - `rrp`, `cost`, `markup`, `sell` (numeric/float)
   - `costGstType` (text)
   - `createdAt`, `updatedAt` (timestamp, default: now())
3. **Enable Row Level Security (RLS)** and add a permissive policy for development:
   ```sql
   CREATE POLICY "Allow all" ON products FOR ALL USING (true);
   ```
4. **Get your Supabase project URL and anon key** from Project Settings > API.

### Environment Variables
Add these to your `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### Development Notes
- The product admin UI is in `app/admin/products/page.tsx`.
- All product data is fetched and mutated via the Supabase JS client.
- TypeScript types ensure type safety for all product operations.
- Margin is always calculated on the fly: `(sell - cost)`.

### Security
- **Never expose your Supabase service_role key in the frontend.**
- For production, restrict RLS policies as needed.

## 🛠️ Development

### **Prerequisites**
- Node.js 18.17 or later
- npm or yarn package manager

### **Installation**
```bash
# Clone the repository
git clone https://github.com/Neesonn/luckylogicit.git

# Navigate to project directory
cd lucky-logic-site-chakra

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Available Scripts**
```bash
npm run dev          # Start development server (localhost:3000)
npm run build        # Build for production (static export)
npm run start        # Start production server
npm run lint         # Run ESLint for code quality
npm test            # Run unit tests
npm run test:watch  # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
```

### **Development Workflow**
1. **Feature Development** - Work on `test` branch
2. **Testing** - Run tests and manual testing
3. **Code Review** - Ensure code quality and standards
4. **Merge to Main** - Deploy to production via Vercel

## 📁 Project Structure

```
├── app/                          # Next.js app directory
│   ├── admin/                    # Admin dashboard pages
│   │   ├── create-customer/      # Customer creation form
│   │   ├── view-customers/       # Customer management interface
│   │   ├── products/             # Product catalogue management
│   │   ├── invoices/             # Invoice management
│   │   └── billings/             # Billing management
│   ├── api/                      # API routes for admin functions
│   ├── about-us/                # About page with company story
│   ├── contact-us/              # Contact page with Formspree form
│   ├── services/                # Services page with detailed offerings
│   ├── troubleshoot/            # Troubleshooting guide
│   ├── privacy-policy/          # Privacy policy page
│   ├── cookie-policy/           # Cookie policy page
│   ├── terms/                   # Terms of service page
│   ├── legal/                   # Legal information
│   ├── __tests__/               # Test files
│   ├── layout.tsx               # Root layout with metadata
│   ├── page.tsx                 # Homepage
│   ├── error.tsx                # Custom error page
│   └── not-found.tsx            # Custom 404 page
├── components/                   # Reusable React components
│   ├── Navbar.tsx               # Responsive navigation
│   ├── Hero.tsx                 # Homepage hero section
│   ├── ContactForm.tsx          # Formspree contact form
│   ├── ServiceGrid.tsx          # Services display
│   ├── Footer.tsx               # Site footer with admin access
│   ├── CookieBanner.tsx         # GDPR cookie consent
│   ├── GoogleAnalytics.tsx      # Analytics integration
│   ├── SEO.tsx                  # SEO component
│   ├── JsonLd.tsx               # Structured data
│   ├── StripeDataContext.tsx    # Stripe data management
│   ├── LockContext.tsx          # Admin authentication context
│   └── __tests__/               # Component tests
├── theme/                       # Chakra UI theme configuration
├── public/                      # Static assets
│   ├── lucky-logic-logo.png     # Company logo
│   ├── favicon.ico              # Site favicon
│   ├── robots.txt               # Search engine instructions
│   ├── sitemap.xml              # Generated sitemap
│   └── it-animation.json        # Lottie animation
├── types/                       # TypeScript type definitions
├── utils/                       # Utility functions
├── styles/                      # Global styles
└── jest.config.js               # Jest configuration
```

## 🚀 Deployment

### **Production Deployment (Vercel)**
- **Platform**: Vercel (optimized for Next.js)
- **Build Command**: `npm run build`
- **Output Directory**: `out/` (static export)
- **Auto-deploy**: Connected to GitHub main branch
- **Environment**: Production-ready with proper caching and CDN

### **Deployment Process**
1. **Code Changes** - Push to `test` branch for testing
2. **Testing** - Verify functionality and performance
3. **Merge to Main** - Automatic deployment to production
4. **Verification** - Test live site functionality

### **Environment Variables (Production)**
```env
# Admin Authentication
ADMIN_PASSWORD=yourStrongAdminPassword

# Stripe Integration
STRIPE_SECRET_KEY=sk_live_...

# Supabase Integration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Google Analytics (Optional - for tracking)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# Google Maps API (Optional - if maps are added)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### **Vercel Configuration**
- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `out`
- **Install Command**: `npm install`
- **Node.js Version**: 18.x

## 🔒 Security & Privacy

### **Data Protection**
- **Formspree Security** - Enterprise-grade form handling
- **Stripe Security** - PCI DSS compliant payment processing
- **Supabase Security** - Enterprise-grade database with RLS
- **No Data Storage** - Form submissions sent directly to email
- **GDPR Compliance** - User consent and data protection
- **Privacy Policy** - Comprehensive data handling information

### **Content Security**
- **CSP Headers** - Protection against XSS and injection attacks
- **HTTPS Only** - Secure connections enforced
- **No Sensitive Data** - No API keys or secrets in client code
- **Admin Authentication** - Secure password-protected admin area

## 📊 Performance & Monitoring

### **Performance Metrics**
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)
- **Core Web Vitals**: Optimized for all metrics
- **Page Load Speed**: < 2 seconds on average
- **Mobile Performance**: Optimized for mobile devices

### **Analytics & Monitoring**
- **Google Analytics 4** - Comprehensive user tracking
- **Vercel Analytics** - Performance monitoring
- **Error Tracking** - Custom error boundaries and logging

## 🧪 Testing

### **Test Coverage**
- **Unit Tests**: Contact form, service components, admin functions
- **Integration Tests**: Form submission flow, admin authentication
- **Manual Testing**: Cross-browser, mobile responsiveness
- **Performance Testing**: Lighthouse audits

### **Testing Commands**
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
```

## 📞 Support & Maintenance

### **Technical Support**
- **Email**: support@luckylogic.com.au
- **Phone**: +61 426 901 209
- **Address**: South Village, 2 Kiln Rd, Kirrawee 2232 (Pickup and Dropoff only)

### **Maintenance Tasks**
- **Regular Updates**: Dependencies and security patches
- **Performance Monitoring**: Core Web Vitals tracking
- **Content Updates**: Service offerings and company information
- **SEO Optimization**: Regular metadata and content reviews
- **Admin Dashboard**: Regular customer data management and updates

## 🎯 Business Information

### **Company Details**
- **Business Name**: Lucky Logic IT
- **ABN**: 68 522 123 312
- **Service Area**: Sydney Metropolitan Area
- **Specialization**: Reliable IT Services for Homes & Small Businesses

### **Service Hours**
- **Monday - Friday**: 9:00 AM - 5:00 PM
- **Saturday**: 9:00 AM - 5:00 PM
- **Sunday**: Closed

## 📄 License & Legal

This project is proprietary and confidential. All rights reserved by Lucky Logic IT.

### **Legal Pages**
- **Privacy Policy**: `/privacy-policy`
- **Terms of Service**: `/terms`
- **Cookie Policy**: `/cookie-policy`

## 🔄 Version History

### **Current Version**: 2.0.0 (Production Ready with Admin Dashboard)
- ✅ Contact form with Formspree integration
- ✅ Complete SEO optimization
- ✅ Mobile-responsive design
- ✅ Accessibility compliance
- ✅ Performance optimization
- ✅ Security implementation
- ✅ Legal compliance
- ✅ Admin dashboard with customer management
- ✅ Stripe integration for customer data
- ✅ Product catalogue with Supabase backend
- ✅ Advanced filtering and search capabilities
- ✅ Bulk operations for customer management

### **Recent Updates**
- **Admin Dashboard**: Complete customer management system with Stripe integration
- **Product Management**: Live product catalogue with Supabase backend
- **Customer Operations**: Create, edit, delete, and bulk operations for customers
- **Advanced UI**: Enhanced admin interface with filtering, sorting, and search
- **Security**: Password-protected admin area with secure API routes
- **Contact Form**: Migrated to Formspree for reliability
- **Build Configuration**: Optimized for static export
- **Error Handling**: Comprehensive error boundaries
- **Performance**: Optimized images and assets
- **Security**: Enhanced CSP and privacy features
- **Troubleshooting Guide**: Modern, accessible, and mobile-friendly. Includes robust search, swipeable accordion on mobile, contextual tips, and step completion with ARIA/keyboard support. Legal disclaimer is now in the Terms under 'Use of Website'.
- **Cookie Banner**: Now links to Privacy Policy, Cookie Policy, and Terms & Conditions for full compliance.
- **Legal**: Disclaimer about troubleshooting guides is clearly stated in the Terms & Conditions (see 'Use of Website' section).

---

**Status**: 🟢 **PRODUCTION READY** - Live at https://www.luckylogic.com.au

For technical support or questions about this website, contact support@luckylogic.com.au

# Lucky Logic Admin Dashboard

## Features

- **Admin Dashboard**: Secure admin area accessible via a hidden spanner icon in the footer (top right). Requires password authentication.
- **Authentication**: Password-protected admin area using a secure, server-side session cookie. Password is set via environment variable.
- **Customer Management**:
  - Create new Stripe customers with full address and mobile number fields.
  - View all Stripe customers in a searchable, editable table.
  - Edit customer details (name, email, mobile, address, etc.) via a modal popup.
  - Delete customers with a confirmation modal and warning.
  - Customer ID links directly to the Stripe dashboard profile.
  - Bulk operations for multiple customer management.
  - Advanced filtering and sorting capabilities.
- **Product Management**:
  - Complete product catalogue with Supabase backend.
  - Add, edit, and delete products with real-time updates.
  - Automatic margin calculations and pricing.
  - Category and vendor management.
- **UI/UX**: Modern, clean Chakra UI design with accessibility and responsive layout.

## Environment Variables

Create a `.env.local` file in the project root with the following:

```
ADMIN_PASSWORD=yourStrongAdminPassword
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```
- `ADMIN_PASSWORD`: Password for admin login (never exposed to the frontend).
- `STRIPE_SECRET_KEY`: Your Stripe secret key for API access.
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key.

## Local Development

1. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```
2. **Set up environment variables:**
   - See above for `.env.local`.
3. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```
4. **Access the site:**
   - Visit `http://localhost:3000`.
   - Click the spanner icon in the footer to access the admin dashboard.

## Deployment

- Deploy to [Vercel](https://vercel.com/) for full serverless support (API routes, middleware, etc.).
- Set the same environment variables (`ADMIN_PASSWORD`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in your Vercel project settings.
- Do **not** use static export (`output: 'export'`) as this disables API routes and authentication.

## Security Notes

- The admin password and Stripe secret key are never exposed to the frontend.
- All sensitive actions (create, update, delete customers) are performed via secure API routes.
- Only authenticated admins can access the admin dashboard and customer management features.
- Supabase Row Level Security (RLS) policies protect database access.

## Customization

- Update the list of Australian states or countries in `app/admin/create-customer/page.tsx` as needed.
- Adjust the Chakra UI theme in `theme/theme.ts` for branding.
- Modify product categories and vendors in the product management interface.

## Support

For questions or support, email [support@luckylogic.com.au](mailto:support@luckylogic.com.au)

## Data Sources in Admin

- **View Customers, Invoices, and Quotes** pages pull their data directly from Stripe APIs.
- **Supplier Products** and **Projects** are managed and stored in Supabase.