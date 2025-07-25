import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

export default function PatientHistory() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [records, setRecords] = useState([]);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/records/patient/${patientId}`);
        setRecords(res.data);
        if (res.data.length > 0 && res.data[0].patientId?.name) {
          setPatientName(res.data[0].patientId.name);
        }
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };
    fetchData();
  }, [patientId]);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => navigate(-1)}>⬅ Back</button>
      <h2>Record History for {patientName || "Patient"}</h2>

      {records.length === 0 ? (
        <p>No records found for this patient.</p>
      ) : (
        <ul>
          {records.map((r) => (
            <li key={r._id} style={{ marginBottom: "15px", border: "1px solid #ddd", padding: "10px" }}>
              <strong>Date:</strong> {new Date(r.createdAt).toLocaleDateString()} <br />
              <strong>Doctor:</strong> Dr. {r.doctorId?.name} <br />
              <strong>Diagnosis:</strong> {r.diagnosis} <br />
              <strong>Treatment:</strong> {r.treatment}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
