const express = require("express");
const router = express.Router();

const subService3Controller = require("../controllers/Sub_service3_controller");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");

router.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService3Controller.createSubService3
);

router.get(
  "/getall",
  isAuthenticated,
  subService3Controller.getAllSubService3
);

router.get(
  "/service/:serviceId",
  isAuthenticated,
  subService3Controller.getSubService3ByServiceId
);

router.get(
  "/:id",
  isAuthenticated,
  subService3Controller.getSubService3ById
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService3Controller.updateSubService3
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService3Controller.deleteSubService3
);

module.exports = router;
