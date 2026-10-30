const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["Standard", "Deluxe", "Suite", "Presidential"], required: true },
    description: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    capacity: { type: Number, required: true },
    size: { type: Number, required: true },
    amenities: [{ type: String }],
    images: [{ type: String }],
    isAvailable: { type: Boolean, default: true },
    floor: { type: Number },
    roomNumber: { type: String, unique: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Room", roomSchema);
