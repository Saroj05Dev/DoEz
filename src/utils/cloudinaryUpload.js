const cloudinary = require("../config/cloudinaryConfig");
const fs = require("fs");

/**
 * Uploads a file to Cloudinary and deletes the local file afterward.
 * @param {string} filePath - Local path to the file.
 * @param {string} folder - Cloudinary folder name.
 * @returns {Promise<string>} - The secure URL of the uploaded image.
 */
async function uploadToCloudinary(filePath, folder = "doez") {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
    });

    // Successfully uploaded, delete local file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload error:", error.message);

    // Even if upload fails, we might want to delete the local file
    // depending on the policy. For now, let's keep it if it fails
    // so the caller can handle fallback if they want.

    throw error;
  }
}

module.exports = { uploadToCloudinary };
