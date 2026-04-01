/**
 * Import timetable for CE2
 * Run: node import/importTimetableCE2.js
 */

const { db } = require("../config/firebase");

const LECTURE_TIMES = {
  lec1: "08:00 – 09:00",
  lec2: "09:00 – 10:00",
  lec3: "10:00 – 11:00",
  lec4: "11:30 – 12:30",
  lec5: "12:30 – 01:30",
};

const CE2 = {
  monday: {
    lec1: { subject: "Data Structures", facultyId: "FAC201", time: "08:00 – 09:00" },
    lec2: { subject: "Machine Learning", facultyId: "FAC207", time: "09:00 – 10:00" },
    lec3: { subject: "Web Technologies", facultyId: "FAC208", time: "10:00 – 11:00" },
    lec4: { subject: "Cloud Computing", facultyId: "FAC209", time: "11:30 – 12:30" },
    lec5: { subject: "Cyber Security", facultyId: "FAC210", time: "12:30 – 01:30" },
  },
  tuesday: {
    lec1: { subject: "Machine Learning", facultyId: "FAC207", time: "08:00 – 09:00" },
    lec2: { subject: "Web Technologies", facultyId: "FAC208", time: "09:00 – 10:00" },
    lec3: { subject: "Cloud Computing", facultyId: "FAC209", time: "10:00 – 11:00" },
    lec4: { subject: "Cyber Security", facultyId: "FAC210", time: "11:30 – 12:30" },
    lec5: { subject: "Operating Systems", facultyId: "FAC206", time: "12:30 – 01:30" },
  },
  wednesday: {
    lec1: { subject: "Web Technologies", facultyId: "FAC208", time: "08:00 – 09:00" },
    lec2: { subject: "Cloud Computing", facultyId: "FAC209", time: "09:00 – 10:00" },
    lec3: { subject: "Cyber Security", facultyId: "FAC210", time: "10:00 – 11:00" },
    lec4: { subject: "Operating Systems", facultyId: "FAC206", time: "11:30 – 12:30" },
    lec5: { subject: "Machine Learning", facultyId: "FAC207", time: "12:30 – 01:30" },
  },
  thursday: {
    lec1: { subject: "Cloud Computing", facultyId: "FAC209", time: "08:00 – 09:00" },
    lec2: { subject: "Cyber Security", facultyId: "FAC210", time: "09:00 – 10:00" },
    lec3: { subject: "Operating Systems", facultyId: "FAC206", time: "10:00 – 11:00" },
    lec4: { subject: "Machine Learning", facultyId: "FAC207", time: "11:30 – 12:30" },
    lec5: { subject: "Web Technologies", facultyId: "FAC208", time: "12:30 – 01:30" },
  },
  friday: {
    lec1: { subject: "Cyber Security", facultyId: "FAC210", time: "08:00 – 09:00" },
    lec2: { subject: "Operating Systems", facultyId: "FAC206", time: "09:00 – 10:00" },
    lec3: { subject: "Machine Learning", facultyId: "FAC207", time: "10:00 – 11:00" },
    lec4: { subject: "Web Technologies", facultyId: "FAC208", time: "11:30 – 12:30" },
    lec5: { subject: "Cloud Computing", facultyId: "FAC209", time: "12:30 – 01:30" },
  },
};

async function importCE2Timetable() {
  try {
    await db.collection("timetable").doc("CE2").set(CE2);
    console.log("✅ CE2 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing CE2 timetable:", error);
    process.exit(1);
  }
}

importCE2Timetable();