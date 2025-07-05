import { NextRequest, NextResponse } from 'next/server';
import { RateLimiter, RATE_LIMITS, getClientIdentifier } from './utils/rateLimit';

// Initialize rate limiters
const magicLinkLimiter = new RateLimiter(RATE_LIMITS.MAGIC_LINK);
const verifyInvoiceLimiter = new RateLimiter(RATE_LIMITS.VERIFY_INVOICE);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    const authCookie = request.cookies.get('admin-auth');
    if (authCookie?.value !== 'true') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // Rate limiting for API endpoints
  if (pathname === '/api/send-magic-link') {
    const clientId = getClientIdentifier(request);
    const result = await magicLinkLimiter.checkLimit(clientId);
    
    if (!result.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.MAGIC_LINK.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_LIMITS.MAGIC_LINK.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    return response;
  }

  if (pathname === '/api/verify-invoice') {
    const clientId = getClientIdentifier(request);
    const result = await verifyInvoiceLimiter.checkLimit(clientId);
    
    if (!result.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded. Please try again later.',
          retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': RATE_LIMITS.VERIFY_INVOICE.maxRequests.toString(),
            'X-RateLimit-Remaining': result.remaining.toString(),
            'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
            'Retry-After': Math.ceil((result.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // Add rate limit headers to successful requests
    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', RATE_LIMITS.VERIFY_INVOICE.maxRequests.toString());
    response.headers.set('X-RateLimit-Remaining', result.remaining.toString());
    response.headers.set('X-RateLimit-Reset', new Date(result.resetTime).toISOString());
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/send-magic-link',
    '/api/verify-invoice'
  ],
}; 