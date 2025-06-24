/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.crisp.chat https://www.googletagmanager.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/;
    style-src 'self' 'unsafe-inline' https://*.crisp.chat https://fonts.googleapis.com;
    img-src 'self' data: https://*.crisp.chat https://www.google-analytics.com https://www.googletagmanager.com https://www.gstatic.com/recaptcha/ https://www.google.com/recaptcha/;
    font-src 'self' https://fonts.gstatic.com https://client.crisp.chat;
    connect-src 'self' https://*.crisp.chat wss://*.crisp.chat https://www.google-analytics.com https://formspree.io/ https://www.google.com/;
    frame-src 'self' https://*.crisp.chat https://www.google.com/recaptcha/;
    worker-src 'self' blob:;
    media-src 'self' https://*.crisp.chat;
`.replace(/\s{2,}/g, ' ').trim();

const nextConfig = {
    // output: 'export', // Disabled to allow API routes and middleware
    images: {
      unoptimized: true,
    },
    async headers() {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'Content-Security-Policy',
              value: cspHeader,
            },
          ],
        },
      ]
    },
  };
  
  module.exports = nextConfig;
  