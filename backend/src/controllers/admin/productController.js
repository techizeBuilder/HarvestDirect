import { storage } from "../../models/storage.js";
import { products } from "../../../../shared/schema.ts";
import { db } from "../../config/db.js";
import { eq } from "drizzle-orm";

/**
 * Get all products (admin view)
 */
export const getAllProducts = async (req, res) => {
  try {
    const allProducts = await storage.getAllProducts();
    res.json({
      success: true,
      data: { products: allProducts }
    });
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch products' 
    });
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ 
        success: false,
        message: 'Invalid product ID' 
      });
    }

    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      data: { product }
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch product' 
    });
  }
};

/**
 * Create new product
 */
export const createProduct = async (req, res) => {
  try {
    const productData = req.body;
    
    const [newProduct] = await db.insert(products).values(productData).returning();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product: newProduct }
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create product' 
    });
  }
};

/**
 * Update product
 */
export const updateProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updateData = req.body;

    const [updatedProduct] = await db
      .update(products)
      .set(updateData)
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update product' 
    });
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const result = await db.delete(products).where(eq(products.id, id));
    
    if (result.rowCount === 0) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete product' 
    });
  }
};