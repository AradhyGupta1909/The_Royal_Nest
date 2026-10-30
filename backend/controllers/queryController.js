const Query = require("../models/Query");

exports.createQuery = async (req, res) => {
  try {
    const query = await Query.create({ ...req.body, user: req.user?._id });
    res.status(201).json({ query });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllQueries = async (req, res) => {
  try {
    const queries = await Query.find().populate("user", "name email").populate("room", "name roomNumber").sort({ createdAt: -1 });
    res.json({ queries });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.updateQueryStatus = async (req, res) => {
  try {
    const { status, adminReply } = req.body;
    const query = await Query.findByIdAndUpdate(req.params.id, { status, adminReply }, { new: true });
    res.json({ query });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
