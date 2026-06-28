import userModel from "../models/userModel.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import validator from "validator";

// logic for allowing  user to create an account or login in to the website

//route for user login
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    //check if user exist
    const user = await userModel.findOne({ email });

    if (!user) {
      res.status(401).json({
        success: false,
        message: "User doesn't exist",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
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
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//route for user register
const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    // Validate all fields are provided
    if (!name || !email || !password) {
      res.status(400).json({
        success: false,
        message:
          "Please provide all required fields: name, email, and password",
      });
      return;
    }
    // Trim and validate name
    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long",
      });
      return;
    }
    // Validate password strength
    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long",
      });
      return;
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
      return;
    }
    // checking user already exist or not
    const exists = await userModel.findOne({ email });

    if (exists) {
      res.status(409).json({
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.json({ success: false, message });
  }
};

// route for admin login
const adminLogin = async (req: Request, res: Response) => {
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
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.json({ success: false, message });
  }
};

export { loginUser, registerUser, adminLogin };
