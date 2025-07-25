const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Route Imports
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/auth");
const recordRoutes = require("./routes/records");
const appointmentRoutes = require("./routes/appointments"); // ✅ FIXED LINE

// Route Use
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/appointments", appointmentRoutes); // ✅ FIXED POSITION

// DB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("Mongo error:", err));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
