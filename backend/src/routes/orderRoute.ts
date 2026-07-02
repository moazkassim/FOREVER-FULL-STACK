import express from "express";
import {
  placeOrder,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  placeOrderSchema,
  placeOrderStripeSchema,
  updateStatusSchema,
  userOrdersSchema,
  verifyStripeSchema,
} from "../validations/order.validation.js";
const orderRouter = express.Router();
// admin features
orderRouter.post("/list", adminAuth, allOrders);
orderRouter.post(
  "/status",
  adminAuth,
  validate(updateStatusSchema),
  updateStatus,
);
// payment features
orderRouter.post("/place", authUser, validate(placeOrderSchema), placeOrder);
orderRouter.post(
  "/stripe",
  authUser,
  validate(placeOrderStripeSchema),
  placeOrderStripe,
);
// user features
orderRouter.post(
  "/userorders",
  authUser,
  validate(userOrdersSchema),
  userOrders,
);
//verify payment
orderRouter.post(
  "/verifyStripe",
  authUser,
  validate(verifyStripeSchema),
  verifyStripe,
);

export default orderRouter;
