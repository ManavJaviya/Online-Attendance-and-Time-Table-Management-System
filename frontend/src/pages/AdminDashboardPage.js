import React from 'react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/admin/Statscard';
import AttendanceChart from '../components/admin/Attendancechart';
import DepartmentChart from '../components/admin/Departmentchart';
import RecentActivity from '../components/admin/Recentactivity';
import QuickActions from '../components/admin/Quickactions';
import LowAttendanceTable from '../components/admin/Lowattendancetable';
import './AdminDashboardPage.css';

const AdminDashboardPage = () => {
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
            value="1,620"
            change="+12% from last semester"
            changeType="positive"
            icon="👨‍🎓"
            iconClassName="stat-icon-primary"
          />
          <StatsCard
            title="Total Faculty"
            value="86"
            change="+3 new this month"
            changeType="positive"
            icon="👨‍🏫"
            iconClassName="stat-icon-accent"
          />
          <StatsCard
            title="Active Subjects"
            value="124"
            change="Across all departments"
            changeType="neutral"
            icon="📚"
            iconClassName="stat-icon-warning"
          />
          <StatsCard
            title="Avg. Attendance"
            value="89.2%"
            change="+2.4% from last week"
            changeType="positive"
            icon="📈"
            iconClassName="stat-icon-success"
          />
        </div>

        {/* Charts Row */}
        <div className="charts-grid">
          <AttendanceChart />
          <DepartmentChart />
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