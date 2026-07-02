import { z } from "zod";

const addressSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .trim(),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .trim(),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters")
    .trim()
    .toLowerCase(),

  street: z
    .string()
    .min(1, "Street address is required")
    .max(200, "Street address must be less than 200 characters")
    .trim(),

  city: z
    .string()
    .min(1, "City is required")
    .max(100, "City must be less than 100 characters")
    .trim(),

  state: z
    .string()
    .min(1, "State is required")
    .max(100, "State must be less than 100 characters")
    .trim(),

  zipcode: z
    .string()
    .min(1, "ZIP code is required")
    .max(20, "ZIP code must be less than 20 characters")
    .regex(/^[0-9]{5,6}$/, "Invalid ZIP code format") // Adjust regex based on your country
    .trim(),

  country: z
    .string()
    .min(1, "Country is required")
    .max(100, "Country must be less than 100 characters")
    .trim(),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .max(20, "Phone number must be less than 20 characters")
    .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number format") // Adjust based on requirements
    .trim(),
});
// Order Item Schema
const orderItemSchema = z.object({
  _id: z
    .string()
    .min(1, "Product ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid product ID format"), // MongoDB ObjectId validation

  name: z.string().min(1, "Product name is required"),

  price: z
    .number()
    .positive("Price must be positive")
    .min(0.01, "Price must be at least 0.01"),

  description: z.string().optional(),

  image: z
    .array(z.string().url("Invalid image URL"))
    .min(1, "At least one image is required"),

  category: z.string().min(1, "Category is required"),

  subCategory: z.string().min(1, "Sub category is required"),

  sizes: z.array(z.string()).optional(),

  bestseller: z.boolean().optional(),

  size: z.string().min(1, "Size selection is required"),

  quantity: z
    .number()
    .int("Quantity must be a whole number")
    .positive("Quantity must be positive")
    .min(1, "Minimum quantity is 1")
    .max(100, "Maximum quantity is 100"),
});
export const placeOrderSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),

  items: z
    .array(orderItemSchema)
    .min(1, "At least one item is required")
    .max(50, "Maximum 50 items per order"),

  amount: z
    .number()
    .positive("Amount must be positive")
    .min(0.01, "Amount must be at least 0.01"),

  address: addressSchema,
});

// Verify Stripe Schema
export const verifyStripeSchema = z.object({
  orderId: z
    .string()
    .min(1, "Order ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID format"),

  success: z
    .string()
    .refine(
      (val) => val === "true" || val === "false",
      "Success must be 'true' or 'false'",
    ),

  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});
export const placeOrderStripeSchema = placeOrderSchema;
// Update Status Schema
export const updateStatusSchema = z.object({
  orderId: z
    .string()
    .min(1, "Order ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid order ID format"),

  status: z.enum(
    [
      "Order Placed",
      "Packing",
      "Shipped",
      "Out for delivery",
      "Delivered",
      "Cancelled",
    ],
    {
      message: "Invalid order status",
    },
  ),
});
// User Orders Schema
export const userOrdersSchema = z.object({
  userId: z
    .string()
    .min(1, "User ID is required")
    .regex(/^[0-9a-fA-F]{24}$/, "Invalid user ID format"),
});
export type PlaceOrderInput = z.infer<typeof placeOrderSchema>;
export type VerifyStripeInput = z.infer<typeof verifyStripeSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type UserOrdersInput = z.infer<typeof userOrdersSchema>;
export type AddressInput = z.infer<typeof addressSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
