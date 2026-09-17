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
import cookieParser from "cookie-parser";

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

app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/cart", cartRouter);

app.use("/api/order", orderRouter);

app.listen(port, () => console.log("Server started on port : " + port));
