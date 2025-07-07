import React, { createContext, useContext, useState, useEffect } from 'react';

type StripeData = {
  customers: any[] | null;
  invoices: any[] | null;
  quotes: any[] | null;
  products: any[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const StripeDataContext = createContext<StripeData | undefined>(undefined);

export function StripeDataProvider({ children }: { children: React.ReactNode }) {
  const [customers, setCustomers] = useState<any[] | null>(null);
  const [invoices, setInvoices] = useState<any[] | null>(null);
  const [quotes, setQuotes] = useState<any[] | null>(null);
  const [products, setProducts] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [custRes, invRes, quotesRes, productsRes] = await Promise.all([
        fetch('/api/list-stripe-customers').then(r => r.json()),
        fetch('/api/list-stripe-invoices').then(r => r.json()),
        fetch('/api/list-stripe-quotes').then(r => r.json()),
        fetch('/api/list-stripe-products').then(r => r.json()),
      ]);
      if (custRes.success) setCustomers(custRes.customers);
      else setError(custRes.error || 'Failed to fetch customers.');
      if (invRes.success) setInvoices(invRes.invoices);
      else setError(invRes.error || 'Failed to fetch invoices.');
      if (quotesRes.success) setQuotes(quotesRes.quotes);
      else setError(quotesRes.error || 'Failed to fetch quotes.');
      if (productsRes.success) setProducts(productsRes.products);
      else setError(productsRes.error || 'Failed to fetch products.');
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
    quotes,
    products,
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