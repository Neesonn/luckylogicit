import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const JWT_SECRET = process.env.JWT_SECRET!;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get('token');

  if (!token) return NextResponse.json({ error: 'Missing token' }, { status: 400 });

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string, invoiceNumber: string };

    const invoices = await stripe.invoices.list({ limit: 100 }); // Use filters in production
    const invoice = invoices.data.find(
      inv => inv.number === decoded.invoiceNumber && inv.customer_email === decoded.email
    );

    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });

    return NextResponse.json({ invoice }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }
} 