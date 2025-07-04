import UserModel from "../models/User";
import ReferralStat from "../models/ReferralStat";
import { OnboardingDTO } from "../dtos/onboarding.dto";

export const completeOnboardingService = async (
  userId: string,
  data: OnboardingDTO,
) => {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.hasOnboarded) return user;

  // Update user onboarding details
  user.fullName = data.fullName;
  user.state = data.state;
  user.country = data.country;
  user.hasOnboarded = true;
  await user.save();

  //Update referral stats once onboarding is done
  if (user.referredBy) {
    const referrer = await UserModel.findOne({ referralCode: user.referredBy });
    if (referrer) {
      const stats = await ReferralStat.findOne({ referrer: referrer._id });
      if (stats) {
        stats.conversions += 1;
        stats.earnings += 10;
        await stats.save();
      }
    }
  }

  return user;
};
