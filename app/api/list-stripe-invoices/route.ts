import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import rateLimiter from '../../../utils/rateLimiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function GET() {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`list-stripe-invoices-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }
  try {
    const invoices = await stripe.invoices.list({ limit: 20, expand: ['data.customer', 'data.quote'] });
    // Map to include customer name/email and billing/shipping for each invoice
    const invoiceData = await Promise.all(invoices.data.map(async inv => {
      let customerId = '';
      let customerName = '';
      let customerEmail = '';
      let customerAddress = null;
      let customerShipping = null;
      if (inv.customer && typeof inv.customer === 'object' && 'id' in inv.customer && !('deleted' in inv.customer && inv.customer.deleted)) {
        customerId = inv.customer.id;
        customerName = (inv.customer as any).name || '';
        customerEmail = (inv.customer as any).email || '';
        customerAddress = (inv.customer as any).address || null;
        customerShipping = (inv.customer as any).shipping || null;
      } else if (typeof inv.customer === 'string') {
        customerId = inv.customer;
      }
      // Fetch line items
      let lines: any[] = [];
      if (inv.id) {
        try {
          const lineRes = await stripe.invoices.listLineItems(inv.id as string, { limit: 100 });
          lines = lineRes.data.map(item => ({
            description: item.description,
            amount: item.amount,
            quantity: item.quantity,
          }));
        } catch {}
      }
      // Fetch payment history
      let payments: any[] = [];
      const piId = (inv as any).payment_intent;
      if (piId) {
        try {
          const pi = await stripe.paymentIntents.retrieve(typeof piId === 'string' ? piId : piId.id);
          if (pi && (pi as any).charges && (pi as any).charges.data && (pi as any).charges.data.length > 0) {
            payments = (pi as any).charges.data.map((charge: any) => ({
              date: charge.created,
              amount: charge.amount,
              status: charge.status,
            }));
          }
        } catch {}
      }
      let quoteId = null;
      let quoteNumber = null;
      const quote = (inv as any).quote;
      if (quote) {
        if (typeof quote === 'object' && quote !== null) {
          quoteId = quote.id || null;
          quoteNumber = quote.number || null;
        } else if (typeof quote === 'string') {
          quoteId = quote;
          // Fetch the quote object to get the number
          try {
            const quoteObj = await stripe.quotes.retrieve(quoteId);
            quoteNumber = (quoteObj as any).number || quoteId;
          } catch {
            quoteNumber = quoteId;
          }
        }
      }
      return {
        id: inv.id,
        number: inv.number,
        customer: customerId,
        customer_name: customerName,
        customer_email: customerEmail,
        customer_address: inv.customer_address || customerAddress,
        customer_shipping: inv.customer_shipping || customerShipping,
        shipping_details: inv.shipping_details || null,
        created: inv.created,
        due_date: inv.due_date,
        amount_due: inv.amount_due,
        status: inv.status,
        hosted_invoice_url: inv.hosted_invoice_url,
        lines,
        payments,
        quote_id: quoteId,
        quote_number: quoteNumber,
      };
    }));
    return NextResponse.json({ success: true, invoices: invoiceData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const { invoiceId, notes } = await req.json();
  if (!invoiceId) {
    return NextResponse.json({ success: false, error: 'Missing invoiceId' }, { status: 400 });
  }
  try {
    const updated = await stripe.invoices.update(invoiceId, { description: notes });
    return NextResponse.json({ success: true, invoice: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
} 