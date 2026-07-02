import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
} from "../controllers/userController.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  adminLoginSchema,
  loginUserSchema,
  registerUserSchema,
} from "../validations/user.validation.js";
const userRouter = express.Router();
userRouter.post("/register", validate(registerUserSchema), registerUser);
userRouter.post("/login", validate(loginUserSchema), loginUser);
userRouter.post("/admin", validate(adminLoginSchema), adminLogin);
export default userRouter;
