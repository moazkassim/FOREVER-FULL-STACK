import userModel from "../models/userModel.js";
import type { Request, Response } from "express";
// add products to cart
const addToCart = async (req: Request, res: Response) => {
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.json({ success: false, message });
  }
};
// update cart
const updateCart = async (req: Request, res: Response) => {
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.json({ success: false, message });
  }
};
// get user cart data
const getUserCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);
    console.log(userData);
    let cartData = await userData.cartData;
    res.json({ success: true, cartData });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.json({ success: false, message });
  }
};
export { addToCart, updateCart, getUserCart };
