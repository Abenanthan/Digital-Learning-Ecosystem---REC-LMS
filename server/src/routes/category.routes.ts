/**
 * Category Routes
 *
 * GET  /  – List all categories
 * POST /  – Create a new category (ADMIN only)
 */

import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// ─── Validation ──────────────────────────────────────────────────────────────

const createCategorySchema = z.object({
  name: z
    .string({ required_error: "Category name is required" })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less"),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── GET / ───────────────────────────────────────────────────────────────────

router.get("/", async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { courses: true } } },
      orderBy: { name: "asc" },
    });

    res.json({ success: true, data: { categories } });
  } catch (error) {
    next(error);
  }
});

// ─── POST / ──────────────────────────────────────────────────────────────────

router.post(
  "/",
  authenticate,
  authorize("ADMIN"),
  validate(createCategorySchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name } = req.body;
      const slug = slugify(name);

      // Check for duplicates
      const existing = await prisma.category.findFirst({
        where: { OR: [{ name }, { slug }] },
      });

      if (existing) {
        throw new AppError("A category with this name already exists.", 409);
      }

      const category = await prisma.category.create({
        data: { name, slug },
      });

      res.status(201).json({
        success: true,
        message: "Category created successfully.",
        data: { category },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
