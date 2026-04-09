import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { logActivityToDb } from '../utils/activityLogger';
import Navbar from '../components/Navbar';
import './UploadStudentDataPage.css';

const UploadStudentDataPage = () => {
  const [file, setFile] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setStatusMessage('');
      setIsError(false);
    }
  };

  const handleUpload = () => {
    if (!file) {
      setIsError(true);
      setStatusMessage('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setStatusMessage('Uploading and processing...');
    setIsError(false);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const rows = text.split('\n').map(row => row.trim()).filter(row => row !== '');
      if (rows.length < 2) {
        setIsError(true);
        setStatusMessage('Invalid or empty CSV file.');
        setIsUploading(false);
        return;
      }

      const headers = rows[0].split(',').map(h => h.trim().toLowerCase());
      
      const expectedFields = ['userid', 'name', 'email', 'password', 'rollno', 'class', 'department'];
      const missingFields = expectedFields.filter(field => !headers.includes(field));
      
      if (missingFields.length > 0) {
        setIsError(true);
        setStatusMessage(`Invalid file format. Missing fields: ${missingFields.join(', ')}`);
        setIsUploading(false);
        return;
      }

      const students = [];

      for (let i = 1; i < rows.length; i++) {
        const values = rows[i].split(',').map(v => v.trim());
        const student = {};
        headers.forEach((header, index) => {
          if (values[index] !== undefined && header) {
            const key = header === 'userid' ? 'userId' : header;
            student[key] = values[index];
          }
        });
        if (student.userId) {
          students.push(student);
        }
      }

      try {
        let added = 0;
        let unchanged = 0;

        await Promise.all(students.map(async (student) => {
          const { userId, name, email, password, rollno, department, class: className } = student;
          
          const studentRef = doc(db, 'students', userId);
          const studentSnap = await getDoc(studentRef);

          if (!studentSnap.exists()) {
            await setDoc(doc(db, 'users', userId), {
               email: email || `${userId.toLowerCase()}@example.com`,
               password: password || 'defaultPass123',
               role: "student",
               userId,
               department: department || "Unassigned"
            });

            await setDoc(studentRef, {
               name: name || "Unknown",
               rollNo: rollno || "",
               class: className || "",
               semester: 1,
               department: department || "Unassigned"
            });
            added++;
          } else {
            unchanged++;
          }
        }));

        if (added > 0) {
           await logActivityToDb('user', `Student data synced. Added: ${added}, Skipped: ${unchanged}`, 'Admin', 'hsl(38, 92%, 50%)', '📤');
        }

        setStatusMessage(`File uploaded successfully. Added: ${added}. Skipped: ${unchanged}.`);
        setIsError(false);
      } catch (error) {
        console.error('Sync error:', error);
        setIsError(true);
        setStatusMessage('Failed to sync students data.');
      } finally {
        setIsUploading(false);
        setFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    };
    reader.onerror = () => {
      setIsError(true);
      setStatusMessage('Failed to read file.');
      setIsUploading(false);
    };
    reader.readAsText(file);
  };

  return (
    <div className="upload-page-layout">
      <Navbar />
      <div className="upload-page-container">
        <div className="upload-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', textAlign: 'left' }}>
          <button className="back-arrow-btn" onClick={() => navigate('/admin')} title="Go back to dashboard" style={{ padding: '0.625rem 1.25rem', background: 'transparent', color: 'black', border: 'none', cursor: 'pointer', marginTop: '0.25rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '45px', minHeight: '45px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div>
            <h1 className="upload-title" style={{ margin: '0 0 0.5rem 0' }}>Update Student Data</h1>
            <p className="upload-subtitle" style={{ margin: 0 }}>Upload a CSV file to synchronize the student database.</p>
          </div>
        </div>

        <div className="upload-card">
          <div className="upload-icon-container">
            <span className="upload-icon">📄</span>
          </div>
          <h2 className="upload-card-title">Select Student File</h2>
          <p className="upload-format-info">Accepted format: .csv with fields: userId, name, email, password, rollno, class, department</p>
          
          <div className="file-input-wrapper">
            <input 
              type="file" 
              accept=".csv" 
              className="file-input"
              ref={fileInputRef}
              onChange={handleFileChange}
              id="file-upload"
            />
            <label htmlFor="file-upload" className="file-label">
              {file ? file.name : 'Choose CSV File'}
            </label>
          </div>

          <button 
            className={`upload-action-btn ${isUploading ? 'loading' : ''} ${!file ? 'disabled' : ''}`}
            onClick={handleUpload}
            disabled={isUploading || !file}
          >
            {isUploading ? 'Processing...' : 'Upload File'}
          </button>

          {statusMessage && (
            <div className={`status-message ${isError ? 'error' : 'success'}`}>
              <span className="status-icon">{isError ? '❌' : '✅'}</span>
              <span className="status-text">{statusMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadStudentDataPage;
