const Room = require("../models/Room");

exports.getRooms = async (req, res) => {
  try {
    const { type, minPrice, maxPrice, capacity } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.pricePerNight = {};
      if (minPrice) filter.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) filter.pricePerNight.$lte = Number(maxPrice);
    }
    if (capacity) filter.capacity = { $gte: Number(capacity) };
    const rooms = await Room.find(filter).sort({ pricePerNight: 1 });
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.suggestRooms = async (req, res) => {
  try {
    const { guests, budget, preference } = req.query;
    const filter = {};
    if (guests) filter.capacity = { $gte: Number(guests) };
    if (budget) filter.pricePerNight = { $lte: Number(budget) };
    if (preference === "luxury") filter.type = { $in: ["Suite", "Presidential"] };
    else if (preference === "budget") filter.type = { $in: ["Standard", "Deluxe"] };
    const rooms = await Room.find(filter).sort({ pricePerNight: 1 }).limit(4);
    res.json({ rooms });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ room });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.json({ message: "Room deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};