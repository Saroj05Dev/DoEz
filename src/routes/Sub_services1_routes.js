const express = require("express");
const router = express.Router();

const subService1Controller = require("../controllers/Sub_services1_controller");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");

// ➕ Create Sub Service 1
router.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService1Controller.createSubService1
);

// 📥 Get all Sub Service 1
router.get(
  "/",
  isAuthenticated,
  subService1Controller.getAllSubService1
);

// 📥 Get Sub Service 1 by Service ID
router.get(
  "/service/:serviceId",
  isAuthenticated,
  subService1Controller.getSubService1ByServiceId
);

// 📥 Get Sub Service 1 by ID
router.get(
  "/:id",
  isAuthenticated,
  subService1Controller.getSubService1ById
);

// ✏️ Update Sub Service 1
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService1Controller.updateSubService1
);

// ❌ Delete Sub Service 1
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService1Controller.deleteSubService1
);

module.exports = router;
