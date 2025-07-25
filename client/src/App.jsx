import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import PatientHistory from "./pages/PatientHistory";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  return (
    <Routes>
      <Route
        path="/"
        element={
          user ? (
            user.role === "doctor" ? (
              <Navigate to="/doctor-dashboard" />
            ) : (
              <Navigate to="/patient-dashboard" />
            )
          ) : (
            <Navigate to="/login" />
          )
        }
      />
      <Route path="/login" element={<Login setUser={setUser} />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/doctor-dashboard"
        element={
          user?.role === "doctor" ? <DoctorDashboard /> : <Navigate to="/login" />
        }
      />
      <Route
        path="/patient-dashboard"
        element={
          user?.role === "patient" ? <PatientDashboard /> : <Navigate to="/login" />
        }
      />
      <Route
      path="/doctor/patient/:patientId"
      element={user?.role === "doctor" ? <PatientHistory /> : <Navigate to="/login" />}
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
