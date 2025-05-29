import { v4 as uuidv4 } from 'uuid';

/**
 * Session ID generator middleware
 */
export const getSessionId = (req, res, next) => {
  let sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.setHeader('X-Session-Id', sessionId);
  }
  
  req.sessionId = sessionId;
  next();
};