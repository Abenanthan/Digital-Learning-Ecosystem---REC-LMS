/**
 * Application Entry Point
 *
 * Bootstraps Express with security middleware, logging, route mounting,
 * and a global error handler. Starts listening on the configured PORT.
 */

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import courseRoutes from "./routes/course.routes";
import categoryRoutes from "./routes/category.routes";
import { errorHandler } from "./middleware/errorHandler";

// ─── Create app ──────────────────────────────────────────────────────────────

const app = express();
const PORT = parseInt(process.env.PORT || "5000", 10);

// ─── Global middleware ───────────────────────────────────────────────────────

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health check ────────────────────────────────────────────────────────────

app.get("/api/v1/health", (_req, res) => {
  res.json({
    success: true,
    message: "REC LMS API is running 🚀",
    timestamp: new Date().toISOString(),
  });
});

// ─── API routes ──────────────────────────────────────────────────────────────

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/categories", categoryRoutes);

// ─── 404 catch-all ───────────────────────────────────────────────────────────

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "The requested resource was not found.",
  });
});

// ─── Global error handler (must be last) ─────────────────────────────────────

app.use(errorHandler);

// ─── Start server ────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`\n🚀 REC LMS Server is running`);
  console.log(`   Environment : ${process.env.NODE_ENV || "development"}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   Health      : http://localhost:${PORT}/api/v1/health\n`);
});

export default app;
