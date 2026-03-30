const fs = require("fs");
const path = require("path");
const { db } = require("../config/firebase");
const { logActivity } = require("../utils/activityLogger");

exports.logFrontendActivity = (req, res) => {
  try {
    const { type, title, user, color, icon } = req.body;
    logActivity(type, title, user, color, icon);
    res.status(200).json({ message: "Activity logged" });
  } catch (error) {
    console.error("Error logging frontend activity:", error);
    res.status(500).json({ error: "Failed to log activity" });
  }
};

exports.getLowAttendanceStudents = async (req, res) => {
  try {
    const studentsPath = path.join(__dirname, "../Data/students.json");
    let studentsData = {};
    if (fs.existsSync(studentsPath)) {
      studentsData = JSON.parse(fs.readFileSync(studentsPath, "utf-8")).students || {};
    }

    const attendanceSnapshot = await db.collection("attendance").get();
    const attendanceData = {};
    attendanceSnapshot.forEach(doc => {
      attendanceData[doc.id] = doc.data();
    });

    const result = [];
    Object.keys(studentsData).forEach(studentId => {
      const student = studentsData[studentId];
      let sTotal = 0;
      let sAttended = 0;
      let subject = "General"; // default 

      if (attendanceData[studentId]) {
        const studentAtt = attendanceData[studentId];
        Object.keys(studentAtt).forEach(subjKey => {
           if (studentAtt[subjKey] && typeof studentAtt[subjKey].total === 'number') {
              sTotal += studentAtt[subjKey].total;
              sAttended += studentAtt[subjKey].attended;
              subject = subjKey;
           }
        });
      }

      // Automatically give 100% to students with 0 classes to avoid alert false positives
      const percentage = sTotal > 0 ? Math.round((sAttended / sTotal) * 100) : 100;
      
      result.push({
        id: studentId,
        rollNo: student.rollNo,
        name: student.name,
        class: student.class,
        subject: subject,
        totalClasses: sTotal,
        present: sAttended,
        attendance: percentage
      });
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({ error: "Failed to fetch student attendance" });
  }
};

exports.getRecentActivities = (req, res) => {
  try {
    const activitiesPath = path.join(__dirname, "../Data/activities.json");
    if (fs.existsSync(activitiesPath)) {
      const data = fs.readFileSync(activitiesPath, "utf-8");
      return res.status(200).json(JSON.parse(data));
    }
    return res.status(200).json([]);
  } catch (error) {
    console.error("Error fetching activities:", error);
    res.status(500).json({ error: "Failed to fetch activities" });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Students and Departments
    const studentDataPath = path.join(__dirname, "../Data/studentLoginData.json");
    const studentData = JSON.parse(fs.readFileSync(studentDataPath, "utf-8"));

    const departmentsCount = {
      "Computer Science": 0,
      "Mechanical": 0,
      "Electronics": 0,
      "Civil": 0,
      "ICT": 0
    };

    let effectiveTotalStudents = 0;

    if (studentData.users) {
      Object.values(studentData.users).forEach(user => {
        effectiveTotalStudents++;
        const dept = user.department || "Unassigned";
        if (departmentsCount[dept] === undefined) {
          departmentsCount[dept] = 0;
        }
        departmentsCount[dept]++;
      });
    }

    const totalStudents = effectiveTotalStudents;

    // 2. Total Faculty
    const facultyDataPath = path.join(__dirname, "../Data/facultyLoginData.json");
    const facultyData = JSON.parse(fs.readFileSync(facultyDataPath, "utf-8"));
    const totalFaculty = Object.keys(facultyData.users || {}).length;

    // 3. Active Subjects
    const subjectsDataPath = path.join(__dirname, "../Data/subjects.json");
    const subjectsData = JSON.parse(fs.readFileSync(subjectsDataPath, "utf-8"));
    const activeSubjects = Object.keys(subjectsData.subjects || {}).length;

    // 4. Average Attendance and Weekly Trends
    let avgAttendance = 0;
    const attendanceSnapshot = await db.collection("attendance").get();

    let totalPresent = 0;
    let totalRecords = 0;

    const now = new Date();
    // Normalize to start of day in UTC format as stored in DB
    const msPerDay = 24 * 60 * 60 * 1000;
    const dailyStats = {};
    for (let i = 0; i < 21; i++) {
      const d = new Date(now.getTime() - i * msPerDay);
      const dateStr = d.toISOString().split("T")[0];
      dailyStats[dateStr] = { total: 0, present: 0 };
    }

    attendanceSnapshot.forEach((doc) => {
      const data = doc.data();
      let docTotal = 0;
      let docPresent = 0;

      // Handle old "attendance" object mapping studentIds to boolean/string
      if (data.hasOwnProperty('attendance') && typeof data.attendance === 'object' && !Array.isArray(data.attendance)) {
        Object.values(data.attendance).forEach((isPresent) => {
          docTotal += 1;
          if (isPresent === true || isPresent === "Present" || isPresent === "present") {
            docPresent += 1;
          }
        });
      }
      // Fallback for old "students" array format
      else if (data.hasOwnProperty('students') && Array.isArray(data.students)) {
        data.students.forEach((student) => {
          docTotal += 1;
          if (student.status === "Present" || student.status === "present" || student.present === true || student.status === true) {
            docPresent += 1;
          }
        });
      }
      // NEW FORMAT: Student aggregate records
      // doc.id = studentId, data = { "SubjectName": { total: number, attended: number }, ... }
      else {
        Object.values(data).forEach((val) => {
          if (val && typeof val === 'object' && typeof val.total === 'number' && typeof val.attended === 'number') {
            docTotal += val.total;
            docPresent += val.attended;
          }
        });
      }

      totalRecords += docTotal;
      totalPresent += docPresent;

      let dateKey = null;
      if (data.date && typeof data.date === 'string') {
        dateKey = data.date.split("T")[0];
      }

      if (dateKey && dailyStats[dateKey]) {
        dailyStats[dateKey].total += docTotal;
        dailyStats[dateKey].present += docPresent;
      }
    });

    // Also fetch from modern class_sessions collection which has proper date fields
    const classSessionsSnapshot = await db.collection("class_sessions").get();
    classSessionsSnapshot.forEach((doc) => {
      const data = doc.data();
      let docTotal = 0;
      let docPresent = 0;
      
      if (data.attendance && typeof data.attendance === 'object') {
        Object.values(data.attendance).forEach(isPresent => {
          docTotal++;
          if (isPresent === true || isPresent === "true") docPresent++;
        });
      }

      let dateKey = null;
      if (data.date && typeof data.date === 'string') {
        dateKey = data.date.split("T")[0];
      }

      if (dateKey && dailyStats[dateKey]) {
        dailyStats[dateKey].total += docTotal;
        dailyStats[dateKey].present += docPresent;
      }
    });

    if (totalRecords > 0) {
      avgAttendance = ((totalPresent / totalRecords) * 100).toFixed(1);
    }

    // Calculate weekly trend (Monday to Saturday of the current week)
    const weeklyTrend = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const currentMonday = new Date(now.getTime() - diffToMonday * msPerDay);

    let currentWeekTotal = 0;
    let currentWeekPresent = 0;
    
    for (let i = 0; i < 6; i++) {
      const d = new Date(currentMonday.getTime() + i * msPerDay);
      const dateStr = d.toISOString().split("T")[0];
      
      let percentage = 0;
      if (dailyStats[dateStr] && dailyStats[dateStr].total > 0) {
        currentWeekTotal += dailyStats[dateStr].total;
        currentWeekPresent += dailyStats[dateStr].present;
        percentage = Math.round((dailyStats[dateStr].present / dailyStats[dateStr].total) * 100);
      }
      weeklyTrend.push({ day: dayNames[d.getDay()], percentage });
    }

    // Previous week (Monday to Saturday of the previous week)
    const prevMonday = new Date(currentMonday.getTime() - 7 * msPerDay);
    let prevWeekTotal = 0;
    let prevWeekPresent = 0;
    
    for (let i = 0; i < 6; i++) {
      const d = new Date(prevMonday.getTime() + i * msPerDay);
      const dateStr = d.toISOString().split("T")[0];
      if (dailyStats[dateStr]) {
        prevWeekTotal += dailyStats[dateStr].total;
        prevWeekPresent += dailyStats[dateStr].present;
      }
    }

    let currentWeekAvg = 0;
    if (currentWeekTotal > 0) {
      currentWeekAvg = Math.round((currentWeekPresent / currentWeekTotal) * 100);
    }

    let prevWeekAvg = 0;
    if (prevWeekTotal > 0) {
      prevWeekAvg = Math.round((prevWeekPresent / prevWeekTotal) * 100);
    }

    let trendChange = 0;
    if (prevWeekTotal > 0) {
      trendChange = currentWeekAvg - prevWeekAvg;
    } else if (currentWeekTotal > 0) {
      trendChange = currentWeekAvg; 
    }
    
    let trendChangeString = trendChange >= 0 ? `+${trendChange}%` : `${trendChange}%`;

    res.json({
      totalStudents,
      totalFaculty,
      activeSubjects,
      avgAttendance: parseFloat(avgAttendance),
      departments: departmentsCount,
      weeklyTrend,
      trendChange: trendChangeString
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
