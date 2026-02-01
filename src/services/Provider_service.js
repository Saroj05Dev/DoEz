const {
  updateUserById,
  findUserById, getAllProviders
} = require("../repositories/userRepository");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");
const User = require("../schema/userSchema");
const Service = require("../schema/Service_schema");
const SubService = require("../schema/Subservice_schema");
async function onboardProvider(userId, data) {
  return await updateUserById(userId, {
    role: "provider",
    kycStatus: null,
    rates: data.rates,
    workArea: data.workArea,
    experienceYears: data.experienceYears,
    availability: "offline",
  });
}

async function getProviderProfile(id) {
  const user = await User.findById(id)
    .select("-password")
    .populate("providerServices.serviceId")
    .populate("providerServices.subServiceId");
  if (!user || user.role !== "provider")
    throw { reason: "Provider not found", statusCode: 404 };
  return user;
}

async function updateProviderProfile(id, data) {
  const allowed = ["rates", "workArea", "experienceYears", "aadharNumber", "panNumber", "bankDetails"];
  const updates = {};
  allowed.forEach((k) => {
    if (data[k] !== undefined) updates[k] = data[k];
  });
  return await updateUserById(id, updates);
}

async function toggleAvailability(id, status) {
  if (!["online", "offline"].includes(status))
    throw { reason: "Invalid status", statusCode: 400 };
  return await updateUserById(id, { availability: status });
}

async function getEarnings(id) {
  const Booking = require("../schema/booking_schema");
  const completed = await Booking.countDocuments({
    provider_id: id,
    status: "Completed",
  });
  const agg = await Booking.aggregate([
    {
      $match: {
        provider_id: new mongoose.Types.ObjectId(id),
        status: "Completed",
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return { completedJobs: completed, monthlyEarnings: agg[0]?.total || 0 };
}

async function handleKycUpload(userId, files) {
  const provider = await findUserById(userId);
  if (!provider) throw { reason: "Provider not found", statusCode: 404 };

  const uploadedUrls = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "fixerly/kyc_docs",
    });
    uploadedUrls.push(result.secure_url);

    // Cleanup local file
    fs.unlinkSync(file.path);
  }

  // Merge existing docs + set status
  const updatedProvider = await updateUserById(userId, {
    kycDocs: [...(provider.kycDocs || []), ...uploadedUrls],
    kycStatus: "pending",
  });

  return updatedProvider;
}


// only for admins
async function listAllProviders() {
  return await User.find({ role: "provider" })
    .select("-password")
    .populate("providerServices.serviceId")
    .populate("providerServices.subServiceId");
}
// admin create provider
async function createProvider(data) {
  return await User.create({
    ...data,
    role: "provider",
    availability: "offline",
  });
}

// admin update provider
async function adminUpdateProvider(id, data) {
  return await updateUserById(id, data);
}

// admin delete provider
async function deleteProvider(id) {
  const user = await findUserById(id);
  if (!user || user.role !== "provider") {
    throw { reason: "Provider not found", statusCode: 404 };
  }
  return await User.findByIdAndDelete(id);
}


async function submitFullKyc(userId, data, files) {
  const provider = await findUserById(userId);
  if (!provider) throw { reason: "Provider not found", statusCode: 404 };

  const updates = {
    aadharNumber: data.aadharNumber,
    panNumber: data.panNumber,
    bankDetails: {
      accountNumber: data.accountNumber,
      ifscCode: data.ifscCode,
    },
    kycStatus: "pending",
  };

  // Handle file uploads to Cloudinary with local fallback
  if (files.aadharFile && files.aadharFile[0]) {
    try {
      const res = await cloudinary.uploader.upload(files.aadharFile[0].path, {
        folder: "fixerly/kyc_docs",
      });
      updates.aadharFile = res.secure_url;
      // Delete local file after successful upload to Cloudinary
      fs.unlinkSync(files.aadharFile[0].path);
    } catch (err) {
      console.error("Aadhar file upload to Cloudinary failed:", err.message);
      // Use local file URL as fallback
      const filename = files.aadharFile[0].filename;
      updates.aadharFile = `/uploads/${filename}`;
      console.log("Using local file URL:", updates.aadharFile);
    }
  }

  if (files.panFile && files.panFile[0]) {
    try {
      const res = await cloudinary.uploader.upload(files.panFile[0].path, {
        folder: "fixerly/kyc_docs",
      });
      updates.panFile = res.secure_url;
      // Delete local file after successful upload to Cloudinary
      fs.unlinkSync(files.panFile[0].path);
    } catch (err) {
      console.error("PAN file upload to Cloudinary failed:", err.message);
      // Use local file URL as fallback
      const filename = files.panFile[0].filename;
      updates.panFile = `/uploads/${filename}`;
      console.log("Using local file URL:", updates.panFile);
    }
  }

  if (files.passbookImage && files.passbookImage[0]) {
    try {
      const res = await cloudinary.uploader.upload(files.passbookImage[0].path, {
        folder: "fixerly/kyc_docs",
      });
      updates["bankDetails.passbookImage"] = res.secure_url;
      // Delete local file after successful upload to Cloudinary
      fs.unlinkSync(files.passbookImage[0].path);
    } catch (err) {
      console.error("Passbook image upload to Cloudinary failed:", err.message);
      // Use local file URL as fallback
      const filename = files.passbookImage[0].filename;
      updates["bankDetails.passbookImage"] = `/uploads/${filename}`;
      console.log("Using local file URL:", updates["bankDetails.passbookImage"]);
    }
  }

  // Use a special way to update nested bankDetails or just overwrite it
  // Since we are setting all bankDetails, we can just do:
  updates.bankDetails = {
    accountNumber: data.accountNumber,
    ifscCode: data.ifscCode,
    passbookImage: updates["bankDetails.passbookImage"] || provider.bankDetails?.passbookImage,
  };
  delete updates["bankDetails.passbookImage"];

  return await updateUserById(userId, updates);
}

// admin approve/reject kyc
async function approveKyc(id, status) {
  if (!["approved", "rejected", "pending"].includes(status)) {
    throw { reason: "Invalid KYC status", statusCode: 400 };
  }
  return await updateUserById(id, { kycStatus: status });
}

// Update provider services
async function updateProviderServices(userId, data) {
  const provider = await findUserById(userId);
  if (!provider) throw { reason: "Provider not found", statusCode: 404 };

  const updates = {
    providerServices: data.services,
  };

  if (data.workArea) updates.workArea = data.workArea;
  if (data.experienceYears) updates.experienceYears = data.experienceYears;

  return await updateUserById(userId, updates);
}

const SubService3 = require("../schema/Sub_service3_schema");

// Get providers by specific service ID (SubService3)
async function getProvidersByServiceId(subService3Id) {
  // First, find the subService3 to get its parent subServiceId
  const subService3 = await SubService3.findById(subService3Id);
  if (!subService3) return [];

  const targetSubServiceId = subService3.subServiceId;

  return await User.find({
    role: "provider",
    kycStatus: "approved", // Only show approved providers
    "providerServices.subServiceId": targetSubServiceId,
  }).select("name rates experienceYears workArea providerServices");
}

module.exports = {
  onboardProvider,
  getProviderProfile,
  updateProviderProfile,
  toggleAvailability,
  getEarnings,
  handleKycUpload,
  submitFullKyc,
  listAllProviders,
  createProvider,
  adminUpdateProvider,
  deleteProvider,
  approveKyc,
  updateProviderServices,
  getProvidersByServiceId,
};
