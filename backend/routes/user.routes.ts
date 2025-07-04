import express from "express";
import { completeOnboardingController, getMeController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth.middleware";

export default (router: express.Router) => {
  router.post("/onboarding", authenticate, completeOnboardingController);
  router.get("/user/me", authenticate, getMeController);
};
