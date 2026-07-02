import { z } from "zod";
export const addProductSchema = z.object({
  // Text fields - error messages go in the object schema, not .string()
  name: z
    .string()
    .min(1, "Product name cannot be empty")
    .max(100, "Product name must be less than 100 characters")
    .trim(),

  description: z
    .string()
    .min(1, "Product description cannot be empty")
    .max(1000, "Product description must be less than 1000 characters")
    .trim(),

  // Price - received as string from FormData
  price: z
    .string()
    .min(1, "Product price cannot be empty")
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0,
      "Price must be a positive number",
    ),

  // Category - enum with fixed values
  category: z.enum(["Men", "Women", "Kids"], {
    message: "Category must be Men, Women, or Kids",
  }),

  // SubCategory - enum with fixed values
  subCategory: z.enum(["Topwear", "Bottomwear", "Winterwear"], {
    message: "Sub category must be Topwear, Bottomwear, or Winterwear",
  }),

  // Bestseller - received as string ("true"/"false")
  bestseller: z
    .string()
    .refine(
      (val) => val === "true" || val === "false",
      "Bestseller must be 'true' or 'false'",
    ),

  // Sizes - received as JSON string
  sizes: z
    .string()
    .min(1, "At least one size must be selected")
    .refine((val) => {
      try {
        const parsed = JSON.parse(val);
        const validSizes = ["S", "M", "L", "XL", "XXL"];
        return (
          Array.isArray(parsed) &&
          parsed.length > 0 &&
          parsed.every((s: string) => validSizes.includes(s))
        );
      } catch {
        return false;
      }
    }, "Sizes must be a valid JSON array with valid sizes (S, M, L, XL, XXL)"),
});

// Get Single Product
export const getSingleProductSchema = z.object({
  productId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
});
// Delete a Product
export const removeProductSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID"),
});
export type AddProductSchema = z.infer<typeof addProductSchema>;
export type GetSingleProductSchema = z.infer<typeof getSingleProductSchema>;
export type RemoveProductSchema = z.infer<typeof removeProductSchema>;
