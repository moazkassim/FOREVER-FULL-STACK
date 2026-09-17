import mongoose, { Document, Schema } from "mongoose";
export interface User extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  cartData: {};
  phone?: string;
  avatar?: string;
  
  location?: string;

  street?: string;
  city?: string;
  state?: string;
  zipcode?: string;

  accountVisibility: boolean;

  createdAt: Date;
  updatedAt: Date;
}
const userSchema = new Schema<User>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
   
    location: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zipcode: { type: String, default: "" },
  },
  { minimize: false, timestamps: true },
);
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
