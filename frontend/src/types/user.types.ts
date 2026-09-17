import * as z from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, "first Name is required")
    .min(1, "first Name must be at least 1 characters")
    .max(50, "first Name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "last Name is required")
    .min(1, "last Name must be at least 1 characters")
    .max(50, "last Name must be less than 50 characters"),
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
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
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
export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  avatar?: string;

  location?: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  accountVisibility: boolean;
  createdAt: string;
  updatedAt: string;
}
export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;

  location?: string;
  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;
}
export const profileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email(),
  phone: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
  location: z.string().optional(),
});
export type ProfileForm = z.infer<typeof profileSchema>;

export interface PersonalTabProps {
  isEditing: boolean;
  onCancel: () => void;
  onSaved: () => void;
}
export interface AuthUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatar?: string;
}
