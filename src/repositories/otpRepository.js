const Otp = require("../schema/otpSchema");

async function saveOtp(phone, otp, expiresAt) {
  return Otp.findOneAndUpdate(
    { phone },
    { otp, expiresAt },
    { upsert: true, new: true }
  );
}

async function findOtp(phone) {
  return Otp.findOne({ phone });
}

async function deleteOtp(phone) {
  return Otp.deleteOne({ phone });
}

module.exports = { saveOtp, findOtp, deleteOtp };
