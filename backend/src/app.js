import express from 'express';
import { createServer } from 'http';
import { v4 as uuidv4 } from 'uuid';

// Import routes
import adminAuthRoutes from './routes/admin/authRoutes.js';
import adminProductRoutes from './routes/admin/productRoutes.js';
import adminUserRoutes from './routes/admin/userRoutes.js';
import userAuthRoutes from './routes/user/authRoutes.js';
import userProductRoutes from './routes/user/productRoutes.js';
import userCartRoutes from './routes/user/cartRoutes.js';

// Import controllers
import { 
  getAllProducts, 
  getProductById, 
  getFeaturedProducts, 
  getProductsByCategory,
  getAllFarmers,
  getFeaturedFarmers,
  getFarmerById
} from './controllers/user/productController.js';
import { getCart, addToCart, updateCartItem, removeFromCart } from './controllers/user/cartController.js';
import { storage } from './storage.js';

// Create Express app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      console.log(logLine);
    }
  });

  next();
});

// Session ID middleware
const getSessionId = (req, res, next) => {
  let sessionId = req.headers['x-session-id'];
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.setHeader('X-Session-Id', sessionId);
  }
  
  req.sessionId = sessionId;
  next();
};

app.use(getSessionId);

// API route prefix
const apiPrefix = '/api';

// Admin routes
app.use(`${apiPrefix}/admin/auth`, adminAuthRoutes);
app.use(`${apiPrefix}/admin/products`, adminProductRoutes);
app.use(`${apiPrefix}/admin/users`, adminUserRoutes);

// User routes
app.use(`${apiPrefix}/auth`, userAuthRoutes);
app.use(`${apiPrefix}/cart`, userCartRoutes);

// Public product and farmer routes
app.get(`${apiPrefix}/products`, getAllProducts);
app.get(`${apiPrefix}/products/featured`, getFeaturedProducts);
app.get(`${apiPrefix}/products/category/:category`, getProductsByCategory);
app.get(`${apiPrefix}/products/:id`, getProductById);

app.get(`${apiPrefix}/farmers`, getAllFarmers);
app.get(`${apiPrefix}/farmers/featured`, getFeaturedFarmers);
app.get(`${apiPrefix}/farmers/:id`, getFarmerById);

// Additional API endpoints from original routes
app.get(`${apiPrefix}/testimonials`, async (req, res) => {
  try {
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

app.post(`${apiPrefix}/newsletter-subscription`, async (req, res) => {
  try {
    const subscription = await storage.addNewsletterSubscription(req.body);
    res.json({ message: "Subscription successful", subscription });
  } catch (error) {
    res.status(500).json({ message: "Failed to subscribe" });
  }
});

app.get(`${apiPrefix}/product-reviews/:productId`, async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await storage.getProductReviews(productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

app.post(`${apiPrefix}/contact`, async (req, res) => {
  try {
    const message = await storage.addContactMessage(req.body);
    res.json({ message: "Message sent successfully", contactMessage: message });
  } catch (error) {
    res.status(500).json({ message: "Failed to send message" });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Harvest Direct Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);

  const statusCode = error.statusCode || error.status || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : error.message;

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
});

export default app;