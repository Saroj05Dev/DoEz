/**
 * One-time migration script to backfill GeoJSON `location` field
 * for providers who already have currentLat / currentLong.
 *
 * Usage:  node src/scripts/migrate_provider_locations.js
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../schema/userSchema");

async function migrate() {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.error("❌ DB_URL not found in .env");
    process.exit(1);
  }

  await mongoose.connect(dbUrl);
  console.log("✅ Connected to MongoDB");

  // Find all providers with existing lat/long but no GeoJSON location
  const providers = await User.find({
    role: "provider",
    currentLat: { $ne: null },
    currentLong: { $ne: null },
    $or: [
      { location: { $exists: false } },
      { "location.coordinates": [0, 0] },
    ],
  });

  console.log(`📍 Found ${providers.length} providers to migrate`);

  let updated = 0;
  for (const provider of providers) {
    await User.updateOne(
      { _id: provider._id },
      {
        $set: {
          location: {
            type: "Point",
            coordinates: [provider.currentLong, provider.currentLat], // GeoJSON: [lng, lat]
          },
        },
      }
    );
    updated++;
    console.log(
      `  ✔ ${provider.name} → [${provider.currentLong}, ${provider.currentLat}]`
    );
  }

  console.log(`\n✅ Migration complete. Updated ${updated} providers.`);
  await mongoose.disconnect();
  process.exit(0);
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
