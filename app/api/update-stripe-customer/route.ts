export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  const { id, name, email, phone, address } = await req.json();
  try {
    const customer = await stripe.customers.update(id, {
      name,
      email,
      phone,
      address: {
        ...address,
        line2: address?.line2 || undefined,
      },
    });
    return NextResponse.json({ success: true, customer });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
} 