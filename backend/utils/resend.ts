import { Resend } from "resend";
import { getOtpEmailHtml } from "../templates/otp-email-template";

//I am using Resend's API

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOtpEmail(email: string, otp: string) {
  const websiteUrl = process.env.WEBSITE_URL;
  const supportUrl = process.env.SUPPORT_URL;
  const privacyPolicyUrl = process.env.PRIVACY_POLICY_URL;
  const systemEmailAddress = process.env.SYSTEM_EMAIL_ADDRESS;

  const html = getOtpEmailHtml(
    email,
    otp,
    websiteUrl,
    supportUrl,
    privacyPolicyUrl,
  );

  await resend.emails.send({
    from: systemEmailAddress,
    to: email,
    subject: "Your OTP Code for Referr",
    html: html,
  });
}
