const SubServiceService = require("../services/SubService_services");

async function createSubService(req, res) {
  try {
    const subServiceData = req.body;
    const subService = await SubServiceService.createSubService(subServiceData);
    return res.status(201).json({
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

async function getSubServiceById(req, res) {
  try {
    const { id } = req.params;
    const subService = await SubServiceService.getSubServiceById(id);
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

async function getSubServicesByServiceId(req, res) {
  try {
    const { serviceId } = req.params;
    const subServices = await SubServiceService.getSubServicesByServiceId(
      serviceId
    );
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

async function updateSubService(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const subService = await SubServiceService.updateSubService(id, updateData);
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

async function deleteSubService(req, res) {
  try {
    const { id } = req.params;
    const subService = await SubServiceService.deleteSubService(id);
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
async function getAllSubServices(req, res) {
  try {
    const subServices = await SubServiceService.getAllSubServices();
    return res.status(200).json({ success: true, data: subServices });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
}

module.exports = {
  createSubService,
  getSubServiceById,
  getSubServicesByServiceId,
  updateSubService,
  deleteSubService,
  getAllSubServices,
};
