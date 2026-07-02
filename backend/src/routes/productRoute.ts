import express from "express";
import {
  addProduct,
  listProduct,
  removeProduct,
  singleProduct,
} from "../controllers/productController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  addProductSchema,
  getSingleProductSchema,
  removeProductSchema,
} from "../validations/product.validation.js";

const productRouter = express.Router();
productRouter.post(
  "/add",
  adminAuth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 2 },
    { name: "image3", maxCount: 3 },
    { name: "image4", maxCount: 4 },
  ]),
  validate(addProductSchema),
  addProduct,
);
productRouter.post(
  "/remove",
  adminAuth,
  validate(removeProductSchema),
  removeProduct,
);
productRouter.post("/single", validate(getSingleProductSchema), singleProduct);
productRouter.get("/list", listProduct);

export default productRouter;
