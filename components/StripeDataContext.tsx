import React, { createContext, useContext, useState, useEffect } from 'react';

type StripeData = {
  customers: any[] | null;
  invoices: any[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const StripeDataContext = createContext<StripeData | undefined>(undefined);

export function StripeDataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<any[] | null>(null);
  const [invoices, setInvoices] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [custRes, invRes] = await Promise.all([
        fetch('/api/list-stripe-customers').then(r => r.json()),
        fetch('/api/list-stripe-invoices').then(r => r.json()),
      ]);
      if (custRes.success) setCustomers(custRes.customers);
      else setError(custRes.error || 'Failed to fetch customers.');
      if (invRes.success) setInvoices(invRes.invoices);
      else setError(invRes.error || 'Failed to fetch invoices.');
    } catch (e) {
      setError('Failed to fetch Stripe data.');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const value: StripeData = {
    customers,
    invoices,
    loading,
    error,
    refresh: fetchData,
  };

  return (
    <StripeDataContext.Provider value={value}>
      {children}
    </StripeDataContext.Provider>
  );
}

export function useStripeData() {
  const ctx = useContext(StripeDataContext);
  if (!ctx) throw new Error('useStripeData must be used within a StripeDataProvider');
  return ctx;
} 