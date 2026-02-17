/**
 * Import timetable for CE1
 * Run: node import/importTimetableCE1.js
 */

//const { doc, setDoc } = require("firebase/firestore");
const { db } = require("../config/firebase");

const CE1 = {
  monday: {
    lec1: { subject: "Data Structures", facultyId: "FAC201" },
    lec2: { subject: "DBMS", facultyId: "FAC202" },
    lec3: { subject: "Computer Networks", facultyId: "FAC203" },
    lec4: { subject: "Artificial Intelligence", facultyId: "FAC204" },
    lec5: { subject: "Software Engineering", facultyId: "FAC206" }
  },
  tuesday: {
    lec1: { subject: "DBMS", facultyId: "FAC202" },
    lec2: { subject: "Data Structures", facultyId: "FAC201" },
    lec3: { subject: "Software Engineering", facultyId: "FAC206" },
    lec4: { subject: "Computer Networks", facultyId: "FAC203" },
    lec5: { subject: "Artificial Intelligence", facultyId: "FAC204" }
  },
  wednesday: {
    lec1: { subject: "Artificial Intelligence", facultyId: "FAC204" },
    lec2: { subject: "DBMS", facultyId: "FAC202" },
    lec3: { subject: "Data Structures", facultyId: "FAC201" },
    lec4: { subject: "Software Engineering", facultyId: "FAC206" },
    lec5: { subject: "Computer Networks", facultyId: "FAC203" }
  },
  thursday: {
    lec1: { subject: "Software Engineering", facultyId: "FAC206" },
    lec2: { subject: "Artificial Intelligence", facultyId: "FAC204" },
    lec3: { subject: "DBMS", facultyId: "FAC202" },
    lec4: { subject: "Data Structures", facultyId: "FAC201" },
    lec5: { subject: "Computer Networks", facultyId: "FAC203" }
  },
  friday: {
    lec1: { subject: "Computer Networks", facultyId: "FAC203" },
    lec2: { subject: "Software Engineering", facultyId: "FAC206" },
    lec3: { subject: "Artificial Intelligence", facultyId: "FAC204" },
    lec4: { subject: "DBMS", facultyId: "FAC202" },
    lec5: { subject: "Data Structures", facultyId: "FAC201" }
  }
};

async function importCE1Timetable() {
  try {
    await db.collection("timetable").doc("CE1").set(CE1);
    console.log(" CE1 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Error importing CE1 timetable:", error);
    process.exit(1);
  }
}

importCE1Timetable();
