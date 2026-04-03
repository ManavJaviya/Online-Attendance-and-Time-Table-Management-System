import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Recentactivity.css';

const timeAgo = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return `Just now`;
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
};

const RecentActivity = () => {
  const [activities, setActivities] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/dashboard/activities');
        setActivities(response.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
    
    // Auto-refresh activities every 15 seconds
    const intervalId = setInterval(fetchActivities, 15000);
    return () => clearInterval(intervalId);
  }, []);

  const displayedActivities = showAll ? activities : activities.slice(0, 4);

  return (
    <div className="activity-card">
      <div className="activity-header">
        <h3 className="activity-title">Recent Activity</h3>
        <button className="view-all-btn" onClick={() => setShowAll(!showAll)}>
          {showAll ? 'Show Less' : 'View All'}
        </button>
      </div>
      <div className="activity-list">
        {displayedActivities.length > 0 ? displayedActivities.map((activity) => (
          <div key={activity.id} className="activity-item">
            <div 
              className="activity-icon"
              style={{ 
                backgroundColor: `${activity.color || 'hsl(234, 89%, 54%)'}15`,
                color: activity.color || 'hsl(234, 89%, 54%)'
              }}
            >
              {activity.icon || 'ℹ️'}
            </div>
            <div className="activity-content">
              <p className="activity-item-title">{activity.title}</p>
              <p className="activity-meta">
                <span className="activity-user">{activity.user}</span>
                <span className="activity-separator">•</span>
                <span className="activity-time">{timeAgo(activity.time)}</span>
              </p>
            </div>
          </div>
        )) : (
          <div className="activity-item">
            <div className="activity-content">
              <p className="activity-meta">No recent activities found.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivity;