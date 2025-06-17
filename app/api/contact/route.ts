import { NextResponse } from 'next/server';
import rateLimiter from '@/utils/rateLimiter';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const isRateLimited = rateLimiter.isRateLimited(ip);

    if (isRateLimited) {
      const remainingTime = rateLimiter.getRemainingTime(ip);
      const minutes = Math.ceil(remainingTime / 60000);
      
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${minutes} minute${minutes !== 1 ? 's' : ''}.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { name, email, message } = body;

    // Basic validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Please fill in all fields.' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please enter a valid email address.' },
        { status: 400 }
      );
    }

    // Here you would typically send the email
    // For now, we'll just simulate a successful submission
    console.log('Contact form submission:', { name, email, message });

    return NextResponse.json(
      { message: 'Thank you for your message. We will get back to you soon.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
} 