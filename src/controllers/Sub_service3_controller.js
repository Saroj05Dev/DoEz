const SubService3Service = require("../services/SubService3_service");

async function createSubService3(req, res) {
  try {
    const data = await SubService3Service.createSubService3(req.body);
    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getAllSubService3(req, res) {
  try {
    const data = await SubService3Service.getAllSubService3();
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getSubService3ById(req, res) {
  try {
    const data = await SubService3Service.getSubService3ById(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function getSubService3ByServiceId(req, res) {
  try {
    const data = await SubService3Service.getSubService3ByServiceId(req.params.serviceId);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function updateSubService3(req, res) {
  try {
    const data = await SubService3Service.updateSubService3(
      req.params.id,
      req.body
    );
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

async function deleteSubService3(req, res) {
  try {
    const data = await SubService3Service.deleteSubService3(req.params.id);
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}

module.exports = {
  createSubService3,
  getAllSubService3,
  getSubService3ById,
  getSubService3ByServiceId,
  updateSubService3,
  deleteSubService3,
};
