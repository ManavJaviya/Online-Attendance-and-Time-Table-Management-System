import React from 'react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/admin/Statscard';
import { useNavigate } from 'react-router-dom';
import './FacultyDashboardPage.css';

// Mock data for today's classes
const todaysClasses = [
  { id: "1", subject: "Data Structures", code: "CS201", time: "09:00 - 10:00", room: "Room 101", status: "completed" },
  { id: "2", subject: "Algorithm Design", code: "CS301", time: "11:00 - 12:00", room: "Room 203", status: "upcoming" },
  { id: "3", subject: "Database Systems", code: "CS401", time: "14:00 - 15:00", room: "Lab 1", status: "upcoming" },
];

const FacultyDashboardPage = () => {
  const navigate = useNavigate();

  const handleMarkAttendance = () => {
    navigate("/faculty/attendance");
  };

  const handleViewTimetable = () => {
    navigate("/faculty/timetable");
  };

  const handleViewReports = () => {
    navigate("/faculty/reports");
  };

  return (
    <div className="faculty-dashboard-layout">
      <Navbar />
      
      <div className="faculty-dashboard-container">
        {/* Page Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Faculty Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here are your classes for today.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatsCard
            title="Classes Today"
            value="5"
            change="2 completed, 3 upcoming"
            changeType="neutral"
            icon="📅"
            iconClassName="stat-icon-primary"
          />
          <StatsCard
            title="Total Students"
            value="186"
            change="Across all subjects"
            changeType="neutral"
            icon="👥"
            iconClassName="stat-icon-accent"
          />
          <StatsCard
            title="Attendance Marked"
            value="156"
            change="Today's count"
            changeType="positive"
            icon="📋"
            iconClassName="stat-icon-success"
          />
          <StatsCard
            title="Avg. Attendance"
            value="91.5%"
            change="+3.2% this week"
            changeType="positive"
            icon="📈"
            iconClassName="stat-icon-warning"
          />
        </div>

        {/* Today's Classes Section */}
        <div className="classes-card">
          <div className="card-header">
            <h2 className="card-title">Today's Classes</h2>
            <button className="btn btn-outline" onClick={handleViewTimetable}>
              View Full Timetable
            </button>
          </div>

          <div className="classes-list">
            {todaysClasses.map((cls) => (
              <div key={cls.id} className="class-item">
                <div className="class-left">
                  <h3 className="class-subject">{cls.subject}</h3>
                  <span className="class-code">{cls.code}</span>
                </div>
                <div className="class-middle">
                  <span className="class-time">{cls.time}</span>
                  <span className="separator">•</span>
                  <span className="class-room">{cls.room}</span>
                </div>
                <div className="class-right">
                  {cls.status === "completed" ? (
                    <span className="status-badge status-completed">✓ Completed</span>
                  ) : (
                    <button className="btn btn-primary btn-sm" onClick={handleMarkAttendance}>
                      Mark Attendance
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions-grid">
          <div className="action-card" onClick={handleMarkAttendance}>
            <div className="action-icon action-icon-primary">📋</div>
            <div className="action-content">
              <h3 className="action-title">Mark Attendance</h3>
              <p className="action-description">Record student attendance</p>
            </div>
          </div>

          <div className="action-card" onClick={handleViewTimetable}>
            <div className="action-icon action-icon-accent">📅</div>
            <div className="action-content">
              <h3 className="action-title">View Timetable</h3>
              <p className="action-description">Check your schedule</p>
            </div>
          </div>

          <div className="action-card" onClick={handleViewReports}>
            <div className="action-icon action-icon-warning">📈</div>
            <div className="action-content">
              <h3 className="action-title">View Reports</h3>
              <p className="action-description">Attendance analytics</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboardPage;