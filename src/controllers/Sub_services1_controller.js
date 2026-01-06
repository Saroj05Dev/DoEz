const SubService1Service = require("../services/SubServices1_services");

async function createSubService1(req, res) {
  try {
    const subService1Data = req.body;
    const subService1 = await SubService1Service.createSubService1(subService1Data);

    return res.status(201).json({
      success: true,
      data: subService1,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function getAllSubService1(req, res) {
  try {
    const subServices = await SubService1Service.getAllSubService1();
    return res.status(200).json({
      success: true,
      data: subServices,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function getSubService1ById(req, res) {
  try {
    const { id } = req.params;
    const subService = await SubService1Service.getSubService1ById(id);

    return res.status(200).json({
      success: true,
      data: subService,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function getSubService1ByServiceId(req, res) {
  try {
    const { serviceId } = req.params;
    const subServices = await SubService1Service.getSubService1ByServiceId(serviceId);

    return res.status(200).json({
      success: true,
      data: subServices,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function updateSubService1(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updated = await SubService1Service.updateSubService1(id, updateData);

    return res.status(200).json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

async function deleteSubService1(req, res) {
  try {
    const { id } = req.params;
    const deleted = await SubService1Service.deleteSubService1(id);

    return res.status(200).json({
      success: true,
      data: deleted,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

module.exports = {
  createSubService1,
  getAllSubService1,
  getSubService1ById,
  getSubService1ByServiceId,
  updateSubService1,
  deleteSubService1,
};
