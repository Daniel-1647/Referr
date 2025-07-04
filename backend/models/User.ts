import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  referralCode: string;
  referredBy?: string;
  fullName?: string;
  state?: string;
  country?: string;
  hasOnboarded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true },
    referralCode: { type: String, required: true, unique: true },
    referredBy: { type: String }, //referral code of the referrer
    fullName: { type: String },
    state: { type: String },
    country: { type: String },

    hasOnboarded: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model<IUser>("User", UserSchema);
