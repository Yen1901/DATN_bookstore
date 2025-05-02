const mongoose = require("mongoose");

const AddressSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },

    city: { type: String, required: true },
    district: { type: String, required: true },
    ward: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
