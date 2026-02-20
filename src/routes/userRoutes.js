const express = require("express");
const {
  createUser,
  sendOtpToUser,
  verifyUserOtp,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage
} = require("../controllers/userController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const router = express.Router();

router.post("/register/send-otp", sendOtpToUser);
router.post("/register/verify-otp", verifyUserOtp);
router.post("/", createUser);

router.get("/profile", isAuthenticated, getProfile);
router.put("/profile", isAuthenticated, updateProfile);
router.put("/change-password", isAuthenticated, changePassword);
router.post("/profile-image", isAuthenticated, upload.single('image'), uploadProfileImage);


module.exports = router;
