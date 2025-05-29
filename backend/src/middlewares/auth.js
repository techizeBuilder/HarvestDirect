const { verifyToken, extractTokenFromHeader } = require('../utils/jwt');

/**
 * Authentication middleware
 * Verifies JWT token and adds user info to request
 */
const authenticate = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access token is required'
      });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: error.message
    });
  }
};

/**
 * Admin authorization middleware
 * Checks if authenticated user has admin role
 */
const authorizeAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }

  next();
};

/**
 * User authorization middleware
 * Checks if authenticated user has user role
 */
const authorizeUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required'
    });
  }

  if (req.user.role !== 'user' && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'User access required'
    });
  }

  next();
};

module.exports = {
  authenticate,
  authorizeAdmin,
  authorizeUser,
};