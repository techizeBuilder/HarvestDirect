const Product = require('../../models/Product');

/**
 * Get all products (admin view)
 */
const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      featured,
      farmerId 
    } = req.query;
    
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      limit: parseInt(limit),
      offset: parseInt(offset),
      category,
      featured: featured !== undefined ? featured === 'true' : undefined,
      farmerId: farmerId ? parseInt(farmerId) : undefined
    });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Create new product
 */
const createProduct = async (req, res) => {
  try {
    const productData = req.body;

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: { product }
    });

  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update product
 */
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = await product.update(updateData);

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: { product: updatedProduct }
    });

  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Delete product
 */
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.delete();

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Update product stock
 */
const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stockQuantity } = req.body;

    const product = await Product.findById(id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const updatedProduct = await product.updateStock(stockQuantity);

    res.json({
      success: true,
      message: 'Product stock updated successfully',
      data: { product: updatedProduct }
    });

  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
};