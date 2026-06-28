import mongoose, { Document, Schema } from "mongoose";
export interface User extends Document {
  name: string;
  email: string;
  password: string;
  cartData: {};
}
const userSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cartData: { type: Object, default: {} },
  },
  { minimize: false },
);
const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
