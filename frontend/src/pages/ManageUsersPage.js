import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { logActivityToDb } from '../utils/activityLogger';
import './ManageUsersPage.css';

const ManageUsersPage = () => {
    const navigate = useNavigate();
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
            const rollNoInt = parseInt(stuRollNo, 10) || '';
            const semesterInt = parseInt(stuSemester, 10) || 1;

            await setDoc(doc(db, "users", stuUserId), {
                email: stuEmail,
                password: stuPassword,
                role: "student",
                userId: stuUserId,
                department: stuDept
            });

            await setDoc(doc(db, "students", stuUserId), {
                name: stuName,
                rollNo: rollNoInt,
                class: stuClass,
                semester: semesterInt,
                department: stuDept
            });

            await logActivityToDb('user', `New student added (${stuName})`, 'Admin', 'hsl(234, 89%, 54%)', '👥');

            setMessage("Student added successfully");
            setStuUserId(''); setStuName(''); setStuEmail(''); setStuPassword(''); setStuDepartment('');
            setStuRollNo(''); setStuClass(''); setStuSemester('');
        } catch (error) {
            setMessage("Error adding student");
        }
    };

    const handleRemoveStudent = async (e) => {
        e.preventDefault();
        try {
            await deleteDoc(doc(db, "users", removeStuId));
            await deleteDoc(doc(db, "students", removeStuId));
            setMessage("Student removed successfully");
            setRemoveStuId('');
        } catch (error) {
            setMessage("Error removing student");
        }
    };

    const handleAddFaculty = async (e) => {
        e.preventDefault();
        try {
            const parsedClasses = facClasses.split(',').map(c => c.trim()).filter(c => c !== '');
            
            await setDoc(doc(db, "users", facUserId), {
                email: facEmail,
                password: facPassword,
                role: "faculty",
                userId: facUserId
            });

            await setDoc(doc(db, "faculty", facUserId), {
                name: facName,
                subject: facSubject || "Unassigned",
                classes: parsedClasses
            });

            await logActivityToDb('user', `New faculty member added (${facName})`, 'Admin', 'hsl(234, 89%, 54%)', '👤');

            setMessage("Faculty added successfully");
            setFacUserId(''); setFacName(''); setFacEmail(''); setFacPassword(''); setFacSubject(''); setFacClasses('');
        } catch (error) {
            setMessage("Error adding faculty");
        }
    };

    const handleRemoveFaculty = async (e) => {
        e.preventDefault();
        try {
            await deleteDoc(doc(db, "users", removeFacId));
            await deleteDoc(doc(db, "faculty", removeFacId));
            setMessage("Faculty removed successfully");
            setRemoveFacId('');
        } catch (error) {
            setMessage("Error removing faculty");
        }
    };

    return (
        <div className="manage-users-layout">
            <Navbar />
            <div className="manage-users-container">
                <div className="dashboard-header" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', textAlign: 'left' }}>
                    <button className="back-arrow-btn" onClick={() => navigate("/admin")} title="Go back to dashboard" style={{ padding: '0.625rem 1.25rem', background: 'transparent', color: 'black', border: 'none', cursor: 'pointer', marginTop: '0.25rem', flexShrink: 0, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: '45px', minHeight: '45px' }}>
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                      </svg>
                    </button>
                    <div>
                        <h1 className="dashboard-title" style={{ margin: '0 0 0.5rem 0' }}>Manage Users</h1>
                        <p className="dashboard-subtitle" style={{ margin: 0 }}>Add or remove Students and Faculty.</p>
                    </div>
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
