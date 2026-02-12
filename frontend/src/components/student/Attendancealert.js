import React from 'react';
import './Attendancealert.css';

const AttendanceAlert = ({ count, onViewDetails }) => {
  return (
    <div className="attendance-alert">
      <div className="alert-icon">
        <svg className="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <div className="alert-content">
        <h3 className="alert-title">Attendance Alert</h3>
        <p className="alert-message">
          You have {count} subject{count > 1 ? 's' : ''} below 75% attendance. 
          Attend more classes to avoid shortage.
        </p>
      </div>
      <button className="alert-button" onClick={onViewDetails}>
        View Details
      </button>
    </div>
  );
};

export default AttendanceAlert;