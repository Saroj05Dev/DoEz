const dotenv = require("dotenv");
dotenv.config();

// Here we are exporting all the env variables that the project uses
module.exports = {
  PORT: process.env.PORT,
  DB_URL: process.env.DB_URL,
  FAST2SMS_API_KEY: process.env.FAST2SMS_API_KEY,
  USE_FAST2SMS: process.env.USE_FAST2SMS,
  NODE_ENV: process.env.NODE_ENV,
  JWT_SECRET: process.env.JWT_SECRET,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:5173",
  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET,
};
