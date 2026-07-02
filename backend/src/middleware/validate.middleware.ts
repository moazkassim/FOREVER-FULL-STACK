import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Overwrites req.body with the parsed (and type-coerced) result
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.json({
          success: false,
          message: error.issues[0]?.message ?? "Invalid request data",
          errors: error.issues,
        });
      }
      return res.json({ success: false, message: "Validation error" });
    }
  };
};
