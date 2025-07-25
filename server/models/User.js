const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["doctor", "patient"],
    required: true,
  },
  patientId: {
    type: String,
    unique: true,
    sparse: true, // only patients will have this
  },
});

module.exports = mongoose.model("User", userSchema);
