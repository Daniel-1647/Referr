import mongoose, { Schema, Document } from "mongoose";

export interface IReferralStat extends Document {
  referrer: mongoose.Types.ObjectId;
  referralCode: string;
  clicks: number;
  signups: number;
  conversions: number;
  earnings: number;
}

const ReferralStatSchema: Schema = new Schema<IReferralStat>({
  referrer: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  referralCode: {
    type: String,
    required: true,
  },
  clicks: { type: Number, default: 0 },
  signups: { type: Number, default: 0 },
  conversions: { type: Number, default: 0 },
  earnings: { type: Number, default: 0 },
});

export default mongoose.model<IReferralStat>(
  "ReferralStat",
  ReferralStatSchema,
);
