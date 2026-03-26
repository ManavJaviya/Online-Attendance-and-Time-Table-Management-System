const fs = require('fs');
const path = require('path');

const ACTIVITIES_FILE = path.join(__dirname, '../Data/activities.json');

exports.logActivity = (type, title, user, color, icon) => {
    try {
        if (!fs.existsSync(ACTIVITIES_FILE)) {
            // make sure directory exists
            const dir = path.dirname(ACTIVITIES_FILE);
            if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
            fs.writeFileSync(ACTIVITIES_FILE, '[]', 'utf8');
        }
        
        const data = fs.readFileSync(ACTIVITIES_FILE, 'utf8');
        let activities = [];
        if (data) {
            activities = JSON.parse(data);
        }

        const newActivity = {
            id: Date.now().toString(),
            type,
            title,
            user,
            time: new Date().toISOString(),
            color,
            icon
        };

        activities.unshift(newActivity);

        if (activities.length > 50) {
            activities = activities.slice(0, 50);
        }

        fs.writeFileSync(ACTIVITIES_FILE, JSON.stringify(activities, null, 2), 'utf8');
    } catch (error) {
        console.error("Failed to log activity:", error);
    }
};
