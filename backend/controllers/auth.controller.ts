import { Request, Response } from "express";
import { requestOtpService } from "../services/auth.service";
import { verifyOtpService } from "../services/auth.service";
import { VerifyOtpDTO } from "../dtos/verifyotp.dto";
import { verifyToken } from "../utils/jwt";
import { RequestOtpDTO } from "../dtos/requestotp.dto";

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const requestOtpController = async (req: Request, res: Response) => {
  const { email } = req.body as RequestOtpDTO;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  if (!isValidEmail(email)) {
    res.status(400).json({ message: "Invalid email format" });
    return;
  }

  try {
    const result = await requestOtpService(email);
    res.status(200).json(result);
    return;
  } catch (error) {
    console.error("OTP generation error:", error);
    res.status(500).json({ message: "Failed to send OTP" });
    return;
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  const { email, otp, referredBy } = req.body as VerifyOtpDTO;

  if (!email || !otp) {
    res.status(400).json({ message: "Email and OTP are required" });
    return;
  }

  try {
    const result = await verifyOtpService(email, otp, referredBy); //returns our token
    console.log("Valid cookie sent");
    res
      .cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
      })
      .status(200)
      .json({ message: "Login successful" });

    return;
  } catch (error: any) {
    console.error("OTP verification error:", error);
    res.status(400).json({ message: error.message || "Invalid OTP" });
    return;
  }
};

export const logoutController = (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "Logged out successfully" });
};

//Debug only
export const getUserIdFromTokenController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { token } = req.body;
    const userId = verifyToken(token).userId;
    res.json({ message: "User ID: " + userId });
    return;
  } catch (error) {
    console.log(error);
    res.json({ message: error.message });
    return;
  }
};
