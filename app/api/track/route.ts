import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../../utils/rateLimiter';

export async function GET(request: NextRequest) {
  const ip = typeof window === 'undefined' ? (globalThis as any).ip || 'unknown' : 'unknown';
  if (rateLimiter.isRateLimited(`track-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const tracking = searchParams.get('tracking');
    const carrier = searchParams.get('carrier');
    if (!tracking) {
      return NextResponse.json({ success: false, error: 'Missing tracking number' }, { status: 400 });
    }

    const endpoint = carrier
      ? `https://api.aftership.com/v4/trackings/${carrier}/${tracking}`
      : `https://api.aftership.com/v4/trackings/auto/${tracking}`;

    const response = await fetch(endpoint, {
      headers: {
        'aftership-api-key': process.env.AFTERSHIP_API_KEY!,
        'Content-Type': 'application/json'
      },
    });
    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ success: false, error: data.meta?.message || 'API error' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      tracking: data.data.tracking
    });

  } catch (error: any) {
    console.error('AfterShip tracking error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Failed to track package' }, { status: 500 });
  }
} 