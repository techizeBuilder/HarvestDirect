import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { v4 as uuidv4 } from 'uuid';
import { insertNewsletterSubscriptionSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API route prefix
  const apiPrefix = '/api';

  // Get session ID middleware
  const getSessionId = (req: Request, res: Response, next: Function) => {
    let sessionId = req.headers['x-session-id'] as string;
    
    if (!sessionId) {
      sessionId = uuidv4();
      res.setHeader('X-Session-Id', sessionId);
    }
    
    (req as any).sessionId = sessionId;
    next();
  };

  app.use(getSessionId);

  // Get all products
  app.get(`${apiPrefix}/products`, async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  // Get featured products
  app.get(`${apiPrefix}/products/featured`, async (req, res) => {
    try {
      const products = await storage.getFeaturedProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured products" });
    }
  });

  // Get products by category
  app.get(`${apiPrefix}/products/category/:category`, async (req, res) => {
    try {
      const { category } = req.params;
      const products = await storage.getProductsByCategory(category);
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });

  // Get product by ID
  app.get(`${apiPrefix}/products/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const product = await storage.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Get all farmers
  app.get(`${apiPrefix}/farmers`, async (req, res) => {
    try {
      const farmers = await storage.getAllFarmers();
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmers" });
    }
  });

  // Get featured farmers
  app.get(`${apiPrefix}/farmers/featured`, async (req, res) => {
    try {
      const farmers = await storage.getFeaturedFarmers();
      res.json(farmers);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured farmers" });
    }
  });

  // Get farmer by ID
  app.get(`${apiPrefix}/farmers/:id`, async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid farmer ID" });
      }
      
      const farmer = await storage.getFarmerById(id);
      if (!farmer) {
        return res.status(404).json({ message: "Farmer not found" });
      }
      
      res.json(farmer);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch farmer" });
    }
  });

  // Get cart
  app.get(`${apiPrefix}/cart`, async (req, res) => {
    try {
      const sessionId = (req as any).sessionId;
      const cart = await storage.getCart(sessionId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart" });
    }
  });

  // Add item to cart
  app.post(`${apiPrefix}/cart/items`, async (req, res) => {
    try {
      const { productId, quantity } = req.body;
      const sessionId = (req as any).sessionId;
      
      if (typeof productId !== 'number' || typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }
      
      const cart = await storage.addToCart(sessionId, productId, quantity);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to add item to cart" });
    }
  });

  // Update cart item
  app.put(`${apiPrefix}/cart/items/:productId`, async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const { quantity } = req.body;
      const sessionId = (req as any).sessionId;
      
      if (isNaN(productId) || typeof quantity !== 'number') {
        return res.status(400).json({ message: "Invalid product ID or quantity" });
      }
      
      const cart = await storage.updateCartItem(sessionId, productId, quantity);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to update cart item" });
    }
  });

  // Remove item from cart
  app.delete(`${apiPrefix}/cart/items/:productId`, async (req, res) => {
    try {
      const productId = parseInt(req.params.productId);
      const sessionId = (req as any).sessionId;
      
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const cart = await storage.removeFromCart(sessionId, productId);
      res.json(cart);
    } catch (error) {
      res.status(500).json({ message: "Failed to remove item from cart" });
    }
  });

  // Get testimonials
  app.get(`${apiPrefix}/testimonials`, async (req, res) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  // Subscribe to newsletter
  app.post(`${apiPrefix}/newsletter/subscribe`, async (req, res) => {
    try {
      const subscriptionData = insertNewsletterSubscriptionSchema.parse(req.body);
      const subscription = await storage.addNewsletterSubscription(subscriptionData);
      res.json({ message: "Subscription successful", subscription });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to subscribe to newsletter" });
      }
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
