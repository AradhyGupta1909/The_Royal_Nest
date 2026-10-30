const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, default: 1 },
    totalPrice: { type: Number, required: true },
    status: { 
      type: String, 
      enum: ["pending", "confirmed", "cancelled", "completed"], 
      default: "confirmed" 
    },
    paymentStatus: { 
      type: String, 
      enum: ["pending", "paid", "refunded"], 
      default: "paid" 
    },
    paymentMethod: { 
      type: String, 
      enum: ["credit_card", "debit_card", "upi", "net_banking"], 
      default: "credit_card" 
    },
    guestDetails: { 
      name: String, 
      email: String, 
      phone: String, 
      specialRequests: String 
    },
    bookingId: { type: String, unique: true },
  },
  { timestamps: true }
);

bookingSchema.pre("save", function (next) {
  if (!this.bookingId) {
    this.bookingId = "RNT" + 
      Date.now().toString().slice(-6) + 
      Math.random().toString(36).slice(-4).toUpperCase();
  }
  next();
});

module.exports = mongoose.model("Booking", bookingSchema);