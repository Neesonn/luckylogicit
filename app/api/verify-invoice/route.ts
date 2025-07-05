import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Validate token format (basic check)
    if (token.length < 10) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 400 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { email: string, invoiceNumber: string };

    // Validate decoded data
    if (!decoded.email || !decoded.invoiceNumber) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedEmail = decoded.email.toLowerCase().trim();
    const sanitizedInvoiceNumber = decoded.invoiceNumber.toString().trim();

    const invoices = await stripe.invoices.list({ limit: 100 }); // Use filters in production
    const invoice = invoices.data.find(
      inv => inv.number === sanitizedInvoiceNumber && inv.customer_email === sanitizedEmail
    );

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json({ invoice }, { status: 200 });
  } catch (err: any) {
    console.error('Error in verify-invoice:', err);
    
    if (err.name === 'TokenExpiredError') {
      return NextResponse.json({ error: 'Token has expired' }, { status: 401 });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 