const SubService3 = require("../schema/Sub_service3_schema");

async function createSubService3(data) {
  const subService3 = new SubService3(data);
  return await subService3.save();
}

async function getSubService3ById(id) {
  return await SubService3.findById(id)
    .populate("serviceId", "name description")
    .populate("subServiceId", "name description")
    .populate("subService1Id", "name")
    .populate("subService2Id", "name");
}

async function getAllSubService3() {
  return await SubService3.find()
    .populate("serviceId", "name description")
    .populate("subServiceId", "name description")
    .populate("subService1Id", "name")
    .populate("subService2Id", "name")
    .sort({ createdAt: -1 });
}

async function getSubService3ByServiceId(serviceId) {
  return await SubService3.find({ serviceId })
    .populate("serviceId", "name description")
    .populate("subServiceId", "name description")
    .populate("subService1Id", "name")
    .populate("subService2Id", "name");
}

async function updateSubService3(id, data) {
  return await SubService3.findByIdAndUpdate(id, data, { new: true });
}

async function deleteSubService3(id) {
  return await SubService3.findByIdAndDelete(id);
}

module.exports = {
  createSubService3,
  getSubService3ById,
  getAllSubService3,
  getSubService3ByServiceId,
  updateSubService3,
  deleteSubService3,
};
