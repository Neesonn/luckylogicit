import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;
const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const EMAIL_FROM = 'Lucky Logic <no-reply@luckylogic.com.au>';

export async function POST(req: Request) {
  const { email, invoiceNumber } = await req.json();

  const token = jwt.sign(
    { email, invoiceNumber },
    JWT_SECRET,
    { expiresIn: '10m' }
  );

  const magicLink = `https://luckylogic.com.au/invoice-access?token=${token}`;

  const emailRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: email,
      subject: '🔐 Access Your Lucky Logic Invoice',
      html: `
        <p>Hello,</p>
        <p>You requested access to your invoice.</p>
        <p><a href="${magicLink}" style="padding:10px 20px; background:#4a90e2; color:white; text-decoration:none; border-radius:5px;">View Invoice</a></p>
        <p>This link will expire in 10 minutes.</p>
      `,
    }),
  });

  if (!emailRes.ok) {
    const error = await emailRes.text();
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 