import OtpToken from "../models/OtpToken";
import UserModel from "../models/User";
import ReferralStat from "../models/ReferralStat";
import { generateOtp } from "../utils/otp";
import { sendOtpEmail } from "../utils/resend";
import { generateToken } from "../utils/jwt";
import { generateReferralCode } from "../utils/referral";

export const requestOtpService = async (email: string) => {
  // Remove any existing OTPs for this email
  await OtpToken.deleteMany({ email });

  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  // Save OTP in our MongoDB
  await OtpToken.create({ email, otp, expiresAt });

  // Send OTP email
  await sendOtpEmail(email, otp);

  return { message: "OTP sent successfully" };
};

export async function verifyOtpService(
  email: string,
  otp: string,
  referrerCode?: string,
): Promise<{ token: string }> {
  const existingOtp = await OtpToken.findOne({ email });

  if (!existingOtp || existingOtp.otp !== otp) {
    throw new Error("Invalid OTP");
  }

  if (!existingOtp) {
    console.log("Existing OTP is null");
    throw new Error("Invalid OTP");
  }
  if (existingOtp.otp !== otp) {
    console.log("Invalid OTP");
    throw new Error("Invalid OTP");
  }

  const now = new Date();
  if (existingOtp.expiresAt < now) {
    await existingOtp.deleteOne();
    throw new Error("OTP expired. Please request a new one.");
  }

  await existingOtp.deleteOne();

  let user = await UserModel.findOne({ email });

  //Signup user if he does not exist
  if (!user) {
    const referralCode = await generateReferralCode();
    user = await UserModel.create({
      email: email,
      referralCode: referralCode,
      referredBy: referrerCode,
      hasOnboarded: false,
    });

    //Update referrer stats
    if (referrerCode) {
      const referrer = await UserModel.findOne({ referralCode: referrerCode });
      if (referrer) {
        await ReferralStat.findOneAndUpdate(
          { referrer: referrer._id },
          {
            $setOnInsert: {
              referrer: referrer._id,
              referralCode: referrerCode,
              clicks: 0,
              conversions: 0,
              earnings: 0,
            },
            $inc: { signups: 1 },
          },
          {
            upsert: true,
          },
        );
      }
    }
  }

  const token = generateToken({
    userId: user._id.toString(),
    email: user.email,
  });

  return { token };
}
