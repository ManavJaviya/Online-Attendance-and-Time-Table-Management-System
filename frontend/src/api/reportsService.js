import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getAttendanceReports = async () => {
    const studentsSnap = await getDocs(collection(db, 'students'));
    const attendanceSnap = await getDocs(collection(db, 'attendance'));

    const studentsMap = {};
    studentsSnap.forEach(doc => {
        studentsMap[doc.id] = { id: doc.id, ...doc.data() };
    });

    const studentWise = [];
    let classMetrics = {};
    let subjectMetrics = {};
    let overallAttended = 0;
    let overallTotal = 0;

    attendanceSnap.forEach(doc => {
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

    return {
        studentWise,
        classWise,
        subjectWise,
        overall: overallTotal > 0 ? parseFloat(((overallAttended / overallTotal) * 100).toFixed(1)) : 0
    };
};

export const getTimetableReports = async () => {
    const classTimetables = {};
    const teacherWorkload = {};
    const clashes = [];
    const allClasses = [];

    const timetableSnap = await getDocs(collection(db, "timetable"));
    timetableSnap.forEach(doc => {
        classTimetables[doc.id] = doc.data();
        allClasses.push(doc.id);
    });

    const dayMap = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
    const lecMap = ['lec1', 'lec2', 'lec3', 'lec4', 'lec5'];

    for (const day of dayMap) {
        for (const lec of lecMap) {
            const facSeen = {};
            for (const cls of allClasses) {
                const t = classTimetables[cls];
                if (t && t[day] && t[day][lec]) {
                    const cell = t[day][lec];
                    if (cell.facultyId && cell.facultyId.trim() !== '') {
                        const fac = cell.facultyId;
                        if (!teacherWorkload[fac]) teacherWorkload[fac] = 0;
                        teacherWorkload[fac]++;
                        if (!facSeen[fac]) facSeen[fac] = [];
                        facSeen[fac].push(cls);
                    }
                }
            }
            Object.keys(facSeen).forEach(fac => {
                if (facSeen[fac].length > 1) {
                    clashes.push({ day, lecture: lec, faculty: fac, classes: facSeen[fac] });
                }
            });
        }
    }

    const workloadArr = Object.keys(teacherWorkload).map(t => ({
        facultyId: t,
        lecturesAssigned: teacherWorkload[t]
    }));

    return {
        classTimetables,
        teacherWorkload: workloadArr,
        clashes
    };
};

export const getAnalyticsReports = async () => {
    const sessionsSnap = await getDocs(collection(db, 'class_sessions'));
    
    const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const trendData = {};
    allMonths.forEach(m => trendData[m] = { total: 0, attended: 0 });

    sessionsSnap.forEach(doc => {
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

    const studentsSnap = await getDocs(collection(db, 'students'));
    const attendanceSnap = await getDocs(collection(db, 'attendance'));
    const studentsMap = {};
    studentsSnap.forEach(doc => { studentsMap[doc.id] = { id: doc.id, ...doc.data() }; });

    let performerList = [];
    attendanceSnap.forEach(doc => {
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

    performerList.sort((a, b) => b.percentage - a.percentage);
    const topPerformers = performerList.slice(0, 5);
    const bottomPerformers = performerList.slice().reverse().slice(0, 5);
    const lowAttendanceAlerts = performerList.filter(p => p.percentage < 75);

    return { trends, topPerformers, bottomPerformers, lowAttendanceAlerts };
};
