import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const PatientDashboard = () => {
  const [doctors, setDoctors] = useState([]);
  const [records, setRecords] = useState([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [reason, setReason] = useState("");

  const patient = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchDoctors();
    fetchRecords();
  }, []);

  const fetchDoctors = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/doctors");
    setDoctors(res.data);
  };

  const fetchRecords = async () => {
    const res = await axios.get(`http://localhost:5000/api/records/patient/${patient._id}`);
    setRecords(res.data);
  };

  const requestAppointment = async (e) => {
    e.preventDefault();
    if (!selectedDoctorId || !reason) return;
    await axios.post("http://localhost:5000/api/requests", {
      doctorId: selectedDoctorId,
      patientId: patient._id,
      reason,
    });
    alert("Request sent successfully");
    setSelectedDoctorId("");
    setReason("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>👩‍⚕️ {patient.name}'s Dashboard</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="section">
        <h3>Your Records</h3>
        <ul>
          {records.map((r) => (
            <li key={r._id}>
              Diagnosis: {r.diagnosis} | Treatment: {r.treatment} | Doctor: {r.doctorId?.name || "Unknown"}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>📅 Request Appointment</h3>
        <form onSubmit={requestAppointment}>
          <select
            value={selectedDoctorId}
            onChange={(e) => setSelectedDoctorId(e.target.value)}
            required
          >
            <option value="">Select doctor</option>
            {doctors.map((doc) => (
              <option key={doc._id} value={doc._id}>
                Dr. {doc.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={reason}
            placeholder="Reason for appointment"
            onChange={(e) => setReason(e.target.value)}
            required
          />
          <button type="submit">Send Request</button>
        </form>
      </div>
    </div>
  );
};

export default PatientDashboard;
