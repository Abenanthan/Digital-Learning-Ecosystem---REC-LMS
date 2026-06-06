/**
 * Global Error Handler
 *
 * Provides a custom AppError class for operational errors and a catch-all
 * Express error-handling middleware that formats every error into a
 * consistent JSON envelope.
 */

import { Request, Response, NextFunction } from "express";

// ─── Custom Error Class ──────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    // Preserve correct prototype chain
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

// ─── Error-handling middleware ────────────────────────────────────────────────

export function errorHandler(
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const message =
    err instanceof AppError ? err.message : "Internal Server Error";

  const isDev = process.env.NODE_ENV === "development";

  // Always log the full error in the server console
  console.error(`[ERROR] ${statusCode} - ${err.message}`);
  if (isDev) {
    console.error(err.stack);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(isDev && { stack: err.stack }),
  });
}
