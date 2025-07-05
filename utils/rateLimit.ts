import { NextRequest } from 'next/server';

// In-memory store for development (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  private cleanup(): void {
    const now = Date.now();
    rateLimitStore.forEach((value, key) => {
      if (now > value.resetTime) {
        rateLimitStore.delete(key);
      }
    });
  }

  async checkLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    this.cleanup();
    
    const key = this.getKey(identifier);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    const current = rateLimitStore.get(key);
    
    if (!current || now > current.resetTime) {
      // First request or window expired
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - 1,
        resetTime: now + this.config.windowMs,
      };
    }
    
    if (current.count >= this.config.maxRequests) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }
    
    // Increment count
    current.count++;
    rateLimitStore.set(key, current);
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - current.count,
      resetTime: current.resetTime,
    };
  }
}

// Rate limit configurations
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

// Helper function to get client identifier
export function getClientIdentifier(req: NextRequest): string {
  // Try to get real IP from various headers
  const forwarded = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  
  const ip = cfConnectingIp || realIp || forwarded?.split(',')[0] || 'unknown';
  
  // For additional security, you can combine IP with user agent
  const userAgent = req.headers.get('user-agent') || 'unknown';
  
  return `${ip}:${userAgent}`;
}

// Production-ready Redis implementation (uncomment when using Redis)
/*
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export class RedisRateLimiter {
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  private getKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  async checkLimit(identifier: string): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
  }> {
    const key = this.getKey(identifier);
    const now = Date.now();
    const windowStart = now - this.config.windowMs;
    
    // Get current count from Redis
    const current = await redis.get<number>(key) || 0;
    
    if (current >= this.config.maxRequests) {
      // Get TTL to know when the key expires
      const ttl = await redis.ttl(key);
      const resetTime = now + (ttl * 1000);
      
      return {
        allowed: false,
        remaining: 0,
        resetTime,
      };
    }
    
    // Increment count with expiration
    await redis.incr(key);
    await redis.expire(key, Math.ceil(this.config.windowMs / 1000));
    
    return {
      allowed: true,
      remaining: this.config.maxRequests - current - 1,
      resetTime: now + this.config.windowMs,
    };
  }
}
*/ 