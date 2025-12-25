const bcrypt = require("bcryptjs");
const { createAdmin, getAllAdmins, updateAdmin, deleteAdmin } = require("../repositories/adminRepository");
const Admin = require("../schema/adminSchema");

async function addAdmin(adminDetails) {
    const existingByEmail = await Admin.findOne({ email: adminDetails.email });
    const existingByPhone = await Admin.findOne({ phone: adminDetails.phone });

    if (existingByEmail) {
        throw new Error("Email already exists. Please use another email.");
    }

    if (existingByPhone) {
        throw new Error("Phone number already exists. Please enter another number.");
    }
    const hashedPassword = await bcrypt.hash(adminDetails.password, 10);
    const newAdmin = await createAdmin({
        name: adminDetails.name,
        email: adminDetails.email,
        phone: adminDetails.phone,
        password: hashedPassword,
        role: adminDetails.role || "admin"
    });

    return newAdmin;
}

async function fetchAllAdmins() {
    return await getAllAdmins();
}

async function modifyAdmin(id, data) {
    return await updateAdmin(id, data);
}

async function removeAdmin(id) {
    return await deleteAdmin(id);
}

module.exports = {
    addAdmin,
    fetchAllAdmins,
    modifyAdmin,
    removeAdmin
};

