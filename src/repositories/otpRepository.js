const Otp = require("../schema/otpSchema");

async function saveOtp(email, otp, expiresAt) {
  return Otp.findOneAndUpdate(
    { email },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
}

async function findOtp(email) {
  return Otp.findOne({ email });
}

async function deleteOtp(email) {
  return Otp.deleteOne({ email });
}

module.exports = { saveOtp, findOtp, deleteOtp };
