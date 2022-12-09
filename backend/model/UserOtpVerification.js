import mongoose from 'mongoose';

const UserOtpVerificationSchema = new mongoose.Schema({
  userId: String,
  otp: String,
  createAt: Date,
  expiresAt: Date,
});

const UserOtpVerification = mongoose.model("UserOtpVerification", UserOtpVerificationSchema);

export default UserOtpVerification;