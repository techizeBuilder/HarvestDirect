/**
 * Simple in-memory rate limiter
 * For production use, consider using redis-based rate limiting
 */

const requests = new Map();

export const rateLimiter = (windowMs = 15 * 60 * 1000, maxRequests = 100) => {
  return (req, res, next) => {
    const clientIp = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean up old entries
    for (const [ip, timestamps] of requests.entries()) {
      const validTimestamps = timestamps.filter(time => time > windowStart);
      if (validTimestamps.length === 0) {
        requests.delete(ip);
      } else {
        requests.set(ip, validTimestamps);
      }
    }

    // Get current client's requests
    const clientRequests = requests.get(clientIp) || [];
    const recentRequests = clientRequests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }

    // Add current request
    recentRequests.push(now);
    requests.set(clientIp, recentRequests);

    next();
  };
};

// Specific rate limiters
export const authRateLimit = rateLimiter(15 * 60 * 1000, 5); // 5 requests per 15 minutes for auth
export const generalRateLimit = rateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes general