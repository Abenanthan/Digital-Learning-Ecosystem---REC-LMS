/**
 * Authentication & Authorization Middleware
 *
 * • `authenticate` – verifies the Bearer access token and attaches the
 *   decoded payload to `req.user`.
 * • `authorize(...roles)` – restricts access to the listed roles.
 */

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, DecodedToken } from "../lib/jwt";

// ─── Extend Express Request ─────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      /** Populated by the `authenticate` middleware after JWT verification. */
      user?: DecodedToken;
    }
  }
}

// ─── Authenticate ────────────────────────────────────────────────────────────

/**
 * Extracts the Bearer token from the Authorization header, verifies it,
 * and attaches the decoded payload to `req.user`.
 */
export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({
        success: false,
        message: "Authentication required. Please provide a valid token.",
      });
      return;
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token. Please log in again.",
    });
  }
}

// ─── Authorize ───────────────────────────────────────────────────────────────

/**
 * Returns middleware that checks whether `req.user.role` is among the
 * allowed roles. Must be used *after* `authenticate`.
 *
 * @example
 * router.post("/", authenticate, authorize("ADMIN", "INSTRUCTOR"), handler);
 */
export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
      });
      return;
    }

    next();
  };
}
