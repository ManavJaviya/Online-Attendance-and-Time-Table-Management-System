const { db } = require("../config/firebase");

const CE4 = {
  monday: {
    lec1: { subject: "Data Structures", facultyId: "FAC207" },
    lec2: { subject: "DBMS", facultyId: "FAC208" },
    lec3: { subject: "Computer Networks", facultyId: "FAC203" },
    lec4: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec5: { subject: "Software Engineering", facultyId: "FAC206" }
  },
  tuesday: {
    lec1: { subject: "Software Engineering", facultyId: "FAC206" },
    lec2: { subject: "Data Structures", facultyId: "FAC207" },
    lec3: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec4: { subject: "DBMS", facultyId: "FAC208" },
    lec5: { subject: "Computer Networks", facultyId: "FAC203" }
  },
  wednesday: {
    lec1: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec2: { subject: "Software Engineering", facultyId: "FAC206" },
    lec3: { subject: "DBMS", facultyId: "FAC208" },
    lec4: { subject: "Data Structures", facultyId: "FAC207" },
    lec5: { subject: "Computer Networks", facultyId: "FAC203" }
  },
  thursday: {
    lec1: { subject: "Computer Networks", facultyId: "FAC203" },
    lec2: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec3: { subject: "Software Engineering", facultyId: "FAC206" },
    lec4: { subject: "DBMS", facultyId: "FAC208" },
    lec5: { subject: "Data Structures", facultyId: "FAC207" }
  },
  friday: {
    lec1: { subject: "DBMS", facultyId: "FAC208" },
    lec2: { subject: "Computer Networks", facultyId: "FAC203" },
    lec3: { subject: "Artificial Intelligence", facultyId: "FAC210" },
    lec4: { subject: "Software Engineering", facultyId: "FAC206" },
    lec5: { subject: "Data Structures", facultyId: "FAC207" }
  }
};

async function importCE4Timetable() {
  try {
    await db.collection("timetable").doc("CE4").set(CE4);
    console.log(" CE4 timetable imported successfully");
    process.exit(0);
  } catch (error) {
    console.error(" Error importing CE2 timetable:", error);
    process.exit(1);
  }
}

importCE4Timetable();