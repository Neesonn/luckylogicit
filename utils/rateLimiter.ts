interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private readonly windowMs: number;
  private readonly maxRequests: number;

  constructor(windowMs: number = 3600000, maxRequests: number = 5) {
    this.windowMs = windowMs; // Default: 1 hour
    this.maxRequests = maxRequests; // Default: 5 requests per hour
  }

  isRateLimited(key: string): boolean {
    // === DEVELOPMENT ONLY: DISABLE RATE LIMITING ===
    return false;
    // === END DEVELOPMENT ONLY ===
    // const now = Date.now();
    // const record = this.store[key];
    // if (!record) {
    //   this.store[key] = {
    //     count: 1,
    //     resetTime: now + this.windowMs,
    //   };
    //   return false;
    // }
    // if (now > record.resetTime) {
    //   this.store[key] = {
    //     count: 1,
    //     resetTime: now + this.windowMs,
    //   };
    //   return false;
    // }
    // if (record.count >= this.maxRequests) {
    //   return true;
    // }
    // record.count += 1;
    // return false;
  }

  getRemainingTime(key: string): number {
    const record = this.store[key];
    if (!record) return 0;
    return Math.max(0, record.resetTime - Date.now());
  }
}

// Create a singleton instance
const rateLimiter = new RateLimiter();

export default rateLimiter; 