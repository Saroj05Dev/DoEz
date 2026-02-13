const { addAdmin, fetchAllAdmins, modifyAdmin, removeAdmin, getCommissionStats, getProviderCommissionDetails } = require("../services/adminService");

async function createAdmin(req, res) {
    try {
        const admin = await addAdmin(req.body);
        return res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: admin
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getAllAdmins(req, res) {
    try {
        const admins = await fetchAllAdmins();
        return res.status(200).json({
            success: true,
            data: admins
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function updateAdmin(req, res) {
    try {
        const updated = await modifyAdmin(req.params.id, req.body);
        return res.status(200).json({
            success: true,
            message: "Admin updated successfully",
            data: updated
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function deleteAdmin(req, res) {
    try {
        await removeAdmin(req.params.id);
        return res.status(200).json({
            success: true,
            message: "Admin deleted successfully"
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getCommissions(req, res) {
    try {
        const stats = await getCommissionStats();
        return res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

async function getProviderDetails(req, res) {
    try {
        const { providerId } = req.params;
        const details = await getProviderCommissionDetails(providerId);
        return res.status(200).json({
            success: true,
            data: details
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin,
    getCommissions,
    getProviderDetails
};
