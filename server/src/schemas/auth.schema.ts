/**
 * Auth Validation Schemas
 *
 * Zod schemas for authentication-related request bodies.
 */

import { z } from "zod";

// ─── Register ────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must contain at least one special character"
    ),

  firstName: z
    .string({ required_error: "First name is required" })
    .min(1, "First name cannot be empty")
    .max(50, "First name must be 50 characters or less"),

  lastName: z
    .string({ required_error: "Last name is required" })
    .min(1, "Last name cannot be empty")
    .max(50, "Last name must be 50 characters or less"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// ─── Login ───────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .email("Please provide a valid email address"),

  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;
