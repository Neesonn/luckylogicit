import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import rateLimiter from '../../../utils/rateLimiter';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export async function GET() {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`list-stripe-products-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }
  try {
    const products = await stripe.products.list({ limit: 100, expand: ['data.default_price'] });
    
    // Map to include pricing and other details for each product
    const productData = await Promise.all(products.data.map(async product => {
      let defaultPrice = null;
      let priceAmount = 0;
      let priceCurrency = 'aud';
      
      if (product.default_price && typeof product.default_price === 'object') {
        defaultPrice = product.default_price;
        priceAmount = (defaultPrice as any).unit_amount || 0;
        priceCurrency = (defaultPrice as any).currency || 'aud';
      } else if (product.default_price && typeof product.default_price === 'string') {
        // If default_price is a string ID, fetch the price
        try {
          const price = await stripe.prices.retrieve(product.default_price);
          priceAmount = price.unit_amount || 0;
          priceCurrency = price.currency || 'aud';
        } catch (error) {
          console.error('Error fetching price:', error);
        }
      }
      
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        active: product.active,
        created: product.created,
        updated: product.updated,
        metadata: product.metadata,
        images: product.images,
        default_price: defaultPrice,
        price_amount: priceAmount,
        price_currency: priceCurrency,
        price_formatted: priceAmount > 0 ? `${priceCurrency.toUpperCase() === 'AUD' ? 'A$' : '$'}${(priceAmount / 100).toFixed(2)}` : 'No price set',
        category: product.metadata?.category || 'Uncategorized',
        vendor: product.metadata?.vendor || 'Unknown',
        sku: product.metadata?.sku || '',
        distributor: product.metadata?.distributor || '',
        distributor_sku: product.metadata?.distributor_sku || '',
        rrp: product.metadata?.rrp ? parseFloat(product.metadata.rrp) : 0,
        cost: product.metadata?.cost ? parseFloat(product.metadata.cost) : 0,
        markup: product.metadata?.markup ? parseFloat(product.metadata.markup) : 0,
        sell: priceAmount > 0 ? priceAmount / 100 : 0,
      };
    }));
    
    return NextResponse.json({ success: true, products: productData });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

export async function POST(req: NextRequest) {
  const { productId, metadata, active } = await req.json();
  if (!productId) {
    return NextResponse.json({ success: false, error: 'Missing productId' }, { status: 400 });
  }
  try {
    const updated = await stripe.products.update(productId, { 
      metadata,
      active: active !== undefined ? active : true // Default to active if not specified
    });
    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
} 