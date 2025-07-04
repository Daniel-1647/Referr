import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";
import UserModel from "../models/User";

export const requireOnboarding = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (!user.hasOnboarded) {
      res.status(409).json({ message: "Complete onboarding to continue", redirect: "/onboarding" });
      return;
    }

    next();
  } catch (error) {
    console.error("Onboarding check error:", error);
    res.status(500).json({ message: "Server error" });
    return;
  }
};
