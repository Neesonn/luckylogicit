import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import rateLimiter from '../../../utils/rateLimiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function GET(req: NextRequest) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`list-stripe-quotes-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const customerParam = searchParams.get('customer');
    const quotes = await stripe.quotes.list({ limit: 100, expand: ['data.customer'] });
    
    // Map to include customer name/email and other details for each quote
    const quoteData = await Promise.all(quotes.data.map(async quote => {
      let customerId = '';
      let customerName = '';
      let customerEmail = '';
      let customerAddress = null;
      
      if (quote.customer && typeof quote.customer === 'object' && 'id' in quote.customer && !('deleted' in quote.customer && quote.customer.deleted)) {
        customerId = quote.customer.id;
        customerName = (quote.customer as any).name || '';
        customerEmail = (quote.customer as any).email || '';
        customerAddress = (quote.customer as any).address || null;
      } else if (typeof quote.customer === 'string') {
        customerId = quote.customer;
      }
      
      // Fetch line items
      let lines: any[] = [];
      if (quote.id) {
        try {
          const lineRes = await stripe.quotes.listLineItems(quote.id as string, { limit: 100 });
          lines = lineRes.data.map(item => ({
            description: item.description,
            amount: (item as any).amount,
            quantity: item.quantity,
          }));
        } catch {}
      }
      
      return {
        id: quote.id,
        number: quote.number,
        customer: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_address: customerAddress,
        created: quote.created,
        expires_at: quote.expires_at,
        amount_total: quote.amount_total,
        status: quote.status,
        hosted_quote_url: (quote as any).hosted_quote_url,
        lines,
        description: quote.description,
        footer: quote.footer,
        header: quote.header,
        terms: (quote as any).terms,
        total_details: quote.total_details,
      };
    }));
    
    // Filter by customer if provided
    const filteredQuotes = customerParam
      ? quoteData.filter(q => q.customer === customerParam)
      : quoteData;
    
    return NextResponse.json({ success: true, quotes: filteredQuotes });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const { quoteId, notes } = await req.json();
  if (!quoteId) {
    return NextResponse.json({ success: false, error: 'Missing quoteId' }, { status: 400 });
  }
  try {
    const updated = await stripe.quotes.update(quoteId, { description: notes });
    return NextResponse.json({ success: true, quote: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
} 