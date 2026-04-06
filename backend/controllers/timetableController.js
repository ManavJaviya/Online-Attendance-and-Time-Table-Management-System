const fs = require('fs');
const path = require('path');
const { db } = require('../config/firebase');
const { logActivity } = require('../utils/activityLogger');

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const LECTURES_ORDER = ['lec1', 'lec2', 'lec3', 'lec4', 'lec5'];

// Listen to Firestore changes and sync them to JSON files automatically
db.collection('timetable').onSnapshot((snapshot) => {
  snapshot.docChanges().forEach((change) => {
    if (change.type === 'added' || change.type === 'modified') {
      const classId = change.doc.id.toUpperCase();
      const rawData = change.doc.data();
      
      // Reconstruct the timetable enforcing correct day and lecture order
      const orderedTimetable = {};
      DAYS_ORDER.forEach(day => {
        if (rawData[day]) {
          orderedTimetable[day] = {};
          LECTURES_ORDER.forEach(lec => {
            if (rawData[day][lec]) {
              orderedTimetable[day][lec] = rawData[day][lec];
            }
          });
          // Also copy any extra lectures if they magically exist but shouldn't be lost
          Object.keys(rawData[day]).forEach(k => {
            if (!orderedTimetable[day][k]) orderedTimetable[day][k] = rawData[day][k];
          });
        }
      });
      // Copy any extra root keys if any
      Object.keys(rawData).forEach(k => {
        if (!orderedTimetable[k]) orderedTimetable[k] = rawData[k];
      });

      const filePath = path.join(__dirname, `../Data/Timetable${classId}.json`);
      try {
        fs.writeFileSync(filePath, JSON.stringify(orderedTimetable, null, 2), 'utf-8');
        console.log(`[Sync] Timetable${classId}.json synchronized from Firestore`);
      } catch (err) {
        console.error(`[Sync Error] Failed to write Timetable${classId}.json:`, err);
      }
    }
  });
}, (error) => {
  console.error('[Sync Error] Firestore timetable onSnapshot failed:', error);
});

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

    // Update Firestore (JSON will be automatically updated via the onSnapshot listener above)

    // Update Firestore
    await db.collection("timetable").doc(classId).set(newTimetable);

    logActivity('timetable', `Timetable updated for ${classId}`, 'Admin', 'hsl(174, 72%, 40%)', '📅');

    return res.status(200).json({ message: "Timetable updated for selected class" });
  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
