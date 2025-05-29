import express from 'express';

// Import routes
import adminAuthRoutes from './routes/admin/authRoutes.js';
import adminProductRoutes from './routes/admin/productRoutes.js';
import adminUserRoutes from './routes/admin/userRoutes.js';
import userAuthRoutes from './routes/user/authRoutes.js';
import userProductRoutes from './routes/user/productRoutes.js';
import userCartRoutes from './routes/user/cartRoutes.js';

// Import controllers for additional endpoints
import { 
  getAllFarmers, 
  getFeaturedFarmers, 
  getFarmerById 
} from './controllers/user/productController.js';
import { storage } from './models/storage.js';
import { getSessionId } from './middlewares/session.js';

// Create Express router for API routes
const app = express.Router();

// Remove duplicate middleware since main server handles it

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

// Session middleware for all requests
app.use(getSessionId);

// Admin routes
app.use('/admin', adminAuthRoutes);
app.use('/admin/products', adminProductRoutes);
app.use('/admin/users', adminUserRoutes);

// User routes
app.use('/auth', userAuthRoutes);
app.use('/products', userProductRoutes);
app.use('/cart', userCartRoutes);

// Additional public endpoints
app.get('/farmers', getAllFarmers);
app.get('/farmers/featured', getFeaturedFarmers);
app.get('/farmers/:id', getFarmerById);

// Additional API endpoints from original routes
app.get('/testimonials', async (req, res) => {
  try {
    const testimonials = await storage.getAllTestimonials();
    res.json(testimonials);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch testimonials" });
  }
});

app.post('/newsletter-subscription', async (req, res) => {
  try {
    const subscription = await storage.addNewsletterSubscription(req.body);
    res.json({ message: "Subscription successful", subscription });
  } catch (error) {
    res.status(500).json({ message: "Failed to subscribe" });
  }
});

app.get('/product-reviews/:productId', async (req, res) => {
  try {
    const productId = parseInt(req.params.productId);
    const reviews = await storage.getProductReviews(productId);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

app.post('/contact', async (req, res) => {
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