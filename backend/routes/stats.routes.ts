import express from "express";
import {
  getReferralStatsController,
  incrementClickStatController,
  getLeaderboardController,
} from "../controllers/stats.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireOnboarding } from "../middleware/onboarding.middleware";

export default (router: express.Router) => {
  router.post("/referral/click", incrementClickStatController);
  router.get("/stats/me", authenticate,  requireOnboarding, getReferralStatsController);
  router.get("/leaderboard", authenticate, requireOnboarding, getLeaderboardController);
};
