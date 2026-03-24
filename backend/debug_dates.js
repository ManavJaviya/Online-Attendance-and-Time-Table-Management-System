const fs = require('fs');
const { db } = require('./config/firebase');

async function debug() {
    const snapshot = await db.collection("attendance").get();
    let dates = {};
    
    snapshot.forEach(doc => {
        const data = doc.data();
        let d = data.date;
        if (typeof d === 'string') d = d.split('T')[0];
        if (!dates[d]) dates[d] = 0;
        dates[d]++;
    });
    
    fs.writeFileSync('debug_dates.json', JSON.stringify(dates, null, 2), 'utf-8');
}

debug().catch(console.error);
