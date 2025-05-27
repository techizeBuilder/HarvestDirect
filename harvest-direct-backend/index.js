import express from "express";
import cors from "cors";
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for frontend
app.use(cors({
  origin: [
    'http://localhost:3000', // React dev server
    'http://localhost:5173', // Vite dev server
    'https://your-frontend-domain.vercel.app', // Production frontend
  ],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Harvest Direct Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Sample data for testing
const sampleProducts = [
  {
    id: 1,
    name: "Mountain Coffee Beans",
    price: 299,
    category: "beverages",
    description: "Premium coffee beans from mountain farms",
    imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e",
    featured: true
  },
  {
    id: 2,
    name: "Organic Honey",
    price: 450,
    category: "pantry",
    description: "Pure organic honey from local beekeepers",
    imageUrl: "https://images.unsplash.com/photo-1587049352846-4a222e784d38",
    featured: true
  }
];

const sampleFarmers = [
  {
    id: 1,
    name: "Rajesh Kumar",
    specialty: "Coffee & Spice Farmer",
    story: "For three generations, my family has grown coffee and spices in harmony with nature.",
    location: "Coorg, Karnataka",
    imageUrl: "https://ui-avatars.com/api/?name=Rajesh+Kumar&size=256&background=10b981&color=ffffff&bold=true",
    featured: true
  }
];

// API Routes
app.get('/api/products', (req, res) => {
  res.json(sampleProducts);
});

app.get('/api/products/featured', (req, res) => {
  const featured = sampleProducts.filter(product => product.featured);
  res.json(featured);
});

app.get('/api/farmers', (req, res) => {
  res.json(sampleFarmers);
});

app.get('/api/farmers/featured', (req, res) => {
  const featured = sampleFarmers.filter(farmer => farmer.featured);
  res.json(featured);
});

app.get('/api/cart', (req, res) => {
  res.json({
    id: 1,
    sessionId: "sample-session",
    items: [],
    totalItems: 0,
    subtotal: 0,
    shipping: 0,
    total: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });
});

app.get('/api/testimonials', (req, res) => {
  res.json([
    {
      id: 1,
      name: "Sarah K.",
      title: "Coffee Lover",
      content: "The coffee beans are absolutely amazing! Best quality I've ever tasted.",
      rating: 5,
      imageInitials: "SK"
    }
  ]);
});

// Admin routes
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === 'admin@example.com' && password === 'admin123') {
    res.json({ 
      success: true, 
      token: 'sample-admin-token',
      message: 'Admin login successful' 
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

app.get('/api/admin/farmers', (req, res) => {
  res.json(sampleFarmers);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Internal server error',
    message: err.message 
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Route not found',
    path: req.originalUrl 
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Harvest Direct Backend server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔌 API endpoints: http://localhost:${PORT}/api`);
  console.log(`💻 Sample data loaded for testing`);
});