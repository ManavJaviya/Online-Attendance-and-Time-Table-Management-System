import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import StatsCard from '../components/admin/Statscard';
import AttendanceChart from '../components/admin/Attendancechart';
import DepartmentChart from '../components/admin/Departmentchart';
import RecentActivity from '../components/admin/Recentactivity';
import QuickActions from '../components/admin/Quickactions';
import LowAttendanceTable from '../components/admin/Lowattendancetable';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudents: "Loading...",
    totalFaculty: "Loading...",
    activeSubjects: "Loading...",
    avgAttendance: "Loading..."
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard/stats");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };
    
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-layout">
      <Navbar />
      
      <div className="admin-dashboard-container">
        {/* Page Header */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Admin Dashboard</h1>
          <p className="dashboard-subtitle">Welcome back! Here's what's happening today.</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatsCard
            title="Total Students"
            value={stats.totalStudents}
            change="Live from Database"
            changeType="neutral"
            icon="👨‍🎓"
            iconClassName="stat-icon-primary"
          />
          <StatsCard
            title="Total Faculty"
            value={stats.totalFaculty}
            change="Live from Database"
            changeType="neutral"
            icon="👨‍🏫"
            iconClassName="stat-icon-accent"
          />
          <StatsCard
            title="Active Subjects"
            value={stats.activeSubjects}
            change="Live from Database"
            changeType="neutral"
            icon="📚"
            iconClassName="stat-icon-warning"
          />
          <StatsCard
            title="Avg. Attendance"
            value={stats.avgAttendance !== "Loading..." ? `${stats.avgAttendance}%` : "Loading..."}
            change="Live from Database"
            changeType="neutral"
            icon="📈"
            iconClassName="stat-icon-success"
          />
        </div>

        {/* Charts Row */}
        <div className="charts-grid">
          <AttendanceChart />
          <DepartmentChart departmentData={stats.departments} />
        </div>

        {/* Activity and Actions Row */}
        <div className="activity-actions-grid">
          <div className="activity-section">
            <RecentActivity />
          </div>
          <QuickActions />
        </div>

        {/* Low Attendance Table */}
        <LowAttendanceTable />
      </div>
    </div>
  );
};

export default AdminDashboardPage;