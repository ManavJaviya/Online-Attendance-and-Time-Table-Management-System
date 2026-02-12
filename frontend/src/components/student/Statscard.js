import React from 'react';
import './Statscard.css';

const StatsCard = ({ title, value, change, changeType = 'neutral', icon, iconClassName }) => {
  const getChangeClass = () => {
    switch (changeType) {
      case 'positive':
        return 'change-positive';
      case 'negative':
        return 'change-negative';
      default:
        return 'change-neutral';
    }
  };

  return (
    <div className="student-stats-card">
      <div className="stats-card-content">
        <div className="stats-info">
          <p className="stats-title">{title}</p>
          <p className="stats-value">{value}</p>
          {change && (
            <p className={`stats-change ${getChangeClass()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`stats-icon ${iconClassName}`}>
          <span className="icon-emoji">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;