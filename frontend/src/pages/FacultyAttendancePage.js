import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./FacultyAttendancePage.css";

// mock students
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

  // default all absent
  const [attendance, setAttendance] = useState(
    Object.fromEntries(mockStudents.map((s) => [s.id, false]))
  );

  // toggle present/absent
  const toggleStudent = (id) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // mark all present
  const markAllPresent = () => {
    setAttendance(Object.fromEntries(mockStudents.map((s) => [s.id, true])));
  };

  const handleSubmit = () => {
    console.log("Topic:", topic);
    console.log("Attendance:", attendance);
    alert("Attendance Submitted Successfully");
    navigate("/faculty");
  };

  return (
    <div className="faculty-attendance-layout">
      <Navbar />

      <div className="faculty-attendance-container">
        
        {/* Header */}
        <div className="attendance-header">
          <h1>Mark Attendance</h1>
          <p>Record student attendance for today's class</p>
        </div>

        <div className="grid-attendance-container">
          
          {/* TOP BAR */}
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

          {/* GRID */}
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

          {/* SUBMIT */}
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
