/**
 * Seed a fully-filled Electrician provider
 * Usage: node src/scripts/seed_provider.js
 */

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const User = require("../schema/userSchema");
const Service = require("../schema/Service_schema");
const SubService = require("../schema/Subservice_schema");

async function seed() {
  const dbUrl = process.env.DB_URL;
  if (!dbUrl) {
    console.error("❌ DB_URL not found in .env");
    process.exit(1);
  }

  await mongoose.connect(dbUrl);
  console.log("✅ Connected to MongoDB");

  // Check if user already exists
  const existing = await User.findOne({ email: "aftab.ali.96088@gmail.com" });
  if (existing) {
    console.log("⚠️  Provider with this email already exists. ID:", existing._id);
    console.log("   Updating to provider role with all fields...");
    
    // Find electrician service
    const electricianService = await Service.findOne({ name: { $regex: /electri/i } });
    if (!electricianService) {
      console.error("❌ No Electrician service found in DB. Please add services first.");
      await mongoose.disconnect();
      process.exit(1);
    }
    console.log(`📌 Found service: ${electricianService.name} (${electricianService._id})`);

    // Find all sub-services under electrician
    const subServices = await SubService.find({ serviceId: electricianService._id });
    console.log(`📌 Found ${subServices.length} sub-services`);

    // Build providerServices array
    const providerServices = subServices.map((ss) => ({
      serviceId: electricianService._id,
      subServiceId: ss._id,
    }));

    // If no sub-services, just link the main service
    if (providerServices.length === 0) {
      providerServices.push({ serviceId: electricianService._id });
    }

    const hashedPassword = await bcrypt.hash("Aftab@123", 10);

    await User.findByIdAndUpdate(existing._id, {
      name: "Aftab Ali",
      password: hashedPassword,
      phone: "9608812345",
      role: "provider",
      isVerified: true,
      isPhoneVerified: true,
      kycStatus: "approved",
      aadharNumber: "1234-5678-9012",
      panNumber: "ABCDE1234F",
      bankDetails: {
        accountNumber: "1234567890123456",
        ifscCode: "SBIN0001234",
      },
      rates: 500,
      workArea: "Kolkata",
      address: "Salt Lake, Sector V, Kolkata, West Bengal 700091",
      experienceYears: 5,
      availability: "offline",
      providerServices,
      status: "active",
      currentLat: 22.5726,
      currentLong: 88.3639,
      location: {
        type: "Point",
        coordinates: [88.3639, 22.5726], // [lng, lat] Kolkata
      },
    });

    console.log("✅ Provider updated successfully!");
    await mongoose.disconnect();
    process.exit(0);
  }

  // ── Find Electrician service ────────────────────────────
  const electricianService = await Service.findOne({ name: { $regex: /electri/i } });
  if (!electricianService) {
    console.error("❌ No Electrician service found in DB. Please add services first.");
    await mongoose.disconnect();
    process.exit(1);
  }
  console.log(`📌 Found service: ${electricianService.name} (${electricianService._id})`);

  // Find all sub-services under electrician
  const subServices = await SubService.find({ serviceId: electricianService._id });
  console.log(`📌 Found ${subServices.length} sub-services`);

  // Build providerServices array
  const providerServices = subServices.map((ss) => ({
    serviceId: electricianService._id,
    subServiceId: ss._id,
  }));

  if (providerServices.length === 0) {
    providerServices.push({ serviceId: electricianService._id });
  }

  // ── Create Provider ─────────────────────────────────────
  const hashedPassword = await bcrypt.hash("Aftab@123", 10);

  const provider = await User.create({
    name: "Aftab Ali",
    email: "aftab.ali.96088@gmail.com",
    password: hashedPassword,
    phone: "9608812345",
    role: "provider",
    isVerified: true,
    isPhoneVerified: true,
    kycStatus: "approved",
    aadharNumber: "1234-5678-9012",
    panNumber: "ABCDE1234F",
    bankDetails: {
      accountNumber: "1234567890123456",
      ifscCode: "SBIN0001234",
    },
    rates: 500,
    workArea: "Kolkata",
    address: "Salt Lake, Sector V, Kolkata, West Bengal 700091",
    experienceYears: 5,
    availability: "offline",
    providerServices,
    status: "active",
    currentLat: 22.5726,
    currentLong: 88.3639,
    location: {
      type: "Point",
      coordinates: [88.3639, 22.5726], // [lng, lat] Kolkata
    },
  });

  console.log("\n✅ Provider created successfully!");
  console.log(`   Name:     ${provider.name}`);
  console.log(`   Email:    ${provider.email}`);
  console.log(`   Password: Aftab@123`);
  console.log(`   ID:       ${provider._id}`);
  console.log(`   KYC:      ${provider.kycStatus}`);
  console.log(`   Services: ${providerServices.length} linked`);
  console.log(`   Location: Kolkata [22.5726, 88.3639]`);

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
