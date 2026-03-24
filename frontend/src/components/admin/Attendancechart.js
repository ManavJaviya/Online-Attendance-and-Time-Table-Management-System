import React from 'react';
import './Attendancechart.css';

const AttendanceChart = ({ weekData, trendChange }) => {
  const defaultData = [
    { day: 'Mon', percentage: 0 },
    { day: 'Tue', percentage: 0 },
    { day: 'Wed', percentage: 0 },
    { day: 'Thu', percentage: 0 },
    { day: 'Fri', percentage: 0 },
    { day: 'Sat', percentage: 0 },
  ];

  const displayData = weekData && weekData.length > 0 ? weekData : defaultData;
  const maxPercentage = 100;

  const isPositive = trendChange && trendChange.startsWith('+');
  const trendColor = isPositive ? 'hsl(142, 76%, 36%)' : 'hsl(0, 84%, 60%)';

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">
          Weekly Attendance Trend
          {trendChange && (
            <span style={{ fontSize: '0.8rem', marginLeft: '10px', color: trendColor, fontWeight: 'normal' }}>
              ({trendChange} vs last week)
            </span>
          )}
        </h3>
        <p className="chart-subtitle">Last {displayData.length} days</p>
      </div>
      <div className="chart-content">
        <div className="bar-chart">
          {displayData.map((data, index) => (
            <div key={index} className="bar-container">
              <div className="bar-wrapper">
                <div
                  className="bar"
                  style={{
                    height: `${(data.percentage / maxPercentage) * 100}%`,
                    minHeight: data.percentage > 0 ? '30px' : '0',
                    paddingTop: data.percentage > 0 ? '0.5rem' : '0',
                    backgroundColor: data.percentage >= 85 ? 'hsl(142, 76%, 36%)' : 
                                   data.percentage >= 75 ? 'hsl(38, 92%, 50%)' : 
                                   'hsl(0, 84%, 60%)'
                  }}
                >
                  <span className="bar-value" style={{ color: data.percentage > 0 ? 'white' : 'var(--color-text-muted)', position: data.percentage === 0 ? 'absolute' : 'static', bottom: data.percentage === 0 ? '5px' : 'auto' }}>
                    {data.percentage}%
                  </span>
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