import React from 'react';
import './Subjectattendance.css';

const SubjectAttendance = ({ subjects, onViewDetails }) => {
  return (
    <div className="subject-attendance-card">
      <div className="card-header">
        <h3 className="card-title">Subject-wise Attendance</h3>
        <button className="view-details-btn" onClick={onViewDetails}>
          View Details
        </button>
      </div>
      <div className="card-content">
        <div className="subjects-list">
          {subjects.map((subject) => (
            <div key={subject.code} className="subject-item">
              <div className="subject-header">
                <div className="subject-name-row">
                  <span className="subject-name">{subject.subject}</span>
                  <span className="subject-code">{subject.code}</span>
                </div>
                <div className="subject-stats">
                  <span className="classes-count">
                    {subject.attended}/{subject.classes} classes
                  </span>
                  <span className={`attendance-badge ${subject.percentage >= 75 ? 'good' : 'low'}`}>
                    {subject.percentage}%
                  </span>
                </div>
              </div>
              <div className="progress-container">
                <div 
                  className={`progress-bar ${subject.percentage >= 75 ? 'good' : 'low'}`}
                  style={{ width: `${subject.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SubjectAttendance;