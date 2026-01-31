// src/controllers/Provider_controller.js
const {
  onboardProvider,
  getProviderProfile,
  updateProviderProfile,
  toggleAvailability,
  getEarnings,
  handleKycUpload, submitFullKyc, listAllProviders, createProvider, adminUpdateProvider,
  deleteProvider, approveKyc,
} = require("../services/Provider_service");

async function onboard(req, res) {
  try {
    return res.status(200).json({
      success: true,
      data: await onboardProvider(req.user.id, req.body),
    });
  } catch (e) {
    console.error(e);
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function getProfile(req, res) {
  try {
    return res
      .status(200)
      .json({ success: true, data: await getProviderProfile(req.user.id) });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function updateProfile(req, res) {
  try {
    return res.status(200).json({
      success: true,
      data: await updateProviderProfile(req.user.id, req.body),
    });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function toggleAvail(req, res) {
  try {
    return res.status(200).json({
      success: true,
      data: await toggleAvailability(req.user.id, req.body.status),
    });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function getEarn(req, res) {
  try {
    return res
      .status(200)
      .json({ success: true, data: await getEarnings(req.user.id) });
  } catch (e) {
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason });
  }
}

async function uploadKycDocs(req, res) {
  try {
    if (!req.files || req.files.length === 0)
      return res
        .status(400)
        .json({ success: false, message: "No files uploaded" });

    const result = await handleKycUpload(req.user.id, req.files);

    return res.status(200).json({
      success: true,
      message: "KYC documents uploaded successfully",
      data: result,
    });
  } catch (e) {
    console.error("KYC Upload Error:", e);
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason || "Upload failed" });
  }
}


// only for admins
async function getAllProviders(req, res) {
  try {
    const providers = await listAllProviders();
    return res.status(200).json({
      success: true,
      data: providers,
    });
  } catch (e) {
    return res
      .status(500)
      .json({ success: false, error: e.message });
  }
}
async function adminCreateProvider(req, res) {
  try {
    const provider = await createProvider(req.body);
    res.status(201).json({ success: true, data: provider });
  } catch (e) {
    res.status(500).json({ success: false, error: e.reason });
  }
}

async function adminUpdate(req, res) {
  try {
    const provider = await adminUpdateProvider(req.params.id, req.body);
    res.status(200).json({ success: true, data: provider });
  } catch (e) {
    res.status(e.statusCode || 500).json({ success: false, error: e.reason });
  }
}

async function adminDelete(req, res) {
  try {
    await deleteProvider(req.params.id);
    res.status(200).json({ success: true, message: "Provider deleted" });
  } catch (e) {
    res.status(e.statusCode || 500).json({ success: false, error: e.reason });
  }
}

async function adminApproveKyc(req, res) {
  try {
    const { status } = req.body;
    const provider = await approveKyc(req.params.id, status);
    res.status(200).json({ success: true, data: provider });
  } catch (e) {
    res.status(e.statusCode || 500).json({ success: false, error: e.reason });
  }
}


async function submitKyc(req, res) {
  try {
    const result = await submitFullKyc(req.user.id, req.body, req.files);
    return res.status(200).json({
      success: true,
      message: "KYC details submitted successfully",
      data: result,
    });
  } catch (e) {
    console.error("Submit KYC Error:", e);
    return res
      .status(e.statusCode || 500)
      .json({ success: false, error: e.reason || "Submission failed" });
  }
}

module.exports = {
  onboard,
  getProfile,
  updateProfile,
  toggleAvail,
  getEarn,
  uploadKycDocs,
  submitKyc,
  getAllProviders, adminCreateProvider,
  adminUpdate,
  adminDelete,
  adminApproveKyc,
};
