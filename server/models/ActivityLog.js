const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    recordId: { type: mongoose.Schema.Types.ObjectId, ref: "PatientRecord" },
    action: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ActivityLog", activityLogSchema);
