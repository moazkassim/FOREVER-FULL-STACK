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
} from "../controllers/userController.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  adminLoginSchema,
  forgotPasswordSchema,
  loginUserSchema,
  registerUserSchema,
  resetPasswordSchema,
} from "../validations/user.validation.js";
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

export default userRouter;
