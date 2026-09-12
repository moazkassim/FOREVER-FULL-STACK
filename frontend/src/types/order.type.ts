import * as z from "zod";
import type { ProductType } from "./product.types";

export const placeOrderSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipcode: z
    .string()
    .min(1, "ZIP code is required")
    .regex(/^[0-9]+$/, "Numbers only"),
  country: z.string().min(1, "Country is required"),
  phone: z.string().min(10, "Enter a valid phone number"),
  method: z.enum(["cod", "stripe", "razorpay"]),
});
export type PlaceOrderValues = z.infer<typeof placeOrderSchema>;
export interface FormField {
  name: keyof PlaceOrderValues;
  control: any;
  label?: string;
  placeholder: string;
  type?: string;
  disabled?: boolean;
  className?: string;
}
export interface OrderItem extends ProductType {
  size: string;
  quantity: number;
  status: string;
  payment: boolean;
  paymentMethod: string;
  date: string;
}
export interface VerifyStripeRequest {
  success: string;
  orderId: string;
}
