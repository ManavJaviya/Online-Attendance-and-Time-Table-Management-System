const fs = require('fs');
const state = {
  monday: {
    lec1: { subject: "Data Structures", facultyId: "FAC201", time: "08:00 – 09:00" },
    lec2: { subject: "Computer Networks", facultyId: "FAC202", time: "09:00 – 10:00" },
  },
  tuesday: {
    lec1: { subject: "Computer Networks", facultyId: "FAC202", time: "08:00 – 09:00" },
    lec2: { subject: "Software Engineering", facultyId: "FAC203", time: "09:00 – 10:00" },
  }
};

let timetable = JSON.parse(JSON.stringify(state));

const handleInputChange = (day, lec, field, value) => {
  timetable = {
    ...timetable,
    [day]: {
      ...timetable[day],
      [lec]: {
        ...timetable[day][lec],
        [field]: value
      }
    }
  };
};

handleInputChange("monday", "lec1", "subject", "Computer Networks");
handleInputChange("monday", "lec2", "subject", "Data Structures");

fs.writeFileSync('output.json', JSON.stringify(timetable, null, 2), 'utf8');
