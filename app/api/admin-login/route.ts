import { NextRequest, NextResponse } from 'next/server';
import rateLimiter from '../../../utils/rateLimiter';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'unknown';
  if (rateLimiter.isRateLimited(`admin-login-${ip}`)) {
    return NextResponse.json({ success: false, message: 'Too many login attempts. Please try again later.' }, { status: 429 });
  }
  const { username, password } = await req.json();
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (username === adminUsername && password === adminPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    // Optionally set username cookie (not httpOnly)
    response.cookies.set('admin-username', username, {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    });
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Invalid username or password' }, { status: 401 });
  }
} 