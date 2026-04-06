const axios = require('axios');
const fs = require('fs');

async function testPut() {
  try {
    let timetable = JSON.parse(fs.readFileSync('d:\\Online-Attendance-and-Time-Table-Management-System\\backend\\Data\\TimetableCE1.json', 'utf8'));

    // Swap Monday lec1 and lec2 subjects
    let tempSubject = timetable.monday.lec1.subject;
    let tempFaculty = timetable.monday.lec1.facultyId;

    timetable.monday.lec1.subject = timetable.monday.lec2.subject;
    timetable.monday.lec1.facultyId = timetable.monday.lec2.facultyId;
    
    timetable.monday.lec2.subject = tempSubject;
    timetable.monday.lec2.facultyId = tempFaculty;

    console.log("Sending PUT request...");
    const res = await axios.put('http://localhost:5000/api/timetable/CE1', timetable);
    console.log("Response:", res.data);
  } catch (err) {
    console.error("Error:", err.response ? err.response.data : err.message);
  }
}

testPut();
