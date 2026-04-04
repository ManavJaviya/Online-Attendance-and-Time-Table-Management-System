import React from 'react';
import './DailyAttendanceCard.css';

const DailyAttendanceCard = ({ yesterdayData, todayData }) => {
  const formatDate = (dateObj) => {
    return dateObj.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const renderSection = (title, dateObj, data) => {
    return (
      <div className="daily-section">
        <div className="daily-section-header">
          <h3 className="daily-section-title">{title}</h3>
          <span className="daily-section-date">{formatDate(dateObj)}</span>
        </div>
        
        {data.length === 0 ? (
          <div className="daily-empty">No lectures scheduled or marked</div>
        ) : (
          <div className="daily-list">
            {data.map((item, index) => (
              <div className="daily-item" key={item.id}>
                <div className="daily-item-index">{index + 1}</div>
                <div className="daily-item-details">
                  <div className="daily-subject">{item.subject}</div>
                  <div className="daily-time">
                    <span className="clock-icon">🕒</span> {item.time}
                  </div>
                  <div className={`daily-status-pill status-${item.status.toLowerCase()}`}>
                    {item.status}
                  </div>
                  {item.faculty && (
                    <div className="daily-faculty">
                      <span className="user-icon">👤</span> {item.faculty}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="classes-card daily-attendance-card">
      {renderSection("Yesterday", yesterday, yesterdayData)}
      {renderSection("Today", today, todayData)}
    </div>
  );
};

export default DailyAttendanceCard;
