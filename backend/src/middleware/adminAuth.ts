import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";
const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.token as string | undefined;
    console.log(token);
    if (!token) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET is not set in environment variables");
    }

    const token_decode = jwt.verify(token, jwtSecret) as string;

    if (
      token_decode !==
      (((process.env.ADMIN_EMAIL as string) +
        process.env.ADMIN_PASSWORD) as string)
    ) {
      return res.json({
        success: false,
        message: "Not Authorized Login Again",
      });
    }

    next();
  } catch (error: any) {
    console.log(error);

    res.json({ success: false, message: error.message });
  }
};
export default adminAuth;
