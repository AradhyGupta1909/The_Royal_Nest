require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const connectDB = require("./config/db");
const passport = require("./config/passport");

const app = express();
connectDB();

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || "secret", resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/rooms", require("./routes/roomRoutes"));
app.use("/api/bookings", require("./routes/bookingRoutes"));
app.use("/api/queries", require("./routes/queryRoutes"));

app.get("/", (req, res) => res.json({ message: "🏨 Hotel Aradhya API Running!" }));

// Seed route - visit once to add sample rooms
app.get("/api/seed", async (req, res) => {
  try {
    const Room = require("./models/Room");
    const count = await Room.countDocuments();
    if (count > 0) return res.json({ message: `Already seeded with ${count} rooms` });
    await Room.insertMany([
      { name: "Classic Standard", type: "Standard", description: "Elegant standard room with city view, comfortable king bed and all modern amenities. Perfect for solo travelers and couples.", pricePerNight: 3500, capacity: 2, size: 350, amenities: ["WiFi", "AC", "TV", "Room Service", "Mini Bar"], roomNumber: "101", floor: 1 },
      { name: "Garden View Standard", type: "Standard", description: "Peaceful room overlooking the hotel's lush garden. A tranquil retreat with premium bedding and serene views.", pricePerNight: 3200, capacity: 2, size: 320, amenities: ["WiFi", "AC", "TV", "Garden View", "Room Service"], roomNumber: "102", floor: 1 },
      { name: "Superior Deluxe", type: "Deluxe", description: "Spacious deluxe room with panoramic city views, premium furnishings and exclusive bathroom with jacuzzi.", pricePerNight: 6500, capacity: 3, size: 550, amenities: ["WiFi", "AC", "Smart TV", "Jacuzzi", "Room Service", "Mini Bar", "Lounge Access"], roomNumber: "201", floor: 2 },
      { name: "Executive Deluxe", type: "Deluxe", description: "Designed for business travelers with high-speed WiFi, work desk, and exclusive lounge access.", pricePerNight: 7500, capacity: 2, size: 600, amenities: ["WiFi", "AC", "Smart TV", "Work Desk", "Lounge Access", "Express Laundry", "Mini Bar"], roomNumber: "202", floor: 2 },
      { name: "Royal Suite", type: "Suite", description: "Luxurious suite with separate living area, private balcony, and dedicated butler service.", pricePerNight: 12000, capacity: 4, size: 950, amenities: ["WiFi", "AC", "Smart TV", "Jacuzzi", "Butler Service", "Breakfast", "Lounge Access", "Mini Bar"], roomNumber: "301", floor: 3 },
      { name: "Presidential Suite", type: "Presidential", description: "The pinnacle of luxury — sprawling suite with private dining, home theatre and personal butler.", pricePerNight: 25000, capacity: 6, size: 2000, amenities: ["WiFi", "AC", "Home Theatre", "Jacuzzi", "Private Pool", "Butler Service", "All Meals", "Airport Transfer", "Spa"], roomNumber: "401", floor: 4 },
    ]);
    res.json({ message: "✅ 6 rooms seeded successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏨 ================================`);
  console.log(`🚀 Hotel Aradhya Server: http://localhost:${PORT}`);
  console.log(`🌱 Seed DB: http://localhost:${PORT}/api/seed`);
  console.log(`🏨 ================================\n`);
});
