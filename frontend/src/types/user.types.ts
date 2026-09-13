import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});
export const registerSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(128, "Password must be less than 128 characters"),
});
export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
export interface AuthState {
  token: string;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  clearAuth: () => void;
}
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  id: string;
  token: string;
  password: string;
}

export interface AuthMessageResponse {
  success: boolean;
  message: string;
}
