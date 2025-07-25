const express = require("express");
const router = express.Router();
const User = require("../models/User");
const shortid = require("shortid");

// Register
router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    let newUserData = { name, email, password, role };

    if (role === "patient") {
      // Find the last patient with a patientId
      const lastPatient = await User.findOne({ role: "patient", patientId: { $exists: true } })
        .sort({ patientId: -1 }) // Sort descending
        .collation({ locale: "en", numericOrdering: true }); // So PT-10 comes after PT-9

      let nextIdNumber = 1;

      if (lastPatient && lastPatient.patientId) {
        const lastId = parseInt(lastPatient.patientId.split("-")[1], 10);
        nextIdNumber = lastId + 1;
      }

      // Format like PT-001, PT-010, etc.
      const paddedId = String(nextIdNumber).padStart(3, "0");
      newUserData.patientId = `PT-${paddedId}`;
    }

    const user = await User.create(newUserData);
    res.json({ user });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Server error" });
  }
});


// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});
// Get all users by role (e.g., doctor or patient)
router.get("/", async (req, res) => {
  const role = req.query.role;
  try {
    const users = await User.find(role ? { role } : {});
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;
