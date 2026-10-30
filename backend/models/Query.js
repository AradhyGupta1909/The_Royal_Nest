const mongoose = require("mongoose");

const querySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    status: { type: String, enum: ["open", "in-progress", "resolved"], default: "open" },
    adminReply: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Query", querySchema);
