/**
 * Diagnostic script — check why provider isn't showing on BookService
 * Usage: node src/scripts/debug_provider_match.js
 */
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../schema/userSchema");
const SubService3 = require("../schema/Sub_service3_schema");
const SubService = require("../schema/Subservice_schema");

async function debug() {
  await mongoose.connect(process.env.DB_URL);
  console.log("✅ Connected\n");

  // 1. Check the SubService3 from the URL
  const sub3Id = "69dca174acc8b0df1f601ef2";
  const sub3 = await SubService3.findById(sub3Id).lean();
  console.log("=== SubService3 (from URL) ===");
  console.log("  ID:", sub3?._id);
  console.log("  Name:", sub3?.subService3Name);
  console.log("  subServiceId:", sub3?.subServiceId);
  console.log("");

  // 2. Check that SubService exists
  if (sub3) {
    const subSvc = await SubService.findById(sub3.subServiceId).lean();
    console.log("=== Target SubService ===");
    console.log("  ID:", subSvc?._id);
    console.log("  Name:", subSvc?.name);
    console.log("");
  }

  // 3. Check the provider
  const provider = await User.findOne({ email: "aftab.ali.96088@gmail.com" }).lean();
  console.log("=== Provider (Aftab Ali) ===");
  console.log("  ID:", provider?._id);
  console.log("  role:", provider?.role);
  console.log("  kycStatus:", provider?.kycStatus);
  console.log("  availability:", provider?.availability);
  console.log("  currentLat:", provider?.currentLat);
  console.log("  currentLong:", provider?.currentLong);
  console.log("  location:", JSON.stringify(provider?.location));
  console.log("  providerServices count:", provider?.providerServices?.length);
  console.log("");

  // 4. Check if provider's subServiceIds match the SubService3's subServiceId
  if (sub3 && provider) {
    const targetId = sub3.subServiceId.toString();
    const provSubIds = (provider.providerServices || []).map(ps => ps.subServiceId?.toString());
    console.log("=== Matching Check ===");
    console.log("  Target subServiceId:", targetId);
    console.log("  Provider subServiceIds:", provSubIds);
    console.log("  MATCH:", provSubIds.includes(targetId) ? "✅ YES" : "❌ NO");
    console.log("");
  }

  // 5. Try the actual query (without geo)
  if (sub3) {
    const basicResult = await User.find({
      role: "provider",
      kycStatus: "approved",
      availability: "online",
      "providerServices.subServiceId": sub3.subServiceId,
    }).select("name availability").lean();
    console.log("=== Query WITHOUT geo filter ===");
    console.log("  Results:", basicResult.length);
    basicResult.forEach(r => console.log(`    - ${r.name} (${r.availability})`));
    console.log("");
  }

  // 6. Try with geo (simulating customer at same location)
  if (sub3 && provider?.location?.coordinates) {
    const [lng, lat] = provider.location.coordinates;
    try {
      const geoResult = await User.find({
        role: "provider",
        kycStatus: "approved",
        availability: "online",
        "providerServices.subServiceId": sub3.subServiceId,
        location: {
          $nearSphere: {
            $geometry: { type: "Point", coordinates: [lng, lat] },
            $maxDistance: 15000,
          },
        },
      }).select("name availability").lean();
      console.log("=== Query WITH geo filter (from provider's own coords) ===");
      console.log("  Results:", geoResult.length);
      geoResult.forEach(r => console.log(`    - ${r.name} (${r.availability})`));
    } catch (err) {
      console.log("  ❌ Geo query FAILED:", err.message);
    }
  }

  // 7. Check 2dsphere index
  const indexes = await User.collection.indexes();
  const geoIdx = indexes.find(i => i.key?.location === "2dsphere");
  console.log("\n=== 2dsphere Index ===");
  console.log("  Exists:", geoIdx ? "✅ YES" : "❌ NO");
  if (geoIdx) console.log("  Details:", JSON.stringify(geoIdx));

  // 8. Count users with invalid location data  
  const totalUsers = await User.countDocuments();
  const usersWithLocation = await User.countDocuments({ "location.type": "Point" });
  console.log("\n=== Users Location Stats ===");
  console.log("  Total users:", totalUsers);
  console.log("  Users with valid location:", usersWithLocation);

  await mongoose.disconnect();
}

debug().catch(err => {
  console.error("❌ Error:", err);
  process.exit(1);
});
