const bcrypt = require("bcryptjs");
const Doctor = require("../models/doctorModel");
const Patient = require("../models/patientModel");

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const Model = role === "doctor" ? Doctor : Patient;

    const existingUser = await Model.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: `${role} already exists.` });
    }

    // Generate unique short patient ID if role is patient
    let patientId = null;
    if (role === "patient") {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      patientId = `PAT-${randomNum}`;
    }

    const newUserData = { name, email, password };
    if (patientId) {
      newUserData.patientId = patientId;
    }

    const newUser = new Model(newUserData);
    await newUser.save();

    res.status(201).json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        patientId: newUser.patientId || null,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Server error during registration." });
  }
};

const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const Model = role === "doctor" ? Doctor : Patient;

    const user = await Model.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    res.status(200).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        patientId: user.patientId || null,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error during login." });
  }
};

module.exports = { registerUser, loginUser };
