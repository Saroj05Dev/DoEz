const SubService1Repository = require("../repositories/Sub_services1_repository");

async function createSubService1(subService1Data) {
  try {
    if (!subService1Data.name || !subService1Data.serviceId || !subService1Data.subServiceId) {
      throw new Error("Name, serviceId and subServiceId are required");
    }

    return await SubService1Repository.createSubService1(subService1Data);
  } catch (error) {
    throw new Error(`Service error: Failed to create sub-service1 - ${error.message}`);
  }
}

async function getSubService1ById(id) {
  try {
    if (!id) throw new Error("SubService1 ID is required");

    const subService1 = await SubService1Repository.getSubService1ById(id);
    if (!subService1) throw new Error("SubService1 not found");

    return subService1;
  } catch (error) {
    throw new Error(`Service error: Failed to get sub-service1 - ${error.message}`);
  }
}

async function getAllSubService1() {
  try {
    return await SubService1Repository.getAllSubService1();
  } catch (error) {
    throw new Error(`Service error: Failed to get sub-service1 list - ${error.message}`);
  }
}

async function getSubService1ByServiceId(serviceId) {
  try {
    if (!serviceId) throw new Error("Service ID is required");

    return await SubService1Repository.getSubService1ByServiceId(serviceId);
  } catch (error) {
    throw new Error(`Service error: Failed to get sub-service1 by service - ${error.message}`);
  }
}

async function updateSubService1(id, updateData) {
  try {
    if (!id) throw new Error("SubService1 ID is required");

    const updated = await SubService1Repository.updateSubService1(id, updateData);
    if (!updated) throw new Error("SubService1 not found");

    return updated;
  } catch (error) {
    throw new Error(`Service error: Failed to update sub-service1 - ${error.message}`);
  }
}

async function deleteSubService1(id) {
  try {
    if (!id) throw new Error("SubService1 ID is required");

    const deleted = await SubService1Repository.deleteSubService1(id);
    if (!deleted) throw new Error("SubService1 not found");

    return deleted;
  } catch (error) {
    throw new Error(`Service error: Failed to delete sub-service1 - ${error.message}`);
  }
}

module.exports = {
  createSubService1,
  getSubService1ById,
  getAllSubService1,
  getSubService1ByServiceId,
  updateSubService1,
  deleteSubService1,
};
