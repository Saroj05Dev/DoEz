const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const subService1Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    serviceId: {
      type: Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },

    subServiceId: {
      type: Schema.Types.ObjectId,
      ref: "SubService",
      required: true,
    },
  },
  { timestamps: true }
);

const SubService1 = mongoose.model("SubService1", subService1Schema);
module.exports = SubService1;
