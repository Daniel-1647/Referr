import { Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { completeOnboardingService } from "../services/user.service";
import { OnboardingDTO } from "../dtos/onboarding.dto";
import User from "../models/User";

export const completeOnboardingController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    const { fullName, state, country } = req.body as OnboardingDTO;

    if (!fullName || !state || !country) {
      res.status(400).json({ message: "Missing required fields" });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.hasOnboarded) {
      res.status(409).json({
        message: "User already onboarded",
        redirect: "/dashboard"
      });
      return;
    }

    const updatedUser = await completeOnboardingService(userId, {
      fullName,
      state,
      country,
    });

    res.status(200).json({
      message: "Onboarding complete",
      user: updatedUser,
    });
    return;
  } catch (error) {
    console.error("Onboarding error:", error);
    res.status(500).json({ message: "Failed to complete onboarding" });
    return;
  }
};


export const getMeController = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error in /auth/me:", error);
    res.status(500).json({ message: "Failed to fetch user data" });
    return;
  }
};