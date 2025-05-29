import { users } from "../../../../shared/schema.ts";
import { db } from "../../config/db.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateToken } from "../../utils/jwt.js";

/**
 * Admin login controller
 */
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    // Check if user exists and is an admin
    if (!user || user.role !== 'admin') {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    // Return user info and token
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Login failed' 
    });
  }
};

/**
 * Get admin dashboard data
 */
export const getDashboardData = async (req, res) => {
  try {
    // Get user statistics
    const userStats = await db.select().from(users);
    
    // Get basic dashboard data
    const dashboardData = {
      users: {
        total: userStats.length,
        admins: userStats.filter(u => u.role === 'admin').length,
        regularUsers: userStats.filter(u => u.role === 'user').length
      }
    };

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch dashboard data' 
    });
  }
};