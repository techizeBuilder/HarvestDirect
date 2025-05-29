import express from "express";
import { setupVite, serveStatic, log } from "./vite.ts";
import { initializeDatabase } from "./initDb.js";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import the backend app
import backendApp from "./app.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Use the backend structure for API routes
app.use('/api', backendApp);

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

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database with seed data
  try {
    await initializeDatabase();
    log('Database initialized successfully with seed data');
  } catch (error) {
    log('Error initializing database: ' + error);
  }
  
  // Create server directly
  const { createServer } = await import('http');
  const server = createServer(app);

  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen(port, "0.0.0.0", () => {
    log(`serving on port ${port}`);
  });
})().catch(console.error);