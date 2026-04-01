import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import "./StudentMissedClassesPage.css";

export default function StudentMissedClassesPage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const studentId = user?.userId;

  const [missedClasses, setMissedClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchMissedClasses();
    }
  }, [studentId]);

  const fetchMissedClasses = async () => {
    setLoading(true);
    try {
      // 1. Get student class
      const studentRef = doc(db, "students", studentId);
      const studentSnap = await getDoc(studentRef);
      if (!studentSnap.exists()) return;
      
      const studentClass = studentSnap.data().class;

      // 2. Fetch all class sessions for this class
      const q = query(collection(db, "class_sessions"), where("class", "==", studentClass));
      const sessionsSnap = await getDocs(q);

      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();

      const missed = [];

      sessionsSnap.forEach((docSnap) => {
        const data = docSnap.data();
        const sessionDate = new Date(data.date);

        // Limit to current month
        if (sessionDate.getMonth() === currentMonth && sessionDate.getFullYear() === currentYear) {
           // student is absent if their id is not in attendance OR if attendance is explicitly false
           if (!data.attendance || data.attendance[studentId] === false || data.attendance[studentId] === undefined) {
              missed.push({
                id: docSnap.id,
                date: sessionDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }),
                timestamp: sessionDate.getTime(),
                subject: data.subject,
                topic: data.topic || "No topic recorded",
                facultyId: data.facultyId
              });
           }
        }
      });
      
      // Sort by date descending
      missed.sort((a, b) => b.timestamp - a.timestamp);

      setMissedClasses(missed);
    } catch (error) {
      console.error("Error fetching missed classes:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="missed-classes-layout">
      <Navbar />
      <div className="missed-classes-container">
        
        <div className="missed-header">
          <button className="back-arrow-btn" onClick={() => navigate("/student")} title="Go back to dashboard">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
          </button>
          <div>
            <h1>Missed Classes & Topics</h1>
            <p>Topics taught in classes you were absent for this month.</p>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">Loading missed classes...</div>
        ) : missedClasses.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎉</div>
            <h3>Great job!</h3>
            <p>You haven't missed any classes this month.</p>
          </div>
        ) : (
          <div className="missed-list">
            {missedClasses.map((item, index) => (
              <div key={index} className="missed-card">
                <div className="missed-card-left">
                  <div className="missed-date">{item.date}</div>
                  <div className="missed-subject">{item.subject}</div>
                  <div className="missed-faculty">Faculty ID: {item.facultyId}</div>
                </div>
                <div className="missed-card-right">
                  <div className="topic-text-container">
                    <h4>Topic Covered:</h4>
                    <p className="missed-topic">{item.topic}</p>
                  </div>
                  <a 
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(item.topic)}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="youtube-search-btn"
                    title="Search this topic on YouTube"
                  >
                    <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="yt-icon">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
                    </svg>
                    Search on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
