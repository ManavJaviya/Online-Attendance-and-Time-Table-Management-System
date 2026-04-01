/**
 * Import timetable for CE3
 * Run: node import/importTimetableCE3.js
 */

const { db } = require("../config/firebase");

const LECTURE_TIMES = {
  lec1: "08:00 – 09:00",
  lec2: "09:00 – 10:00",
  lec3: "10:00 – 11:00",
  lec4: "11:30 – 12:30",
  lec5: "12:30 – 01:30",
};

const CE3 = {
  monday: {
    lec1: { subject: "Computer Graphics", facultyId: "FAC211", time: "08:00 – 09:00" },
    lec2: { subject: "Compiler Design", facultyId: "FAC212", time: "09:00 – 10:00" },
    lec3: { subject: "Theory of Computation", facultyId: "FAC213", time: "10:00 – 11:00" },
    lec4: { subject: "Distributed Systems", facultyId: "FAC214", time: "11:30 – 12:30" },
    lec5: { subject: "Mobile Computing", facultyId: "FAC215", time: "12:30 – 01:30" },
  },
  tuesday: {
    lec1: { subject: "Compiler Design", facultyId: "FAC212", time: "08:00 – 09:00" },
    lec2: { subject: "Theory of Computation", facultyId: "FAC213", time: "09:00 – 10:00" },
    lec3: { subject: "Distributed Systems", facultyId: "FAC214", time: "10:00 – 11:00" },
    lec4: { subject: "Mobile Computing", facultyId: "FAC215", time: "11:30 – 12:30" },
    lec5: { subject: "Computer Graphics", facultyId: "FAC211", time: "12:30 – 01:30" },
  },
  wednesday: {
    lec1: { subject: "Theory of Computation", facultyId: "FAC213", time: "08:00 – 09:00" },
    lec2: { subject: "Distributed Systems", facultyId: "FAC214", time: "09:00 – 10:00" },
    lec3: { subject: "Mobile Computing", facultyId: "FAC215", time: "10:00 – 11:00" },
    lec4: { subject: "Computer Graphics", facultyId: "FAC211", time: "11:30 – 12:30" },
    lec5: { subject: "Compiler Design", facultyId: "FAC212", time: "12:30 – 01:30" },
  },
  thursday: {
    lec1: { subject: "Distributed Systems", facultyId: "FAC214", time: "08:00 – 09:00" },
    lec2: { subject: "Mobile Computing", facultyId: "FAC215", time: "09:00 – 10:00" },
    lec3: { subject: "Computer Graphics", facultyId: "FAC211", time: "10:00 – 11:00" },
    lec4: { subject: "Compiler Design", facultyId: "FAC212", time: "11:30 – 12:30" },
    lec5: { subject: "Theory of Computation", facultyId: "FAC213", time: "12:30 – 01:30" },
  },
  friday: {
    lec1: { subject: "Mobile Computing", facultyId: "FAC215", time: "08:00 – 09:00" },
    lec2: { subject: "Computer Graphics", facultyId: "FAC211", time: "09:00 – 10:00" },
    lec3: { subject: "Compiler Design", facultyId: "FAC212", time: "10:00 – 11:00" },
    lec4: { subject: "Theory of Computation", facultyId: "FAC213", time: "11:30 – 12:30" },
    lec5: { subject: "Distributed Systems", facultyId: "FAC214", time: "12:30 – 01:30" },
  },
};

async function importCE3Timetable() {
  try {
    await db.collection("timetable").doc("CE3").set(CE3);
    console.log("✅ CE3 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing CE3 timetable:", error);
    process.exit(1);
  }
}

importCE3Timetable();