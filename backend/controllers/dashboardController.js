const fs = require("fs");
const path = require("path");
const { db } = require("../config/firebase");

exports.getDashboardStats = async (req, res) => {
  try {
    // 1. Total Students and Departments
    const studentDataPath = path.join(__dirname, "../Data/studentLoginData.json");
    const studentData = JSON.parse(fs.readFileSync(studentDataPath, "utf-8"));
    const totalStudents = Object.keys(studentData.users || {}).length;

    const departmentsCount = {
      "Computer Science": 0,
      "Mechanical": 0,
      "Electronics": 0,
      "Civil": 0
    };
    
    if (studentData.users) {
      Object.values(studentData.users).forEach(user => {
        if (user.department && departmentsCount[user.department] !== undefined) {
          departmentsCount[user.department]++;
        }
      });
    }

    // 2. Total Faculty
    const facultyDataPath = path.join(__dirname, "../Data/facultyLoginData.json");
    const facultyData = JSON.parse(fs.readFileSync(facultyDataPath, "utf-8"));
    const totalFaculty = Object.keys(facultyData.users || {}).length;

    // 3. Active Subjects
    const subjectsDataPath = path.join(__dirname, "../Data/subjects.json");
    const subjectsData = JSON.parse(fs.readFileSync(subjectsDataPath, "utf-8"));
    const activeSubjects = Object.keys(subjectsData.subjects || {}).length;

    // 4. Average Attendance
    let avgAttendance = 0;
    const attendanceSnapshot = await db.collection("attendance").get();
    
    let totalPresent = 0;
    let totalRecords = 0;

    attendanceSnapshot.forEach((doc) => {
      const data = doc.data();
      
      // Handle "attendance" object mapping studentIds to boolean/string
      if (data.attendance && typeof data.attendance === 'object' && !Array.isArray(data.attendance)) {
        Object.values(data.attendance).forEach((isPresent) => {
          totalRecords += 1;
          if (isPresent === true || isPresent === "Present" || isPresent === "present") {
            totalPresent += 1;
          }
        });
      } 
      // Fallback for "students" array format
      else if (data.students && Array.isArray(data.students)) {
        data.students.forEach((student) => {
          totalRecords += 1;
          if (student.status === "Present" || student.status === "present" || student.present === true || student.status === true) {
            totalPresent += 1;
          }
        });
      }
    });

    if (totalRecords > 0) {
      avgAttendance = ((totalPresent / totalRecords) * 100).toFixed(1);
    }

    res.json({
      totalStudents,
      totalFaculty,
      activeSubjects,
      avgAttendance: parseFloat(avgAttendance),
      departments: departmentsCount
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ error: "Failed to fetch dashboard stats" });
  }
};
