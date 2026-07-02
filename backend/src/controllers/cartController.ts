import type {
  AddToCartInput,
  GetUserCartInput,
  UpdateCartInput,
} from "../validations/cart.validation.js";
import userModel from "../models/userModel.js";
import type { Request, Response } from "express";
// add products to cart
const addToCart = async (
  req: Request<{}, {}, AddToCartInput>,
  res: Response,
) => {
  try {
    const { userId, itemId, size } = req.body;
    const userData = await userModel.findById(userId);

    let cartData = await userData.cartData;
    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Added to cart" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// update cart
const updateCart = async (
  req: Request<{}, {}, UpdateCartInput>,
  res: Response,
) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);
    let cartData = await userData.cartData;
    if (quantity > 0) {
      cartData[itemId][size] = quantity;
      await userModel.findByIdAndUpdate(userId, { cartData });
      res.json({ success: true, message: "Cart Updated" });
    } else {
      await userModel.findByIdAndUpdate(userId, {
        $unset: { [`cartData.${itemId}`]: "" },
      });
      res.json({ success: true, message: "item deleted" });
    }
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
// get user cart data
const getUserCart = async (
  req: Request<{}, {}, GetUserCartInput>,
  res: Response,
) => {
  try {
    const { userId } = req.body;
    console.log("user id", userId);
    const userData = await userModel.findById(userId);

    console.log("user data", userData);
    let cartData = await userData.cartData;
    console.log("cart data", cartData);
    res.json({ success: true, cartData });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export { addToCart, updateCart, getUserCart };
