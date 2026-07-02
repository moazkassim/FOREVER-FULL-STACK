import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.token as string | undefined;
  if (!token) {
    return res.json({ message: "No token, authorization denied, Login again" });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  try {
    const token_decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.body.userId = token_decoded.id;
    next();
  } catch (error: any) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
export default authUser;
