const express = require("express");
const router = express.Router();
const PatientRecord = require("../models/PatientRecord");
const AppointmentRequest = require("../models/AppointmentRequest"); // NEW
const ActivityLog = require("../models/ActivityLog"); // NEW

// ✅ Get records for a specific doctor
router.get("/doctor/:doctorId", async (req, res) => {
  try {
    const records = await PatientRecord.find({ doctorId: req.params.doctorId }).populate("patientId", "name");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error while fetching doctor records" });
  }
});

// ✅ Get records for a specific patient
router.get("/patient/:id", async (req, res) => {
  try {
    const records = await PatientRecord.find({ patientId: req.params.id }).populate("doctorId", "name");
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch records." });
  }
});

// ✅ Create a new patient record
router.post("/", async (req, res) => {
  const { doctorId, patientId, diagnosis, treatment } = req.body;
  if (!doctorId || !patientId) {
    return res.status(400).json({ message: "Missing doctor or patient ID" });
  }

  try {
    const newRecord = await PatientRecord.create({ doctorId, patientId, diagnosis, treatment });

    // 📌 Log activity
    await ActivityLog.create({
      doctorId,
      patientId,
      action: "Created a new record",
      recordId: newRecord._id,
    });

    res.json(newRecord);
  } catch (err) {
    res.status(500).json({ message: "Server error while creating record" });
  }
});

// ✅ Update (edit) a record
router.put("/:id", async (req, res) => {
  try {
    const updated = await PatientRecord.findByIdAndUpdate(
      req.params.id,
      {
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Record not found" });

    // 📌 Log update
    await ActivityLog.create({
      doctorId: updated.doctorId,
      patientId: updated.patientId,
      recordId: updated._id,
      action: "Updated a patient record",
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error while updating record" });
  }
});

// ✅ Delete a record
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await PatientRecord.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Record not found" });

    // 📌 Log deletion
    await ActivityLog.create({
      doctorId: deleted.doctorId,
      patientId: deleted.patientId,
      recordId: deleted._id,
      action: "Deleted a patient record",
    });

    res.json({ message: "Record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error while deleting record" });
  }
});

// ✅ Share a record
router.post("/share/:recordId", async (req, res) => {
  const { toDoctorId } = req.body;
  const { recordId } = req.params;

  if (!toDoctorId) {
    return res.status(400).json({ message: "Target doctor ID is required" });
  }

  try {
    const original = await PatientRecord.findById(recordId);
    if (!original) return res.status(404).json({ message: "Original record not found" });

    const newShared = await PatientRecord.create({
      doctorId: toDoctorId,
      patientId: original.patientId,
      diagnosis: original.diagnosis,
      treatment: original.treatment,
    });

    // 📌 Log share
    await ActivityLog.create({
      doctorId: original.doctorId,
      patientId: original.patientId,
      recordId: newShared._id,
      action: `Shared record with doctor ${toDoctorId}`,
    });

    res.json({ message: "Record shared successfully", shared: newShared });
  } catch (err) {
    res.status(500).json({ message: "Failed to share record" });
  }
});

// ✅ NEW: Get activity logs
router.get("/logs/:userId", async (req, res) => {
  try {
    const logs = await ActivityLog.find({
      $or: [{ doctorId: req.params.userId }, { patientId: req.params.userId }],
    })
      .populate("recordId", "diagnosis treatment")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch logs" });
  }
});

module.exports = router;
