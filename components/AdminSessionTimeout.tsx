import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const INACTIVITY_LIMIT = 10 * 60 * 1000; // 10 minutes in ms

export default function AdminSessionTimeout() {
  const router = useRouter();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Logout and redirect
  const handleLogout = async () => {
    await fetch('/api/admin-logout', { method: 'POST' });
    router.push('/admin/login');
  };

  // Reset inactivity timer
  const resetTimer = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(handleLogout, INACTIVITY_LIMIT);
  };

  useEffect(() => {
    // Activity events
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer(); // Start timer on mount
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
} 