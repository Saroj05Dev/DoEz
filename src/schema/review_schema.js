// src/schema/Review_schema.js
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    provider_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { 
      type: Number, 
      min: 1, 
      max: 5, 
      required: true 
    },
    comment: String,
    isVisible: { 
      type: Boolean, 
      default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
