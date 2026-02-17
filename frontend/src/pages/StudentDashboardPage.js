import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/student/Statscard";
import AttendanceCircular from "../components/student/AttendanceCircular";
import SubjectAttendance from "../components/student/Subjectattendance";
import TodaySchedule from "../components/student/Todayschedule";
import AttendanceAlert from "../components/student/Attendancealert";

import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

/* ===== LECTURE TIME MAP (PROFESSIONAL) ===== */
const LECTURE_TIMES = {
  lec1: "08:00 – 09:00",
  lec2: "09:00 – 10:00",
  lec3: "10:00 – 11:00",
  lec4: "11:30 – 12:30",
  lec5: "12:30 – 01:30"
};

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  /* ===== TEMP (later from login context) ===== */
  const studentId = "STU101";
  const studentClass = "CE1";

  /* ===== STATES ===== */
  const [studentName, setStudentName] = useState("");
  const [subjectAttendance, setSubjectAttendance] = useState([]);
  const [todaySchedule, setTodaySchedule] = useState([]);
  const [overallAttendance, setOverallAttendance] = useState(0);

  /* ===== LOAD DATA ===== */
  useEffect(() => {
    fetchStudentProfile();
    fetchAttendance();
    fetchTodaySchedule();
  }, []);

  /* ===== STUDENT PROFILE ===== */
  const fetchStudentProfile = async () => {
    try {
      const ref = doc(db, "students", studentId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setStudentName(snap.data().name);
      }
    } catch (err) {
      console.error("Student profile error", err);
    }
  };

  /* ===== ATTENDANCE ===== */
  const fetchAttendance = async () => {
    try {
      const ref = doc(db, "attendance", studentId);
      const snap = await getDoc(ref);

      if (!snap.exists()) return;

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
