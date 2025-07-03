import express from "express";
import cors from "cors";
import { registerRoutes } from "./routes.js";
import { initializeDatabase } from "./initDb.js";
import morgan from "morgan";
import dotenv from "dotenv";
const app = express();
const PORT = process.env.PORT || 5000;

dotenv.config();
app.use(morgan("dev"));
const allowedOrigins = [
  "http://localhost:5173",
  "https://farm-fresh-new-fronted02.vercel.app",
  "https://farmfresh.techizebuilder.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Harvest Direct Backend is running!",
    timestamp: new Date().toISOString(),
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database with seed data
    await initializeDatabase();
    console.log("Database initialized successfully with seed data");

    // Register API routes
    await registerRoutes(app);

    // Start server
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Harvest Direct Backend server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 API endpoints: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
