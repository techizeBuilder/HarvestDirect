import { storage } from "../../storage.js";

/**
 * Get all products (admin view)
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await storage.getAllProducts();
    res.json({
      success: true,
      data: { products }
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
    const product = await storage.createProduct(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
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

    const product = await storage.updateProduct(id, updateData);
    if (!product) {
      return res.status(404).json({ 
        success: false,
        message: 'Product not found' 
      });
    }

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product }
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
    
    const success = await storage.deleteProduct(id);
    if (!success) {
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