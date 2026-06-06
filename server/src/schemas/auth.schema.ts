/**
 * Auth Validation Schemas
 *
 * Zod schemas for authentication-related request bodies.
 * Accepts the Prisma-shaped `name` field and the older client shape
 * (`firstName` + `lastName`), then route handlers normalize to `name`.
 */

import { z } from "zod";

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be 100 characters or less")
      .trim()
      .optional(),

    firstName: z
      .string()
      .min(1, "First name cannot be empty")
      .max(50, "First name must be 50 characters or less")
      .trim()
      .optional(),

    lastName: z
      .string()
      .min(1, "Last name cannot be empty")
      .max(50, "Last name must be 50 characters or less")
      .trim()
      .optional(),

    email: z
      .string({ required_error: "Email is required" })
      .email("Please provide a valid email address")
      .toLowerCase(),

    password: z
      .string({ required_error: "Password is required" })
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),

    role: z
      .enum(["STUDENT", "TEACHER"], {
        invalid_type_error: "Role must be either STUDENT or TEACHER",
      })
      .default("STUDENT"),
  })
  .superRefine((data, ctx) => {
    const displayName =
      data.name ?? [data.firstName, data.lastName].filter(Boolean).join(" ");

    if (displayName.trim().length < 2) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["name"],
        message: "Name is required",
      });
    }
  });

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email address")
    .toLowerCase(),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
