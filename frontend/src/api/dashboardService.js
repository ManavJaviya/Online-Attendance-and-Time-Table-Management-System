import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getDashboardStats = async () => {
    // 1. Total Students and Departments
    const studentsSnap = await getDocs(collection(db, "students"));
    let totalStudents = 0;
    const departmentsCount = {
        "Computer Science": 0,
        "Mechanical": 0,
        "Electronics": 0,
        "Civil": 0,
        "ICT": 0
    };

    studentsSnap.forEach(doc => {
        totalStudents++;
        const dept = doc.data().department || "Unassigned";
        if (departmentsCount[dept] === undefined) departmentsCount[dept] = 0;
        departmentsCount[dept]++;
    });

    // 2. Total Faculty
    const facultySnap = await getDocs(collection(db, "faculty"));
    const totalFaculty = facultySnap.size;

    // 3. Active Subjects
    const subjectsSnap = await getDocs(collection(db, "timetable"));
    const uniqueSubjects = new Set();
    subjectsSnap.forEach(doc => {
        const data = doc.data();
        Object.values(data).forEach(dayData => {
            Object.values(dayData).forEach(lecData => {
                if (lecData && lecData.subject && lecData.subject.trim() !== '') {
                    uniqueSubjects.add(lecData.subject);
                }
            });
        });
    });
    const activeSubjects = uniqueSubjects.size;

    // 4. Average Attendance and Weekly Trends
    let totalPresent = 0;
    let totalRecords = 0;
    const msPerDay = 24 * 60 * 60 * 1000;
    const now = new Date();
    const dailyStats = {};

    for (let i = 0; i < 21; i++) {
        const d = new Date(now.getTime() - i * msPerDay);
        const dateStr = d.toISOString().split("T")[0];
        dailyStats[dateStr] = { total: 0, present: 0 };
    }

    const classSessionsSnap = await getDocs(collection(db, "class_sessions"));
    classSessionsSnap.forEach((doc) => {
        const data = doc.data();
        let docTotal = 0;
        let docPresent = 0;
        
        if (data.attendance && typeof data.attendance === 'object') {
            Object.values(data.attendance).forEach(isPresent => {
                docTotal++;
                if (isPresent === true || isPresent === "true" || isPresent === "Present") docPresent++;
            });
        }

        let dateKey = null;
        if (data.date && typeof data.date === 'string') {
            dateKey = data.date.split("T")[0];
        }

        if (dateKey && dailyStats[dateKey]) {
            dailyStats[dateKey].total += docTotal;
            dailyStats[dateKey].present += docPresent;
        }

        totalRecords += docTotal;
        totalPresent += docPresent;
    });

    let avgAttendance = 0;
    if (totalRecords > 0) {
        avgAttendance = ((totalPresent / totalRecords) * 100).toFixed(1);
    }

    // Calculate weekly trend
    const weeklyTrend = [];
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    
    const dayOfWeek = now.getDay();
    const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const currentMonday = new Date(now.getTime() - diffToMonday * msPerDay);

    let currentWeekTotal = 0;
    let currentWeekPresent = 0;
    
    for (let i = 0; i < 6; i++) {
        const d = new Date(currentMonday.getTime() + i * msPerDay);
        const dateStr = d.toISOString().split("T")[0];
        
        let percentage = 0;
        if (dailyStats[dateStr] && dailyStats[dateStr].total > 0) {
            currentWeekTotal += dailyStats[dateStr].total;
            currentWeekPresent += dailyStats[dateStr].present;
            percentage = Math.round((dailyStats[dateStr].present / dailyStats[dateStr].total) * 100);
        }
        weeklyTrend.push({ day: dayNames[d.getDay()], percentage });
    }

    const prevMonday = new Date(currentMonday.getTime() - 7 * msPerDay);
    let prevWeekTotal = 0;
    let prevWeekPresent = 0;
    
    for (let i = 0; i < 6; i++) {
        const d = new Date(prevMonday.getTime() + i * msPerDay);
        const dateStr = d.toISOString().split("T")[0];
        if (dailyStats[dateStr]) {
            prevWeekTotal += dailyStats[dateStr].total;
            prevWeekPresent += dailyStats[dateStr].present;
        }
    }

    let currentWeekAvg = 0;
    if (currentWeekTotal > 0) currentWeekAvg = Math.round((currentWeekPresent / currentWeekTotal) * 100);

    let prevWeekAvg = 0;
    if (prevWeekTotal > 0) prevWeekAvg = Math.round((prevWeekPresent / prevWeekTotal) * 100);

    let trendChange = 0;
    if (prevWeekTotal > 0) trendChange = currentWeekAvg - prevWeekAvg;
    else if (currentWeekTotal > 0) trendChange = currentWeekAvg; 
    
    let trendChangeString = trendChange >= 0 ? `+${trendChange}%` : `${trendChange}%`;

    return {
        totalStudents,
        totalFaculty,
        activeSubjects,
        avgAttendance: parseFloat(avgAttendance),
        departments: departmentsCount,
        weeklyTrend,
        trendChange: trendChangeString
    };
};

export const getLowAttendanceStudents = async () => {
    const studentsSnap = await getDocs(collection(db, "students"));
    const studentsData = {};
    studentsSnap.forEach(doc => {
        studentsData[doc.id] = doc.data();
    });

    const attendanceSnap = await getDocs(collection(db, "attendance"));
    const attendanceData = {};
    attendanceSnap.forEach(doc => {
        attendanceData[doc.id] = doc.data();
    });

    const result = [];
    Object.keys(studentsData).forEach(studentId => {
        const student = studentsData[studentId];
        let sTotal = 0;
        let sAttended = 0;
        let subject = "General";

        if (attendanceData[studentId]) {
            const studentAtt = attendanceData[studentId];
            Object.keys(studentAtt).forEach(subjKey => {
                if (studentAtt[subjKey] && typeof studentAtt[subjKey].total === 'number') {
                    sTotal += studentAtt[subjKey].total;
                    sAttended += studentAtt[subjKey].attended;
                    subject = subjKey;
                }
            });
        }
        
        const percentage = sTotal > 0 ? Math.round((sAttended / sTotal) * 100) : 100;
        result.push({
            id: studentId,
            rollNo: student.rollNo || "",
            name: student.name || "",
            class: student.class || "",
            subject: subject,
            totalClasses: sTotal,
            present: sAttended,
            attendance: percentage
        });
    });

    return result;
};
