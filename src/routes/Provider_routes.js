const express = require("express");
const {
  onboard,
  getProfile,
  updateProfile,
  toggleAvail,
  getEarn,
  uploadKycDocs, submitKyc, getAllProviders, adminCreateProvider, adminDelete, adminUpdate, adminApproveKyc,
  updateServices, getProvidersByService, uploadPaymentQr
} = require("../controllers/Provider_controller");

const {
  isAuthenticated,
  isAuthorized,
} = require("../middlewares/authMiddleware");
const upload = require("../middlewares/multerMiddleware");

const router = express.Router();

router.post("/onboard", isAuthenticated, onboard);
router.get("/profile", isAuthenticated, isAuthorized(["provider"]), getProfile);
router.put(
  "/profile",
  isAuthenticated,
  isAuthorized(["provider"]),
  updateProfile
);
router.put(
  "/availability",
  isAuthenticated,
  isAuthorized(["provider"]),
  toggleAvail
);
router.get("/earnings", isAuthenticated, isAuthorized(["provider"]), getEarn);

// Update provider services
router.put(
  "/services",
  isAuthenticated,
  isAuthorized(["provider"]),
  updateServices
);

// Get providers by service ID (Public or Customer/Admin)
router.get("/by-service/:subService3Id", getProvidersByService);

router.post(
  "/submit-kyc",
  isAuthenticated,
  isAuthorized(["provider"]),
  upload.fields([
    { name: "aadharFile", maxCount: 1 },
    { name: "panFile", maxCount: 1 },
    { name: "passbookImage", maxCount: 1 },
  ]),
  submitKyc
);

router.post(
  "/upload-payment-qr",
  isAuthenticated,
  isAuthorized(["provider"]),
  upload.single("paymentQr"),
  uploadPaymentQr
);

router.get("/all", getAllProviders);


router.post(
  "/admin",
  isAuthenticated,
  isAuthorized(["admin"]),
  adminCreateProvider
);

router.put(
  "/admin/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  adminUpdate
);

router.delete(
  "/admin/:id",
  isAuthenticated,
  isAuthorized(["admin"]),
  adminDelete
);

router.put(
  "/admin/:id/kyc",
  isAuthenticated,
  isAuthorized(["admin"]),
  adminApproveKyc
);

module.exports = router;
