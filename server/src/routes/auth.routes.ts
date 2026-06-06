/**
 * Auth Routes
 *
 * POST /register  – Create a new user account (student or teacher)
 * POST /login     – Authenticate and receive JWT access + refresh tokens
 * POST /refresh   – Rotate tokens using the refresh cookie/body (Redis-backed)
 * POST /logout    – Invalidate the refresh token in Redis
 * GET  /me        – Return the authenticated user's profile
 */

import { Router, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import {
  generateTokenPair,
  verifyRefreshToken,
  TokenPayload,
} from "../lib/jwt";
import {
  storeRefreshToken,
  getRefreshToken,
  deleteRefreshToken,
} from "../lib/redis";
import { authenticateToken } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { registerSchema, loginSchema } from "../schemas/auth.schema";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Cookie options shared between set & clear. */
const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/** Paths used by current and legacy auth cookie configurations. */
const REFRESH_COOKIE_CLEAR_PATHS = ["/", "/api", "/api/v1/auth", "/api/auth"];

/** Build a standard token payload from a user record. */
function toPayload(user: {
  id: string;
  email: string;
  role: string;
}): TokenPayload {
  return { userId: user.id, email: user.email, role: user.role };
}

/** Sanitised user object returned in API responses. */
function sanitiseUser(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: Date;
}) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
  };
}

/** Normalize supported registration body shapes into the Prisma `name` field. */
function getDisplayName(body: {
  name?: string;
  firstName?: string;
  lastName?: string;
}): string {
  return (
    body.name ?? [body.firstName, body.lastName].filter(Boolean).join(" ")
  ).trim();
}

/** Read refresh token from JSON body first, then from httpOnly cookie. */
function getRefreshTokenFromRequest(req: Request): string | undefined {
  const bodyToken =
    typeof req.body?.refreshToken === "string"
      ? req.body.refreshToken.trim()
      : undefined;
  const cookieToken =
    typeof req.cookies?.refreshToken === "string"
      ? req.cookies.refreshToken
      : undefined;

  return bodyToken || cookieToken;
}

function clearRefreshCookie(res: Response): void {
  REFRESH_COOKIE_CLEAR_PATHS.forEach((path) => {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict" as const,
      path,
    });
  });
}

// ─── POST /register ──────────────────────────────────────────────────────────

router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, role } = req.body;
      const name = getDisplayName(req.body);

      // Check for existing user
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError("An account with this email already exists.", 409);
      }

      // Hash password & create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });

      // Generate tokens
      const payload = toPayload(user);
      const { accessToken, refreshToken } = generateTokenPair(payload);

      // Store refresh token in Redis
      await storeRefreshToken(user.id, refreshToken);

      // Set refresh cookie
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        message: "Account created successfully.",
        data: {
          accessToken,
          refreshToken,
          user: sanitiseUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /login ─────────────────────────────────────────────────────────────

router.post(
  "/login",
  validate(loginSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new AppError("Invalid email or password.", 401);
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new AppError("Invalid email or password.", 401);
      }

      // Generate tokens
      const payload = toPayload(user);
      const { accessToken, refreshToken } = generateTokenPair(payload);

      // Store refresh token in Redis
      await storeRefreshToken(user.id, refreshToken);

      // Set refresh cookie
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        data: {
          accessToken,
          refreshToken,
          user: sanitiseUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /refresh ───────────────────────────────────────────────────────────

router.post(
  "/refresh",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getRefreshTokenFromRequest(req);

      if (!token) {
        throw new AppError("Refresh token not found.", 401);
      }

      // Verify JWT signature & expiry
      let decoded;
      try {
        decoded = verifyRefreshToken(token);
      } catch {
        clearRefreshCookie(res);
        throw new AppError("Invalid or expired refresh token.", 401);
      }

      // Ensure it matches what is stored in Redis (single-use rotation)
      const storedToken = await getRefreshToken(decoded.userId);
      if (!storedToken || storedToken !== token) {
        // Possible token reuse → invalidate to be safe
        await deleteRefreshToken(decoded.userId);
        clearRefreshCookie(res);
        throw new AppError("Refresh token has been revoked.", 401);
      }

      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });
      if (!user) {
        await deleteRefreshToken(decoded.userId);
        clearRefreshCookie(res);
        throw new AppError("User no longer exists.", 401);
      }

      // Issue new pair (rotation)
      const payload = toPayload(user);
      const { accessToken, refreshToken } = generateTokenPair(payload);

      // Replace old token in Redis
      await storeRefreshToken(user.id, refreshToken);

      // Set new cookie
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(200).json({
        success: true,
        data: {
          accessToken,
          refreshToken,
          user: sanitiseUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /logout ────────────────────────────────────────────────────────────

router.post(
  "/logout",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = getRefreshTokenFromRequest(req);

      if (!token) {
        clearRefreshCookie(res);
        throw new AppError("Refresh token is required.", 400);
      }

      let decoded;
      try {
        decoded = verifyRefreshToken(token);
      } catch {
        clearRefreshCookie(res);
        throw new AppError("Invalid or expired refresh token.", 401);
      }

      // Remove the refresh token from Redis if it is the active token.
      const storedToken = await getRefreshToken(decoded.userId);
      if (storedToken === token) {
        await deleteRefreshToken(decoded.userId);
      }

      // Clear cookie
      clearRefreshCookie(res);

      res.status(200).json({
        success: true,
        message: "Logged out successfully.",
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── GET /me ─────────────────────────────────────────────────────────────────

router.get(
  "/me",
  authenticateToken,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError("User not found.", 404);
      }

      res.status(200).json({
        success: true,
        data: { user },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
