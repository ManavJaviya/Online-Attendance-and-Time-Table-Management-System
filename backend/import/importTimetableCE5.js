/**
 * Import timetable for CE5
 * Run: node import/importTimetableCE5.js
 */

const { db } = require("../config/firebase");

const LECTURE_TIMES = {
  lec1: "08:00 – 09:00",
  lec2: "09:00 – 10:00",
  lec3: "10:00 – 11:00",
  lec4: "11:30 – 12:30",
  lec5: "12:30 – 01:30",
};

const CE5 = {
  monday: {
    lec1: { subject: "Computer Architecture", facultyId: "FAC221", time: "08:00 – 09:00" },
    lec2: { subject: "Digital Electronics", facultyId: "FAC222", time: "09:00 – 10:00" },
    lec3: { subject: "Probability & Statistics", facultyId: "FAC223", time: "10:00 – 11:00" },
    lec4: { subject: "Software Testing", facultyId: "FAC224", time: "11:30 – 12:30" },
    lec5: { subject: "Linux & Shell Scripting", facultyId: "FAC225", time: "12:30 – 01:30" },
  },
  tuesday: {
    lec1: { subject: "Digital Electronics", facultyId: "FAC222", time: "08:00 – 09:00" },
    lec2: { subject: "Probability & Statistics", facultyId: "FAC223", time: "09:00 – 10:00" },
    lec3: { subject: "Software Testing", facultyId: "FAC224", time: "10:00 – 11:00" },
    lec4: { subject: "Linux & Shell Scripting", facultyId: "FAC225", time: "11:30 – 12:30" },
    lec5: { subject: "Computer Architecture", facultyId: "FAC221", time: "12:30 – 01:30" },
  },
  wednesday: {
    lec1: { subject: "Probability & Statistics", facultyId: "FAC223", time: "08:00 – 09:00" },
    lec2: { subject: "Software Testing", facultyId: "FAC224", time: "09:00 – 10:00" },
    lec3: { subject: "Linux & Shell Scripting", facultyId: "FAC225", time: "10:00 – 11:00" },
    lec4: { subject: "Computer Architecture", facultyId: "FAC221", time: "11:30 – 12:30" },
    lec5: { subject: "Digital Electronics", facultyId: "FAC222", time: "12:30 – 01:30" },
  },
  thursday: {
    lec1: { subject: "Software Testing", facultyId: "FAC224", time: "08:00 – 09:00" },
    lec2: { subject: "Linux & Shell Scripting", facultyId: "FAC225", time: "09:00 – 10:00" },
    lec3: { subject: "Computer Architecture", facultyId: "FAC221", time: "10:00 – 11:00" },
    lec4: { subject: "Digital Electronics", facultyId: "FAC222", time: "11:30 – 12:30" },
    lec5: { subject: "Probability & Statistics", facultyId: "FAC223", time: "12:30 – 01:30" },
  },
  friday: {
    lec1: { subject: "Linux & Shell Scripting", facultyId: "FAC225", time: "08:00 – 09:00" },
    lec2: { subject: "Computer Architecture", facultyId: "FAC221", time: "09:00 – 10:00" },
    lec3: { subject: "Digital Electronics", facultyId: "FAC222", time: "10:00 – 11:00" },
    lec4: { subject: "Probability & Statistics", facultyId: "FAC223", time: "11:30 – 12:30" },
    lec5: { subject: "Software Testing", facultyId: "FAC224", time: "12:30 – 01:30" },
  },
};

async function importCE5Timetable() {
  try {
    await db.collection("timetable").doc("CE5").set(CE5);
    console.log("✅ CE5 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error importing CE5 timetable:", error);
    process.exit(1);
  }
}

importCE5Timetable();