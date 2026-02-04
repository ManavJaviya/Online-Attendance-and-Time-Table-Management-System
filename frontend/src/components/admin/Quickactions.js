import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Quickactions.css';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: 'Manage Users',
      icon: '👥',
      color: 'hsl(234, 89%, 54%)',
      route: '/admin/manage-users'
    },
    {
      title: 'Manage Timetable',
      icon: '📅',
      color: 'hsl(174, 72%, 40%)',
      route: '/admin/manage-timetable'
    },
    {
      title: 'View Reports',
      icon: '📊',
      color: 'hsl(142, 76%, 36%)',
      route: '/admin/reports'
    },
    {
      title: 'System Settings',
      icon: '⚙️',
      color: 'hsl(38, 92%, 50%)',
      route: '/admin/settings'
    },
  ];

  return (
    <div className="quick-actions-card">
      <div className="quick-actions-header">
        <h3 className="quick-actions-title">Quick Actions</h3>
      </div>
      <div className="quick-actions-list">
        {actions.map((action, index) => (
          <button
            key={index}
            className="quick-action-btn"
            onClick={() => navigate(action.route)}
          >
            <div 
              className="quick-action-icon"
              style={{ backgroundColor: `${action.color}15`, color: action.color }}
            >
              {action.icon}
            </div>
            <span className="quick-action-title">{action.title}</span>
            <span className="quick-action-arrow">→</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;