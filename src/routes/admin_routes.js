const express = require("express");
const { createAdmin, getAllAdmins, updateAdmin, deleteAdmin } = require("../controllers/adminController");

const adminRouter = express.Router();

adminRouter.post("/add", createAdmin);
adminRouter.get("/getall", getAllAdmins);
adminRouter.put("/:id", updateAdmin);
adminRouter.delete("/:id", deleteAdmin);

module.exports = adminRouter;
