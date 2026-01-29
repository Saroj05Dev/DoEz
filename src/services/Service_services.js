const ServiceRepository = require("../repositories/Service_repository");

async function createService(data) {
  const {
    name,
    image,
    price,
    description,
  } = data;

  if (
    !name ||
    !image ||
    !price ||
    !description
  ) {
    throw new Error("All fields are required");
  }

  return await ServiceRepository.createService(data);
}

async function getServiceById(id) {
  if (!id) {
    throw new Error("Service ID is required");
  }

  const service = await ServiceRepository.getServiceById(id);
  if (!service) {
    throw new Error("Service not found");
  }

  return service;
}

async function getAllServices() {
  return await ServiceRepository.getAllServices();
}

async function updateService(id, data) {
  if (!id) {
    throw new Error("Service ID is required");
  }

  const service = await ServiceRepository.updateService(id, data);
  if (!service) {
    throw new Error("Service not found");
  }

  return service;
}

async function deleteService(id) {
  if (!id) {
    throw new Error("Service ID is required");
  }

  const service = await ServiceRepository.deleteService(id);
  if (!service) {
    throw new Error("Service not found");
  }

  return service;
}

module.exports = {
  createService,
  getServiceById,
  getAllServices,
  updateService,
  deleteService,
};
