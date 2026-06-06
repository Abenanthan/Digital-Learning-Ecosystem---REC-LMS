/**
 * Auth Routes
 *
 * POST /register  – Create a new user account
 * POST /login     – Authenticate and receive token pair
 * POST /refresh   – Rotate tokens using the refresh cookie
 * POST /logout    – Clear refresh token
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
import { authenticate } from "../middleware/auth";
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
  path: "/api/v1/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

/** Build a standard token payload from a user record. */
function toPayload(user: {
  id: string;
  email: string;
  role: string;
}): TokenPayload {
  return { userId: user.id, email: user.email, role: user.role };
}

// ─── POST /register ──────────────────────────────────────────────────────────

router.post(
  "/register",
  validate(registerSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check for existing user
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError("An account with this email already exists.", 409);
      }

      // Hash password & create user
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await prisma.user.create({
        data: { email, passwordHash, firstName, lastName },
      });

      // Generate tokens
      const payload = toPayload(user);
      const { accessToken, refreshToken } = generateTokenPair(payload);

      // Persist refresh token hash
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      // Set refresh cookie
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        message: "Account created successfully.",
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
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
      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new AppError("Invalid email or password.", 401);
      }

      // Generate tokens
      const payload = toPayload(user);
      const { accessToken, refreshToken } = generateTokenPair(payload);

      // Persist refresh token
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      // Set refresh cookie
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({
        success: true,
        message: "Logged in successfully.",
        data: {
          accessToken,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
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
      const token: string | undefined = req.cookies?.refreshToken;

      if (!token) {
        throw new AppError("Refresh token not found.", 401);
      }

      // Verify token
      const decoded = verifyRefreshToken(token);

      // Check that the token matches what's stored (single-use rotation)
      const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user || user.refreshToken !== token) {
        throw new AppError("Invalid refresh token.", 401);
      }

      // Issue new pair
      const payload = toPayload(user);
      const { accessToken, refreshToken } = generateTokenPair(payload);

      // Rotate stored token
      await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken },
      });

      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);

      res.json({
        success: true,
        data: { accessToken },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /logout ────────────────────────────────────────────────────────────

router.post(
  "/logout",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Clear refresh token in DB
      await prisma.user.update({
        where: { id: req.user!.userId },
        data: { refreshToken: null },
      });

      // Clear cookie
      res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
        path: "/api/v1/auth",
      });

      res.json({ success: true, message: "Logged out successfully." });
    } catch (error) {
      next(error);
    }
  }
);

// ─── GET /me ─────────────────────────────────────────────────────────────────

router.get(
  "/me",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          avatar: true,
          bio: true,
          isVerified: true,
          createdAt: true,
        },
      });

      if (!user) {
        throw new AppError("User not found.", 404);
      }

      res.json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
