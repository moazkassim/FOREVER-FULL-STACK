import { z } from "zod";
// Register User
export const registerUserSchema = z.object({
  firstName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
  lastName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot exceed 50 characters")
    .trim(),
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password cannot exceed 128 characters"),
});

// Login User
export const loginUserSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});

// Admin Login
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email format").toLowerCase().trim(),
  password: z.string().min(1, "Password is required"),
});
export const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email"),
});
export const verifyResetToken = z.object({
  id: z.string(),
  token: z.string(),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6),
});
export const updateProfileSchema = z.object({
  userId: z.string().optional(),
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
});
export const getUserProfileSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
});
export const changePasswordSchema = z.object({
  userId: z.string().optional(),
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
});
export const deleteAccountSchema = z.object({
  userId: z.string().optional(),
  password: z.string().min(1, "Password is required"),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type ForgetPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
export type ResetPasswordParams = z.infer<typeof resetPasswordSchema>;
export type VerifyResetTokenInput = z.infer<typeof verifyResetToken>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type GetUserProfileInput = z.infer<typeof getUserProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;
