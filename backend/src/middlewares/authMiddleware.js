import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';
import { users } from '../models/schema.js';
import { eq } from 'drizzle-orm';

const JWT_SECRET = process.env.JWT_SECRET || 'harvest_direct_secret_2024';

// General authentication middleware
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid user' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication failed' 
    });
  }
};

// Admin-only authentication middleware
export const authenticateAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Admin authentication required' 
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    
    const [admin] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.userId));

    if (!admin || admin.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Admin access required' 
      });
    }

    req.user = admin;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Admin authentication failed' 
    });
  }
};

// Optional authentication (for cart sessions)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.userId));

      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // If token is invalid, continue without user
    next();
  }
};