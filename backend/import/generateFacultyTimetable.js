/**
 * Import all faculty timetables into Firestore
 * Run: node import/importAllFacultyTimetables.js
 */

const { db } = require("../config/firebase"); // admin db

/* ===== LECTURE TIME MAP ===== */
const LECTURE_TIMES = {
  lec1: "08:00 – 09:00",
  lec2: "09:00 – 10:00",
  lec3: "10:00 – 11:00",
  lec4: "11:30 – 12:30",
  lec5: "12:30 – 01:30",
};

/* ===== ALL CLASSES ===== */
const CLASS_LIST = ["CE1", "CE2", "CE3", "CE4", "CE5"];

/* ===== HARDCODED FACULTY TIMETABLE MAP ===== */
const facultyMap = {
  "FAC201": {
    monday: [
      { class: "CE1", subject: "Data Structures", time: "08:00 – 09:00" },
      { class: "CE2", subject: "Data Structures", time: "08:00 – 09:00" },
    ],
    tuesday: [
      { class: "CE1", subject: "Data Structures", time: "12:30 – 01:30" },
    ],
    wednesday: [
      { class: "CE1", subject: "Data Structures", time: "11:30 – 12:30" },
    ],
    thursday: [
      { class: "CE1", subject: "Data Structures", time: "10:00 – 11:00" },
    ],
    friday: [
      { class: "CE1", subject: "Data Structures", time: "09:00 – 10:00" },
    ],
  },
  "FAC202": {
    monday: [
      { class: "CE1", subject: "Computer Networks", time: "09:00 – 10:00" },
    ],
    tuesday: [
      { class: "CE1", subject: "Computer Networks", time: "08:00 – 09:00" },
    ],
    wednesday: [
      { class: "CE1", subject: "Computer Networks", time: "12:30 – 01:30" },
    ],
    thursday: [
      { class: "CE1", subject: "Computer Networks", time: "11:30 – 12:30" },
    ],
    friday: [
      { class: "CE1", subject: "Computer Networks", time: "10:00 – 11:00" },
    ],
  },
  "FAC203": {
    monday: [
      { class: "CE1", subject: "Software Engineering", time: "10:00 – 11:00" },
    ],
    tuesday: [
      { class: "CE1", subject: "Software Engineering", time: "09:00 – 10:00" },
    ],
    wednesday: [
      { class: "CE1", subject: "Software Engineering", time: "08:00 – 09:00" },
    ],
    thursday: [
      { class: "CE1", subject: "Software Engineering", time: "12:30 – 01:30" },
    ],
    friday: [
      { class: "CE1", subject: "Software Engineering", time: "11:30 – 12:30" },
    ],
  },
  "FAC204": {
    monday: [
      { class: "CE1", subject: "Artificial Intelligence", time: "11:30 – 12:30" },
    ],
    tuesday: [
      { class: "CE1", subject: "Artificial Intelligence", time: "10:00 – 11:00" },
    ],
    wednesday: [
      { class: "CE1", subject: "Artificial Intelligence", time: "09:00 – 10:00" },
    ],
    thursday: [
      { class: "CE1", subject: "Artificial Intelligence", time: "08:00 – 09:00" },
    ],
    friday: [
      { class: "CE1", subject: "Artificial Intelligence", time: "12:30 – 01:30" },
    ],
  },
  "FAC205": {
    monday: [
      { class: "CE1", subject: "Database Management", time: "12:30 – 01:30" },
    ],
    tuesday: [
      { class: "CE1", subject: "Database Management", time: "11:30 – 12:30" },
    ],
    wednesday: [
      { class: "CE1", subject: "Database Management", time: "10:00 – 11:00" },
    ],
    thursday: [
      { class: "CE1", subject: "Database Management", time: "09:00 – 10:00" },
    ],
    friday: [
      { class: "CE1", subject: "Database Management", time: "08:00 – 09:00" },
    ],
  },
  "FAC206": {
    tuesday: [
      { class: "CE2", subject: "Operating Systems", time: "12:30 – 01:30" },
    ],
    wednesday: [
      { class: "CE2", subject: "Operating Systems", time: "11:30 – 12:30" },
    ],
    thursday: [
      { class: "CE2", subject: "Operating Systems", time: "10:00 – 11:00" },
    ],
    friday: [
      { class: "CE2", subject: "Operating Systems", time: "09:00 – 10:00" },
    ],
  },
  "FAC207": {
    monday: [
      { class: "CE2", subject: "Machine Learning", time: "09:00 – 10:00" },
    ],
    tuesday: [
      { class: "CE2", subject: "Machine Learning", time: "08:00 – 09:00" },
    ],
    wednesday: [
      { class: "CE2", subject: "Machine Learning", time: "12:30 – 01:30" },
    ],
    thursday: [
      { class: "CE2", subject: "Machine Learning", time: "11:30 – 12:30" },
    ],
    friday: [
      { class: "CE2", subject: "Machine Learning", time: "10:00 – 11:00" },
    ],
  },
  "FAC208": {
    monday: [
      { class: "CE2", subject: "Web Technologies", time: "10:00 – 11:00" },
    ],
    tuesday: [
      { class: "CE2", subject: "Web Technologies", time: "09:00 – 10:00" },
    ],
    wednesday: [
      { class: "CE2", subject: "Web Technologies", time: "08:00 – 09:00" },
    ],
    thursday: [
      { class: "CE2", subject: "Web Technologies", time: "12:30 – 01:30" },
    ],
    friday: [
      { class: "CE2", subject: "Web Technologies", time: "11:30 – 12:30" },
    ],
  },
  "FAC209": {
    monday: [
      { class: "CE2", subject: "Cloud Computing", time: "11:30 – 12:30" },
    ],
    tuesday: [
      { class: "CE2", subject: "Cloud Computing", time: "10:00 – 11:00" },
    ],
    wednesday: [
      { class: "CE2", subject: "Cloud Computing", time: "09:00 – 10:00" },
    ],
    thursday: [
      { class: "CE2", subject: "Cloud Computing", time: "08:00 – 09:00" },
    ],
    friday: [
      { class: "CE2", subject: "Cloud Computing", time: "12:30 – 01:30" },
    ],
  },
  "FAC210": {
    monday: [
      { class: "CE2", subject: "Cyber Security", time: "12:30 – 01:30" },
    ],
    tuesday: [
      { class: "CE2", subject: "Cyber Security", time: "11:30 – 12:30" },
    ],
    wednesday: [
      { class: "CE2", subject: "Cyber Security", time: "10:00 – 11:00" },
    ],
    thursday: [
      { class: "CE2", subject: "Cyber Security", time: "09:00 – 10:00" },
    ],
    friday: [
      { class: "CE2", subject: "Cyber Security", time: "08:00 – 09:00" },
    ],
  },
  "FAC211": {
    monday: [
      { class: "CE3", subject: "Computer Graphics", time: "08:00 – 09:00" },
    ],
    tuesday: [
      { class: "CE3", subject: "Computer Graphics", time: "12:30 – 01:30" },
    ],
    wednesday: [
      { class: "CE3", subject: "Computer Graphics", time: "11:30 – 12:30" },
      { class: "CE4", subject: "Computer Graphics", time: "10:00 – 11:00" },
    ],
    thursday: [
      { class: "CE3", subject: "Computer Graphics", time: "10:00 – 11:00" },
    ],
    friday: [
      { class: "CE3", subject: "Computer Graphics", time: "09:00 – 10:00" },
    ],
  },
  "FAC212": {
    monday: [
      { class: "CE3", subject: "Compiler Design", time: "09:00 – 10:00" },
    ],
    tuesday: [
      { class: "CE3", subject: "Compiler Design", time: "08:00 – 09:00" },
    ],
    wednesday: [
      { class: "CE3", subject: "Compiler Design", time: "12:30 – 01:30" },
    ],
    thursday: [
      { class: "CE3", subject: "Compiler Design", time: "11:30 – 12:30" },
    ],
    friday: [
      { class: "CE3", subject: "Compiler Design", time: "10:00 – 11:00" },
    ],
  },
  "FAC213": {
    monday: [
      { class: "CE3", subject: "Theory of Computation", time: "10:00 – 11:00" },
    ],
    tuesday: [
      { class: "CE3", subject: "Theory of Computation", time: "09:00 – 10:00" },
    ],
    wednesday: [
      { class: "CE3", subject: "Theory of Computation", time: "08:00 – 09:00" },
    ],
    thursday: [
      { class: "CE3", subject: "Theory of Computation", time: "12:30 – 01:30" },
    ],
    friday: [
      { class: "CE3", subject: "Theory of Computation", time: "11:30 – 12:30" },
    ],
  },
  "FAC214": {
    monday: [
      { class: "CE3", subject: "Distributed Systems", time: "11:30 – 12:30" },
    ],
    tuesday: [
      { class: "CE3", subject: "Distributed Systems", time: "10:00 – 11:00" },
    ],
    wednesday: [
      { class: "CE3", subject: "Distributed Systems", time: "09:00 – 10:00" },
    ],
    thursday: [
      { class: "CE3", subject: "Distributed Systems", time: "08:00 – 09:00" },
    ],
    friday: [
      { class: "CE3", subject: "Distributed Systems", time: "12:30 – 01:30" },
    ],
  },
  "FAC215": {
    monday: [
      { class: "CE3", subject: "Mobile Computing", time: "12:30 – 01:30" },
    ],
    tuesday: [
      { class: "CE3", subject: "Mobile Computing", time: "11:30 – 12:30" },
    ],
    wednesday: [
      { class: "CE3", subject: "Mobile Computing", time: "10:00 – 11:00" },
    ],
    thursday: [
      { class: "CE3", subject: "Mobile Computing", time: "09:00 – 10:00" },
    ],
    friday: [
      { class: "CE3", subject: "Mobile Computing", time: "08:00 – 09:00" },
    ],
  },
  "FAC216": {
    monday: [
      { class: "CE4", subject: "Data Science", time: "08:00 – 09:00" },
    ],
    tuesday: [
      { class: "CE4", subject: "Data Science", time: "12:30 – 01:30" },
    ],
    wednesday: [
      { class: "CE4", subject: "Data Science", time: "11:30 – 12:30" },
    ],
    thursday: [
      { class: "CE4", subject: "Data Science", time: "10:00 – 11:00" },
    ],
    friday: [
      { class: "CE4", subject: "Data Science", time: "09:00 – 10:00" },
    ],
  },
  "FAC217": {
    monday: [
      { class: "CE4", subject: "IoT Systems", time: "09:00 – 10:00" },
    ],
    tuesday: [
      { class: "CE4", subject: "IoT Systems", time: "08:00 – 09:00" },
    ],
    wednesday: [
      { class: "CE4", subject: "IoT Systems", time: "12:30 – 01:30" },
    ],
    thursday: [
      { class: "CE4", subject: "IoT Systems", time: "11:30 – 12:30" },
    ],
    friday: [
      { class: "CE4", subject: "IoT Systems", time: "10:00 – 11:00" },
    ],
  },
  "FAC218": {
    monday: [
      { class: "CE4", subject: "Embedded Systems", time: "10:00 – 11:00" },
    ],
    tuesday: [
      { class: "CE4", subject: "Embedded Systems", time: "09:00 – 10:00" },
    ],
    wednesday: [
      { class: "CE4", subject: "Embedded Systems", time: "08:00 – 09:00" },
    ],
    thursday: [
      { class: "CE4", subject: "Embedded Systems", time: "12:30 – 01:30" },
    ],
    friday: [
      { class: "CE4", subject: "Embedded Systems", time: "11:30 – 12:30" },
    ],
  },
  "FAC219": {
    monday: [
      { class: "CE4", subject: "Python Programming", time: "11:30 – 12:30" },
    ],
    tuesday: [
      { class: "CE4", subject: "Python Programming", time: "10:00 – 11:00" },
    ],
    wednesday: [
      { class: "CE4", subject: "Python Programming", time: "09:00 – 10:00" },
    ],
    thursday: [
      { class: "CE4", subject: "Python Programming", time: "08:00 – 09:00" },
    ],
    friday: [
      { class: "CE4", subject: "Python Programming", time: "12:30 – 01:30" },
    ],
  },
  "FAC220": {
    monday: [
      { class: "CE4", subject: "Advanced Algorithms", time: "12:30 – 01:30" },
    ],
    tuesday: [
      { class: "CE4", subject: "Advanced Algorithms", time: "11:30 – 12:30" },
    ],
    thursday: [
      { class: "CE4", subject: "Advanced Algorithms", time: "09:00 – 10:00" },
    ],
    friday: [
      { class: "CE4", subject: "Advanced Algorithms", time: "08:00 – 09:00" },
    ],
  },
  "FAC221": {
    monday: [
      { class: "CE5", subject: "Computer Architecture", time: "08:00 – 09:00" },
    ],
    tuesday: [
      { class: "CE5", subject: "Computer Architecture", time: "12:30 – 01:30" },
    ],
    wednesday: [
      { class: "CE5", subject: "Computer Architecture", time: "11:30 – 12:30" },
    ],
    thursday: [
      { class: "CE5", subject: "Computer Architecture", time: "10:00 – 11:00" },
    ],
    friday: [
      { class: "CE5", subject: "Computer Architecture", time: "09:00 – 10:00" },
    ],
  },
  "FAC222": {
    monday: [
      { class: "CE5", subject: "Digital Electronics", time: "09:00 – 10:00" },
    ],
    tuesday: [
      { class: "CE5", subject: "Digital Electronics", time: "08:00 – 09:00" },
    ],
    wednesday: [
      { class: "CE5", subject: "Digital Electronics", time: "12:30 – 01:30" },
    ],
    thursday: [
      { class: "CE5", subject: "Digital Electronics", time: "11:30 – 12:30" },
    ],
    friday: [
      { class: "CE5", subject: "Digital Electronics", time: "10:00 – 11:00" },
    ],
  },
  "FAC223": {
    monday: [
      { class: "CE5", subject: "Probability & Statistics", time: "10:00 – 11:00" },
    ],
    tuesday: [
      { class: "CE5", subject: "Probability & Statistics", time: "09:00 – 10:00" },
    ],
    wednesday: [
      { class: "CE5", subject: "Probability & Statistics", time: "08:00 – 09:00" },
    ],
    thursday: [
      { class: "CE5", subject: "Probability & Statistics", time: "12:30 – 01:30" },
    ],
    friday: [
      { class: "CE5", subject: "Probability & Statistics", time: "11:30 – 12:30" },
    ],
  },
  "FAC224": {
    monday: [
      { class: "CE5", subject: "Software Testing", time: "11:30 – 12:30" },
    ],
    tuesday: [
      { class: "CE5", subject: "Software Testing", time: "10:00 – 11:00" },
    ],
    wednesday: [
      { class: "CE5", subject: "Software Testing", time: "09:00 – 10:00" },
    ],
    thursday: [
      { class: "CE5", subject: "Software Testing", time: "08:00 – 09:00" },
    ],
    friday: [
      { class: "CE5", subject: "Software Testing", time: "12:30 – 01:30" },
    ],
  },
  "FAC225": {
    monday: [
      { class: "CE5", subject: "Linux & Shell Scripting", time: "12:30 – 01:30" },
    ],
    tuesday: [
      { class: "CE5", subject: "Linux & Shell Scripting", time: "11:30 – 12:30" },
    ],
    wednesday: [
      { class: "CE5", subject: "Linux & Shell Scripting", time: "10:00 – 11:00" },
    ],
    thursday: [
      { class: "CE5", subject: "Linux & Shell Scripting", time: "09:00 – 10:00" },
    ],
    friday: [
      { class: "CE5", subject: "Linux & Shell Scripting", time: "08:00 – 09:00" },
    ],
  },
};

async function importAllFacultyTimetables() {
  try {
    for (const facultyId of Object.keys(facultyMap)) {
      await db
        .collection("facultyTimetable")
        .doc(facultyId)
        .set(facultyMap[facultyId]);

      console.log(`✅ Faculty timetable imported for ${facultyId}`);
    }

    console.log("✅ All faculty timetables imported successfully");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error importing faculty timetables:", err);
    process.exit(1);
  }
}

importAllFacultyTimetables();