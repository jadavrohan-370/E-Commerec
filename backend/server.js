import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./config/db.js";
import { connectRedis } from "./config/redis.js";
import { checkElasticsearchConnection, setupIndex } from "./services/elasticsearch.js";

import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import recommendationRoutes from "./routes/recommendationRoutes.js";
import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();

// Connect to databases
await connectDB();
await connectRedis();
await checkElasticsearchConnection();
await setupIndex();

const app = express();
  
// Security Middlewares
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 1000, // Increased for development
  message: "Too many requests from this IP, please try again after 15 minutes",
});
app.use("/api/", limiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://e-commerec-self.vercel.app",
      process.env.CLIENT_URL,
    ].filter(Boolean),
    credentials: true,
  }),
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "API is running" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/recommendations", recommendationRoutes);

app.get("/api/config/razorpay", (req, res) =>
  res.send({ clientId: process.env.RAZORPAY_KEY_ID || "YOUR_RAZORPAY_KEY_ID" }),
);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
