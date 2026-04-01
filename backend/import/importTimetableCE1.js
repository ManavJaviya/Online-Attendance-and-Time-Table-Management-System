/**
 * Import timetable for CE1
 * Run: node import/importTimetableCE1.js
 */

const { db } = require("../config/firebase");

const LECTURE_TIMES = {
  lec1: "08:00 – 09:00",
  lec2: "09:00 – 10:00",
  lec3: "10:00 – 11:00",
  lec4: "11:30 – 12:30",
  lec5: "12:30 – 01:30",
};

const CE1 = {
  monday: {
    lec1: { subject: "Data Structures", facultyId: "FAC201", time: "08:00 – 09:00" },
    lec2: { subject: "Computer Networks", facultyId: "FAC202", time: "09:00 – 10:00" },
    lec3: { subject: "Software Engineering", facultyId: "FAC203", time: "10:00 – 11:00" },
    lec4: { subject: "Artificial Intelligence", facultyId: "FAC204", time: "11:30 – 12:30" },
    lec5: { subject: "Database Management", facultyId: "FAC205", time: "12:30 – 01:30" },
  },
  tuesday: {
    lec1: { subject: "Computer Networks", facultyId: "FAC202", time: "08:00 – 09:00" },
    lec2: { subject: "Software Engineering", facultyId: "FAC203", time: "09:00 – 10:00" },
    lec3: { subject: "Artificial Intelligence", facultyId: "FAC204", time: "10:00 – 11:00" },
    lec4: { subject: "Database Management", facultyId: "FAC205", time: "11:30 – 12:30" },
    lec5: { subject: "Data Structures", facultyId: "FAC201", time: "12:30 – 01:30" },
  },
  wednesday: {
    lec1: { subject: "Software Engineering", facultyId: "FAC203", time: "08:00 – 09:00" },
    lec2: { subject: "Artificial Intelligence", facultyId: "FAC204", time: "09:00 – 10:00" },
    lec3: { subject: "Database Management", facultyId: "FAC205", time: "10:00 – 11:00" },
    lec4: { subject: "Data Structures", facultyId: "FAC201", time: "11:30 – 12:30" },
    lec5: { subject: "Computer Networks", facultyId: "FAC202", time: "12:30 – 01:30" },
  },
  thursday: {
    lec1: { subject: "Artificial Intelligence", facultyId: "FAC204", time: "08:00 – 09:00" },
    lec2: { subject: "Database Management", facultyId: "FAC205", time: "09:00 – 10:00" },
    lec3: { subject: "Data Structures", facultyId: "FAC201", time: "10:00 – 11:00" },
    lec4: { subject: "Computer Networks", facultyId: "FAC202", time: "11:30 – 12:30" },
    lec5: { subject: "Software Engineering", facultyId: "FAC203", time: "12:30 – 01:30" },
  },
  friday: {
    lec1: { subject: "Database Management", facultyId: "FAC205", time: "08:00 – 09:00" },
    lec2: { subject: "Data Structures", facultyId: "FAC201", time: "09:00 – 10:00" },
    lec3: { subject: "Computer Networks", facultyId: "FAC202", time: "10:00 – 11:00" },
    lec4: { subject: "Software Engineering", facultyId: "FAC203", time: "11:30 – 12:30" },
    lec5: { subject: "Artificial Intelligence", facultyId: "FAC204", time: "12:30 – 01:30" },
  },
};

async function importCE1Timetable() {
  try {
    await db.collection("timetable").doc("CE1").set(CE1);
    console.log("✅ CE1 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing CE1 timetable:", error);
    process.exit(1);
  }
}

importCE1Timetable();