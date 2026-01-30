import React from 'react';
import './Statscard.css';

const StatsCard = ({ title, value, change, changeType, icon, iconClassName }) => {
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
    <div className="stats-card">
      <div className="stats-card-header">
        <div className="stats-card-info">
          <p className="stats-card-title">{title}</p>
          <h3 className="stats-card-value">{value}</h3>
        </div>
        <div className={`stats-card-icon ${iconClassName}`}>
          <span className="icon-emoji">{icon}</span>
        </div>
      </div>
      <p className={`stats-card-change ${getChangeClass()}`}>
        {changeType === 'positive' && '↗ '}
        {changeType === 'negative' && '↘ '}
        {change}
      </p>
    </div>
  );
};

export default StatsCard;