const mongoose = require("mongoose");

const appointmentRequestSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: String,
  requestedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("AppointmentRequest", appointmentRequestSchema);
