import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./FacultyDashboardPage.css";

const DAYS = ["monday", "tuesday", "wednesday", "thursday", "friday"];

const FacultyTimetablePage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const facultyId = user?.userId;

  const [timetable, setTimetable] = useState({});

  useEffect(() => {
    const fetchTimetable = async () => {
      if (!facultyId) return;

      const ref = doc(db, "facultyTimetable", facultyId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        setTimetable(snap.data());
      }
    };

    fetchTimetable();
  }, [facultyId]);

  return (
    <div className="faculty-dashboard-layout">
      <Navbar />

      <div className="faculty-dashboard-container">
        <div className="dashboard-header">
          <h1 className="dashboard-title">Weekly Timetable</h1>
          <p className="dashboard-subtitle">
            Complete teaching schedule
          </p>
        </div>

        {DAYS.map((day) => (
          <div key={day} className="classes-card">
            <div className="card-header">
              <h2 className="card-title">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </h2>
            </div>

            {timetable[day]?.length > 0 ? (
              timetable[day].map((lec, index) => (
                <div key={index} className="class-item">
                  <div className="class-left">
                    <h3 className="class-subject">{lec.subject}</h3>
                    <span className="class-code">
                      {lec.class} • {lec.time}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-classes">
                No lectures scheduled
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyTimetablePage;