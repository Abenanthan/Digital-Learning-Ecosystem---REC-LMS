/**
 * User Routes
 *
 * GET   /      – List all users (ADMIN only)
 * GET   /:id   – Get user profile (public)
 * PATCH /:id   – Update user profile (self or ADMIN)
 */

import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// ─── Validation ──────────────────────────────────────────────────────────────

const updateUserSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

// ─── Fields we never leak to clients ─────────────────────────────────────────

const PUBLIC_USER_SELECT = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
} as const;

// ─── GET / ───────────────────────────────────────────────────────────────────

router.get(
  "/",
  authenticate,
  authorize("ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        page = "1",
        limit = "20",
        role,
        search,
      } = req.query as Record<string, string>;

      const pageNum = Math.max(1, parseInt(page, 10) || 1);
      const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
      const skip = (pageNum - 1) * limitNum;

      const where: Record<string, unknown> = {};

      if (role) {
        where.role = role;
      }

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          where,
          select: PUBLIC_USER_SELECT,
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum,
        }),
        prisma.user.count({ where }),
      ]);

      res.json({
        success: true,
        data: {
          users,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── GET /:id ────────────────────────────────────────────────────────────────

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        ...PUBLIC_USER_SELECT,
        courses: {
          where: { isPublished: true },
          select: { id: true, title: true, thumbnail: true },
        },
        _count: { select: { enrollments: true } },
      },
    });

    if (!user) {
      throw new AppError("User not found.", 404);
    }

    res.json({ success: true, data: { user } });
  } catch (error) {
    next(error);
  }
});

// ─── PATCH /:id ──────────────────────────────────────────────────────────────

router.patch(
  "/:id",
  authenticate,
  validate(updateUserSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Users can only update their own profile, unless they're an ADMIN
      if (req.params.id !== req.user!.userId && req.user!.role !== "ADMIN") {
        throw new AppError(
          "You are not authorised to update this profile.",
          403
        );
      }

      const user = await prisma.user.findUnique({
        where: { id: req.params.id },
      });

      if (!user) {
        throw new AppError("User not found.", 404);
      }

      const updated = await prisma.user.update({
        where: { id: req.params.id },
        data: {
          name: req.body.name,
        },
        select: PUBLIC_USER_SELECT,
      });

      res.json({
        success: true,
        message: "Profile updated successfully.",
        data: { user: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
