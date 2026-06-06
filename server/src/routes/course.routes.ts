/**
 * Course Routes
 *
 * GET    /              – List courses (search, category filter, pagination)
 * GET    /:id           – Get course by ID (includes chapters & instructor)
 * POST   /              – Create course (INSTRUCTOR / ADMIN)
 * PATCH  /:id           – Update course (owner / ADMIN)
 * DELETE /:id           – Delete course (owner / ADMIN)
 * POST   /:id/chapters  – Add a chapter to a course
 * POST   /:id/enroll    – Enroll the authenticated student
 */

import { Router, Request, Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { authenticate, authorize } from "../middleware/auth";
import { validate } from "../middleware/validate";
import { createCourseSchema, updateCourseSchema } from "../schemas/course.schema";
import { AppError } from "../middleware/errorHandler";

const router = Router();

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Generate a URL-safe slug from a title. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ─── GET / ───────────────────────────────────────────────────────────────────

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      search,
      categoryId,
      page = "1",
      limit = "10",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: Record<string, unknown> = { isPublished: true };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          category: true,
          instructor: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
            },
          },
          chapters: { where: { isPublished: true }, select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.course.count({ where }),
    ]);

    res.json({
      success: true,
      data: {
        courses,
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
});

// ─── GET /:id ────────────────────────────────────────────────────────────────

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const course = await prisma.course.findUnique({
      where: { id: req.params.id },
      include: {
        category: true,
        instructor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
          },
        },
        chapters: {
          where: { isPublished: true },
          orderBy: { position: "asc" },
        },
        attachments: true,
        _count: { select: { enrollments: true } },
      },
    });

    if (!course) {
      throw new AppError("Course not found.", 404);
    }

    res.json({ success: true, data: { course } });
  } catch (error) {
    next(error);
  }
});

// ─── POST / ──────────────────────────────────────────────────────────────────

router.post(
  "/",
  authenticate,
  authorize("INSTRUCTOR", "ADMIN"),
  validate(createCourseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, categoryId, price } = req.body;

      // Generate a unique slug
      let slug = slugify(title);
      const existing = await prisma.course.findUnique({ where: { slug } });
      if (existing) {
        slug = `${slug}-${Date.now()}`;
      }

      const course = await prisma.course.create({
        data: {
          title,
          slug,
          description,
          categoryId,
          price,
          instructorId: req.user!.userId,
        },
      });

      res.status(201).json({
        success: true,
        message: "Course created successfully.",
        data: { course },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── PATCH /:id ──────────────────────────────────────────────────────────────

router.patch(
  "/:id",
  authenticate,
  validate(updateCourseSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        throw new AppError("Course not found.", 404);
      }

      // Only the owner or an ADMIN may update
      if (
        course.instructorId !== req.user!.userId &&
        req.user!.role !== "ADMIN"
      ) {
        throw new AppError("You are not authorised to update this course.", 403);
      }

      const updated = await prisma.course.update({
        where: { id: req.params.id },
        data: req.body,
      });

      res.json({
        success: true,
        message: "Course updated successfully.",
        data: { course: updated },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── DELETE /:id ─────────────────────────────────────────────────────────────

router.delete(
  "/:id",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        throw new AppError("Course not found.", 404);
      }

      if (
        course.instructorId !== req.user!.userId &&
        req.user!.role !== "ADMIN"
      ) {
        throw new AppError("You are not authorised to delete this course.", 403);
      }

      await prisma.course.delete({ where: { id: req.params.id } });

      res.json({ success: true, message: "Course deleted successfully." });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /:id/chapters ─────────────────────────────────────────────────────

router.post(
  "/:id/chapters",
  authenticate,
  authorize("INSTRUCTOR", "ADMIN"),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        throw new AppError("Course not found.", 404);
      }

      if (
        course.instructorId !== req.user!.userId &&
        req.user!.role !== "ADMIN"
      ) {
        throw new AppError(
          "You are not authorised to add chapters to this course.",
          403
        );
      }

      // Auto-calculate next position
      const lastChapter = await prisma.chapter.findFirst({
        where: { courseId: course.id },
        orderBy: { position: "desc" },
      });

      const position = (lastChapter?.position ?? 0) + 1;

      const chapter = await prisma.chapter.create({
        data: {
          title: req.body.title,
          description: req.body.description,
          videoUrl: req.body.videoUrl,
          position,
          courseId: course.id,
        },
      });

      res.status(201).json({
        success: true,
        message: "Chapter added successfully.",
        data: { chapter },
      });
    } catch (error) {
      next(error);
    }
  }
);

// ─── POST /:id/enroll ───────────────────────────────────────────────────────

router.post(
  "/:id/enroll",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
      });

      if (!course) {
        throw new AppError("Course not found.", 404);
      }

      if (!course.isPublished) {
        throw new AppError("This course is not available for enrollment.", 400);
      }

      // Check for existing enrollment
      const existing = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user!.userId,
            courseId: course.id,
          },
        },
      });

      if (existing) {
        throw new AppError("You are already enrolled in this course.", 409);
      }

      const enrollment = await prisma.enrollment.create({
        data: {
          userId: req.user!.userId,
          courseId: course.id,
        },
      });

      res.status(201).json({
        success: true,
        message: "Enrolled successfully.",
        data: { enrollment },
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
