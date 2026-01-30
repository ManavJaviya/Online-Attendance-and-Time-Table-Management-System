import React from 'react';
import './Attendancechart.css';

const AttendanceChart = () => {
  const weekData = [
    { day: 'Mon', percentage: 88 },
    { day: 'Tue', percentage: 92 },
    { day: 'Wed', percentage: 85 },
    { day: 'Thu', percentage: 90 },
    { day: 'Fri', percentage: 87 },
    { day: 'Sat', percentage: 78 },
  ];

  const maxPercentage = 100;

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Weekly Attendance Trend</h3>
        <p className="chart-subtitle">Last 6 days</p>
      </div>
      <div className="chart-content">
        <div className="bar-chart">
          {weekData.map((data, index) => (
            <div key={index} className="bar-container">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${(data.percentage / maxPercentage) * 100}%`,
                    backgroundColor: data.percentage >= 85 ? 'hsl(142, 76%, 36%)' : 
                                   data.percentage >= 75 ? 'hsl(38, 92%, 50%)' : 
                                   'hsl(0, 84%, 60%)'
                  }}
                >
                  <span className="bar-value">{data.percentage}%</span>
                </div>
              </div>
              <span className="bar-label">{data.day}</span>
            </div>
          ))}
        </div>
        <div className="chart-legend">
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'hsl(142, 76%, 36%)' }}></span>
            <span className="legend-text">Good (≥85%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'hsl(38, 92%, 50%)' }}></span>
            <span className="legend-text">Average (75-84%)</span>
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ backgroundColor: 'hsl(0, 84%, 60%)' }}></span>
            <span className="legend-text">Low (&lt;75%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceChart;