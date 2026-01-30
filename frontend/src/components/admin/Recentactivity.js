import React from 'react';
import './Recentactivity.css';

const RecentActivity = () => {
  const activities = [
    {
      id: 1,
      type: 'attendance',
      title: 'Attendance marked for CSE-3A',
      user: 'Dr. Sarah Johnson',
      time: '10 minutes ago',
      icon: '✓',
      color: 'hsl(142, 76%, 36%)'
    },
    {
      id: 2,
      type: 'timetable',
      title: 'Timetable updated for ME-2B',
      user: 'Admin',
      time: '1 hour ago',
      icon: '📅',
      color: 'hsl(174, 72%, 40%)'
    },
    {
      id: 3,
      type: 'user',
      title: 'New faculty member added',
      user: 'Prof. Michael Brown',
      time: '2 hours ago',
      icon: '👤',
      color: 'hsl(234, 89%, 54%)'
    },
    {
      id: 4,
      type: 'attendance',
      title: 'Low attendance alert for EC-1A',
      user: 'System',
      time: '3 hours ago',
      icon: '⚠',
      color: 'hsl(38, 92%, 50%)'
    },
    {
      id: 5,
      type: 'user',
      title: '15 new students enrolled',
      user: 'Admission Office',
      time: '5 hours ago',
      icon: '👥',
      color: 'hsl(234, 89%, 54%)'
    },
  ];

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h3 className="activity-title">Recent Activity</h3>
        <button className="view-all-btn">View All</button>
      </div>
      <div className="activity-list">
        {activities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div 
              className="activity-icon"
              style={{ 
                backgroundColor: `${activity.color}15`,
                color: activity.color
              }}
            >
              {activity.icon}
            </div>
            <div className="activity-content">
              <p className="activity-item-title">{activity.title}</p>
              <p className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-separator">•</span>
                <span className="activity-time">{activity.time}</span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;