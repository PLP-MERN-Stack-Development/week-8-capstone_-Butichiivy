import React, { useEffect, useState } from "react";
import axios from "axios";
import "../App.css";

const DoctorDashboard = () => {
  const [records, setRecords] = useState([]);
  const [requests, setRequests] = useState([]);
  const [logs, setLogs] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [patientId, setPatientId] = useState("");
  const [patients, setPatients] = useState([]);

  const doctor = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchRecords();
    fetchPatients();
    fetchRequests();
    fetchLogs();
  }, []);

  const fetchRecords = async () => {
    const res = await axios.get(`http://localhost:5000/api/records/doctor/${doctor._id}`);
    setRecords(res.data);
  };

  const fetchPatients = async () => {
    const res = await axios.get("http://localhost:5000/api/auth/patients");
    setPatients(res.data);
  };

  const fetchRequests = async () => {
    const res = await axios.get("http://localhost:5000/api/requests/doctor/" + doctor._id);
    setRequests(res.data);
  };

  const fetchLogs = async () => {
    const res = await axios.get(`http://localhost:5000/api/records/logs/${doctor._id}`);
    setLogs(res.data);
  };

  const addRecord = async (e) => {
    e.preventDefault();
    await axios.post("http://localhost:5000/api/records", {
      doctorId: doctor._id,
      patientId,
      diagnosis,
      treatment,
    });
    fetchRecords();
    fetchLogs();
    setShowAddForm(false);
    setDiagnosis("");
    setTreatment("");
    setPatientId("");
  };

  const logout = () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h2>👨‍⚕️ Dr. {doctor.name}</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <div className="section">
        <h3>Your Patient Records</h3>
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Record"}
        </button>
        {showAddForm && (
          <form onSubmit={addRecord} className="record-form">
            <select required onChange={(e) => setPatientId(e.target.value)} value={patientId}>
              <option value="">Select patient</option>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Diagnosis"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Treatment"
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              required
            />
            <button type="submit">Save</button>
          </form>
        )}

        <ul>
          {records.map((r) => (
            <li key={r._id}>
              Patient: {r.patientId?.name || "Unknown"} | Diagnosis: {r.diagnosis} | Treatment: {r.treatment}
            </li>
          ))}
        </ul>
      </div>

      <div className="section">
        <h3>📅 Appointment Requests</h3>
        {requests.length === 0 ? (
          <p>No appointment requests.</p>
        ) : (
          <ul>
            {requests.map((req) => (
              <li key={req._id}>
                From: {req.patientId?.name || "Unknown"} | Reason: {req.reason}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="section">
        <h3>📜 Activity Logs</h3>
        {logs.length === 0 ? (
          <p>No recent activity.</p>
        ) : (
          <ul>
            {logs.map((log) => (
              <li key={log._id}>
                {log.action} | {new Date(log.createdAt).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
