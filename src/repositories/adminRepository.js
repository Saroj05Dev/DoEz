const Admin = require("../schema/adminSchema");

async function createAdmin(data) {
    return await Admin.create(data);
}

async function getAllAdmins() {
    return await Admin.find();
}

async function updateAdmin(id, data) {
    return await Admin.findByIdAndUpdate(id, data, { new: true });
}


async function deleteAdmin(id) {
    return await Admin.findByIdAndDelete(id);
}

module.exports = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    deleteAdmin
};
