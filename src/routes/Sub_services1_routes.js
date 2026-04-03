const express = require("express");
const router = express.Router();

const subService1Controller = require("../controllers/Sub_services1_controller");
const { isAuthenticated, isAuthorized } = require("../middlewares/authMiddleware");

router.post(
  "/",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService1Controller.createSubService1
);

router.get(
  "/getall",
  subService1Controller.getAllSubService1
);

router.get(
  "/service/:serviceId",
  subService1Controller.getSubService1ByServiceId
);

router.get(
  "/:id",
  subService1Controller.getSubService1ById
);

router.put(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService1Controller.updateSubService1
);

router.delete(
  "/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  subService1Controller.deleteSubService1
);

module.exports = router;
