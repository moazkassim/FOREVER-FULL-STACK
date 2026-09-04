import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";

import productModel from "../models/productModel.js";
import type {
  AddProductSchema,
  RemoveProductSchema,
} from "../validations/product.validation.js";
import mongoose from "mongoose";
interface ProductFilter {
  category?: { $in: string[] };
  subCategory?: { $in: string[] };
  bestseller?: boolean;
  $or?: Array<{
    name?: { $regex: string; $options: string };
    description?: { $regex: string; $options: string };
  }>;
}
// function for add product
const addProduct = async (
  req: Request<{}, {}, AddProductSchema>,
  res: Response,
) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subCategory,
      sizes,
      bestseller,
    } = req.body;

    // const image1 = req.files.image1 && req.files.image1[0];
    // const image2 = req.files.image2 && req.files.image2[0];
    // const image3 = req.files.image3 && req.files.image3[0];
    // const image4 = req.files.image4 && req.files.image4[0];
    const files = req.files as
      | { [fieldname: string]: Express.Multer.File[] }
      | undefined;

    const image1 = files?.image1?.[0];
    const image2 = files?.image2?.[0];
    const image3 = files?.image3?.[0];
    const image4 = files?.image4?.[0];

    const images = [image1, image2, image3, image4].filter(
      (item) => item !== undefined,
    );
    let imagesUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image",
        });
        return result.secure_url;
      }),
    );

    const productData = {
      name,
      description,
      category,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      price: Number(price),
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now(),
    };

    const product = new productModel(productData);

    await product.save();
    res.json({ success: true, message: "product added" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listProduct = async (req: Request, res: Response) => {
  try {
    const { category, subCategory, search, sortType, bestseller } = req.query;
    const filter: ProductFilter = {};
    if (category) {
      const categories = Array.isArray(category)
        ? (category as string[])
        : [category as string];
      filter.category = { $in: categories };
    }
    if (subCategory) {
      const subCategories = Array.isArray(subCategory)
        ? (subCategory as string[])
        : [subCategory as string];
      filter.subCategory = { $in: subCategories };
    }
    if (bestseller === "true" || bestseller === "1") {
      filter.bestseller = true;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search as string, $options: "i" } },
        { description: { $regex: search as string, $options: "i" } },
      ];
    }
    const sort: { [key: string]: 1 | -1 } = {};
    switch (sortType) {
      case "low-high":
        sort.price = 1;
        break;
      case "high-low":
        sort.price = -1;
        break;
      default:
        sort.createdAt = -1;
        break;
    }
    const products = await productModel.find(filter).sort(sort);
    res.json({ success: true, products });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for remover  product
const removeProduct = async (
  req: Request<{}, {}, RemoveProductSchema>,
  res: Response,
) => {
  try {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Product ID is required",
      });
    }

    const deletedProduct = await productModel.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found. It may have been already deleted.",
      });
    }
    res.json({
      success: true,
      message: "Product removed successfully",
      product: {
        id: deletedProduct._id,
        name: deletedProduct.name,
      },
    });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single  product
const singleProduct = async (
  req: Request<{ productId: string }>,
  res: Response,
) => {
  try {
    const { productId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found.",
      });
    }

    return res.status(200).json({
      success: true,
      product,
    });
  } catch (error: any) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export { addProduct, listProduct, removeProduct, singleProduct };
