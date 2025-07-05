import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  const { email, invoiceNumber } = await req.json();

  try {
    // You may want to filter smarter in production (e.g. by customer, created, etc.)
    const invoices = await stripe.invoices.list({ limit: 100 });

    const invoice = invoices.data.find(
      inv => inv.number === invoiceNumber && inv.customer_email === email
    );

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    // Only return safe fields
    return NextResponse.json({
      invoice: {
        id: invoice.id,
        number: invoice.number,
        amount_due: invoice.amount_due,
        status: invoice.status,
        hosted_invoice_url: invoice.hosted_invoice_url,
        invoice_pdf: invoice.invoice_pdf,
        customer_email: invoice.customer_email,
        created: invoice.created,
        due_date: invoice.due_date,
      }
    }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 