const { db } = require("../config/firebase");

const CE2 = {
  monday: {
    lec1: { subject: "Data Structures", facultyId: "FAC207" },
    lec2: { subject: "DBMS", facultyId: "FAC208" },
    lec3: { subject: "Computer Networks", facultyId: "FAC209" },
    lec4: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec5: { subject: "Software Engineering", facultyId: "FAC212" }
  },
  tuesday: {
    lec1: { subject: "DBMS", facultyId: "FAC208" },
    lec2: { subject: "Data Structures", facultyId: "FAC207" },
    lec3: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec4: { subject: "Computer Networks", facultyId: "FAC209" },
    lec5: { subject: "Software Engineering", facultyId: "FAC212" }
  },
  wednesday: {
    lec1: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec2: { subject: "DBMS", facultyId: "FAC208" },
    lec3: { subject: "Data Structures", facultyId: "FAC207" },
    lec4: { subject: "Software Engineering", facultyId: "FAC212" },
    lec5: { subject: "Computer Networks", facultyId: "FAC209" }
  },
  thursday: {
    lec1: { subject: "Software Engineering", facultyId: "FAC212" },
    lec2: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec3: { subject: "DBMS", facultyId: "FAC208" },
    lec4: { subject: "Data Structures", facultyId: "FAC207" },
    lec5: { subject: "Computer Networks", facultyId: "FAC209" }
  },
  friday: {
    lec1: { subject: "Computer Networks", facultyId: "FAC209" },
    lec2: { subject: "Software Engineering", facultyId: "FAC212" },
    lec3: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec4: { subject: "DBMS", facultyId: "FAC208" },
    lec5: { subject: "Data Structures", facultyId: "FAC207" }
  }
};

async function importCE2Timetable() {
  try {
    await db.collection("timetable").doc("CE2").set(CE2);
    console.log(" CE2 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Error importing CE2 timetable:", error);
    process.exit(1);
  }
}

importCE2Timetable();
