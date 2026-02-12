import React from 'react';
import { useNavigate } from 'react-router-dom';
import TopHeader from '../components/student/Topheader';
import StatsCard from '../components/student/Statscard';
import SubjectAttendance from '../components/student/Subjectattendance';
import TodaySchedule from '../components/student/Todayschedule';
import AttendanceAlert from '../components/student/Attendancealert';
import './Studentdashboardpage.css';

const StudentDashboardPage = () => {
  const navigate = useNavigate();

  // Mock data
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
  const lowAttendanceSubjects = subjectAttendance.filter((s) => s.percentage < 75);

  return (
    <div className="student-dashboard-layout">
      <TopHeader />
      
      <div className="student-dashboard-content">
        {/* Page Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Student Dashboard</h1>
          <p className="dashboard-subtitle">Track your attendance and view your schedule.</p>
        </div>

        {/* Alert for low attendance */}
        {lowAttendanceSubjects.length > 0 && (
          <AttendanceAlert 
            count={lowAttendanceSubjects.length}
            onViewDetails={() => navigate('/student/alerts')}
          />
        )}

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatsCard
            title="Overall Attendance"
            value={`${overallAttendance}%`}
            change={overallAttendance >= 75 ? "Above minimum" : "Below minimum!"}
            changeType={overallAttendance >= 75 ? "positive" : "negative"}
            icon="📋"
            iconClassName="stat-icon-primary"
          />
          <StatsCard
            title="Classes Today"
            value="4"
            change="Next: 11:00 AM"
            changeType="neutral"
            icon="📅"
            iconClassName="stat-icon-accent"
          />
          <StatsCard
            title="Classes Attended"
            value="84"
            change="This semester"
            changeType="neutral"
            icon="✓"
            iconClassName="stat-icon-success"
          />
          <StatsCard
            title="Subjects at Risk"
            value={lowAttendanceSubjects.length.toString()}
            change={lowAttendanceSubjects.length > 0 ? "Need attention" : "All good!"}
            changeType={lowAttendanceSubjects.length > 0 ? "negative" : "positive"}
            icon="⚠"
            iconClassName="stat-icon-warning"
          />
        </div>

        {/* Subject-wise Attendance */}
        <SubjectAttendance 
          subjects={subjectAttendance}
          onViewDetails={() => navigate('/student/attendance')}
        />

        {/* Today's Schedule */}
        <TodaySchedule 
          schedule={todaySchedule}
          onViewFull={() => navigate('/student/timetable')}
        />
      </div>
    </div>
  );
};

export default StudentDashboardPage;