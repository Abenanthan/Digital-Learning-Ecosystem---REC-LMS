/**
 * Course Validation Schemas
 *
 * Zod schemas for course-related request bodies.
 */

import { z } from "zod";

// ─── Create Course ───────────────────────────────────────────────────────────

export const createCourseSchema = z.object({
  title: z
    .string({ required_error: "Title is required" })
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be 200 characters or less"),

  description: z
    .string()
    .max(5000, "Description must be 5000 characters or less")
    .optional(),

  categoryId: z
    .string()
    .uuid("Category ID must be a valid UUID")
    .optional(),

  price: z
    .number()
    .min(0, "Price cannot be negative")
    .optional(),
});

export type CreateCourseInput = z.infer<typeof createCourseSchema>;

// ─── Update Course ───────────────────────────────────────────────────────────

export const updateCourseSchema = createCourseSchema.partial().extend({
  isPublished: z.boolean().optional(),
});

export type UpdateCourseInput = z.infer<typeof updateCourseSchema>;
