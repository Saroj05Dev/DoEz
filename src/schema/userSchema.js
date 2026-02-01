// src/schema/User_schema.js
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name must be provided"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email must be provided"],
      unique: true,
      trim: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Invalid email"],
    },
    password: {
      type: String,
      required: [true, "Password must be provided"],
    },
    phone: {
      type: String,
      required: [true, "Phone number must be provided"],
      unique: true,
      minLength: [10, "10 digits only"],
      maxLength: [10, "10 digits only"],
    },
    role: {
      type: String,
      enum: ["customer", "provider", "admin"],
      default: "customer",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },

    isPhoneVerified: {
      type: Boolean,
      default: false,
    },

    kycStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: null,
    },
    aadharNumber: String,
    aadharFile: String,
    panNumber: String,
    panFile: String,
    bankDetails: {
      accountNumber: String,
      ifscCode: String,
      passbookImage: String,
    },
    rates: Number,
    workArea: String,
    experienceYears: Number,
    availability: {
      type: String,
      enum: ["online", "offline"],
      default: "offline",
    },
    kycDocs: [String],
    providerServices: [
      {
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
        },
        subServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubService",
        },
        subService1Id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubService1",
        },
        subService2Id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubService2",
        },
        subService3Ids: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubService3",
          },
        ],
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
