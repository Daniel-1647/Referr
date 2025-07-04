import { Request, Response } from "express";
import {
  getReferralStatsService,
  incrementClickStatService,
  getLeaderboardService,
  creatStatService
} from "../services/stats.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const getReferralStatsController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const userId = req.user?.userId;

    const stats = await getReferralStatsService(userId!);
    if (!stats) {
      const stats = await creatStatService(userId);
      res.status(200).json(stats);
      return;
    }

    res.status(200).json(stats);
    return;
  } catch (error) {
    console.error("Referral stats error:", error);
    res.status(500).json({ message: "Failed to fetch referral stats" });
    return;
  }
};

export const incrementClickStatController = async (
  req: Request,
  res: Response,
) => {
  const { referralCode } = req.body;

  if (!referralCode) {
    res.status(400).json({ message: "Referral code is required" });
    return;
  }

  try {
    await incrementClickStatService(referralCode);
    res.status(200).json({ message: "Click registered" });
    return;
  } catch (error) {
    console.error("incrementClickStatService error:", error);
    res.status(500).json({ message: "Failed to register click" });
    return;
  }
};

export const getLeaderboardController = async (
  req: AuthenticatedRequest,
  res: Response,
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getLeaderboardService(page, limit, req.user.userId);

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("Leaderboard fetch error:", error);
    res.status(500).json({ message: "Failed to fetch leaderboard" });
    return;
  }
};
