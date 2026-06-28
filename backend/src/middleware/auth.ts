import jwt, { type JwtPayload } from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";
export const authUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {

  const token = req.headers.token as string | undefined;
  if (!token) {
    return res
      .status(401)
      .json({ message: "No token, authorization denied, Login again" });
  }
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not set in environment variables");
  }
  try {
    const token_decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    req.body.userId = token_decoded.id;
    next();
  } catch (error) {
    console.log(error);
    const message =
      error instanceof Error ? error.message : "Something went wrong";
    res.status(401).json({ success: false, message });
  }
};
export default authUser;
