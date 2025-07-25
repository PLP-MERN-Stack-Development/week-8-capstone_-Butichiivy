const express = require("express");
const router = express.Router();
const User = require("../models/User");

// GET /api/users?role=patient - Fetch users by role
router.get("/", async (req, res) => {
  try {
    const role = req.query.role;
    const users = await User.find(role ? { role } : {});
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch users", error });
  }
});

module.exports = router;
