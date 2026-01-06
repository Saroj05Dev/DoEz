const mongoose = require("mongoose");
const SubService1 = require("../schema/Sub_services1_schema");

async function createSubService1(subService1Data) {
  try {
    const subService1 = new SubService1(subService1Data);
    return await subService1.save();
  } catch (error) {
    throw error;
  }
}

async function getSubService1ById(id) {
  return await SubService1.findById(id)
    .populate({
      path: "serviceId",
      select: "name description",
    })
    .populate({
      path: "subServiceId",
      select: "name description",
    });
}

async function getAllSubService1() {
  return await SubService1.find()
    .populate({
      path: "serviceId",
      select: "name description",
    })
    .populate({
      path: "subServiceId",
      select: "name description",
    })
    .sort({ createdAt: -1 });
}

async function getSubService1ByServiceId(serviceId) {
  return await SubService1.find({ serviceId })
    .populate({
      path: "serviceId",
      select: "name description",
    })
    .populate({
      path: "subServiceId",
      select: "name description",
    });
}

async function updateSubService1(id, updateData) {
  try {
    const updated = await SubService1.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updated) throw new Error("SubService1 not found");
    return updated;
  } catch (error) {
    throw error;
  }
}

async function deleteSubService1(id) {
  try {
    const deleted = await SubService1.findByIdAndDelete(id);
    if (!deleted) throw new Error("SubService1 not found");
    return deleted;
  } catch (error) {
    throw error;
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
