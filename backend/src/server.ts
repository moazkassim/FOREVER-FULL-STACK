import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";
import corsOptions from "./config/cors.js";
import cookieParser from "cookie-parser"; // ← add this
console.log("\n=== IMPORT CHECK ===");
console.log("userRouter:", typeof userRouter);
console.log("productRouter:", typeof productRouter);
console.log("cartRouter:", typeof cartRouter);
console.log("orderRouter:", typeof orderRouter);
console.log("====================\n");
// App config

const app: Express = express();
const port = process.env.PORT || 4000;
app.use(cookieParser());
connectDB();
connectCloudinary();

// Middle wares
app.use(express.json());
app.use(cors(corsOptions));

// api endpoints
app.get("/", (_req: Request, res: Response) => {
  res.send("API Working");
});

console.log("Mounting routers...");

try {
  app.use("/api/user", userRouter);
  console.log("✅ userRouter mounted");
} catch (e) {
  console.error("❌ userRouter mount failed:", e);
}

try {
  app.use("/api/product", productRouter);
  console.log("✅ productRouter mounted");
} catch (e) {
  console.error("❌ productRouter mount failed:", e);
}

try {
  app.use("/api/cart", cartRouter);
  console.log("✅ cartRouter mounted");
} catch (e) {
  console.error("❌ cartRouter mount failed:", e);
}

try {
  app.use("/api/order", orderRouter);
  console.log("✅ orderRouter mounted");
} catch (e) {
  console.error("❌ orderRouter mount failed:", e);
}
app.listen(port, () => console.log("Server started on port : " + port));
