const express = require("express");
const {
  createUser,
  sendOtpToUser,
  verifyUserOtp,
} = require("../controllers/userController");

const { isAuthenticated } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register/send-otp", sendOtpToUser);
router.post("/register/verify-otp", verifyUserOtp);
router.post("/", createUser);

router.get("/profile", isAuthenticated);
router.put("/profile", isAuthenticated);

module.exports = router;
