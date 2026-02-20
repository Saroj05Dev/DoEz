const User = require("../schema/userSchema");

async function createAdmin(data) {
    return await User.create({ ...data, role: "admin" });
}

async function getAllAdmins() {
    return await User.find({ role: "admin" });
}

async function updateAdmin(id, data) {
    return await User.findByIdAndUpdate(id, { ...data, role: "admin" }, { new: true });
}

async function toggleAdminStatus(id) {
    const user = await User.findById(id);
    if (!user) throw new Error("Admin not found");
    user.status = user.status === "suspended" ? "active" : "suspended";
    return await user.save();
}

module.exports = {
    createAdmin,
    getAllAdmins,
    updateAdmin,
    toggleAdminStatus
};
