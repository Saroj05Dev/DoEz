const User = require("../schema/userSchema");

async function findUser(params) {
  return User.findOne({ ...params });
}

async function findUserById(id) {
  return User.findById(id).select("-password");
}

async function updateUserById(id, data) {
  return User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");
}

async function createUser(data) {
  return User.create(data);
}

async function getAllUsers() {
  return User.find().select("-password");
}
async function getAllProviders() {
  return User.find({ role: "provider" }).select("-password");
}
module.exports = {
  findUser,
  findUserById,
  updateUserById,
  createUser,
  getAllUsers,
   getAllProviders,
};
