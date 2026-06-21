import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import { products } from "../assets/assets.js";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "dlukffjba",
  api_key: "617658719212322",
  api_secret: "AM5aj2kCGAkz9kmidt-ntuCzwkM",
});
await mongoose.connect(
  "mongodb+srv://moazkassim100_db_user:ZNH3HunQy5LHJ6DK@cluster0.wgi67ut.mongodb.net",
);
let finalProducts = [];
for (const product of products) {
  let imagesPath = [];
  try {
    if (product.image[0]) {
      const result = await cloudinary.uploader.upload(product.image[0], {
        resource_type: "image",
      });
      console.log(result.secure_url);
      imagesPath.push(result.secure_url);
    }
    if (product.image[1]) {
      const result = await cloudinary.uploader.upload(product.image[1], {
        resource_type: "image",
      });
      imagesPath.push(result.secure_url);
    }
    if (product.image[2]) {
      const result = await cloudinary.uploader.upload(product.image[2], {
        resource_type: "image",
      });
      imagesPath.push(result.secure_url);
    }
    if (product.image[3]) {
      const result = await cloudinary.uploader.upload(product.image[3], {
        resource_type: "image",
      });
      imagesPath.push(result.secure_url);
    }
    console.log({ ...product, image: imagesPath });
    finalProducts.push({ ...product, image: imagesPath });
  } catch (error) {
    console.log(error);
  }
}

console.log(finalProducts);
await productModel.insertMany(finalProducts);
console.log("Products seeded successfully");
await mongoose.connection.close();
process.exit(0);;
