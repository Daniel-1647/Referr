import express from "express";
import {
  requestOtpController,
  verifyOtpController,
  getUserIdFromTokenController,
  logoutController,
} from "../controllers/auth.controller";

export default (router: express.Router) => {
  router.post("/auth/request-otp", requestOtpController);
  router.post("/auth/verify-otp", verifyOtpController);
  router.post("/auth/logout", logoutController);
  
  //Below is for DEBUGGING purpose only
  //router.post("/auth/get-uid-from-token", getUserIdFromTokenController);
};
