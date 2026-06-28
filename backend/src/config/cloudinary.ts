// src/config/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

const connectCloudinary = async (): Promise<void> => {
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_SECRET_KEY;
  
  // Validate environment variables
  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Missing Cloudinary configuration. Please check your environment variables:\n" +
        `CLOUDINARY_NAME: ${cloudName ? "✓" : "✗"}\n` +
        `CLOUDINARY_API_KEY: ${apiKey ? "✓" : "✗"}\n` +
        `CLOUDINARY_SECRET_KEY: ${apiSecret ? "✓" : "✗"}`,
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  console.log("Cloudinary connected successfully");
};

export default connectCloudinary;
