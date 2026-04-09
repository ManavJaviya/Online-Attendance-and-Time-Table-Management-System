import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { db } from "../firebase";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import "./FacultyReportsPage.css";

const FacultyReportsPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [threshold, setThreshold] = useState(75);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!user?.userId) {
          setError("User not found");
          return;
        }

        const facultyDoc = await getDoc(doc(db, 'faculty', user.userId));
        if (!facultyDoc.exists()) {
          setError("Faculty not found");
          return;
        }
        
        const facData = facultyDoc.data();
        const facSubject = facData.subject;
        const facClasses = facData.classes || [];

        const studentsSnap = await getDocs(collection(db, 'students'));
        const attendanceSnap = await getDocs(collection(db, 'attendance'));

        const studentsMap = {};
        studentsSnap.forEach(d => {
          const data = d.data();
          if (facClasses.includes(data.class)) {
            studentsMap[d.id] = { id: d.id, ...data };
          }
        });

        const studentsList = [];
        attendanceSnap.forEach(d => {
          const studentId = d.id;
          if (studentsMap[studentId]) {
            const data = d.data();
            const student = studentsMap[studentId];
            const subjStats = data[facSubject];
            if (subjStats && subjStats.total > 0) {
              const percentage = parseFloat(((subjStats.attended / subjStats.total) * 100).toFixed(1));
              studentsList.push({
                id: studentId,
                name: student.name,
                rollNo: student.rollNo,
                className: student.class,
                subject: facSubject,
                percentage,
                total: subjStats.total,
                attended: subjStats.attended
              });
            }
          }
        });

        studentsList.sort((a, b) => b.percentage - a.percentage);

        setReportData({
          subject: facSubject,
          students: studentsList
        });

      } catch (err) {
        console.error("Error fetching faculty report:", err);
        setError("Error connecting to database");
      } finally {
        setLoading(false);
      }
    };
    console.log("==> API CALLED <=="); // Add this line
    fetchReport();
  }, [user?.userId]); // Notice this is the fixed version!


  const getSeverityClass = (percentage) => {
    if (percentage <= 50) return "range-50";
    if (percentage <= 60) return "range-60";
    if (percentage <= 65) return "range-65";
    if (percentage <= 70) return "range-70";
    return "range-75";
  };

  const renderStudentCard = (student) => {
    const severity = getSeverityClass(student.percentage);
    return (
      <div className={`student-card ${severity}`} key={student.id}>
        <div className="student-card-header">
          <div>
            <h4 className="student-name">{student.name}</h4>
            <span className="student-roll">{student.rollNo} • {student.className}</span>
          </div>
          <div className="student-percentage percentage-text">
            {student.percentage}%
          </div>
        </div>
        <div className="student-stats">
          <span>Attended: {student.attended} / {student.total}</span>
          <span>{student.subject}</span>
        </div>
      </div>
    );
  };

  const filteredStudents = reportData?.students
    ? reportData.students.filter(s => s.percentage <= threshold)
    : [];

  return (
    <div className="faculty-reports-layout">
      <Navbar />

      <div className="faculty-reports-container">

        <div className="faculty-reports-header">
          <button className="back-arrow-btn" onClick={() => navigate("/faculty")} title="Go back to dashboard">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>

          <div className="faculty-reports-header-text">
            <h1 className="faculty-reports-title">Low Attendance Report</h1>
            <p className="faculty-reports-subtitle">
              Students at risk in {reportData ? reportData.subject : "your subject"}
            </p>
          </div>

          <div className="filter-container">
            <label htmlFor="threshold-select">Filter Threshold:</label>
            <select
              id="threshold-select"
              className="threshold-dropdown"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
            >
              <option value={75}>Below 75%</option>
              <option value={70}>Below 70%</option>
              <option value={65}>Below 65%</option>
              <option value={60}>Below 60%</option>
              <option value={50}>Below 50%</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-spinner">Crunching Attendance Data...</div>
        ) : error ? (
          <div className="error-message">⚠ {error}</div>
        ) : reportData ? (
          <div className="faculty-reports-content">
            {filteredStudents.length > 0 ? (
              <div className="students-grid flat-grid">
                {filteredStudents.map((stu) => renderStudentCard(stu))}
              </div>
            ) : (
              <div className="empty-message-box">
                🎉 Awesome! No students have attendance below {threshold}% in this subject.
              </div>
            )}
          </div>
        ) : null}

      </div>
    </div>
  );
};

export default FacultyReportsPage;
