import userModel from "../models/userModel.js";
import type { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt, { type JwtPayload } from "jsonwebtoken";
import type {
  AdminLoginInput,
  ForgetPasswordInput,
  LoginUserInput,
  RegisterUserInput,
  ResetPasswordInput,
  ResetPasswordParams,
} from "../validations/user.validation.js";
import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const requestPasswordReset = async (
  req: Request<{}, {}, ForgetPasswordInput>,
  res: Response,
) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If that email exists, a reset link has been sent",
      });
    }
    const secret = process.env.JWT_SECRET + user.password;

    const token = jwt.sign({ id: user._id, email: user.email }, secret, {
      expiresIn: "1h",
    });
    const resetURL = `${process.env.FRONTEND_URL}/reset-password/${user._id}/${token}`;

    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "Password Reset Request",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Request</h2>
          <p>You requested a password reset. Click the button below to reset your password:</p>
          <a href="${resetURL}" 
             style="display: inline-block; padding: 12px 24px; background-color: #000; color: #fff; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Reset Password
          </a>
          <p>Or paste this link in your browser:</p>
          <p style="word-break: break-all; color: #666;">${resetURL}</p>
          <p><strong>This link expires in 1 hour.</strong></p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Password reset link sent",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const resetPassword = async (
  req: Request<{ id: string; token: string }, {}, ResetPasswordInput>,
  res: Response,
) => {
  const { id, token } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters",
    });
  }
  try {
    const user = await userModel.findOne({ _id: id });
    if (!user) {
      return res.status(404).json({
      
        success: false,
        message: "User doesn't exist",
      });
    }
    const secret = process.env.JWT_SECRET + user.password;
    try {
      jwt.verify(token, secret);
    } catch (err) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    await userModel.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      },
    );

    res.status(200).json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};
const verifyResetToken = async (
  req: Request<ResetPasswordParams>,
  res: Response,
) => {
  try {
    const { id, token } = req.params;

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({

        success: false,
        message: "User doesn't exist",
      });
    }

    const secret = process.env.JWT_SECRET + user.password;

    try {
      jwt.verify(token, secret);
      return res.status(200).json({
        success: true,
        message: "Token is valid",
      });
    } catch {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
const loginUser = async (
  req: Request<{}, {}, LoginUserInput>,
  res: Response,
) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
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
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30d",
      },
    );
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, token });
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

    
    const exists = await userModel.findOne({ email });

    if (exists) {
      res.json({
        success: false,
        message: "An account with this email already exists",
      });
      return;
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({ name, email, password: hashedPassword });
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "30d",
      },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

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
const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken as string | undefined;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "No refresh token" });
  }

  try {
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    const token = jwt.sign(
      { id: decoded.id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "15m",
      },
    );
    return res.json({ success: true, token: token });
  } catch {
    return res.status(401).json({
      success: false,
      message: "Refresh token expired, please login again",
    });
  }
};
const logoutUser = async (_req: Request, res: Response) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    return res.json({ success: true, message: "Logged out" });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    return res.status(500).json({ success: false, message });
  }
};

export {
  loginUser,
  registerUser,
  adminLogin,
  refreshToken,
  logoutUser,
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
};
