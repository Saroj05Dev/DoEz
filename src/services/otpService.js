const axios = require("axios");
const bcrypt = require("bcrypt");
const { saveOtp, findOtp, deleteOtp } = require("../repositories/otpRepository");
const { USE_FAST2SMS, FAST2SMS_API_KEY } = require("../config/serverConfig");

async function sendOtp(phone) {
  const existingOtp = await findOtp(phone);

  if (existingOtp && existingOtp.expiresAt > new Date()) {
    throw {
      reason: "OTP already sent. Please wait before requesting again.",
      statusCode: 429,
    };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const expiresAt = new Date(Date.now() + 2 * 60 * 1000);

  await saveOtp(phone, hashedOtp, expiresAt);

  if (USE_FAST2SMS !== "true") {
    console.log(`[MOCK OTP] ${phone}: ${otp}`);
    return;
  }

  try {
    await axios.post(
      "https://www.fast2sms.com/dev/bulkV2",
      {
        route: "v3",
        sender_id: "TXTIND",
        message: `Your Fixerly OTP is ${otp}. Valid for 2 minutes.`,
        language: "english",
        flash: 0,
        numbers: phone,
      },
      {
        headers: {
          authorization: FAST2SMS_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    throw { reason: "Failed to send OTP", statusCode: 500 };
  }
}

async function verifyOtp(phone, enteredOtp) {
  phone = phone.replace(/\D/g, "");

  const otpDoc = await findOtp(phone);
  if (!otpDoc) {
    throw { reason: "OTP not found or expired", statusCode: 400 };
  }

  if (otpDoc.expiresAt < new Date()) {
    await deleteOtp(phone);
    throw { reason: "OTP expired", statusCode: 400 };
  }

  const valid = await bcrypt.compare(enteredOtp, otpDoc.otp);
  if (!valid) {
    throw { reason: "Invalid OTP", statusCode: 400 };
  }

  await deleteOtp(phone);
  return true;
}


module.exports = { sendOtp, verifyOtp };
