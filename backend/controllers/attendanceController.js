const admin = require("firebase-admin");
const db = admin.firestore();

// Get students by class
exports.getStudentsByClass = async (req, res) => {
  try {
    const { className } = req.params;

    const snapshot = await db
      .collection("students")
      .where("class", "==", className)
      .get();

    const students = [];

    snapshot.forEach((doc) => {
      students.push({ id: doc.id, ...doc.data() });
    });

    res.json(students);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark attendance
exports.markAttendance = async (req, res) => {
  try {
    const { className, subjectName, facultyId, attendanceData } = req.body;

    const today = new Date().toISOString().split("T")[0];
    const documentId = `${today}_${subjectName.replace(/\s/g, "")}_${className}`;

    await db.collection("attendance").doc(documentId).set({
      date: today,
      subject: subjectName,
      class: className,
      facultyId: facultyId,
      students: attendanceData,
    });

    res.json({ message: "Attendance saved successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
