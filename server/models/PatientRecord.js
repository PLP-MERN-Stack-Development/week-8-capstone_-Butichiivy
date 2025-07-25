const mongoose = require("mongoose");

const patientRecordSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  diagnosis: String,
  treatment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("PatientRecord", patientRecordSchema);
