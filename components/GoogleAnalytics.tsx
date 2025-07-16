'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('GA loaded? CookieConsent:', localStorage.getItem('cookieConsent'));
    }
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setHasConsent(true);
    }
  }, []);

  const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

  if (!hasConsent || !GA_ID) return null;

  return (
    <>
      <Script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
      <Script id="ga-setup">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
