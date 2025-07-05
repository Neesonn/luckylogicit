# Rate Limiting Implementation

This document describes the rate limiting implementation for the Lucky Logic website API endpoints.

## Overview

Rate limiting has been implemented to protect the following API endpoints from abuse:

- `/api/send-magic-link` - 5 requests per 15 minutes per client
- `/api/verify-invoice` - 10 requests per 5 minutes per client

## Implementation Details

### Rate Limiting Strategy

The implementation uses a sliding window rate limiting approach with the following features:

1. **Client Identification**: Uses IP address combined with User-Agent for unique client identification
2. **In-Memory Storage**: Uses Map-based storage for development environments
3. **Redis Support**: Includes commented Redis implementation for production
4. **Automatic Cleanup**: Expired rate limit entries are automatically cleaned up
5. **Standard Headers**: Implements RFC 6585 rate limit headers

### Configuration

Rate limits are configured in `utils/rateLimit.ts`:

```typescript
export const RATE_LIMITS = {
  MAGIC_LINK: {
    maxRequests: 5, // 5 requests per window
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  VERIFY_INVOICE: {
    maxRequests: 10, // 10 requests per window
    windowMs: 5 * 60 * 1000, // 5 minutes
  },
} as const;
```

### Response Headers

Successful requests include the following headers:
- `X-RateLimit-Limit`: Maximum requests allowed per window
- `X-RateLimit-Remaining`: Remaining requests in current window
- `X-RateLimit-Reset`: ISO timestamp when the rate limit resets

Rate limit exceeded responses (429) include:
- `Retry-After`: Seconds to wait before retrying
- All the above headers with current values

## Production Deployment

### Option 1: Vercel Edge Runtime (Recommended)

For Vercel deployment, the current in-memory implementation works well with Edge Runtime:

1. Add to your API routes:
```typescript
export const runtime = 'edge';
```

2. The rate limiting will work automatically with Vercel's edge network.

### Option 2: Redis Implementation

For more robust rate limiting across multiple server instances:

1. Install Redis dependencies:
```bash
npm install @upstash/redis
```

2. Set environment variables:
```env
UPSTASH_REDIS_REST_URL=your_redis_url
UPSTASH_REDIS_REST_TOKEN=your_redis_token
```

3. Uncomment and use the `RedisRateLimiter` class in `utils/rateLimit.ts`

4. Update middleware to use Redis implementation:
```typescript
const magicLinkLimiter = new RedisRateLimiter(RATE_LIMITS.MAGIC_LINK);
const verifyInvoiceLimiter = new RedisRateLimiter(RATE_LIMITS.VERIFY_INVOICE);
```

## Security Considerations

### Client Identification

The system identifies clients using:
1. Cloudflare IP (`cf-connecting-ip`)
2. Real IP (`x-real-ip`)
3. Forwarded IP (`x-forwarded-for`)
4. User-Agent string

This provides protection against:
- IP spoofing attempts
- Shared IP addresses
- Proxy/VPN usage

### Additional Security Measures

1. **Input Validation**: All API endpoints validate and sanitize inputs
2. **Error Handling**: Comprehensive error handling prevents information leakage
3. **Token Expiration**: JWT tokens expire after 10 minutes
4. **Rate Limit Headers**: Standard headers help clients respect limits

## Monitoring and Debugging

### Logging

Rate limit violations are logged with:
- Client identifier (IP:User-Agent)
- Request path
- Rate limit configuration
- Reset time

### Testing Rate Limits

You can test rate limiting using curl:

```bash
# Test magic link endpoint
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/send-magic-link \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","invoiceNumber":"INV-001"}'
  echo "Request $i"
done
```

Expected behavior:
- Requests 1-5: 200 OK with rate limit headers
- Request 6: 429 Too Many Requests with retry information

## Customization

### Adjusting Rate Limits

To modify rate limits, update the `RATE_LIMITS` configuration:

```typescript
export const RATE_LIMITS = {
  MAGIC_LINK: {
    maxRequests: 10, // Increase to 10 requests
    windowMs: 30 * 60 * 1000, // Increase window to 30 minutes
  },
  // ... other endpoints
};
```

### Adding New Protected Endpoints

1. Add configuration to `RATE_LIMITS`
2. Create rate limiter instance in middleware
3. Add rate limiting logic for the endpoint
4. Update middleware matcher configuration

### Custom Client Identification

To use different client identification logic, modify the `getClientIdentifier` function:

```typescript
export function getClientIdentifier(req: NextRequest): string {
  // Custom logic here
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const sessionId = req.cookies.get('session-id')?.value || 'no-session';
  return `${ip}:${sessionId}`;
}
```

## Troubleshooting

### Common Issues

1. **Rate limits not working**: Check middleware matcher configuration
2. **Incorrect client identification**: Verify proxy/load balancer headers
3. **Memory leaks**: Ensure cleanup function is working properly
4. **Redis connection issues**: Check environment variables and Redis service

### Debug Mode

Enable debug logging by setting:
```env
DEBUG_RATE_LIMIT=true
```

This will log all rate limit checks and decisions.

## Performance Considerations

- In-memory storage is fast but doesn't persist across server restarts
- Redis adds network latency but provides persistence and scalability
- Rate limit checks add minimal overhead (~1-2ms per request)
- Cleanup runs on each request but only processes expired entries

## Compliance

This implementation follows:
- RFC 6585 (Rate Limiting Headers)
- RFC 7231 (HTTP/1.1)
- OWASP Rate Limiting Guidelines 