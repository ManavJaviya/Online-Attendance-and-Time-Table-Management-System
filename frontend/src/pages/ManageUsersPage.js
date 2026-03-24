import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import './ManageUsersPage.css';

const ManageUsersPage = () => {
    const [activeTab, setActiveTab] = useState('student');
    
    // Student states
    const [stuUserId, setStuUserId] = useState('');
    const [stuName, setStuName] = useState('');
    const [stuEmail, setStuEmail] = useState('');
    const [stuPassword, setStuPassword] = useState('');
    const [stuDept, setStuDepartment] = useState('');
    const [stuRollNo, setStuRollNo] = useState('');
    const [stuClass, setStuClass] = useState('');
    const [stuSemester, setStuSemester] = useState('');
    
    const [removeStuId, setRemoveStuId] = useState('');

    // Faculty states
    const [facUserId, setFacUserId] = useState('');
    const [facName, setFacName] = useState('');
    const [facEmail, setFacEmail] = useState('');
    const [facPassword, setFacPassword] = useState('');
    const [facSubject, setFacSubject] = useState('');
    const [facClasses, setFacClasses] = useState('');
    
    const [removeFacId, setRemoveFacId] = useState('');

    const [message, setMessage] = useState('');

    const handleAddStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/users/student", {
                userId: stuUserId,
                name: stuName,
                email: stuEmail,
                password: stuPassword,
                department: stuDept,
                rollNo: parseInt(stuRollNo, 10) || '',
                className: stuClass,
                semester: parseInt(stuSemester, 10) || 1
            });
            setMessage(res.data.message || "Student added successfully");
            setStuUserId(''); setStuName(''); setStuEmail(''); setStuPassword(''); setStuDepartment('');
            setStuRollNo(''); setStuClass(''); setStuSemester('');
        } catch (error) {
            setMessage(error.response?.data?.error || "Error adding student");
        }
    };

    const handleRemoveStudent = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`http://localhost:5000/api/users/student/${removeStuId}`);
            setMessage(res.data.message || "Student removed successfully");
            setRemoveStuId('');
        } catch (error) {
            setMessage(error.response?.data?.error || "Error removing student");
        }
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        try {
            const parsedClasses = facClasses.split(',').map(c => c.trim()).filter(c => c !== '');
            const res = await axios.post("http://localhost:5000/api/users/faculty", {
                userId: facUserId,
                name: facName,
                email: facEmail,
                password: facPassword,
                subject: facSubject,
                classes: parsedClasses
            });
            setMessage(res.data.message || "Faculty added successfully");
            setFacUserId(''); setFacName(''); setFacEmail(''); setFacPassword(''); setFacSubject(''); setFacClasses('');
        } catch (error) {
            setMessage(error.response?.data?.error || "Error adding faculty");
        }
    };

    const handleRemoveFaculty = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.delete(`http://localhost:5000/api/users/faculty/${removeFacId}`);
            setMessage(res.data.message || "Faculty removed successfully");
            setRemoveFacId('');
        } catch (error) {
            setMessage(error.response?.data?.error || "Error removing faculty");
        }
    };

    return (
        <div className="manage-users-layout">
            <Navbar />
            <div className="manage-users-container">
                <div className="dashboard-header">
                    <h1 className="dashboard-title">Manage Users</h1>
                    <p className="dashboard-subtitle">Add or remove Students and Faculty.</p>
                </div>

                {message && <div className="message-alert">{message}</div>}

                <div className="tabs">
                    <button className={`tab-btn ${activeTab === 'student' ? 'active' : ''}`} onClick={() => setActiveTab('student')}>Students</button>
                    <button className={`tab-btn ${activeTab === 'faculty' ? 'active' : ''}`} onClick={() => setActiveTab('faculty')}>Faculty</button>
                </div>

                <div className="tab-content">
                    {activeTab === 'student' && (
                        <div className="forms-container">
                            <div className="form-card">
                                <h3>Add Student</h3>
                                <form onSubmit={handleAddStudent}>
                                    <input type="text" placeholder="User ID (e.g. STU101)" value={stuUserId} onChange={e => setStuUserId(e.target.value)} required />
                                    <input type="text" placeholder="Name" value={stuName} onChange={e => setStuName(e.target.value)} required />
                                    <input type="email" placeholder="Email" value={stuEmail} onChange={e => setStuEmail(e.target.value)} required />
                                    <input type="password" placeholder="Password" value={stuPassword} onChange={e => setStuPassword(e.target.value)} required />
                                    <input type="text" placeholder="Department" value={stuDept} onChange={e => setStuDepartment(e.target.value)} required />
                                    <input type="number" placeholder="Roll No" value={stuRollNo} onChange={e => setStuRollNo(e.target.value)} required />
                                    <input type="text" placeholder="Class (e.g. CE1)" value={stuClass} onChange={e => setStuClass(e.target.value)} required />
                                    <input type="number" placeholder="Semester" value={stuSemester} onChange={e => setStuSemester(e.target.value)} required />
                                    <button type="submit" className="btn btn-primary">Add Student</button>
                                </form>
                            </div>
                            <div className="form-card">
                                <h3>Remove Student</h3>
                                <form onSubmit={handleRemoveStudent}>
                                    <input type="text" placeholder="User ID to remove" value={removeStuId} onChange={e => setRemoveStuId(e.target.value)} required />
                                    <button type="submit" className="btn btn-danger">Remove Student</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {activeTab === 'faculty' && (
                        <div className="forms-container">
                             <div className="form-card">
                                <h3>Add Faculty</h3>
                                <form onSubmit={handleAddFaculty}>
                                    <input type="text" placeholder="User ID (e.g. FAC201)" value={facUserId} onChange={e => setFacUserId(e.target.value)} required />
                                    <input type="text" placeholder="Name" value={facName} onChange={e => setFacName(e.target.value)} required />
                                    <input type="email" placeholder="Email" value={facEmail} onChange={e => setFacEmail(e.target.value)} required />
                                    <input type="password" placeholder="Password" value={facPassword} onChange={e => setFacPassword(e.target.value)} required />
                                    <input type="text" placeholder="Subject (e.g. Data Structures)" value={facSubject} onChange={e => setFacSubject(e.target.value)} required />
                                    <input type="text" placeholder="Classes (comma separated, e.g. CE1, CE2)" value={facClasses} onChange={e => setFacClasses(e.target.value)} required />
                                    <button type="submit" className="btn btn-primary">Add Faculty</button>
                                </form>
                            </div>
                            <div className="form-card">
                                <h3>Remove Faculty</h3>
                                <form onSubmit={handleRemoveFaculty}>
                                    <input type="text" placeholder="User ID to remove" value={removeFacId} onChange={e => setRemoveFacId(e.target.value)} required />
                                    <button type="submit" className="btn btn-danger">Remove Faculty</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageUsersPage;
