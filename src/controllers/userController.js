// src/controllers/userController.js
const {
  getUserProfile,
  updateUserProfile,
} = require("../services/userService");
const { registerAndLogin } = require("../services/authService");
const { sendOtp, verifyOtp } = require("../services/otpService");

async function getProfile(req, res) {
  try {
    const user = await getUserProfile(req.user.id);
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

async function updateProfile(req, res) {
  try {
    delete req.body.role;
    delete req.body._id;
    const updated = await updateUserProfile(req.user.id, req.body);
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

async function sendOtpToUser(req, res) {
  try {
    await sendOtp(req.body.phone);
    return res.status(200).json({ success: true, message: "OTP sent" });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function verifyUserOtp(req, res) {
  try {
    await verifyOtp(req.body.phone, req.body.otp);
    return res.status(200).json({ success: true, message: "OTP verified" });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function createUser(req, res) {
  try {
    const result = await registerAndLogin(req.body);

    // Auto-login after registration
    res.cookie("authToken", result.token, {
      httpOnly: true,
      secure: false, // true in production (HTTPS)
      sameSite: "lax",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return res.status(201).json({
      success: true,
      message: "Registered and logged in successfully",
      data: result.userData,
    });
  } catch (e) {
    return res.status(e.statusCode || 500).json({
      success: false,
      message: e.reason || e.message,
    });
  }
}


async function getAllUsers(req, res) {
  try {
    return res
      .status(200)
      .json({ success: true, data: await getAllUsersService() });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}
module.exports = {
  getProfile,
  updateProfile,
  createUser,
  sendOtpToUser,
  verifyUserOtp,
  getAllUsers,
};
