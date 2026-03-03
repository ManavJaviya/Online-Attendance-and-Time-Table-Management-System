import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import StatsCard from "../components/admin/Statscard";
import TodaySchedule from "../components/student/Todayschedule";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import "./FacultyDashboardPage.css";

const FacultyDashboardPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const [facultyData, setFacultyData] = useState(null);
  const [todaySchedule, setTodaySchedule] = useState([]);

  /* ================= FETCH FACULTY DATA ================= */
  useEffect(() => {
    const fetchFacultyData = async () => {
      try {
        if (!user?.userId) return;

        const facultyRef = doc(db, "faculty", user.userId);
        const facultySnap = await getDoc(facultyRef);

        if (facultySnap.exists()) {
          setFacultyData(facultySnap.data());
        }
      } catch (error) {
        console.error("Error fetching faculty data:", error);
      }
    };

    fetchFacultyData();
  }, [user]);

  /* ================= FETCH TODAY'S TIMETABLE ================= */
  useEffect(() => {
    const fetchTodaySchedule = async () => {
      try {
        if (!user?.userId) return;

        const today = new Date().toLocaleDateString("en-IN", {
          weekday: "long",
          timeZone: "Asia/Kolkata",
        }).toLowerCase();

        const ref = doc(db, "facultyTimetable", user.userId);
        const snap = await getDoc(ref);

        if (!snap.exists()) {
          setTodaySchedule([]);
          return;
        }

        const dayData = snap.data()[today];

        if (!dayData) {
          setTodaySchedule([]);
          return;
        }

        const formatted = dayData.map((lec, index) => ({
          id: index + 1,
          subject: lec.subject,
          time: lec.time,
          room: lec.class,
          faculty: ""
        }));

        setTodaySchedule(formatted);
      } catch (error) {
        console.error("Error fetching timetable:", error);
      }
    };

    fetchTodaySchedule();
  }, [user]);

  /* ================= NAVIGATION ================= */
  const handleViewTimetable = () => {
    navigate("/faculty/timetable");
  };

  const handleViewReports = () => {
    navigate("/faculty/reports");
  };

  /* ================= UI ================= */
  return (
    <div className="faculty-dashboard-layout">
      <Navbar />

      <div className="faculty-dashboard-container">

        {/* HEADER */}
        <div className="dashboard-header">
          <h1 className="dashboard-title">Faculty Dashboard</h1>
          <p className="dashboard-subtitle">
            Welcome, {facultyData?.name || "Faculty"}.
          </p>
        </div>

        {/* ================= STATS ================= */}
        <div className="stats-grid">
          <StatsCard
            title="Subject"
            value={facultyData?.subject || "Loading..."}
            change="Assigned Subject"
            changeType="neutral"
            icon="📘"
            iconClassName="stat-icon-primary"
          />

          <StatsCard
            title="Classes Assigned"
            value={facultyData?.classes?.length || 0}
            change="Total Classes"
            changeType="neutral"
            icon="🏫"
            iconClassName="stat-icon-accent"
          />

          <StatsCard
            title="Today's Lectures"
            value={todaySchedule.length}
            change="Scheduled Today"
            changeType="neutral"
            icon="📅"
            iconClassName="stat-icon-success"
          />
        </div>

        {/* ================= TODAY'S TIMETABLE ================= */}
        <div className="classes-card">
          <div className="card-header">
          </div>

          {todaySchedule.length > 0 ? (
            <TodaySchedule
              schedule={todaySchedule}
              onViewFull={handleViewTimetable}
            />
          ) : (
            <div className="no-classes">
              No lectures scheduled today.
            </div>
          )}
        </div>

        {/* ================= ASSIGNED CLASSES ================= */}
        <div className="classes-card">
          <div className="card-header">
            <h2 className="card-title">Assigned Classes</h2>
            <button className="btn btn-outline" onClick={handleViewTimetable}>
              View Timetable
            </button>
          </div>

          <div className="classes-list">
            {facultyData?.classes?.length > 0 ? (
              facultyData.classes.map((cls, index) => (
                <div key={index} className="class-item">
                  <div className="class-left">
                    <h3 className="class-subject">
                      {facultyData.subject}
                    </h3>
                    <span className="class-code">{cls}</span>
                  </div>

                  <div className="class-right">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() =>
                        navigate("/faculty/attendance", {
                          state: { className: cls }
                        })
                      }
                    >
                      Mark Attendance
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-classes">
                No classes assigned yet.
              </div>
            )}
          </div>
        </div>

        {/* ================= QUICK ACTIONS ================= */}
        <div className="quick-actions-grid">
          <div
            className="action-card"
            onClick={() => navigate("/faculty/attendance")}
          >
            <div className="action-icon action-icon-primary">📋</div>
            <div className="action-content">
              <h3 className="action-title">Mark Attendance</h3>
              <p className="action-description">
                Record student attendance
              </p>
            </div>
          </div>

          <div className="action-card" onClick={handleViewTimetable}>
            <div className="action-icon action-icon-accent">📅</div>
            <div className="action-content">
              <h3 className="action-title">View Timetable</h3>
              <p className="action-description">
                Check your schedule
              </p>
            </div>
          </div>

          <div className="action-card" onClick={handleViewReports}>
            <div className="action-icon action-icon-warning">📈</div>
            <div className="action-content">
              <h3 className="action-title">View Reports</h3>
              <p className="action-description">
                Attendance analytics
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FacultyDashboardPage;