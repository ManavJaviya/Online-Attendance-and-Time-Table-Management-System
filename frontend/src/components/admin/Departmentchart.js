import React from 'react';
import './Departmentchart.css';

const DepartmentChart = () => {
  const departments = [
    { name: 'Computer Science', students: 450, color: 'hsl(234, 89%, 54%)' },
    { name: 'Mechanical', students: 380, color: 'hsl(174, 72%, 40%)' },
    { name: 'Electronics', students: 420, color: 'hsl(38, 92%, 50%)' },
    { name: 'Civil', students: 370, color: 'hsl(142, 76%, 36%)' },
  ];

  const totalStudents = departments.reduce((sum, dept) => sum + dept.students, 0);

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3 className="chart-title">Students by Department</h3>
        <p className="chart-subtitle">Distribution overview</p>
      </div>
      <div className="chart-content">
        <div className="department-list">
          {departments.map((dept, index) => {
            const percentage = ((dept.students / totalStudents) * 100).toFixed(1);
            return (
              <div key={index} className="department-item">
                <div className="department-info">
                  <div className="department-name-row">
                    <span 
                      className="department-dot" 
                      style={{ backgroundColor: dept.color }}
                    ></span>
                    <span className="department-name">{dept.name}</span>
                  </div>
                  <span className="department-value">{dept.students}</span>
                </div>
                <div className="department-bar-container">
                  <div 
                    className="department-bar"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: dept.color
                    }}
                  ></div>
                </div>
                <span className="department-percentage">{percentage}%</span>
              </div>
            );
          })}
        </div>
        <div className="department-total">
          <span className="total-label">Total Students</span>
          <span className="total-value">{totalStudents.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default DepartmentChart;