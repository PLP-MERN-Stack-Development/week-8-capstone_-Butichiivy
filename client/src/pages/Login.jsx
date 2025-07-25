import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", form);
      const user = res.data.user;

      // Save to localStorage and update app-level state
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user); // ✅ This is critical for redirection

      // Navigate based on role
      if (user.role === "doctor") {
        navigate("/doctor-dashboard");
      } else if (user.role === "patient") {
        navigate("/patient-dashboard");
      } else {
        navigate("/login");
      }

    } catch (err) {
      console.log("Login error:", err.response?.data);
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p>Don't have an account? <a href="/register">Register</a></p>
    </div>
  );
}
