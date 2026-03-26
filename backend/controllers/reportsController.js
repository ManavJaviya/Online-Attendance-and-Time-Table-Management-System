const fs = require('fs');
const path = require('path');
const { db } = require('../config/firebase');

exports.getAttendanceReports = async (req, res) => {
    try {
        const studentsRef = await db.collection('students').get();
        const attendanceRef = await db.collection('attendance').get();
        const sessionsRef = await db.collection('class_sessions').get();

        const studentsMap = {};
        studentsRef.forEach(doc => {
            studentsMap[doc.id] = { id: doc.id, ...doc.data() };
        });

        const studentWise = [];
        let classMetrics = {};
        let subjectMetrics = {};
        let overallAttended = 0;
        let overallTotal = 0;

        attendanceRef.forEach(doc => {
            const data = doc.data();
            const studentId = doc.id;
            
            // if this is the student aggregate schema
            if (studentsMap[studentId]) {
                const student = studentsMap[studentId];
                let sTotal = 0;
                let sAttended = 0;
                
                Object.keys(data).forEach(subj => {
                    const stats = data[subj];
                    if (stats && stats.total) {
                        sTotal += stats.total;
                        sAttended += stats.attended;

                        if (!subjectMetrics[subj]) subjectMetrics[subj] = { subject: subj, total: 0, attended: 0 };
                        subjectMetrics[subj].total += stats.total;
                        subjectMetrics[subj].attended += stats.attended;
                    }
                });

                overallTotal += sTotal;
                overallAttended += sAttended;

                const cName = student.class || 'Unassigned';
                if (!classMetrics[cName]) classMetrics[cName] = { className: cName, total: 0, attended: 0 };
                classMetrics[cName].total += sTotal;
                classMetrics[cName].attended += sAttended;

                const percentage = sTotal > 0 ? ((sAttended / sTotal) * 100).toFixed(1) : 0;
                studentWise.push({
                    id: studentId,
                    name: student.name,
                    rollNo: student.rollNo,
                    className: cName,
                    totalLectures: sTotal,
                    attendedLectures: sAttended,
                    percentage: parseFloat(percentage)
                });
            }
        });

        const classWise = Object.values(classMetrics).map(c => ({
            className: c.className,
            percentage: c.total > 0 ? parseFloat(((c.attended / c.total) * 100).toFixed(1)) : 0
        }));

        const subjectWise = Object.values(subjectMetrics).map(s => ({
            subject: s.subject,
            percentage: s.total > 0 ? parseFloat(((s.attended / s.total) * 100).toFixed(1)) : 0
        }));

        res.status(200).json({
            studentWise,
            classWise,
            subjectWise,
            overall: overallTotal > 0 ? parseFloat(((overallAttended / overallTotal) * 100).toFixed(1)) : 0
        });

    } catch (error) {
        console.error("Attendance reports error", error);
        res.status(500).json({ error: "Failed to fetch attendance reports" });
    }
};

exports.getTimetableReports = async (req, res) => {
    try {
        const allClasses = ['CE1', 'CE2', 'CE3', 'CE4', 'CE5'];
        const classTimetables = {};
        const teacherWorkload = {};
        const clashes = [];

        // Parse local JSONs
        for (const cls of allClasses) {
            const filePath = path.join(__dirname, `../Data/Timetable${cls}.json`);
            if (fs.existsSync(filePath)) {
                classTimetables[cls] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
            }
        }

        // Compute teacher workloads and clashes
        const dayMap = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
        const lecMap = ['lec1', 'lec2', 'lec3', 'lec4', 'lec5'];

        for (const day of dayMap) {
            for (const lec of lecMap) {
                const facSeen = {}; // to detect overlaps: { "FAC201": ["CE1"] }

                for (const cls of allClasses) {
                    const t = classTimetables[cls];
                    if (t && t[day] && t[day][lec]) {
                        const cell = t[day][lec];
                        if (cell.facultyId && cell.facultyId.trim() !== '') {
                            const fac = cell.facultyId;
                            
                            // Workload tracking
                            if (!teacherWorkload[fac]) teacherWorkload[fac] = 0;
                            teacherWorkload[fac]++;

                            // Clash mapping
                            if (!facSeen[fac]) facSeen[fac] = [];
                            facSeen[fac].push(cls);
                        }
                    }
                }

                // Push clashes logic
                Object.keys(facSeen).forEach(fac => {
                    if (facSeen[fac].length > 1) {
                        clashes.push({
                            day,
                            lecture: lec,
                            faculty: fac,
                            classes: facSeen[fac] // Now contains ["CE1", "CE2", "CE3"] etc.
                        });
                    }
                });
            }
        }

        // Format workload into array map
        const workloadArr = Object.keys(teacherWorkload).map(t => ({
            facultyId: t,
            lecturesAssigned: teacherWorkload[t]
        }));

        res.status(200).json({
            classTimetables,
            teacherWorkload: workloadArr,
            clashes
        });

    } catch (error) {
        console.error("Timetable reports error", error);
        res.status(500).json({ error: "Failed to fetch timetable reports" });
    }
};

exports.getAnalyticsReports = async (req, res) => {
    try {
        // Attendance Trends (Graph data)
        const sessionsRef = await db.collection('class_sessions').get();
        
        const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const trendData = {};
        allMonths.forEach(m => trendData[m] = { total: 0, attended: 0 });

        sessionsRef.forEach(doc => {
            const d = doc.data();
            if (d.date && d.attendance) {
                const mIndex = new Date(d.date).getMonth();
                const mKey = allMonths[mIndex];
                
                if (mKey) {
                    let sAttended = 0;
                    let sTotal = 0;
                    Object.values(d.attendance).forEach(val => {
                        sTotal++;
                        if (val === true || val === 'true') sAttended++;
                    });

                    trendData[mKey].total += sTotal;
                    trendData[mKey].attended += sAttended;
                }
            }
        });

        let trends = allMonths.map(m => ({
            name: m,
            attendance: trendData[m].total > 0 ? parseFloat(((trendData[m].attended / trendData[m].total) * 100).toFixed(1)) : 0
        }));

        // Low attendance & Performers
        const studentsRef = await db.collection('students').get();
        const attendanceRef = await db.collection('attendance').get();
        const studentsMap = {};
        studentsRef.forEach(doc => { studentsMap[doc.id] = { id: doc.id, ...doc.data() }; });

        let performerList = [];

        attendanceRef.forEach(doc => {
            const data = doc.data();
            const studentId = doc.id;
            if (studentsMap[studentId]) {
                const student = studentsMap[studentId];
                let sTotal = 0;
                let sAttended = 0;
                Object.keys(data).forEach(subj => {
                    const stats = data[subj];
                    if (stats && stats.total) {
                        sTotal += stats.total;
                        sAttended += stats.attended;
                    }
                });

                if (sTotal > 0) {
                    const percentage = parseFloat(((sAttended / sTotal) * 100).toFixed(1));
                    performerList.push({
                        id: studentId,
                        name: student.name,
                        percentage,
                        className: student.class || 'Unassigned'
                    });
                }
            }
        });

        // Filter valid performers
        performerList.sort((a, b) => b.percentage - a.percentage);

        const topPerformers = performerList.slice(0, 5);
        const bottomPerformers = performerList.slice().reverse().slice(0, 5);
        const lowAttendanceAlerts = performerList.filter(p => p.percentage < 75);

        res.status(200).json({
            trends,
            topPerformers,
            bottomPerformers,
            lowAttendanceAlerts
        });

    } catch (error) {
        console.error("Analytics reports error", error);
        res.status(500).json({ error: "Failed to fetch analytics reports" });
    }
};
