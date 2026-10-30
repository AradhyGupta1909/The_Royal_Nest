const express = require("express");
const router = express.Router();
const { createQuery, getAllQueries, updateQueryStatus } = require("../controllers/queryController");
const { protect, adminOnly } = require("../middleware/auth");
router.post("/", createQuery);
router.get("/", protect, adminOnly, getAllQueries);
router.put("/:id", protect, adminOnly, updateQueryStatus);
module.exports = router;
