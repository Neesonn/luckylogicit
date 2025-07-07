import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import rateLimiter from '../../../utils/rateLimiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function POST(req: NextRequest) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`create-stripe-product-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }
  
  try {
    const { name, description, amount, include_tax, active } = await req.json();
    
    if (!name || !amount) {
      return NextResponse.json({ success: false, error: 'Name and amount are required' }, { status: 400 });
    }

    // Create the product
    const product = await stripe.products.create({
      name,
      description,
      active,
      metadata: {
        include_tax: include_tax.toString(),
        tax_code: 'txcd_1234567890', // General - Services
      },
    });

    // If product is inactive, archive it in Stripe
    if (!active) {
      await stripe.products.update(product.id, { active: false });
    }

    // Create the price for the product
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(parseFloat(amount) * 100), // Convert to cents
      currency: 'aud',
      tax_behavior: include_tax ? 'inclusive' : 'exclusive',
    });

    // Update the product to set the default price
    const updatedProduct = await stripe.products.update(product.id, {
      default_price: price.id,
    });

    return NextResponse.json({ 
      success: true, 
      product: updatedProduct,
      price: price
    });
  } catch (error: any) {
    console.error('Stripe product creation error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
} 