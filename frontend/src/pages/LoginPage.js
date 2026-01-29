import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });

      if (res.data.role === "admin") navigate("/admin");
      if (res.data.role === "faculty") navigate("/faculty");
      if (res.data.role === "student") navigate("/student");
    } catch (error) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Smart Attendance System</h1>
        <p className="login-subtitle">Academic Login Portal</p>

        <label>User Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="student">Student</option>
          <option value="faculty">Faculty</option>
          <option value="admin">Admin</option>
        </select>

        <label>Email</label>
        <input
          type="email"
          placeholder="Enter email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="Enter password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
};

export default LoginPage;
