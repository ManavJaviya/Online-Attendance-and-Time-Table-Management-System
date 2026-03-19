import React from 'react';
import './Departmentchart.css';

const DepartmentChart = ({ departmentData }) => {
  console.log("DepartmentChart received departmentData:", departmentData);
  
  const defaultColors = {
    'Computer Science': 'hsl(234, 89%, 54%)',
    'Mechanical': 'hsl(174, 72%, 40%)',
    'Electronics': 'hsl(38, 92%, 50%)',
    'Civil': 'hsl(142, 76%, 36%)',
    'ICT': 'hsl(280, 80%, 60%)'
  };

  const departments = departmentData
    ? Object.keys(departmentData).map(name => ({
      name,
      students: departmentData[name],
      color: defaultColors[name] || 'hsl(0, 0%, 50%)'
    }))
    : [
      { name: 'Computer Science', students: 0, color: 'hsl(234, 89%, 54%)' },
      { name: 'Mechanical', students: 0, color: 'hsl(174, 72%, 40%)' },
      { name: 'Electronics', students: 0, color: 'hsl(38, 92%, 50%)' },
      { name: 'Civil', students: 0, color: 'hsl(142, 76%, 36%)' },
      { name: 'ICT', students: 0, color: 'hsl(280, 80%, 60%)' },
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
            const percentage = totalStudents > 0 ? ((dept.students / totalStudents) * 100).toFixed(1) : 0;
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