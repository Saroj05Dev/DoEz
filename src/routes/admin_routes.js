const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");

// PROTECT ALL ADMIN ROUTES
router.use(isAuthenticated, isAuthorized(["admin"]));

// Dashboard & Commission Stats
router.get("/commissions", adminController.getCommissions);
router.get("/commissions/:providerId", adminController.getProviderDetails);

// Admin Management
router.get("/admins", adminController.getAllAdmins);
router.post("/admins", adminController.createAdmin);
router.put("/admins/:id", adminController.updateAdmin);
router.patch("/admins/status/:id", adminController.toggleAdminStatus);

// User Management (Customers & Providers)
router.get("/users", adminController.getUsers);

module.exports = router;
