const express = require("express");
const router = express.Router();
const subServiceController = require("../controllers/Sub_services_controller");
const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware");

router.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin"]),
  subServiceController.createSubService,
);
router.get("/getall", subServiceController.getAllSubServices);
router.get(
  "/service/:serviceId",
  subServiceController.getSubServicesByServiceId,
);
router.get("/:id", subServiceController.getSubServiceById);
router.put(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subServiceController.updateSubService,
);
router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subServiceController.deleteSubService,
);

module.exports = router;
