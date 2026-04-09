import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { doc, onSnapshot, collection, getDocs, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import './ManageTimetablePage.css';

const CLASSES = ['CE1', 'CE2', 'CE3', 'CE4', 'CE5'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const LECTURES = ['lec1', 'lec2', 'lec3', 'lec4', 'lec5'];

const ManageTimetablePage = () => {
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState('');
  const [dbTimetable, setDbTimetable] = useState(null);
  const [timetable, setTimetable] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [facultyList, setFacultyList] = useState([]);

  // Fetch all faculty once
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const snap = await getDocs(collection(db, "faculty"));
        const list = [];
        snap.forEach(doc => {
          list.push({ id: doc.id, ...doc.data() });
        });
        setFacultyList(list);
      } catch (err) {
        console.error("Error fetching faculty list:", err);
      }
    };
    fetchFaculty();
  }, []);

  // Sync dbTimetable to timetable when not editing
  useEffect(() => {
    if (!isEditing) {
      setTimetable(dbTimetable ? JSON.parse(JSON.stringify(dbTimetable)) : null);
    }
  }, [dbTimetable, isEditing]);

  useEffect(() => {
    let unsubscribe = () => {};
    if (selectedClass) {
      setIsEditing(false);
      setMessage('');
      setError('');
      
      unsubscribe = onSnapshot(doc(db, "timetable", selectedClass), (docSnap) => {
        if (docSnap.exists()) {
          setDbTimetable(docSnap.data());
          setError('');
        } else {
          setError('Failed to fetch timetable. Ensure it exists.');
          setDbTimetable(null);
        }
      }, (err) => {
        console.error("Error fetching timetable realtime:", err);
        setError('Failed to fetch timetable.');
        setDbTimetable(null);
      });
    } else {
      setDbTimetable(null);
      setTimetable(null);
    }

    return () => unsubscribe();
  }, [selectedClass]);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTimetable(dbTimetable ? JSON.parse(JSON.stringify(dbTimetable)) : null);
  };

  const handleSubjectChange = (day, lec, subjectName) => {
    // Find the faculty who teaches this subject for the current class
    const foundFaculty = facultyList.find(f => 
      f.subject === subjectName && f.classes?.includes(selectedClass)
    );
    
    // Update both subject and faculty ID in one go
    setTimetable(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [lec]: {
          ...prev[day]?.[lec],
          subject: subjectName,
          facultyId: foundFaculty ? foundFaculty.id : ''
        }
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      await setDoc(doc(db, "timetable", selectedClass), timetable);
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
                  <button className="btn-cancel" onClick={handleCancel}>Cancel</button>
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
                              <select 
                                value={timetable[day]?.[lec]?.subject || ''}
                                onChange={(e) => handleSubjectChange(day, lec, e.target.value)}
                                style={{
                                  padding: '0.5rem',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '4px',
                                  fontSize: '0.875rem',
                                  outline: 'none',
                                  width: '100%',
                                  backgroundColor: 'white',
                                  cursor: 'pointer'
                                }}
                              >
                                <option value="">- Free Slot -</option>
                                {facultyList
                                  .filter(f => f.classes?.includes(selectedClass))
                                  .map(f => (
                                    <option key={f.id} value={f.subject}>{f.subject}</option>
                                  ))}
                              </select>
                              <div className="faculty" style={{ fontSize: '0.75rem', marginTop: '4px', color: '#64748b' }}>
                                {timetable[day]?.[lec]?.facultyId || 'No Faculty Assg.'}
                              </div>
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
