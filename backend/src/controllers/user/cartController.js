import { storage } from "../../models/storage.js";

/**
 * Get cart
 */
export const getCart = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const cart = await storage.getCart(sessionId);
    res.json(cart);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
};

/**
 * Add item to cart
 */
export const addToCart = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cart = await storage.addToCart(sessionId, productId, quantity);
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
};

/**
 * Update cart item
 */
export const updateCartItem = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const { productId } = req.params;
    const { quantity } = req.body;
    
    if (!productId || quantity === undefined) {
      return res.status(400).json({ message: 'Product ID and quantity are required' });
    }

    const cart = await storage.updateCartItem(sessionId, parseInt(productId), quantity);
    res.json(cart);
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ message: 'Failed to update cart item' });
  }
};

/**
 * Remove item from cart
 */
export const removeFromCart = async (req, res) => {
  try {
    const sessionId = req.sessionId;
    const { productId } = req.params;
    
    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const cart = await storage.removeFromCart(sessionId, parseInt(productId));
    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
};