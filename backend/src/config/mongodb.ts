import mongoose from "mongoose";
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URL;
    if (!mongoURI) {
      throw new Error("MONGODB_URL is not defined in environment variables");
    }
    // Connection event handlers
    mongoose.connection.on("connected", (): void => {
      console.log("DB Connected");
    });
    mongoose.connection.on("error", (error: Error) => {
      console.error("MongoDB Connection Error:", error.message);
    });
    await mongoose.connect(`${mongoURI}/e-commerce`);
  } catch (error) {
    console.error(
      "Failed to connect to MongoDB:",
      error instanceof Error ? error.message : error,
    );
    // process.exit(1) stops the app immediately rather than running with no database
    process.exit(1);
  }
};
export default connectDB;
