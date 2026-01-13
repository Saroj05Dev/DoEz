const express = require("express");
const {
  onboard,
  getProfile,
  updateProfile,
  toggleAvail,
  getEarn,
  uploadKycDocs, getAllProviders, adminCreateProvider,adminDelete,adminUpdate
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

router.post(
    '/upload-kyc',
    isAuthenticated,
    isAuthorized(['provider']),
    upload.array('kycDocs', 3),
    uploadKycDocs
)
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

module.exports = router;
