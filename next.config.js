/** @type {import('next').NextConfig} */

const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://client.crisp.chat https://www.googletagmanager.com;
    style-src 'self' 'unsafe-inline' https://client.crisp.chat;
    img-src 'self' data: https://image.crisp.chat https://client.crisp.chat https://www.google-analytics.com https://www.googletagmanager.com;
    font-src 'self' https://client.crisp.chat;
    connect-src 'self' https://client.crisp.chat https://storage.crisp.chat wss://client.relay.crisp.chat wss://stream.relay.crisp.chat https://www.google-analytics.com;
    frame-src 'self' https://game.crisp.chat;
    worker-src 'self' blob:;
    media-src 'self' https://client.crisp.chat;
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
  