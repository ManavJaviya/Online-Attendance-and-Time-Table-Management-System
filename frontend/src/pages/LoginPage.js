import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();

  // Selected role (admin / faculty / student)
  const [selectedRole, setSelectedRole] = useState(null);

  // Login fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // ================= LOGIN FUNCTION =================
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      alert("Please select role first");
      return;
    }

    try {
      const q = query(
        collection(db, "users"),
        where("email", "==", email),
        where("password", "==", password),
        where("role", "==", selectedRole) // check selected role
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userData = querySnapshot.docs[0].data();

        localStorage.setItem("user", JSON.stringify(userData));

        // redirect by role
        if (selectedRole === "admin") navigate("/admin");
        if (selectedRole === "faculty") navigate("/faculty");
        if (selectedRole === "student") navigate("/student");

      } else {
        alert("Invalid credentials");
      }

    } catch (error) {
      console.error(error);
    }
  };

  // ================= UI =================
  return (
    <div className="login-container">

      <h1 className="login-title">Attendance System</h1>

      {/* ROLE SELECTION */}
      {!selectedRole && (
        <div className="role-grid">

          <div className="role-card" onClick={() => setSelectedRole("admin")}>
            <div className="role-icon">👨‍💼</div>
            <h3>Admin</h3>
          </div>

          <div className="role-card" onClick={() => setSelectedRole("faculty")}>
            <div className="role-icon">👩‍🏫</div>
            <h3>Faculty</h3>
          </div>

          <div className="role-card" onClick={() => setSelectedRole("student")}>
            <div className="role-icon">🎓</div>
            <h3>Student</h3>
          </div>

        </div>
      )}

      {/* LOGIN FORM */}
      {selectedRole && (
        <form className="login-form" onSubmit={handleLogin}>

          <h2>{selectedRole.toUpperCase()} LOGIN</h2>

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>

          <p className="back-btn" onClick={() => setSelectedRole(null)}>
            ← Change Role
          </p>

        </form>
      )}

    </div>
  );
};

export default LoginPage;
