const { pool } = require('../config/db');

class Product {
  constructor(productData) {
    this.id = productData.id;
    this.name = productData.name;
    this.description = productData.description;
    this.price = productData.price;
    this.category = productData.category;
    this.imageUrl = productData.image_url;
    this.farmerId = productData.farmer_id;
    this.stockQuantity = productData.stock_quantity;
    this.featured = productData.featured;
    this.createdAt = productData.created_at;
    this.updatedAt = productData.updated_at;
  }

  /**
   * Create a new product
   * @param {Object} productData - Product data
   * @returns {Product} Created product instance
   */
  static async create(productData) {
    const { 
      name, 
      description, 
      price, 
      category, 
      imageUrl, 
      farmerId, 
      stockQuantity = 0,
      featured = false 
    } = productData;
    
    const query = `
      INSERT INTO products (name, description, price, category, image_url, farmer_id, stock_quantity, featured, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;
    
    const values = [name, description, price, category, imageUrl, farmerId, stockQuantity, featured];
    const result = await pool.query(query, values);
    
    return new Product(result.rows[0]);
  }

  /**
   * Find product by ID
   * @param {number} id - Product ID
   * @returns {Product|null} Product instance or null
   */
  static async findById(id) {
    const query = 'SELECT * FROM products WHERE id = $1';
    const result = await pool.query(query, [id]);
    
    if (result.rows.length === 0) {
      return null;
    }
    
    return new Product(result.rows[0]);
  }

  /**
   * Get all products with optional filters
   * @param {Object} options - Query options
   * @returns {Array} Array of product instances
   */
  static async findAll(options = {}) {
    const { 
      limit = 50, 
      offset = 0, 
      category, 
      featured, 
      farmerId,
      minPrice,
      maxPrice 
    } = options;
    
    let query = 'SELECT * FROM products WHERE 1=1';
    const values = [];
    let paramCount = 1;

    if (category) {
      query += ` AND category = $${paramCount}`;
      values.push(category);
      paramCount++;
    }

    if (featured !== undefined) {
      query += ` AND featured = $${paramCount}`;
      values.push(featured);
      paramCount++;
    }

    if (farmerId) {
      query += ` AND farmer_id = $${paramCount}`;
      values.push(farmerId);
      paramCount++;
    }

    if (minPrice !== undefined) {
      query += ` AND price >= $${paramCount}`;
      values.push(minPrice);
      paramCount++;
    }

    if (maxPrice !== undefined) {
      query += ` AND price <= $${paramCount}`;
      values.push(maxPrice);
      paramCount++;
    }
    
    query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
    values.push(limit, offset);
    
    const result = await pool.query(query, values);
    
    return result.rows.map(row => new Product(row));
  }

  /**
   * Search products by name or description
   * @param {string} searchTerm - Search term
   * @param {Object} options - Query options
   * @returns {Array} Array of product instances
   */
  static async search(searchTerm, options = {}) {
    const { limit = 50, offset = 0 } = options;
    
    const query = `
      SELECT * FROM products 
      WHERE name ILIKE $1 OR description ILIKE $1
      ORDER BY 
        CASE 
          WHEN name ILIKE $1 THEN 1 
          ELSE 2 
        END,
        created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const searchPattern = `%${searchTerm}%`;
    const result = await pool.query(query, [searchPattern, limit, offset]);
    
    return result.rows.map(row => new Product(row));
  }

  /**
   * Update product data
   * @param {Object} updateData - Data to update
   * @returns {Product} Updated product instance
   */
  async update(updateData) {
    const allowedFields = [
      'name', 'description', 'price', 'category', 
      'image_url', 'stock_quantity', 'featured'
    ];
    
    const updates = [];
    const values = [];
    let paramCount = 1;

    for (const field of allowedFields) {
      const dataField = field === 'image_url' ? 'imageUrl' : field;
      if (updateData[dataField] !== undefined) {
        updates.push(`${field} = $${paramCount}`);
        values.push(updateData[dataField]);
        paramCount++;
      }
    }

    if (updates.length === 0) {
      return this;
    }

    updates.push(`updated_at = NOW()`);
    values.push(this.id);

    const query = `
      UPDATE products 
      SET ${updates.join(', ')} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return new Product(result.rows[0]);
  }

  /**
   * Delete product
   * @returns {boolean} Deletion success
   */
  async delete() {
    const query = 'DELETE FROM products WHERE id = $1';
    const result = await pool.query(query, [this.id]);
    
    return result.rowCount > 0;
  }

  /**
   * Update stock quantity
   * @param {number} quantity - New stock quantity
   * @returns {Product} Updated product instance
   */
  async updateStock(quantity) {
    const query = `
      UPDATE products 
      SET stock_quantity = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [quantity, this.id]);
    return new Product(result.rows[0]);
  }

  /**
   * Check if product is in stock
   * @param {number} requestedQuantity - Requested quantity
   * @returns {boolean} Stock availability
   */
  isInStock(requestedQuantity = 1) {
    return this.stockQuantity >= requestedQuantity;
  }
}

module.exports = Product;