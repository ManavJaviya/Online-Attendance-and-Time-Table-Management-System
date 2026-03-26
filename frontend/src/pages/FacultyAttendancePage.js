import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import axios from "axios";
import { collection, getDocs, addDoc, doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./FacultyAttendancePage.css";

export default function FacultyAttendancePage() {
  const navigate = useNavigate();
  const location = useLocation();

  // class and subject passed from dashboard
  const selectedClass = location.state?.className;
  const selectedSubject = location.state?.subject;

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
  const handleSubmit = () => {
    if (!selectedClass || !selectedSubject) {
      alert(`Missing class or subject information.\nClass: ${selectedClass}\nSubject: ${selectedSubject}`);
      return;
    }

    // Immediately alert and navigate so the user doesn't have to wait
    alert("Attendance submitted successfully!");
    navigate("/faculty");

    // Process everything in the background
    const processAttendance = async () => {
      try {
        // 1. Save the lecture session
        await addDoc(collection(db, "class_sessions"), {
          facultyId: user.userId,
          class: selectedClass,
          subject: selectedSubject,
          topic: topic || "No topic",
          date: new Date().toISOString(),
          attendance: attendance // Map of studentId -> boolean
        });

        // 2. Update each student's attendance summary in parallel to speed it up
        await Promise.all(students.map(async (student) => {
          const isPresent = attendance[student.id];
          const studentAttendanceRef = doc(db, "attendance", student.id);
          const snap = await getDoc(studentAttendanceRef);

          let currentData = {};
          if (snap.exists()) {
            currentData = snap.data();
          }

          const currentSubjectStats = currentData[selectedSubject] || { attended: 0, total: 0 };

          await setDoc(studentAttendanceRef, {
            [selectedSubject]: {
              total: currentSubjectStats.total + 1,
              attended: currentSubjectStats.attended + (isPresent ? 1 : 0)
            }
          }, { merge: true });
        }));

        // 3. Log the activity using the backend generic endpoint
        await axios.post("http://localhost:5000/api/dashboard/log-activity", {
          type: "attendance",
          title: `Attendance marked for ${selectedClass}`,
          user: user.name || "Faculty",
          color: "hsl(142, 76%, 36%)",
          icon: "✓"
        });

      } catch (error) {
        console.error("Error saving attendance:", error);
      }
    };


    processAttendance();
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
                    className={`student-box ${attendance[student.id] ? "present" : "absent"
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
