import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./FacultyAttendancePage.css";

const mockStudents = [
  { id: "1", name: "John Doe", rollNo: "101" },
  { id: "2", name: "Harsh", rollNo: "102" },
  { id: "3", name: "Meet", rollNo: "103" },
  { id: "4", name: "Raj", rollNo: "104" },
  { id: "5", name: "Amit", rollNo: "105" },
  { id: "6", name: "Riya", rollNo: "106" },
  { id: "7", name: "Neha", rollNo: "107" },
  { id: "8", name: "Dev", rollNo: "108" },
  { id: "9", name: "Karan", rollNo: "109" },
];

export default function FacultyAttendancePage() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");

  const [attendance, setAttendance] = useState(
    Object.fromEntries(mockStudents.map((s) => [s.id, false]))
  );

  const toggleStudent = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const markAllPresent = () => {
    setAttendance(Object.fromEntries(mockStudents.map((s) => [s.id, true])));
  };

  const handleSubmit = () => {
    alert("Attendance Submitted Successfully");
    navigate("/faculty");
  };

  return (
    <div className="faculty-attendance-layout">
      <Navbar />

      <div className="faculty-attendance-container">

        {/* HEADER */}
        <div className="attendance-header">

          <div className="header-row">
            <button
              className="back-btn"
              onClick={() => navigate("/faculty")}
            >
              <span className="arrow">←</span>
            </button>

            <div>
              <h1>Mark Attendance</h1>
              <p>Record student attendance for today's class</p>
            </div>
          </div>

        </div>

        <div className="grid-attendance-container">
          
          <div className="top-bar">
            <input
              type="text"
              placeholder="Today's lecture topic..."
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="topic-input"
            />

            <button className="all-present-btn" onClick={markAllPresent}>
              All Present
            </button>
          </div>

          <div className="student-grid">
            {mockStudents.map((student) => (
              <div
                key={student.id}
                className={`student-box ${
                  attendance[student.id] ? "present" : "absent"
                }`}
                onClick={() => toggleStudent(student.id)}
              >
                <div className="student-name">{student.name}</div>
                <div className="student-roll">{student.rollNo}</div>
              </div>
            ))}
          </div>

          <div className="submit-wrapper">
            <button className="submit-btn" onClick={handleSubmit}>
              Submit Attendance
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
