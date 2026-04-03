import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './ManageTimetablePage.css';

const CLASSES = ['CE1', 'CE2', 'CE3', 'CE4', 'CE5'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const LECTURES = ['lec1', 'lec2', 'lec3', 'lec4', 'lec5'];

const ManageTimetablePage = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [timetable, setTimetable] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (selectedClass) {
      fetchTimetable(selectedClass);
      setIsEditing(false);
      setMessage('');
      setError('');
    } else {
      setTimetable(null);
    }
  }, [selectedClass]);

  const fetchTimetable = async (classId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/timetable/${classId}`);
      setTimetable(response.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch timetable. Ensure it exists.');
      setTimetable(null);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage('');
  };

  const handleInputChange = (day, lec, field, value) => {
    setTimetable(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [lec]: {
          ...prev[day][lec],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/timetable/${selectedClass}`, timetable);
      setMessage('Timetable updated for selected class');
      setIsEditing(false);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to update timetable');
    }
  };

  return (
    <div className="manage-timetable-layout">
      <Navbar />
      <div className="manage-timetable-container">
        <div className="header-section" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', textAlign: 'left' }}>
          <button className="back-arrow-btn" onClick={() => navigate("/admin")} title="Go back to dashboard" style={{ padding: '0.625rem 1.25rem', background: 'transparent', color: 'black', border: 'none', cursor: 'pointer', marginTop: '0.25rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '45px', minHeight: '45px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div>
            <h1 style={{ margin: '0 0 0.5rem 0' }}>Manage Timetable</h1>
            <p style={{ margin: 0 }}>Select a class to view and edit its timetable</p>
          </div>
        </div>

        <div className="controls-section">
          <select 
            value={selectedClass} 
            onChange={(e) => setSelectedClass(e.target.value)}
            className="class-select"
          >
            <option value="">Select Class</option>
            {CLASSES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {message && <div className="success-message">{message}</div>}
        {error && <div className="error-message">{error}</div>}

        {timetable && (
          <div className="timetable-section">
            <div className="action-buttons">
              {!isEditing ? (
                <button className="btn-edit" onClick={handleEditToggle}>Edit Timetable</button>
              ) : (
                <div className="edit-actions">
                  <button className="btn-cancel" onClick={() => { fetchTimetable(selectedClass); setIsEditing(false); }}>Cancel</button>
                  <button className="btn-submit" onClick={handleSubmit}>Submit</button>
                </div>
              )}
            </div>

            <div className="timetable-grid">
              <table>
                <thead>
                  <tr>
                    <th>Day</th>
                    {LECTURES.map((lec, idx) => (
                      <th key={lec}>Lecture {idx + 1}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {DAYS.map(day => (
                    <tr key={day}>
                      <td className="day-name">{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                      {LECTURES.map(lec => (
                        <td key={lec} className="timetable-cell">
                          {isEditing ? (
                            <div className="cell-inputs">
                              <input 
                                type="text" 
                                placeholder="Subject"
                                value={timetable[day]?.[lec]?.subject || ''}
                                onChange={(e) => handleInputChange(day, lec, 'subject', e.target.value)}
                              />
                              <input 
                                type="text" 
                                placeholder="Faculty ID"
                                value={timetable[day]?.[lec]?.facultyId || ''}
                                onChange={(e) => handleInputChange(day, lec, 'facultyId', e.target.value)}
                              />
                            </div>
                          ) : (
                            <div className="cell-display">
                              <div className="subject">{timetable[day]?.[lec]?.subject || '-'}</div>
                              <div className="faculty">{timetable[day]?.[lec]?.facultyId || ''}</div>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageTimetablePage;
