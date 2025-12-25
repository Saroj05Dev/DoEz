// src/repositories/service_repository.js
const mongoose = require('mongoose');
const Service = require('../schema/Service_schema');

async function createService(serviceData) {
    try {
        const service = new Service(serviceData);
        return await service.save();
    } catch (error) {
        throw error; // directly throw to be handled in controller
    }
}

async function getServiceById(id) {
    try {
        const service = await Service.findById(id);
        if (!service) throw new Error("Service not found");
        return service;
    } catch (error) {
        throw error;
    }
}

async function getAllServices() {
    try {
        return await Service.find();
    } catch (error) {
        throw error;
    }
}

async function updateService(id, updateData) {
    try {
        const updatedService = await Service.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedService) throw new Error("Service not found to update");
        return updatedService;
    } catch (error) {
        throw error;
    }
}

async function deleteService(id) {
    try {
        const deletedService = await Service.findByIdAndDelete(id);
        if (!deletedService) throw new Error("Service not found to delete");
        return deletedService;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createService,
    getServiceById,
    getAllServices,
    updateService,
    deleteService,
};
