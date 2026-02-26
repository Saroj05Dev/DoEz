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
    const { email } = req.body;
    const forceResend = req.body.forceResend === true;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    await sendOtp(email, forceResend);
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please check your email.",
    });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, message: e.reason || "Failed to send OTP" });
  }
}

async function verifyUserOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: "Email and OTP are required" });
    }

    await verifyOtp(email, otp);
    return res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, message: e.reason || "OTP verification failed" });
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
async function changePassword(req, res) {
  try {
    const { oldPassword, newPassword } = req.body;
    const result = await require("../services/userService").changePassword(req.user.id, oldPassword, newPassword);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

async function uploadProfileImage(req, res) {
  try {
    if (!req.file) throw { reason: "No image provided", statusCode: 400 };
    const imageUrl = `/uploads/${req.file.filename}`;
    await require("../services/userService").updateUserProfile(req.user.id, { profileImage: imageUrl });
    return res.status(200).json({ success: true, data: { profileImage: imageUrl } });
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json({ success: false, error: error.reason });
  }
}

module.exports = {
  getProfile,
  updateProfile,
  createUser,
  sendOtpToUser,
  verifyUserOtp,
  getAllUsers,
  changePassword,
  uploadProfileImage
};

