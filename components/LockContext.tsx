import React, { createContext, useContext, useState, useEffect } from 'react';

interface LockContextType {
  metricsLocked: boolean;
  setMetricsLocked: (locked: boolean) => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: React.ReactNode }) {
  const [metricsLocked, setMetricsLocked] = useState(true);

  // Load initial state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('metricsLocked');
    if (savedState !== null) {
      setMetricsLocked(JSON.parse(savedState));
    }
  }, []);

  // Update localStorage when state changes
  const handleSetMetricsLocked = (locked: boolean) => {
    setMetricsLocked(locked);
    localStorage.setItem('metricsLocked', JSON.stringify(locked));
  };

  return (
    <LockContext.Provider value={{ metricsLocked, setMetricsLocked: handleSetMetricsLocked }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLock() {
  const context = useContext(LockContext);
  if (!context) throw new Error('useLock must be used within a LockProvider');
  return context;
} 