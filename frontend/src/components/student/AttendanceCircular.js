import React, { useState, useEffect } from 'react';
import './AttendanceCircular.css';

const AttendanceCircular = ({ percentage = 80, title = "Overall Attendance", subtitle = "This semester" }) => {
  const [displayedPercentage, setDisplayedPercentage] = useState(0);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  useEffect(() => {
    let animationFrameId;
    let startTime;
    const duration = 5000; // 5 seconds in milliseconds

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1); // 0 to 1
      const currentPercentage = Math.floor(progress * percentage);
      
      setDisplayedPercentage(currentPercentage);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, [percentage]);

  return (
    <div className="attendance-circular-card">
      <div className="circular-card-content">
        <div className="circular-info">
          <p className="circular-title">{title}</p>
          <p className="circular-subtitle">{subtitle}</p>
        </div>
        
        <div className="circular-progress-wrapper">
          <svg className="circular-svg" width="140" height="140" viewBox="0 0 120 120">
            {/* Background Circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="#e8f4f7"
              strokeWidth="8"
            />
            {/* Progress Circle */}
            <circle
              cx="60"
              cy="60"
              r="45"
              fill="none"
              stroke="hsl(174, 72%, 40%)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="progress-circle"
              style={{
                transform: 'rotate(-90deg)',
                transformOrigin: '60px 60px',
                animation: `fillCircle 5s ease-out forwards`,
                '--target-offset': strokeDashoffset
              }}
            />
          </svg>
          
          <div className="circular-percentage-display">
            <span className="percentage-text">{displayedPercentage}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceCircular;

