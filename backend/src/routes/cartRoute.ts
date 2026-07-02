import express from "express";
import {
  addToCart,
  updateCart,
  getUserCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addToCartSchema,
  updateCartSchema,
  getUserCartSchema,
} from "../validations/cart.validation.js";

const cartRouter = express.Router();
cartRouter.post("/add", authUser, validate(addToCartSchema), addToCart);
cartRouter.post("/get", authUser, validate(getUserCartSchema), getUserCart);
cartRouter.post("/update", authUser, validate(updateCartSchema), updateCart);
export default cartRouter;
