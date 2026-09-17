import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  refreshToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  adminLoginSchema,
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
  updateProfileSchema,
  changePasswordSchema,
  deleteAccountSchema,
} from "../validations/user.validation.js";
import authUser from "@/middleware/auth.js";
const userRouter = express.Router();
userRouter.post(
  "/forgot-password",
  validate(forgotPasswordSchema),
  requestPasswordReset,
);

userRouter.post(
  "/reset-password/:id/:token",
  validate(resetPasswordSchema),
  resetPassword,
);
userRouter.get("/verify-reset-token/:id/:token", verifyResetToken);
userRouter.post("/register", validate(registerUserSchema), registerUser);
userRouter.post("/login", validate(loginUserSchema), loginUser);
userRouter.post("/admin", validate(adminLoginSchema), adminLogin);
userRouter.post("/refresh", refreshToken);
userRouter.post("/logout", logoutUser);
userRouter.get("/profile", authUser, getProfile);
userRouter.put(
  "/profile",
  authUser,
  validate(updateProfileSchema),
  updateProfile,
);
userRouter.patch(
  "/change-password",
  authUser,
  validate(changePasswordSchema),
  changePassword,
);
userRouter.post(
  "/account",
  authUser,
  validate(deleteAccountSchema),
  deleteAccount,
);
export default userRouter;
