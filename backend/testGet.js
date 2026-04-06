const axios = require('axios');
async function run() {
  const { data } = await axios.get('http://localhost:5000/api/timetable/CE1');
  console.log(data.monday.lec1);
}
run();
