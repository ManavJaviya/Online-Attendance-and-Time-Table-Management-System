const { db } = require('./config/firebase');
const fs = require('fs');

async function test() {
  try {
    const doc = await db.collection("timetable").doc("CE1").get();
    fs.writeFileSync('testDbResult.json', JSON.stringify(doc.data(), null, 2));
  } catch (e) {
    console.error(e);
  }
}

test();
