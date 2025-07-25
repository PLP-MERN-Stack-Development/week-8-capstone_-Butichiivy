const mongoose = require("mongoose");
const User = require("./models/User"); // updated path for local import

const MONGO_URI = "mongodb://localhost:27017/chronicare";

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("🟢 Connected to MongoDB...");

    const patients = await User.find({ role: "patient" });

    for (let i = 0; i < patients.length; i++) {
      const patient = patients[i];
      if (!patient.patientId) {
        patient.patientId = `PT-${(i + 1).toString().padStart(3, "0")}`;
        await patient.save();
        console.log(`✅ Updated: ${patient.name} => ${patient.patientId}`);
      }
    }

    console.log("🎉 All patients updated with unique patientId.");
    mongoose.disconnect();
  })
  .catch(err => {
    console.error("❌ Failed to update patients:", err);
  });
