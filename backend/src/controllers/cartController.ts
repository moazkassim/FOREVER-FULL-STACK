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
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    if (!itemId || !size) {
      return res.status(400).json({
        success: false,
        message: "Item ID and size are required",
      });
    }
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
    res.json({ success: true, message: "Added to cart", cartData });
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
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let cartData = await userData.cartData;
    if (quantity > 0) {
      cartData[itemId][size] = quantity;
      await userModel.findByIdAndUpdate(userId, { cartData });
      res.json({ success: true, message: "Cart Updated", cartData });
    } else {
      await userModel.findByIdAndUpdate(userId, {
        $unset: { [`cartData.${itemId}.${size}`]: "" },
      });
      res.json({ success: true, message: "item deleted", cartData });
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
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }

    const userData = await userModel.findById(userId);
    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    let cartProducts = await userData.cartData;
    let cartCount = 0;
    for (const productId in cartProducts) {
      const sizes = cartProducts[productId];
      for (const size in sizes) {
        const quantity = sizes[size];
        if (quantity > 0) {
          cartCount += quantity;
        }
      }
    }

    return res.status(200).json({
      success: true,
      cartProducts,
      cartCount,
    });
  } catch (error: any) {
    console.error("Error in getUserCart:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch cart",
    });
  }
};

export { addToCart, updateCart, getUserCart };
