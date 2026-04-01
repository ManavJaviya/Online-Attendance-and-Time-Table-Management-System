import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/student/Statscard";
import AttendanceCircular from "../components/student/AttendanceCircular";
import SubjectAttendance from "../components/student/Subjectattendance";
import TodaySchedule from "../components/student/Todayschedule";
import AttendanceAlert from "../components/student/Attendancealert";

import { db } from "../firebase";
import { doc, getDoc, onSnapshot, collection, query, where, getDocs } from "firebase/firestore";

/* ===== LECTURE TIME MAP (PROFESSIONAL) ===== */
const LECTURE_TIMES = {
  lec1: "08:00 - 09:00",
  lec2: "09:00 - 10:00",
  lec3: "10:00 - 11:00",
  lec4: "11:30 - 12:30",
  lec5: "12:30 - 01:30"
};

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.userId;

  /* ===== STATES ===== */
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);
  const [missedClassesCount, setMissedClassesCount] = useState(0);

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    if (studentId) {
      fetchStudentProfile();
      const unsubscribe = listenAttendance();
      return () => unsubscribe && unsubscribe();
    }
  }, [studentId]);

  useEffect(() => {
    if (studentClass) {
      fetchTodaySchedule();
    }
  }, [studentClass]);

  useEffect(() => {
    if (studentClass && studentId) {
      fetchMissedClasses();
    }
  }, [studentClass, studentId]);

  /* ===== MISSED CLASSES ===== */
  const fetchMissedClasses = async () => {
    try {
      const q = query(collection(db, "class_sessions"), where("class", "==", studentClass));
      const snap = await getDocs(q);
      
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      let missed = 0;
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        const sessionDate = new Date(data.date);

        if (sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear) {
           // student is absent if their id is not in attendance, or attendance[studentId] is false
           if (!data.attendance || data.attendance[studentId] === false || data.attendance[studentId] === undefined) {
              missed++;
           }
        }
      });
      setMissedClassesCount(missed);
    } catch (err) {
      console.error("Error fetching missed classes", err);
    }
  };

  /* ===== STUDENT PROFILE ===== */
  const fetchStudentProfile = async () => {
    try {
      const ref = doc(db, "students", studentId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setStudentName(data.name);
        setStudentClass(data.class);
      }
    } catch (err) {
      console.error("Student profile error", err);
    }
  };

  /* ===== ATTENDANCE ===== */
  const listenAttendance = () => {
    try {
      const ref = doc(db, "attendance", studentId);

      const unsubscribe = onSnapshot(ref, (snap) => {
        if (!snap.exists()) {
          setSubjectAttendance([]);
          setOverallAttendance(0);
          return;
        }

        const data = snap.data();
        const subjects = [];
        let totalClasses = 0;
        let totalAttended = 0;

        Object.keys(data).forEach((subject) => {
          const { attended, total } = data[subject];
          const percentage = Math.round((attended / total) * 100);

          subjects.push({
            subject,
            classes: total,
            attended,
            percentage
          });

          totalClasses += total;
          totalAttended += attended;
        });

        setSubjectAttendance(subjects);
        setOverallAttendance(
          totalClasses === 0
            ? 0
            : Math.round((totalAttended / totalClasses) * 100)
        );
      });

      return unsubscribe;
    } catch (err) {
      console.error("Attendance fetch error", err);
    }
  };

  /* ===== TODAY SCHEDULE (ORDERED & PROFESSIONAL) ===== */
  const fetchTodaySchedule = async () => {
    try {
      const day = new Date()
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      const ref = doc(db, "timetable", studentClass);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

      const daySchedule = snap.data()[day];
      if (!daySchedule) return;

      const orderedKeys = ["lec1", "lec2", "lec3", "lec4", "lec5"];

      const lectures = orderedKeys
        .filter((key) => daySchedule[key])
        .map((key, index) => ({
          id: index + 1,
          subject: daySchedule[key].subject,
          faculty: daySchedule[key].facultyId,
          time: LECTURE_TIMES[key]
        }));

      setTodaySchedule(lectures);
    } catch (err) {
      console.error("Timetable fetch error", err);
    }
  };

  const lowAttendanceSubjects = subjectAttendance.filter(
    (s) => s.percentage < 75
  );

  /* ===== UI ===== */
  return (
    <div className="faculty-dashboard-layout">
      <Navbar />

      <div className="faculty-dashboard-container">
        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">
            Welcome, {studentName || "Student"}
          </h1>
          <p className="dashboard-subtitle">
            Here is your attendance overview and today’s schedule
          </p>
        </div>

        {/* ALERT */}
        {lowAttendanceSubjects.length > 0 && (
          <div className="classes-card">
            <AttendanceAlert
              count={lowAttendanceSubjects.length}
              onViewDetails={() => navigate("/student/alerts")}
            />
          </div>
        )}

        {/* STATS */}
        <div className="stats-grid">
          <AttendanceCircular
            percentage={overallAttendance}
            title="Overall Attendance"
            subtitle="This semester"
          />

          <StatsCard
            title="Classes Today"
            value={todaySchedule.length}
            change="As per timetable"
            changeType="neutral"
            icon="📅"
          />

          <StatsCard
            title="Subjects"
            value={subjectAttendance.length}
            change="Enrolled"
            changeType="neutral"
            icon="📚"
          />

          <StatsCard
            title="Low Attendance"
            value={lowAttendanceSubjects.length}
            change="Needs attention"
            changeType="negative"
            icon="⚠"
          />

          <div
            onClick={() => navigate("/student/missed")}
            style={{ cursor: "pointer", transition: "transform 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            title="Click to view missed classes and topics"
          >
            <StatsCard
              title="Missed Classes"
              value={missedClassesCount}
              change="This Month"
              changeType="negative"
              icon="🚫"
            />
          </div>
        </div>

        {/* SUBJECT ATTENDANCE */}
        <div className="classes-card">
          <SubjectAttendance
            subjects={subjectAttendance}
            onViewDetails={() => navigate("/student/attendance")}
          />
        </div>

        {/* TODAY SCHEDULE */}
        <div className="classes-card">
          <TodaySchedule
            schedule={todaySchedule}
            onViewFull={() => navigate("/student/timetable")}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardPage;