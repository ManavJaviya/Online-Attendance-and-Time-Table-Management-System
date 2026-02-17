import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./FacultyAttendancePage.css";

export default function FacultyAttendancePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // class passed from dashboard
  const selectedClass = location.state?.className;

  // logged in faculty
  const user = JSON.parse(localStorage.getItem("user"));

  // ================= STATES =================
  const [topic, setTopic] = useState("");
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});

  // ================= FETCH STUDENTS =================
  useEffect(() => {
    // if no class selected → do nothing
    if (!selectedClass) return;

    const fetchStudents = async () => {
      try {
        const snapshot = await getDocs(collection(db, "students"));

        const filtered = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(student => student.class === selectedClass);

        setStudents(filtered);

        const initial = Object.fromEntries(
          filtered.map(s => [s.id, false])
        );
        setAttendance(initial);

      } catch (error) {
        console.error("Error fetching students:", error);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  // ================= TOGGLE =================
  const toggleStudent = (id) => {
    setAttendance(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // ================= ALL PRESENT =================
  const markAllPresent = () => {
    const allPresent = Object.fromEntries(
      students.map(s => [s.id, true])
    );
    setAttendance(allPresent);
  };

  // ================= SUBMIT =================
  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "attendance"), {
        facultyId: user.userId,
        class: selectedClass,
        topic: topic,
        date: new Date().toISOString(),
        attendance: attendance
      });

      alert("Attendance submitted successfully");
      navigate("/faculty");

    } catch (error) {
      console.error("Error saving attendance:", error);
    }
  };

  // ================= UI =================
  return (
    <div className="faculty-attendance-layout">
      <Navbar />

      <div className="faculty-attendance-container">

        {!selectedClass ? (

          /* SHOW MESSAGE IF NO CLASS */
          <div style={{ padding: "40px" }}>
            No class selected. Please go back to dashboard.
          </div>

        ) : (

          <>
            {/* HEADER */}
            <div className="attendance-header">
              <div className="header-with-back">
                <button className="back-arrow-btn" onClick={() => navigate("/faculty")} title="Go back to dashboard">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6"></polyline>
                  </svg>
                </button>
                <div>
                  <h1>Mark Attendance</h1>
                  <p>Class: {selectedClass}</p>
                </div>
              </div>
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

              {/* STUDENTS */}
              <div className="student-grid">
                {students.map(student => (
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
          </>
        )}

      </div>
    </div>
  );
}
