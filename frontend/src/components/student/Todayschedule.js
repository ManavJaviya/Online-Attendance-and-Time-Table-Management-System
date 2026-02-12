import React from 'react';
import './Todayschedule.css';

const TodaySchedule = ({ schedule, onViewFull }) => {
  return (
    <div className="today-schedule-card">
      <div className="card-header">
        <h3 className="card-title">Today's Schedule</h3>
        <button className="view-details-btn" onClick={onViewFull}>
          Full Timetable
        </button>
      </div>
      <div className="card-content">
        <div className="schedule-list">
          {schedule.map((cls) => (
            <div key={cls.id} className="schedule-item">
              <div className="schedule-info">
                <h4 className="class-subject">{cls.subject}</h4>
                <p className="class-faculty">{cls.faculty}</p>
              </div>
              <div className="schedule-details">
                <p className="class-time">{cls.time}</p>
                <p className="class-room">{cls.room}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodaySchedule;