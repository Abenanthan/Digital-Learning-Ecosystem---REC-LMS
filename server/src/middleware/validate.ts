/**
 * Zod Validation Middleware
 *
 * Factory that returns Express middleware validating `req.body` against
 * the supplied Zod schema. On failure it returns a 400 with structured
 * validation error messages.
 */

import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

/**
 * Validate `req.body` against a Zod schema.
 *
 * @example
 * router.post("/register", validate(registerSchema), registerHandler);
 */
export function validate(schema: AnyZodObject) {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const formatted = error.errors.map((err) => ({
          field: err.path.join("."),
          message: err.message,
        }));

        res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: formatted,
        });
        return;
      }

      next(error);
    }
  };
}
