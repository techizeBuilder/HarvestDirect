import { storage } from "../../models/storage.js";
import { users } from "../../../../shared/schema.ts";
import { db } from "../../config/db.js";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

/**
 * Get all users (admin only)
 */
export const getAllUsers = async (req, res) => {
  try {
    const allUsers = await storage.getAllUsers();
    
    // Remove password from response
    const safeUsers = allUsers.map(user => {
      const { password, ...safeUser } = user;
      return safeUser;
    });

    res.json({
      success: true,
      data: { users: safeUsers }
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch users' 
    });
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid user ID' 
      });
    }

    const user = await storage.getUserById(id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Remove password from response
    const { password, ...safeUser } = user;

    res.json({
      success: true,
      data: { user: safeUser }
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch user' 
    });
  }
};

/**
 * Create new user (admin only)
 */
export const createUser = async (req, res) => {
  try {
    const { name, email, password, role = 'user' } = req.body;

    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ 
        success: false,
        message: 'User with this email already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    const userData = {
      name,
      email,
      password: hashedPassword,
      role,
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const user = await storage.createUser(userData);
    
    // Remove password from response
    const { password: _, ...safeUser } = user;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: { user: safeUser }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create user' 
    });
  }
};

/**
 * Update user (admin only)
 */
export const updateUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    // Prevent admin from changing their own role
    if (id === req.user.id && updateData.role && updateData.role !== req.user.role) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot change your own role' 
      });
    }

    const user = await storage.updateUser(id, updateData);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    // Remove password from response
    const { password, ...safeUser } = user;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: { user: safeUser }
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update user' 
    });
  }
};

/**
 * Delete user (admin only)
 */
export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    // Prevent admin from deleting themselves
    if (id === req.user.id) {
      return res.status(400).json({ 
        success: false,
        message: 'Cannot delete your own account' 
      });
    }

    const success = await storage.deleteUser(id);
    if (!success) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete user' 
    });
  }
};