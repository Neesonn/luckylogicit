import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  const response = await fetch('https://api.aftership.com/v4/trackings', {
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
    shipments: data.data.trackings
  });
} 