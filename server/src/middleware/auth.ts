/**
 * Authentication & Authorization Middleware
 *
 * • `authenticateToken` – verifies the Bearer access token and attaches the
 *   decoded payload to `req.user`.
 * • `authorizeRole(...roles)` – restricts access to the listed roles.
 *
 * The older `authenticate` / `authorize` names are re-exported as aliases
 * so existing route files continue to compile without changes.
 */

import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, DecodedToken } from "../lib/jwt";

// ─── Extend Express Request ─────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      /** Populated by the `authenticateToken` middleware after JWT verification. */
      user?: DecodedToken;
    }
  }
}

// ─── authenticateToken ──────────────────────────────────────────────────────

/**
 * Extracts the Bearer token from the `Authorization` header, verifies it,
 * and attaches the decoded payload to `req.user`.
 *
 * Responds with:
 *   401 – missing or malformed header
 *   401 – invalid / expired token
 */
export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      message: "Authentication required. Please provide a valid token.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
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

// ─── authorizeRole ──────────────────────────────────────────────────────────

/**
 * Returns middleware that checks whether `req.user.role` is among the
 * allowed roles.  Must be used **after** `authenticateToken`.
 *
 * @example
 * router.get("/admin", authenticateToken, authorizeRole("ADMIN"), handler);
 * router.post("/", authenticateToken, authorizeRole("ADMIN", "TEACHER"), handler);
 */
export function authorizeRole(...roles: string[]) {
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
        message: `Access denied. Required role(s): ${roles.join(", ")}.`,
      });
      return;
    }

    next();
  };
}

// ─── Aliases (backward-compatibility) ───────────────────────────────────────

export const authenticate = authenticateToken;
export const authorize = authorizeRole;
