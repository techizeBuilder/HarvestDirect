const Product = require('../../models/Product');

/**
 * Get all products (public view)
 */
const getAllProducts = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      category, 
      featured,
      minPrice,
      maxPrice,
      search 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let products;

    if (search) {
      products = await Product.search(search, {
        limit: parseInt(limit),
        offset: parseInt(offset)
      });
    } else {
      products = await Product.findAll({
        limit: parseInt(limit),
        offset: parseInt(offset),
        category,
        featured: featured !== undefined ? featured === 'true' : undefined,
        minPrice: minPrice ? parseFloat(minPrice) : undefined,
        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
      });
    }

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
 * Get product by ID
 */
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
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
      message: 'Internal server error'
    });
  }
};

/**
 * Get featured products
 */
const getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;

    const products = await Product.findAll({
      featured: true,
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Get products by category
 */
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      category,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: { products }
    });

  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * Search products
 */
const searchProducts = async (req, res) => {
  try {
    const { q: searchTerm } = req.query;
    const { page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const products = await Product.search(searchTerm, {
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: { 
        products,
        searchTerm 
      }
    });

  } catch (error) {
    console.error('Search products error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  getFeaturedProducts,
  getProductsByCategory,
  searchProducts,
};