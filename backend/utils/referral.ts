// utils/referral.ts

import User from "../models/User";

const REFERRAL_CODE_LENGTH = 8;
const CHARSET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function getRandomCode(length: number): string {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += CHARSET.charAt(Math.floor(Math.random() * CHARSET.length));
  }
  return code;
}

export async function generateReferralCode(): Promise<string> {
  let code: string;
  let exists = true;

  // Loop until a unique code is found
  do {
    code = getRandomCode(REFERRAL_CODE_LENGTH);
    const existingUser = await User.findOne({ referralCode: code });
    exists = !!existingUser;
  } while (exists);

  return code;
}
