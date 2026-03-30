import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Lowattendancetable.css';

const LowAttendanceTable = () => {
  const [lowAttendanceStudents, setLowAttendanceStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/dashboard/students-attendance");
        setLowAttendanceStudents(response.data);
      } catch (error) {
        console.error("Error fetching students attendance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const [selectedClass, setSelectedClass] = useState('All');
  const [selectedThreshold, setSelectedThreshold] = useState(75);

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) return 'status-warning';
    if (percentage >= 65) return 'status-critical';
    return 'status-danger';
  };

  const uniqueClasses = ['All', ...new Set(lowAttendanceStudents.map(s => s.class))];

  const filteredStudents = lowAttendanceStudents.filter(student => {
    const classMatch = selectedClass === 'All' || student.class === selectedClass;
    const thresholdMatch = student.attendance < selectedThreshold;
    return classMatch && thresholdMatch;
  });

  return (
    <div className="low-attendance-card">
      <div className="low-attendance-header">
        <div>
          <h3 className="low-attendance-title">Low Attendance Alert</h3>
          <p className="low-attendance-subtitle">Students below {selectedThreshold}% attendance threshold</p>
        </div>
        <div className="alert-filters">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="filter-select"
          >
            {uniqueClasses.map(cls => (
              <option key={cls} value={cls}>{cls === 'All' ? 'All Classes' : cls}</option>
            ))}
          </select>
          <select 
            value={selectedThreshold} 
            onChange={(e) => setSelectedThreshold(Number(e.target.value))}
            className="filter-select"
          >
            {[100, 95, 90, 85, 80, 75, 70, 65, 60, 55, 50].map(threshold => (
              <option key={threshold} value={threshold}>Below {threshold}%</option>
            ))}
          </select>
        </div>
      </div>
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>Roll No</th>
              <th>Student Name</th>
              <th>Class</th>
              <th>Subject</th>
              <th>Present/Total</th>
              <th>Attendance %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>Loading student data...</td></tr>
            ) : filteredStudents.length === 0 ? (
              <tr><td colSpan="7" style={{textAlign: 'center'}}>No students found matching criteria</td></tr>
            ) : (
              filteredStudents.map((student) => (
                <tr key={student.id}>
                  <td className="roll-no">{student.rollNo}</td>
                  <td className="student-name">{student.name}</td>
                  <td>{student.class}</td>
                  <td>{student.subject}</td>
                  <td className="classes-count">
                    {student.present}/{student.totalClasses}
                  </td>
                  <td>
                    <div className="attendance-percentage">
                      <div className="percentage-bar-bg">
                        <div 
                          className="percentage-bar-fill"
                          style={{ 
                            width: `${student.attendance}%`,
                            backgroundColor: student.attendance >= 75 ? 'hsl(38, 92%, 50%)' :
                                           student.attendance >= 65 ? 'hsl(0, 84%, 60%)' :
                                           'hsl(0, 84%, 40%)'
                          }}
                        ></div>
                      </div>
                      <span className="percentage-text">{student.attendance}%</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getAttendanceStatus(student.attendance)}`}>
                      {student.attendance >= 75 ? 'Warning' :
                       student.attendance >= 65 ? 'Critical' : 'Danger'}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowAttendanceTable;