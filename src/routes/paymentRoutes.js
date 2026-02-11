const express = require("express");
const router = express.Router();
const { createOrder, verify } = require("../controllers/paymentController");
const { isAuthenticated } = require("../middlewares/authMiddleware");

router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify", isAuthenticated, verify);

module.exports = router;
