import { v2 as cloudinary } from "cloudinary";
import type { Request, Response } from "express";

import productModel from "../models/productModel.js";
import type {
  AddProductSchema,
  GetSingleProductSchema,
  RemoveProductSchema,
} from "../validations/product.validation.js";
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

// function for  list products
const listProduct = async (_req: Request, res: Response) => {
  try {
    const products = await productModel.find({});
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
    await productModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "product removed" });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// function for single  product
const singleProduct = async (
  req: Request<{}, {}, GetSingleProductSchema>,
  res: Response,
) => {
  try {
    const { productId } = req.body;
    const product = await productModel.findById(productId);
    res.json({ success: true, product });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProduct, removeProduct, singleProduct };
