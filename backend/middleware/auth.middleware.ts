import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {

    const token = req.cookies.token;

    if (!token) {
      res.status(401).json({ message: "No token provided", redirect: "/login" });
      console.log("No token provided");
      return;
    }

    const payload = verifyToken(token);
    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token has expired", redirect: "/login" });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token", redirect: "/login" });
      console.log(error);
      return;
    }

    res.status(500).json({ message: "Authentication failed", redirect: "/login" });
    return;
  }
};
