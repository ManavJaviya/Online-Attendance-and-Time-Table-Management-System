import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import './ReportsPage.css';

const AttendanceReports = ({ data }) => {
  if (!data) return <div className="loading-spinner">Loading Attendance Data...</div>;

  return (
    <div className="report-section fade-in">
      <h3>Class-wise Overview</h3>
      <div className="metrics-grid">
        <div className="metric-card primary-card">
          <h4>Overall Attendance</h4>
          <div className="metric-value">{data.overall}%</div>
        </div>
        {data.classWise.map(c => (
          <div key={c.className} className="metric-card secondary-card">
            <h4>{c.className}</h4>
            <div className="metric-value">{c.percentage}%</div>
          </div>
        ))}
      </div>

      <div className="grid-2-col mt-4">
          <div className="card-outlined">
              <h3>Subject-wise Attendance</h3>
              <div className="table-responsive">
                <table className="data-table">
                  <thead>
                    <tr><th>Subject</th><th>Attendance %</th></tr>
                  </thead>
                  <tbody>
                    {data.subjectWise.map(s => (
                      <tr key={s.subject}>
                        <td className="fw-500">{s.subject}</td>
                        <td className={s.percentage < 75 ? 'text-danger fw-bold' : 'text-success fw-bold'}>
                            {s.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
          </div>
          <div></div>
      </div>

      <div className="card-outlined mt-4">
          <h3>Student-wise Breakdown</h3>
          <div className="table-responsive">
            <table className="data-table">
              <thead>
                <tr><th>Roll No</th><th>Name</th><th>Class</th><th>Lectures</th><th>Attended</th><th>Percentage</th></tr>
              </thead>
              <tbody>
                {data.studentWise.map(s => (
                  <tr key={s.id}>
                    <td>{s.rollNo}</td>
                    <td className="fw-500">{s.name}</td>
                    <td>{s.className}</td>
                    <td>{s.totalLectures}</td>
                    <td>{s.attendedLectures}</td>
                    <td className={s.percentage < 75 ? 'text-danger fw-bold' : 'text-success fw-bold'}>{s.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      </div>
    </div>
  );
};

const TimetableReports = ({ data }) => {
  if (!data) return <div className="loading-spinner">Loading Timetable Data...</div>;

  return (
    <div className="report-section fade-in">
      <div className="grid-2-col">
        <div className="card-outlined">
          <h3>Teacher Workload</h3>
          <table className="data-table">
            <thead>
              <tr><th>Faculty ID</th><th>Assigned Lectures</th></tr>
            </thead>
            <tbody>
              {data.teacherWorkload.map(t => (
                <tr key={t.facultyId}>
                  <td className="fw-500">{t.facultyId}</td>
                  <td>{t.lecturesAssigned}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-outlined">
          <h3>Clash / Free Slot Detection</h3>
          {data.clashes.length > 0 ? (
            <div className="alert-danger">
              <h4>Overlapping Lectures Detected!</h4>
              <ul>
                {data.clashes.map((c, idx) => (
                    <li key={idx}>
                       Faculty <strong>{c.faculty}</strong> has a clash on {c.day} ({c.lecture}) 
                       between classes {c.classes.join(" & ")}.
                    </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="alert-success">
               ✓ No timetable clashes detected. All faculty schedules are safely optimized!
            </div>
          )}
        </div>
      </div>

      <div className="card-outlined mt-4">
          <h3>Class Timetables Overview</h3>
          <div className="timetable-accordion">
              {Object.keys(data.classTimetables).map(cls => (
                <div key={cls} className="mb-4">
                  <h4 className="text-primary">{cls} Weekly Schedule</h4>
                  <div className="table-responsive">
                      <table className="data-table small-table">
                         <thead>
                            <tr>
                               <th>Day</th><th>Lecture 1</th><th>Lecture 2</th><th>Lecture 3</th><th>Lecture 4</th><th>Lecture 5</th>
                            </tr>
                         </thead>
                         <tbody>
                           {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map(day => (
                             <tr key={day}>
                               <td className="fw-bold text-capitalize">{day}</td>
                               {['lec1', 'lec2', 'lec3', 'lec4', 'lec5'].map(lec => {
                                 const cell = data.classTimetables[cls]?.[day]?.[lec];
                                 return <td key={lec}>{cell && cell.subject ? `${cell.subject} (${cell.facultyId})` : <span className="text-muted">Free</span>}</td>;
                               })}
                             </tr>
                           ))}
                         </tbody>
                      </table>
                  </div>
                </div>
              ))}
          </div>
      </div>
    </div>
  );
};

const AnalyticsReports = ({ data }) => {
  if (!data) return <div className="loading-spinner">Crunching Analytics Data...</div>;

  return (
    <div className="report-section fade-in">
      <div className="card-outlined">
          <h3>Attendance Trends</h3>
          <p className="text-muted mb-4">Tracking monthly attendance consistency across the platform</p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="attendance" name="Attendance Rate" fill="#4318FF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

      <div className="grid-3-col mt-4">
        <div className="analytics-card alert-danger-card">
           <h4>⚠ Low Attendance Alerts</h4>
           <div className="scrolling-list">
             {data.lowAttendanceAlerts.length > 0 ? data.lowAttendanceAlerts.map(s => (
               <div key={s.id} className="list-item">
                 <span className="fw-500">{s.name} <small>({s.className})</small></span>
                 <span className="fw-bold text-danger">{s.percentage}%</span>
               </div>
             )) : <div className="p-3 text-success fw-500">All students are above 75%!</div>}
           </div>
        </div>

        <div className="analytics-card alert-success-card">
           <h4>⭐ Top Performers</h4>
           <div className="scrolling-list">
             {data.topPerformers.length > 0 ? data.topPerformers.map(s => (
               <div key={s.id} className="list-item">
                 <span className="fw-500">{s.name} <small>({s.className})</small></span>
                 <span className="fw-bold text-success">{s.percentage}%</span>
               </div>
             )) : <div className="p-3">No data available</div>}
           </div>
        </div>

        <div className="analytics-card alert-warning-card">
           <h4>📉 Bottom Performers</h4>
           <div className="scrolling-list">
             {data.bottomPerformers.length > 0 ? data.bottomPerformers.map(s => (
               <div key={s.id} className="list-item">
                 <span className="fw-500">{s.name} <small>({s.className})</small></span>
                 <span className="fw-bold text-warning">{s.percentage}%</span>
               </div>
             )) : <div className="p-3">No data available</div>}
           </div>
        </div>
      </div>
    </div>
  );
};

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('attendance');
  const [attendanceData, setAttendanceData] = useState(null);
  const [timetableData, setTimetableData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [attRes, ttRes, anRes] = await Promise.all([
          axios.get('http://localhost:5000/api/reports/attendance'),
          axios.get('http://localhost:5000/api/reports/timetable'),
          axios.get('http://localhost:5000/api/reports/analytics')
        ]);
        setAttendanceData(attRes.data);
        setTimetableData(ttRes.data);
        setAnalyticsData(anRes.data);
      } catch (error) {
        console.error("Error fetching reports", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="reports-layout">
      <Navbar />
      <div className="reports-container fade-in">
        <div className="reports-header">
          <h1>System Reports & Analytics</h1>
          <p>Comprehensive overview of attendance, timetables, and performance benchmarks</p>
        </div>

        <div className="reports-tabs">
          <button className={`tab-btn ${activeTab === 'attendance' ? 'active' : ''}`} onClick={() => setActiveTab('attendance')}>
            Attendance Reports
          </button>
          <button className={`tab-btn ${activeTab === 'timetable' ? 'active' : ''}`} onClick={() => setActiveTab('timetable')}>
            Timetable Reports
          </button>
          <button className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`} onClick={() => setActiveTab('analytics')}>
            Analytics Dashboard
          </button>
        </div>

        <div className="reports-content">
          {activeTab === 'attendance' && <AttendanceReports data={attendanceData} />}
          {activeTab === 'timetable' && <TimetableReports data={timetableData} />}
          {activeTab === 'analytics' && <AnalyticsReports data={analyticsData} />}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
