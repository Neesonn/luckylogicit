import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const { password } = await req.json();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password === adminPassword) {
    const response = NextResponse.json({ success: true });
    response.cookies.set('admin-auth', 'true', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 day
    });
    return response;
  } else {
    return NextResponse.json({ success: false, message: 'Invalid password' }, { status: 401 });
  }
} 