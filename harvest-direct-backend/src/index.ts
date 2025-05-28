import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes.js";
import { initializeDatabase } from "./initDb.js";

const app = express();
const PORT = process.env.PORT || 5000;

// CORS configuration for frontend
app.use(cors({
  origin: [
    'http://localhost:5173', // Vite dev server
    'http://localhost:3000', // React dev server
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

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database with seed data
    await initializeDatabase();
    console.log('Database initialized successfully with seed data');

    // Register API routes
    await registerRoutes(app);

    // Start server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Harvest Direct Backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();