/**
 * Import timetable for CE4
 * Run: node import/importTimetableCE4.js
 */

const { db } = require("../config/firebase");

const LECTURE_TIMES = {
  lec1: "08:00 – 09:00",
  lec2: "09:00 – 10:00",
  lec3: "10:00 – 11:00",
  lec4: "11:30 – 12:30",
  lec5: "12:30 – 01:30",
};

const CE4 = {
  monday: {
    lec1: { subject: "Data Science", facultyId: "FAC216", time: "08:00 – 09:00" },
    lec2: { subject: "IoT Systems", facultyId: "FAC217", time: "09:00 – 10:00" },
    lec3: { subject: "Embedded Systems", facultyId: "FAC218", time: "10:00 – 11:00" },
    lec4: { subject: "Python Programming", facultyId: "FAC219", time: "11:30 – 12:30" },
    lec5: { subject: "Advanced Algorithms", facultyId: "FAC220", time: "12:30 – 01:30" },
  },
  tuesday: {
    lec1: { subject: "IoT Systems", facultyId: "FAC217", time: "08:00 – 09:00" },
    lec2: { subject: "Embedded Systems", facultyId: "FAC218", time: "09:00 – 10:00" },
    lec3: { subject: "Python Programming", facultyId: "FAC219", time: "10:00 – 11:00" },
    lec4: { subject: "Advanced Algorithms", facultyId: "FAC220", time: "11:30 – 12:30" },
    lec5: { subject: "Data Science", facultyId: "FAC216", time: "12:30 – 01:30" },
  },
  wednesday: {
    lec1: { subject: "Embedded Systems", facultyId: "FAC218", time: "08:00 – 09:00" },
    lec2: { subject: "Python Programming", facultyId: "FAC219", time: "09:00 – 10:00" },
    lec3: { subject: "Computer Graphics", facultyId: "FAC211", time: "10:00 – 11:00" },
    lec4: { subject: "Data Science", facultyId: "FAC216", time: "11:30 – 12:30" },
    lec5: { subject: "IoT Systems", facultyId: "FAC217", time: "12:30 – 01:30" },
  },
  thursday: {
    lec1: { subject: "Python Programming", facultyId: "FAC219", time: "08:00 – 09:00" },
    lec2: { subject: "Advanced Algorithms", facultyId: "FAC220", time: "09:00 – 10:00" },
    lec3: { subject: "Data Science", facultyId: "FAC216", time: "10:00 – 11:00" },
    lec4: { subject: "IoT Systems", facultyId: "FAC217", time: "11:30 – 12:30" },
    lec5: { subject: "Embedded Systems", facultyId: "FAC218", time: "12:30 – 01:30" },
  },
  friday: {
    lec1: { subject: "Advanced Algorithms", facultyId: "FAC220", time: "08:00 – 09:00" },
    lec2: { subject: "Data Science", facultyId: "FAC216", time: "09:00 – 10:00" },
    lec3: { subject: "IoT Systems", facultyId: "FAC217", time: "10:00 – 11:00" },
    lec4: { subject: "Embedded Systems", facultyId: "FAC218", time: "11:30 – 12:30" },
    lec5: { subject: "Python Programming", facultyId: "FAC219", time: "12:30 – 01:30" },
  },
};

async function importCE4Timetable() {
  try {
    await db.collection("timetable").doc("CE4").set(CE4);
    console.log("✅ CE4 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing CE4 timetable:", error);
    process.exit(1);
  }
}

importCE4Timetable();