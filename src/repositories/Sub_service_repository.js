// src/repositories/subservice_repository.js
const mongoose = require('mongoose');
const SubService = require('../schema/Subservice_schema');

async function createSubService(subServiceData) {
    try {
        const subService = new SubService(subServiceData);
        return await subService.save();
    } catch (error) {
        throw error;
    }
}

async function getSubServiceById(id) {
    return await SubService.findById(id).populate({
        path: 'serviceId',
        select: 'name description',
    });
}

async function getAllSubServices() {
    return await SubService.find().populate({
        path: 'serviceId',
        select: 'name description',
    }).sort({ createdAt: -1 });
}

async function getSubServicesByServiceId(serviceId) {
    return await SubService.find({ serviceId }).populate({
        path: 'serviceId',
        select: 'name description',
    });
}

async function updateSubService(id, updateData) {
    try {
        const updated = await SubService.findByIdAndUpdate(id, updateData, { new: true });
        if (!updated) throw new Error("Sub-service not found to update");
        return updated;
    } catch (error) {
        throw error;
    }
}

async function deleteSubService(id) {
    try {
        const deleted = await SubService.findByIdAndDelete(id);
        if (!deleted) throw new Error("Sub-service not found to delete");
        return deleted;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createSubService,
    getSubServiceById,
    getAllSubServices,
    getSubServicesByServiceId,
    updateSubService,
    deleteSubService,
};