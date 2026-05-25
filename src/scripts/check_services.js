const mongoose = require("mongoose");
require("dotenv").config();
const SubService = require("../schema/Subservice_schema");
const Service = require("../schema/Service_schema");
const User = require("../schema/userSchema");

(async () => {
  await mongoose.connect(process.env.DB_URL);
  
  const svc = await Service.findOne({ name: /electri/i });
  const all = await SubService.find({ serviceId: svc._id }).lean();
  console.log("ALL SubServices under Electrical (" + svc._id + "):");
  all.forEach(s => console.log("  " + s._id + " => " + s.name));
  
  const targetId = "69dca173acc8b0df1f601ee3";
  const targetSS = await SubService.findById(targetId).lean();
  console.log("\nTarget SubService (Labour Only):");
  console.log("  ID:", targetSS?._id);
  console.log("  Name:", targetSS?.name);
  console.log("  serviceId:", targetSS?.serviceId);
  
  const isUnderElectrical = targetSS?.serviceId?.toString() === svc._id.toString();
  console.log("  Under Electrical?", isUnderElectrical ? "YES" : "NO");
  
  if (!isUnderElectrical) {
    const parentService = await Service.findById(targetSS?.serviceId).lean();
    console.log("  Actual Parent Service:", parentService?.name, parentService?._id);
  }
  
  // Check if this SubService is in the providers list
  const aftab = await User.findOne({ email: "aftab.ali.96088@gmail.com" }).lean();
  const aftabSubIds = aftab.providerServices.map(ps => ps.subServiceId?.toString());
  console.log("\nAftab's subServiceIds:", aftabSubIds);
  console.log("Target in Aftab's list?", aftabSubIds.includes(targetId));
  
  // Find which service IDs from aftab's list DON'T match the all list
  const allIds = all.map(s => s._id.toString());
  console.log("\nAll Electrical SubService IDs:", allIds);
  console.log("Aftab's IDs match?", aftabSubIds.every(id => allIds.includes(id)));
  
  await mongoose.disconnect();
})();
