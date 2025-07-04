import ReferralStat from "../models/ReferralStat";

export const getReferralStatsService = async (userId: string) => {
  return await ReferralStat.findOne({ referrer: userId }).lean();
};

export const incrementClickStatService = async (referralCode: string) => {
  await ReferralStat.findOneAndUpdate(
    { referralCode },
    { $inc: { clicks: 1 } },
    { new: true },
  );
};

export const creatStatService = async (userId: string) => {
  return await ReferralStat.create({ 
    referrer: userId,
    clicks: 0,
    earnings: 0,
    signups: 0,
    conversions: 0
  })
}

export const getLeaderboardService = async (page: number, limit: number, userId: string) => {
  const skip = (page - 1) * limit;

  const leaderboardData = await ReferralStat.find({})
    .sort({ conversions: -1 })
    .skip(skip)
    .limit(limit)
    .populate("referrer", "fullName")
    .lean();

  const total = await ReferralStat.countDocuments();

  const formatted = leaderboardData.map((entry, index) => {
    const referrer = entry.referrer as unknown as { _id: string; fullName: string } | null;
    const fullName = referrer ? referrer.fullName : "Unknown User";
    const isUser = referrer?._id.toString() === userId;

    return {
      rank: skip + index + 1,
      fullName,
      conversions: entry.conversions,
      isUser,
    };
  });



  return {
    currentPage: page,
    totalPages: Math.ceil(total / limit),
    data: formatted,
  };
};
