// src/controllers/userController.js
const { registerUser, getUserProfile, updateUserProfile } = require("../services/userService");
const { sendOtp, verifyOtp } = require("../services/otpService");

async function getProfile(req, res) {
    try {
        const user = await getUserProfile(req.user.id);
        return res.status(200).json({ success: true, data: user });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, error: error.reason });
    }
}

async function updateProfile(req, res) {
    try {
        delete req.body.role; delete req.body._id;
        const updated = await updateUserProfile(req.user.id, req.body);
        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, error: error.reason });
    }
}

async function sendOtpToUser(req, res) {
    try {
        const { phone } = req.body;
        if (!phone) return res.status(400).json({ success: false, message: "Phone is required" });
        await sendOtp(phone);
        return res.status(200).json({ success: true, message: "OTP sent" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, error: error.reason });
    }
}

async function verifyUserOtp(req, res) {
    try {
        const { phone, otp } = req.body;
        await verifyOtp(phone, otp);
        return res.status(200).json({ success: true, message: "OTP verified" });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ success: false, error: error.reason });
    }
}
async function createUser(req, res) {
    try {
        console.log("Incoming user data:", req.body); //  log request body

        const user = await registerUser(req.body);
        console.log("User created successfully:", user); //  log success

        return res.status(201).json({ success: true, data: user });
    } catch (error) {
        console.error("User creation error:", error); //  log actual error
        return res.status(error.statusCode || 500).json({ success: false, error: error.reason || error.message });
    }
}

async function getAllUsers(req, res) {
    try { return res.status(200).json({ success: true, data: await getAllUsersService() }); }
    catch (e) { return res.status(e.statusCode || 500).json({ success: false, error: e.reason }); }
}
module.exports = { getProfile, updateProfile, createUser, sendOtpToUser, verifyUserOtp, getAllUsers };