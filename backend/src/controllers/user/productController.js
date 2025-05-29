import { storage } from "../../models/storage.js";

/**
 * Get all products (public view)
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await storage.getAllProducts();
    res.json(products);
  } catch (error) {
    console.error('Get all products error:', error);
    res.status(500).json({
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
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await storage.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await storage.getFeaturedProducts();
    res.json(products);
  } catch (error) {
    console.error('Get featured products error:', error);
    res.status(500).json({ message: 'Failed to fetch featured products' });
  }
};

/**
 * Get products by category
 */
export const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await storage.getProductsByCategory(category);
    res.json(products);
  } catch (error) {
    console.error('Get products by category error:', error);
    res.status(500).json({ message: 'Failed to fetch products by category' });
  }
};

/**
 * Get all farmers
 */
export const getAllFarmers = async (req, res) => {
  try {
    const farmers = await storage.getAllFarmers();
    res.json(farmers);
  } catch (error) {
    console.error('Get all farmers error:', error);
    res.status(500).json({ message: 'Failed to fetch farmers' });
  }
};

/**
 * Get featured farmers
 */
export const getFeaturedFarmers = async (req, res) => {
  try {
    const farmers = await storage.getFeaturedFarmers();
    res.json(farmers);
  } catch (error) {
    console.error('Get featured farmers error:', error);
    res.status(500).json({ message: 'Failed to fetch featured farmers' });
  }
};

/**
 * Get farmer by ID
 */
export const getFarmerById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid farmer ID' });
    }

    const farmer = await storage.getFarmerById(id);
    if (!farmer) {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    res.json(farmer);
  } catch (error) {
    console.error('Get farmer by ID error:', error);
    res.status(500).json({ message: 'Failed to fetch farmer' });
  }
};