import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import authRouter from "./routes/auth.js";
import ordersRouter from "./routes/orders.js";
import productsRouter from "./routes/products.js";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Initialize database connection on first request
let dbConnected = false;

app.use(async (req, res, next) => {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
    } catch (error) {
      console.error("Failed to connect to database:", error);
      return res.status(500).json({
        error: "Database connection failed",
        message: error.message,
      });
    }
  }
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/products", productsRouter);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", db: dbConnected ? "connected" : "disconnected" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("API Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

export default app;
