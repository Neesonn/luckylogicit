import React, { createContext, useContext, useState } from 'react';

interface LockContextType {
  metricsLocked: boolean;
  setMetricsLocked: (locked: boolean) => void;
}

const LockContext = createContext<LockContextType | undefined>(undefined);

export function LockProvider({ children }: { children: React.ReactNode }) {
  const [metricsLocked, setMetricsLocked] = useState(true);
  return (
    <LockContext.Provider value={{ metricsLocked, setMetricsLocked }}>
      {children}
    </LockContext.Provider>
  );
}

export function useLock() {
  const context = useContext(LockContext);
  if (!context) throw new Error('useLock must be used within a LockProvider');
  return context;
} 