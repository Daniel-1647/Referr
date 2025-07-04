import mongoose, { Schema, Document } from "mongoose";

export interface IOtpToken extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
}

const OtpTokenSchema: Schema = new Schema<IOtpToken>({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: "0s" }, //TTL index to auto-delete
  },
});

export default mongoose.model<IOtpToken>("OtpToken", OtpTokenSchema);
