const fs = require('fs');
let timetable = JSON.parse(fs.readFileSync('d:\\Online-Attendance-and-Time-Table-Management-System\\backend\\Data\\TimetableCE1.json', 'utf8'));

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

handleInputChange('monday', 'lec1', 'subject', 'Computer Networks');
handleInputChange('monday', 'lec1', 'facultyId', 'FAC202');
handleInputChange('monday', 'lec2', 'subject', 'Data Structures');
handleInputChange('monday', 'lec2', 'facultyId', 'FAC201');

fs.writeFileSync('testStateResult.json', JSON.stringify(timetable.monday, null, 2));
