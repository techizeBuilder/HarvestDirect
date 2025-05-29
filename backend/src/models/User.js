const { pool } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  constructor(userData) {
    this.id = userData.id;
    this.name = userData.name;
    this.email = userData.email;
    this.password = userData.password;
    this.role = userData.role || 'user';
    this.createdAt = userData.created_at;
    this.updatedAt = userData.updated_at;
  }

  /**
   * Create a new user
   * @param {Object} userData - User data
   * @returns {User} Created user instance
   */
  static async create(userData) {
    const { name, email, password, role = 'user' } = userData;
    
    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    const query = `
      INSERT INTO users (name, email, password, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [name, email, hashedPassword, role];
    const result = await pool.query(query, values);
    
    return new User(result.rows[0]);
  }

  /**
   * Find user by email
   * @param {string} email - User email
   * @returns {User|null} User instance or null
   */
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(query, [email]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  /**
   * Find user by ID
   * @param {number} id - User ID
   * @returns {User|null} User instance or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new User(result.rows[0]);
  }

  /**
   * Get all users (admin only)
   * @param {Object} options - Query options (limit, offset, role)
   * @returns {Array} Array of user instances
   */
  static async findAll(options = {}) {
    const { limit = 50, offset = 0, role } = options;
    
    let query = 'SELECT * FROM users';
    const values = [];
    
    if (role) {
      query += ' WHERE role = $1';
      values.push(role);
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
    values.push(limit, offset);
    
    const result = await pool.query(query, values);
    
    return result.rows.map(row => new User(row));
  }

  /**
   * Verify password
   * @param {string} password - Plain text password
   * @returns {boolean} Password match result
   */
  async verifyPassword(password) {
    return await bcrypt.compare(password, this.password);
  }

  /**
   * Update user data
   * @param {Object} updateData - Data to update
   * @returns {User} Updated user instance
   */
  async update(updateData) {
    const allowedFields = ['name', 'email'];
    const updates = [];
    const values = [];
    let paramCount = 1;

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        updates.push(`${field} = $${paramCount}`);
        values.push(updateData[field]);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return this;
    }

    updates.push(`updated_at = NOW()`);
    values.push(this.id);

    const query = `
      UPDATE users 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return new User(result.rows[0]);
  }

  /**
   * Delete user
   * @returns {boolean} Deletion success
   */
  async delete() {
    const query = 'DELETE FROM users WHERE id = $1';
    const result = await pool.query(query, [this.id]);
    
    return result.rowCount > 0;
  }

  /**
   * Convert to JSON (exclude password)
   * @returns {Object} User data without password
   */
  toJSON() {
    const { password, ...userWithoutPassword } = this;
    return userWithoutPassword;
  }
}

module.exports = User;