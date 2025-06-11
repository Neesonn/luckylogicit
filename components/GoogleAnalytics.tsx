'use client';
import Script from 'next/script';
import { useEffect, useState } from 'react';

export default function GoogleAnalytics() {
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (consent === 'true') {
      setHasConsent(true);
    }
  }, []);

  if (!hasConsent) return null;

  return (
    <>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-88W370Y84T" />
      <Script id="ga-setup">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-88W370Y84T');
        `}
      </Script>
    </>
  );
}
