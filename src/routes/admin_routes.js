const express = require("express");
const router = express.Router();
const User = require("../schema/userSchema");
const bcrypt = require("bcrypt");
const adminController = require("../controllers/adminController");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");

// ONLY ADMINS
router.get("/commissions", isAuthenticated, isAuthorized(["admin"]), adminController.getCommissions);
router.get("/commissions/:providerId", isAuthenticated, isAuthorized(["admin"]), adminController.getProviderDetails);

router.get("/admins", async (req, res) => {
  try {
    const admins = await User.find({ role: "admin" }).select("-password");
    res.status(200).json({ success: true, data: admins });
  } catch (e) {
    res.status(500).json({ success: false, error: e.message });
  }
});


// ✅ ADD USER (Admin)
router.post("/users", async (req, res) => {
  try {
    const data = req.body;
    data.password = await bcrypt.hash(data.password, 10);
    const user = await User.create(data);
    res.status(201).json({ success: true, data: user });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// ✅ UPDATE USER
router.put("/users/:id", async (req, res) => {
  try {
    const update = { ...req.body };
    delete update.password; // avoid accidental overwrite
    const user = await User.findByIdAndUpdate(req.params.id, update, {
      new: true,
    }).select("-password");

    res.json({ success: true, data: user });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

// ✅ DELETE USER
router.delete("/users/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (e) {
    res.status(400).json({ success: false, error: e.message });
  }
});

module.exports = router;
