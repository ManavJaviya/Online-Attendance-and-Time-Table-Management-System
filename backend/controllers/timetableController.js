const fs = require('fs');
const path = require('path');
const { db } = require('../config/firebase');
const { logActivity } = require('../utils/activityLogger');


exports.getTimetable = async (req, res) => {
  try {
    const classId = req.params.classId.toUpperCase();
    const filePath = path.join(__dirname, `../Data/Timetable${classId}.json`);
    
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return res.status(200).json(JSON.parse(data));
    } else {
      return res.status(404).json({ message: "Timetable not found for " + classId });
    }
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.updateTimetable = async (req, res) => {
  try {
    const classId = req.params.classId.toUpperCase();
    const newTimetable = req.body;
    const filePath = path.join(__dirname, `../Data/Timetable${classId}.json`);

    // Update JSON file
    fs.writeFileSync(filePath, JSON.stringify(newTimetable, null, 2), 'utf-8');

    // Update Firestore
    await db.collection("timetable").doc(classId).set(newTimetable);

    logActivity('timetable', `Timetable updated for ${classId}`, 'Admin', 'hsl(174, 72%, 40%)', '📅');

    return res.status(200).json({ message: "Timetable updated for selected class" });
  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
