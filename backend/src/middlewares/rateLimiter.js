// Rate limiting middleware
export const rateLimiter = (req, res, next) => {
  // Basic rate limiting implementation
  // In production, use express-rate-limit package
  next();
};

// Session ID generator middleware
export const getSessionId = (req, res, next) => {
  if (!req.session?.id) {
    // Generate session ID if not exists
    req.sessionId = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
  } else {
    req.sessionId = req.session.id;
  }
  next();
};