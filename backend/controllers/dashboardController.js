const fs = require("fs");
const path = require("path");
const { db } = require("../config/firebase");

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

    // 4. Average Attendance
    let avgAttendance = 0;
    const attendanceSnapshot = await db.collection("attendance").get();

    let totalPresent = 0;
    let totalRecords = 0;

    attendanceSnapshot.forEach((doc) => {
      const data = doc.data();

      // Handle old "attendance" object mapping studentIds to boolean/string
      if (data.hasOwnProperty('attendance') && typeof data.attendance === 'object' && !Array.isArray(data.attendance)) {
        Object.values(data.attendance).forEach((isPresent) => {
          totalRecords += 1;
          if (isPresent === true || isPresent === "Present" || isPresent === "present") {
            totalPresent += 1;
          }
        });
      }
      // Fallback for old "students" array format
      else if (data.hasOwnProperty('students') && Array.isArray(data.students)) {
        data.students.forEach((student) => {
          totalRecords += 1;
          if (student.status === "Present" || student.status === "present" || student.present === true || student.status === true) {
            totalPresent += 1;
          }
        });
      }
      // NEW FORMAT: Student aggregate records
      // doc.id = studentId, data = { "SubjectName": { total: number, attended: number }, ... }
      else {
        Object.values(data).forEach((val) => {
          if (val && typeof val === 'object' && typeof val.total === 'number' && typeof val.attended === 'number') {
            totalRecords += val.total;
            totalPresent += val.attended;
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
