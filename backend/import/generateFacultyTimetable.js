
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
const CLASS_LIST = ["CE1", "CE2", "CE3", "CE4" , "CE5"];

async function generateFacultyTimetable() {
  try {
    const facultyMap = {};

    /* ===== READ ALL CLASS TIMETABLES ===== */
    for (const classId of CLASS_LIST) {
      const classSnap = await db
        .collection("timetable")
        .doc(classId)
        .get();

      if (!classSnap.exists) {
        console.log(`⚠️ No timetable found for ${classId}`);
        continue;
      }

      const timetable = classSnap.data();

      for (const day of Object.keys(timetable)) {
        const daySchedule = timetable[day];

        for (const lecKey of Object.keys(daySchedule)) {
          const lecture = daySchedule[lecKey];
          const facultyId = lecture.facultyId;

          if (!facultyId) continue;

          if (!facultyMap[facultyId]) {
            facultyMap[facultyId] = {};
          }

          if (!facultyMap[facultyId][day]) {
            facultyMap[facultyId][day] = [];
          }

          facultyMap[facultyId][day].push({
            class: classId,
            subject: lecture.subject,
            time: LECTURE_TIMES[lecKey],
          });
        }
      }
    }

    /* ===== SAVE FACULTY TIMETABLE ===== */
    for (const facultyId of Object.keys(facultyMap)) {
      await db
        .collection("facultyTimetable")
        .doc(facultyId)
        .set(facultyMap[facultyId]);

      console.log(` Faculty timetable created for ${facultyId}`);
    }

    console.log(" Faculty timetable generation completed successfully");
    process.exit(0);
  } catch (err) {
    console.error(" Error generating faculty timetable:", err);
    process.exit(1);
  }
}

generateFacultyTimetable();