import { z } from "zod";
// MongoDB ObjectId validation
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Valid sizes for the application
const validSizes = ["S", "M", "L", "XL", "XXL"] as const;
// Add to Cart Schema
export const addToCartSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(objectIdRegex, "Invalid user ID format"),

  itemId: z
    .string()
    .min(1, "Item ID is required")
    .regex(objectIdRegex, "Invalid item ID format"),

  size: z.enum(validSizes, {
    message: "Invalid size. Must be S, M, L, XL, or XXL",
  }),
});
// Update Cart Schema
export const updateCartSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(objectIdRegex, "Invalid user ID format"),

  itemId: z
    .string()
    .min(1, "Item ID is required")
    .regex(objectIdRegex, "Invalid item ID format"),

  size: z.enum(validSizes, {
    message: "Invalid size. Must be S, M, L, XL, or XXL",
  }),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .min(0, "Quantity cannot be negative")
    .max(100, "Quantity cannot exceed 100"),
});
// Get User Cart Schema
export const getUserCartSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(objectIdRegex, "Invalid user ID format"),
});

// Type exports
export type AddToCartInput = z.infer<typeof addToCartSchema>;
export type UpdateCartInput = z.infer<typeof updateCartSchema>;
export type GetUserCartInput = z.infer<typeof getUserCartSchema>;
