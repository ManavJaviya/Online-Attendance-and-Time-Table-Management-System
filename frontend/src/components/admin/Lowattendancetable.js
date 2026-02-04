import React from 'react';
import './Lowattendancetable.css';

const LowAttendanceTable = () => {
  const lowAttendanceStudents = [
    {
      id: 1,
      rollNo: 'CSE2021045',
      name: 'Rahul Sharma',
      class: 'CSE-3A',
      subject: 'Data Structures',
      attendance: 68,
      totalClasses: 25,
      present: 17
    },
    {
      id: 2,
      rollNo: 'ME2021032',
      name: 'Priya Patel',
      class: 'ME-2B',
      subject: 'Thermodynamics',
      attendance: 72,
      totalClasses: 30,
      present: 22
    },
    {
      id: 3,
      rollNo: 'EC2021018',
      name: 'Amit Kumar',
      class: 'EC-1A',
      subject: 'Digital Electronics',
      attendance: 65,
      totalClasses: 28,
      present: 18
    },
    {
      id: 4,
      rollNo: 'CSE2021089',
      name: 'Sneha Gupta',
      class: 'CSE-3A',
      subject: 'Operating Systems',
      attendance: 70,
      totalClasses: 26,
      present: 18
    },
    {
      id: 5,
      rollNo: 'CE2021055',
      name: 'Vijay Singh',
      class: 'CE-2A',
      subject: 'Surveying',
      attendance: 67,
      totalClasses: 24,
      present: 16
    },
  ];

  const getAttendanceStatus = (percentage) => {
    if (percentage >= 75) return 'status-warning';
    if (percentage >= 65) return 'status-critical';
    return 'status-danger';
  };

  return (
    <div className="low-attendance-card">
      <div className="low-attendance-header">
        <div>
          <h3 className="low-attendance-title">Low Attendance Alert</h3>
          <p className="low-attendance-subtitle">Students below 75% attendance threshold</p>
        </div>
        <button className="export-btn">Export Report</button>
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
            {lowAttendanceStudents.map((student) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowAttendanceTable;