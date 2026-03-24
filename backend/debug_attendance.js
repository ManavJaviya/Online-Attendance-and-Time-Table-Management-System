const fs = require('fs');
const { db } = require('./config/firebase');

async function debug() {
    const snapshot = await db.collection("attendance").get();
    let records = [];
    
    snapshot.forEach(doc => {
        const data = doc.data();
        records.push({
            id: doc.id,
            date: data.date,
            hasStudentsArray: Array.isArray(data.students),
            hasAttendanceObj: data.hasOwnProperty('attendance') && typeof data.attendance === 'object' && !Array.isArray(data.attendance),
        });
    });
    
    const out = {
      total: records.length,
      sample: records.slice(-10)
    };
    
    fs.writeFileSync('debug_output_utf8.json', JSON.stringify(out, null, 2), 'utf-8');
}

debug().catch(console.error);
