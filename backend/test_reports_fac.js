const { db } = require('./config/firebase');

async function test() {
    try {
        const facultyId = 'FAC1'; // Replace with a common ID
        const facultyDoc = await db.collection('faculty').doc(facultyId).get();
        if (!facultyDoc.exists) {
            console.log("Faculty not found");
            return;
        }
        
        console.log("Faculty Data:", facultyDoc.data());
        const facultyData = facultyDoc.data();
        const facSubject = facultyData.subject;
        const facClasses = facultyData.classes || [];

        const studentsRef = await db.collection('students').get();
        const attendanceRef = await db.collection('attendance').get();
        
        const studentsMap = {};
        studentsRef.forEach(doc => { 
            const data = doc.data();
            if (facClasses.includes(data.class)) {
                studentsMap[doc.id] = { id: doc.id, ...data }; 
            }
        });

        console.log("Students Mapped:", Object.keys(studentsMap).length);

        const lowAttendanceStudents = [];
        attendanceRef.forEach(doc => {
            const studentId = doc.id;
            if (studentsMap[studentId]) {
                const data = doc.data();
                const student = studentsMap[studentId];
                
                const subjStats = data[facSubject];
                if (subjStats && subjStats.total > 0) {
                    const percentage = parseFloat(((subjStats.attended / subjStats.total) * 100).toFixed(1));
                    if (percentage <= 75) {
                        lowAttendanceStudents.push({
                            id: studentId
                        });
                    }
                }
            }
        });
        
        console.log("Low attendance students:", lowAttendanceStudents.length);
        console.log("Success");
    } catch (error) {
        console.error("Test error:", error);
    }
}

test();
