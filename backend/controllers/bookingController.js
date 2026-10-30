const Booking = require("../models/Booking");
const Room = require("../models/Room");
const User = require("../models/User");

exports.createBooking = async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, paymentMethod, guestDetails } = req.body;
    const room = await Room.findById(roomId);
    if (!room) return res.status(404).json({ message: "Room not found" });
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    if (nights < 1) return res.status(400).json({ message: "Invalid dates" });
    const conflict = await Booking.findOne({ room: roomId, status: { $ne: "cancelled" }, checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } });
    if (conflict) return res.status(400).json({ message: "Room not available for selected dates" });
    const totalPrice = nights * room.pricePerNight;
    const booking = await Booking.create({ user: req.user._id, room: roomId, checkIn, checkOut, guests, totalPrice, paymentMethod, guestDetails });
    await booking.populate(["user", "room"]);
    res.status(201).json({ booking });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate("room").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("user", "name email phone").populate("room", "name type roomNumber pricePerNight").sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    booking.status = "cancelled";
    await booking.save();
    res.json({ booking });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getStats = async (req, res) => {
  try {
    const year = new Date().getFullYear();
    const monthlyBookings = await Booking.aggregate([
      { $match: { createdAt: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) }, status: { $ne: "cancelled" } } },
      { $group: { _id: { $month: "$createdAt" }, count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } },
      { $sort: { _id: 1 } },
    ]);
    const roomTypeStats = await Booking.aggregate([
      { $match: { status: { $ne: "cancelled" } } },
      { $lookup: { from: "rooms", localField: "room", foreignField: "_id", as: "roomData" } },
      { $unwind: "$roomData" },
      { $group: { _id: "$roomData.type", count: { $sum: 1 } } },
    ]);
    const totalBookings = await Booking.countDocuments({ status: { $ne: "cancelled" } });
    const revenueAgg = await Booking.aggregate([{ $match: { status: { $ne: "cancelled" } } }, { $group: { _id: null, total: { $sum: "$totalPrice" } } }]);
    const totalUsers = await User.countDocuments({ role: "user" });
    const activeBookings = await Booking.countDocuments({ status: "confirmed", checkIn: { $lte: new Date() }, checkOut: { $gte: new Date() } });
    res.json({ monthlyBookings, roomTypeStats, totalBookings, totalRevenue: revenueAgg[0]?.total || 0, totalUsers, activeBookings });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
