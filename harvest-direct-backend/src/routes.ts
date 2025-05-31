import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
import Razorpay from 'razorpay';
import { 
  insertNewsletterSubscriptionSchema,
  insertUserSchema,
  insertPaymentSchema,
  insertSubscriptionSchema,
  insertProductReviewSchema,
  insertContactMessageSchema
} from "@shared/schema";
import adminRouter from './admin';

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRY = '24h';

// Initialize Razorpay
let razorpay: Razorpay;

// Email configuration
let transporter: nodemailer.Transporter;

// Auth middleware
const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    
    const user = await storage.getUserById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: 'Invalid user' });
    }

    (req as any).user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

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

  // Health check endpoint for deployment monitoring
  app.get(`${apiPrefix}/health`, (req, res) => {
    res.json({ 
      status: 'OK', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
  });

  // Register admin routes
  app.use(`${apiPrefix}/admin`, adminRouter);

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
  
  // Product reviews endpoints
  app.get(`${apiPrefix}/products/:id/reviews`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product reviews" });
    }
  });
  
  app.post(`${apiPrefix}/products/:id/reviews`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      if (isNaN(productId)) {
        return res.status(400).json({ message: "Invalid product ID" });
      }
      
      const reviewData = {
        ...req.body,
        productId
      };
      
      const newReview = await storage.addProductReview(reviewData);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: "Failed to add product review" });
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

  // User Authentication Routes
  
  // Register a new user
  app.post(`${apiPrefix}/auth/register`, async (req, res) => {
    try {
      // Validate user data
      const userData = insertUserSchema.parse(req.body);
      
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);
      
      // Create user with hashed password and mark as already verified
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
        emailVerified: true
      });
      
      // Return success message without exposing password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json({ 
        message: "Registration successful. You can now log in.",
        user: userWithoutPassword
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Failed to register user" });
      }
    }
  });
  
  // Verify email
  app.get(`${apiPrefix}/auth/verify/:token`, async (req, res) => {
    try {
      const { token } = req.params;
      const success = await storage.verifyUserEmail(token);
      
      if (success) {
        res.json({ message: "Email verified successfully" });
      } else {
        res.status(400).json({ message: "Invalid or expired verification token" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to verify email" });
    }
  });
  
  // Login
  app.post(`${apiPrefix}/auth/login`, async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(`Login attempt for email: ${email}`);
      
      // Check if user exists
      const user = await storage.getUserByEmail(email);
      if (!user) {
        console.log('User not found in database');
        return res.status(400).json({ message: "Invalid email or password" });
      }
      
      console.log('User found, verifying password');
      
      try {
        // Verify password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
          console.log('Password verification failed');
          return res.status(400).json({ message: "Invalid email or password" });
        }
        
        console.log('Password verified, generating token');
        
        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
        
        // Return token and user data without password
        const { password: _, ...userWithoutPassword } = user;
        console.log('Login successful');
        
        return res.json({
          message: "Login successful",
          token,
          user: userWithoutPassword
        });
      } catch (pwError) {
        console.error('Error during password verification:', pwError);
        return res.status(400).json({ message: "Password verification failed" });
      }
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Login failed" });
    }
  });
  
  // Request password reset
  app.post(`${apiPrefix}/auth/reset-request`, async (req, res) => {
    try {
      const { email } = req.body;
      const success = await storage.resetPasswordRequest(email);
      
      if (success && transporter) {
        const user = await storage.getUserByEmail(email);
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${user?.resetToken}`;
        
        await transporter.sendMail({
          from: 'noreply@yourstore.com',
          to: email,
          subject: 'Reset Your Password',
          html: `<p>Please click <a href="${resetUrl}">here</a> to reset your password.</p>`
        });
      }
      
      // Always return success to prevent email enumeration
      res.json({ message: "If your email is registered, you will receive a password reset link" });
    } catch (error) {
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });
  
  // Reset password
  app.post(`${apiPrefix}/auth/reset-password/:token`, async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      
      const success = await storage.resetPassword(token, hashedPassword);
      
      if (success) {
        res.json({ message: "Password reset successful" });
      } else {
        res.status(400).json({ message: "Invalid or expired reset token" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to reset password" });
    }
  });
  
  // User Profile Routes (protected)
  
  // Get user profile
  app.get(`${apiPrefix}/user/profile`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const { password, ...userWithoutPassword } = user;
      
      res.json({ user: userWithoutPassword });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });
  
  // Update user profile
  app.put(`${apiPrefix}/user/profile`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const { name } = req.body;
      
      const updatedUser = await storage.updateUser(user.id, { name });
      const { password, ...userWithoutPassword } = updatedUser;
      
      res.json({ 
        message: "Profile updated successfully", 
        user: userWithoutPassword 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update profile" });
    }
  });
  
  // Payment Routes
  
  // Initialize Razorpay
  app.post(`${apiPrefix}/payments/initialize`, authenticate, async (req, res) => {
    try {
      // Check if Razorpay is initialized
      if (!razorpay) {
        // Initialize Razorpay with API keys
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (!razorpayKeyId || !razorpayKeySecret) {
          return res.status(500).json({ message: "Razorpay API keys not configured" });
        }
        
        try {
          razorpay = new Razorpay({
            key_id: razorpayKeyId,
            key_secret: razorpayKeySecret
          });
          console.log("Razorpay initialized successfully for payment");
        } catch (initError) {
          console.error("Failed to initialize Razorpay instance:", initError);
          return res.status(500).json({ message: "Failed to initialize payment gateway", error: String(initError) });
        }
      }
      
      const user = (req as any).user;
      const { amount, currency = 'INR' } = req.body;
      
      if (!amount || isNaN(amount) || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount specified", error: "Amount must be a positive number" });
      }
      
      // Create Razorpay order
      const options = {
        amount: Math.round(amount * 100), // Razorpay expects amount in smallest currency unit (paise)
        currency,
        receipt: `receipt_order_${Date.now()}`,
        payment_capture: 1
      };
      
      console.log("Creating Razorpay order with options:", options);
      
      try {
        const order = await razorpay.orders.create(options);
        console.log("Razorpay order created:", order);
        
        res.json({
          orderId: order.id,
          amount: order.amount,
          currency: order.currency,
          keyId: process.env.RAZORPAY_KEY_ID
        });
      } catch (orderError) {
        console.error("Failed to create Razorpay order:", orderError);
        return res.status(500).json({ message: "Failed to create payment order", error: String(orderError) });
      }
    } catch (error) {
      console.error('Payment initialization error:', error);
      res.status(500).json({ message: "Failed to initialize payment", error: error instanceof Error ? error.message : String(error) });
    }
  });
  
  // Verify payment
  app.post(`${apiPrefix}/payments/verify`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const { 
        razorpayPaymentId, 
        razorpayOrderId, 
        razorpaySignature,
        amount,
        currency = 'INR'
      } = req.body;
      
      // Verify the payment signature
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || '')
        .update(body)
        .digest("hex");
      
      if (expectedSignature !== razorpaySignature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }
      
      // Record the payment
      const payment = await storage.createPayment({
        userId: user.id,
        razorpayPaymentId,
        amount: amount / 100, // Convert back to main currency unit
        currency,
        status: 'completed'
      });
      
      res.json({ 
        message: "Payment successful", 
        payment 
      });
    } catch (error) {
      res.status(500).json({ message: "Payment verification failed" });
    }
  });
  
  // Get payment history
  app.get(`${apiPrefix}/payments/history`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const payments = await storage.getPaymentsByUserId(user.id);
      
      res.json({ payments });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment history" });
    }
  });
  
  // Subscription Routes
  
  // Create subscription
  app.post(`${apiPrefix}/subscriptions/create`, authenticate, async (req, res) => {
    try {
      // Check if Razorpay is initialized
      if (!razorpay) {
        // Initialize Razorpay with API keys
        const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
        const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;
        
        if (!razorpayKeyId || !razorpayKeySecret) {
          return res.status(500).json({ message: "Razorpay API keys not configured" });
        }
        
        razorpay = new Razorpay({
          key_id: razorpayKeyId,
          key_secret: razorpayKeySecret
        });
      }
      
      const user = (req as any).user;
      const { planId, planName, intervalInMonths = 1 } = req.body;
      
      // Create Razorpay subscription
      const subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 12, // 12 billing cycles
        quantity: 1
      });
      
      // Calculate end date based on interval
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + intervalInMonths * 12); // 12 billing cycles
      
      // Record subscription in our database
      const createdSubscription = await storage.createSubscription({
        userId: user.id,
        razorpaySubscriptionId: subscription.id,
        planName,
        status: 'active',
        startDate,
        endDate
      });
      
      res.json({
        message: "Subscription created successfully",
        subscription: createdSubscription,
        razorpaySubscription: subscription
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to create subscription" });
    }
  });
  
  // Get user subscriptions
  app.get(`${apiPrefix}/subscriptions`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const subscriptions = await storage.getSubscriptionsByUserId(user.id);
      
      res.json({ subscriptions });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch subscriptions" });
    }
  });
  
  // Get all user orders
  app.get(`${apiPrefix}/orders/history`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      // Sample data for demonstration purposes
      const sampleOrders = [
        {
          id: 1001,
          userId: user.id,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          total: 129.99,
          status: 'processing',
          items: [
            { productName: 'Mountain Coffee Beans', quantity: 2, price: 49.99 },
            { productName: 'Organic Spice Mix', quantity: 1, price: 30.01 }
          ]
        },
        {
          id: 1002,
          userId: user.id,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          total: 75.50,
          status: 'delivered',
          deliveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          items: [
            { productName: 'Fresh Valley Honey', quantity: 3, price: 25.50 }
          ]
        },
        {
          id: 1003,
          userId: user.id,
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
          total: 45.95,
          status: 'cancelled',
          cancellationReason: 'Changed my mind',
          items: [
            { productName: 'Handcrafted Cheese', quantity: 1, price: 45.95 }
          ]
        }
      ];
      
      res.json({ orders: sampleOrders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order history" });
    }
  });
  
  // Get cancelled orders
  app.get(`${apiPrefix}/orders/cancelled`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      // Sample data for demonstration purposes
      const cancelledOrders = [
        {
          id: 1003,
          userId: user.id,
          createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000), // 21 days ago
          total: 45.95,
          status: 'cancelled',
          cancellationReason: 'Changed my mind',
          items: [
            { productName: 'Handcrafted Cheese', quantity: 1, price: 45.95 }
          ]
        },
        {
          id: 1005,
          userId: user.id,
          createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
          total: 95.80,
          status: 'cancelled',
          cancellationReason: 'Found a better deal elsewhere',
          items: [
            { productName: 'Organic Spice Mix', quantity: 2, price: 30.01 },
            { productName: 'Fresh Valley Honey', quantity: 1, price: 35.78 }
          ]
        }
      ];
      
      res.json({ orders: cancelledOrders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cancelled orders" });
    }
  });
  
  // Get delivered orders
  app.get(`${apiPrefix}/orders/delivered`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      // Sample data for demonstration purposes
      const deliveredOrders = [
        {
          id: 1002,
          userId: user.id,
          createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          total: 75.50,
          status: 'delivered',
          deliveredAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
          items: [
            { productName: 'Fresh Valley Honey', quantity: 3, price: 25.50 }
          ]
        },
        {
          id: 1004,
          userId: user.id,
          createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
          total: 125.45,
          status: 'delivered',
          deliveredAt: new Date(Date.now() - 27 * 24 * 60 * 60 * 1000), // 27 days ago
          items: [
            { productName: 'Mountain Coffee Beans', quantity: 1, price: 49.99 },
            { productName: 'Handcrafted Cheese', quantity: 1, price: 45.95 },
            { productName: 'Organic Tea Sampler', quantity: 1, price: 29.51 }
          ]
        },
        {
          id: 1006,
          userId: user.id,
          createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
          total: 187.25,
          status: 'delivered',
          deliveredAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000), // 55 days ago
          items: [
            { productName: 'Handcrafted Cheese', quantity: 2, price: 91.90 },
            { productName: 'Mountain Coffee Beans', quantity: 1, price: 49.99 },
            { productName: 'Fresh Valley Honey', quantity: 1, price: 35.78 },
            { productName: 'Organic Spice Mix', quantity: 1, price: 9.58 }
          ]
        }
      ];
      
      res.json({ orders: deliveredOrders });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch delivered orders" });
    }
  });
  
  // Cancel subscription
  app.post(`${apiPrefix}/subscriptions/:id/cancel`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      const subscriptionId = parseInt(req.params.id);
      
      // Verify ownership
      const subscription = await storage.getSubscriptionById(subscriptionId);
      if (!subscription || subscription.userId !== user.id) {
        return res.status(403).json({ message: "Unauthorized access to subscription" });
      }
      
      // Cancel in Razorpay
      if (razorpay) {
        await razorpay.subscriptions.cancel(subscription.razorpaySubscriptionId);
      }
      
      // Update status in our database
      const updatedSubscription = await storage.updateSubscriptionStatus(subscriptionId, 'canceled');
      
      res.json({
        message: "Subscription canceled successfully",
        subscription: updatedSubscription
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to cancel subscription" });
    }
  });

  // Product Review System for Delivered Orders
  // Get product reviews
  app.get(`${apiPrefix}/products/:id/reviews`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviews = await storage.getProductReviews(productId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product reviews" });
    }
  });
  
  // Check if user can review a product (has purchased and received it)
  app.get(`${apiPrefix}/products/:id/can-review`, authenticate, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = (req as any).user.id;
      
      const canReview = await storage.canUserReviewProduct(userId, productId);
      res.json(canReview);
    } catch (error) {
      res.status(500).json({ message: "Failed to check review eligibility" });
    }
  });
  
  // Add product review
  app.post(`${apiPrefix}/products/:id/reviews`, async (req, res) => {
    try {
      const productId = parseInt(req.params.id);
      const reviewData = req.body;
      
      // Validate the review data
      const validatedData = insertProductReviewSchema.parse({
        ...reviewData,
        productId
      });
      
      const newReview = await storage.addProductReview(validatedData);
      res.status(201).json(newReview);
    } catch (error) {
      res.status(500).json({ message: "Failed to add product review" });
    }
  });
  
  // Contact Form Handling
  // Submit contact form
  app.post(`${apiPrefix}/contact`, async (req, res) => {
    try {
      const contactData = req.body;
      
      // Validate the contact form data
      const validatedData = insertContactMessageSchema.parse(contactData);
      
      const newContactMessage = await storage.addContactMessage(validatedData);
      res.status(201).json({ 
        message: "Contact message submitted successfully", 
        id: newContactMessage.id 
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to submit contact message" });
    }
  });
  
  // Admin routes for managing contact messages (protected)
  app.get(`${apiPrefix}/admin/contact-messages`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Only allow admins to access this endpoint
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messages = await storage.getAllContactMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contact messages" });
    }
  });
  
  // Update contact message status (mark as read, in progress, resolved, etc.)
  app.patch(`${apiPrefix}/admin/contact-messages/:id`, authenticate, async (req, res) => {
    try {
      const user = (req as any).user;
      
      // Only allow admins to access this endpoint
      if (user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const messageId = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || typeof status !== 'string') {
        return res.status(400).json({ message: "Status is required" });
      }
      
      const updatedMessage = await storage.updateContactMessageStatus(messageId, status);
      res.json(updatedMessage);
    } catch (error) {
      res.status(500).json({ message: "Failed to update contact message status" });
    }
  });

  // Initialize Razorpay and Email service when environment variables are available
  if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log("Razorpay payment gateway initialized");
  }

  if (process.env.EMAIL_HOST && process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
    console.log("Email service initialized");
  }

  const httpServer = createServer(app);

  return httpServer;
}
