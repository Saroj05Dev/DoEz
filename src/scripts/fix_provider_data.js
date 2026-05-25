const mongoose = require("mongoose");
require("dotenv").config();
const SubService = require("../schema/Subservice_schema");
const User = require("../schema/userSchema");

(async () => {
  await mongoose.connect(process.env.DB_URL);
  console.log("✅ Connected\n");

  // The CORRECT service ID that customer is browsing: "Electrician" = 69dca16dacc8b0df1f601e44
  const correctServiceId = "69dca16dacc8b0df1f601e44";

  // Get ALL SubServices under the correct "Electrician" service
  const subServices = await SubService.find({ serviceId: correctServiceId }).lean();
  console.log("SubServices under 'Electrician' (" + correctServiceId + "):");
  subServices.forEach(s => console.log("  " + s._id + " => " + s.name));

  // Build providerServices with CORRECT IDs
  const providerServices = subServices.map((ss) => ({
    serviceId: new mongoose.Types.ObjectId(correctServiceId),
    subServiceId: ss._id,
  }));

  // Update Aftab
  const result = await User.findOneAndUpdate(
    { email: "aftab.ali.96088@gmail.com" },
    { $set: { providerServices } },
    { new: true }
  );

  console.log("\n✅ Updated Aftab's providerServices to " + result.providerServices.length + " services");
  result.providerServices.forEach(ps => console.log("  serviceId:", ps.serviceId, "subServiceId:", ps.subServiceId));

  // Also fix the 3 other providers that match — give them location data
  const otherProviders = await User.find({
    role: "provider",
    "providerServices.subServiceId": { $in: subServices.map(s => s._id) },
    $or: [
      { "location.coordinates": { $exists: false } },
      { "location.coordinates": [0, 0] },
      { location: { $exists: false } },
    ],
  });
  
  for (const p of otherProviders) {
    if (p.currentLat && p.currentLong) {
      await User.updateOne({ _id: p._id }, {
        $set: {
          location: { type: "Point", coordinates: [p.currentLong, p.currentLat] },
        },
      });
      console.log("  ✔ Fixed location for " + p.name);
    }
  }

  // Verify
  const sub3 = await require("../schema/Sub_service3_schema").findById("69dca174acc8b0df1f601ef2");
  const providers = await User.find({
    role: "provider",
    kycStatus: "approved",
    availability: "online",
    "providerServices.subServiceId": sub3.subServiceId,
  }).select("name availability location").lean();
  
  console.log("\n=== Final Verification ===");
  console.log("Matching providers (no geo):", providers.length);
  providers.forEach(p => console.log("  " + p.name + " | loc:", JSON.stringify(p.location?.coordinates)));

  await mongoose.disconnect();
  console.log("\n✅ Done!");
})();
