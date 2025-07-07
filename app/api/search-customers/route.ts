export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import rateLimiter from '../../../utils/rateLimiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function GET(request: NextRequest) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`search-customers-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('name') || searchParams.get('email') || searchParams.get('query') || '';
    
    if (!query.trim()) {
      return NextResponse.json({ success: true, customers: [] });
    }

    // Search by name or email using Stripe's search functionality
    const customers = await stripe.customers.list({
      limit: 10,
      // Stripe doesn't have built-in search, so we'll filter client-side
    });

    // Filter customers by name or email
    const filteredCustomers = customers.data.filter(customer => {
      const searchLower = query.toLowerCase();
      return (
        (customer.name && customer.name.toLowerCase().includes(searchLower)) ||
        (customer.email && customer.email.toLowerCase().includes(searchLower)) ||
        (customer.phone && customer.phone.includes(query))
      );
    });

    return NextResponse.json({ 
      success: true, 
      customers: filteredCustomers.slice(0, 10) // Limit to 10 results
    });
  } catch (error: any) {
    console.error('Error searching customers:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Failed to search customers' 
    }, { status: 400 });
  }
} 