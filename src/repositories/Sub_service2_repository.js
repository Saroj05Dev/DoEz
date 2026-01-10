const SubService2 = require("../schema/Sub_service2_schema");

async function createSubService2(data) {
  const subService2 = new SubService2(data);
  return await subService2.save();
}

async function getSubService2ById(id) {
  return await SubService2.findById(id)
    .populate("serviceId", "name description")
    .populate("subServiceId", "name description")
    .populate("subService1Id", "name");
}

async function getAllSubService2() {
  return await SubService2.find()
    .populate("serviceId", "name description")
    .populate("subServiceId", "name description")
    .populate("subService1Id", "name")
    .sort({ createdAt: -1 });
}

async function getSubService2ByServiceId(serviceId) {
  return await SubService2.find({ serviceId })
    .populate("serviceId", "name description")
    .populate("subServiceId", "name description")
    .populate("subService1Id", "name");
}

async function updateSubService2(id, data) {
  return await SubService2.findByIdAndUpdate(id, data, { new: true });
}

async function deleteSubService2(id) {
  return await SubService2.findByIdAndDelete(id);
}

module.exports = {
  createSubService2,
  getSubService2ById,
  getAllSubService2,
  getSubService2ByServiceId,
  updateSubService2,
  deleteSubService2,
};
