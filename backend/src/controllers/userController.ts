import userModel from "../models/userModel.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";
import type {
  AdminLoginInput,
  LoginUserInput,
  RegisterUserInput,
} from "../validations/user.validation.js";

// logic for allowing  user to create an account or login in to the website

//route for user login
const loginUser = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;

    //check if user exist
    const user = await userModel.findOne({ email });

    if (!user) {
      res.json({
        success: false,
        message: "User doesn't exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
    res.json({ success: true, token });
  } catch (error) {
    console.error(
      "Login error:",
      error instanceof Error ? error.message : error,
    );
    res.json({
      success: false,
      message: "Internal server error",
    });
  }
};

//route for user register
const registerUser = async (
  req: Request<{}, {}, RegisterUserInput>,
  res: Response,
) => {
  try {
    const { name, email, password } = req.body;

    // checking user already exist or not
    const exists = await userModel.findOne({ email });

    if (exists) {
      res.json({
        success: false,
        message: "An account with this email already exists",
      });
      return;
    }
    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string);
    res.json({ success: true, token });
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// route for admin login
const adminLogin = async (
  req: Request<{}, {}, AdminLoginInput>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(
        email + password,
        process.env.JWT_SECRET as string,
      );
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "invalid credentials" });
    }
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { loginUser, registerUser, adminLogin };
