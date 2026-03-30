import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
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
      
      const expectedFields = ['username', 'name', 'email', 'password', 'rollno', 'class', 'department'];
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
            student[header] = values[index];
          }
        });
        if (student.username) {
          students.push(student);
        }
      }

      try {
        const response = await axios.post("http://localhost:5000/api/users/sync-students", { students });
        setStatusMessage('file uploaded successfully and student data updated. ' + (response.data.message || ''));
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
        <div className="upload-header">
          <button className="back-btn" onClick={() => navigate('/admin')}>
            &larr; Back to Dashboard
          </button>
          <h1 className="upload-title">Update Student Data</h1>
          <p className="upload-subtitle">Upload a CSV file to synchronize the student database.</p>
        </div>

        <div className="upload-card">
          <div className="upload-icon-container">
            <span className="upload-icon">📄</span>
          </div>
          <h2 className="upload-card-title">Select Student File</h2>
          <p className="upload-format-info">Accepted format: .csv with fields: username, name, email, password, rollno, class, department</p>
          
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
