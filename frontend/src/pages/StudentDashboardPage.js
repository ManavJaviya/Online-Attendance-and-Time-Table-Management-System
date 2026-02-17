import React from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import StatsCard from "../components/student/Statscard";
import AttendanceCircular from "../components/student/AttendanceCircular";
import SubjectAttendance from "../components/student/Subjectattendance";
import TodaySchedule from "../components/student/Todayschedule";
import AttendanceAlert from "../components/student/Attendancealert";
import "./FacultyDashboardPage.css";   // ← USE FACULTY THEME

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  const subjectAttendance = [
    { subject: "Data Structures", code: "CS201", percentage: 92, classes: 24, attended: 22 },
    { subject: "Algorithm Design", code: "CS301", percentage: 88, classes: 20, attended: 18 },
    { subject: "Database Systems", code: "CS401", percentage: 72, classes: 18, attended: 13 },
    { subject: "Computer Networks", code: "CS501", percentage: 95, classes: 22, attended: 21 },
  ];

  const todaySchedule = [
    { id: "1", subject: "Data Structures", time: "09:00 - 10:00", room: "Room 101", faculty: "Dr. Smith" },
    { id: "2", subject: "Algorithm Design", time: "11:00 - 12:00", room: "Room 203", faculty: "Prof. Johnson" },
    { id: "3", subject: "Database Systems", time: "14:00 - 15:00", room: "Lab 1", faculty: "Dr. Williams" },
  ];

  const overallAttendance = 87;
  const lowAttendanceSubjects = subjectAttendance.filter(s => s.percentage < 75);

  return (
    <div className="faculty-dashboard-layout">
      <Navbar />

      <div className="faculty-dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">Track your attendance and schedule</p>
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
            value="4"
            change="Next class 11 AM"
            changeType="neutral"
            icon="📅"
            iconClassName="stat-icon-accent"
          />

          <StatsCard
            title="Subjects"
            value="4"
            change="Enrolled"
            changeType="neutral"
            icon="📚"
            iconClassName="stat-icon-success"
          />

          <StatsCard
            title="Low Attendance"
            value={lowAttendanceSubjects.length}
            change="Need attention"
            changeType="negative"
            icon="⚠"
            iconClassName="stat-icon-warning"
          />
        </div>

        {/* SUBJECT CARD */}
        <div className="classes-card">
          <SubjectAttendance
            subjects={subjectAttendance}
            onViewDetails={() => navigate("/student/attendance")}
          />
        </div>

        {/* SCHEDULE */}
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
