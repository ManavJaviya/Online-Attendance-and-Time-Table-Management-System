const fs = require('fs');
const path = require('path');
const { db } = require('../config/firebase');
const { logActivity } = require('../utils/activityLogger');

// Utility to read and write JSON synchronously
const readJson = (filename) => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, '../Data', filename), 'utf8'));
};

const writeJson = (filename, data) => {
    fs.writeFileSync(path.join(__dirname, '../Data', filename), JSON.stringify(data, null, 2), 'utf8');
};

exports.syncStudents = async (req, res) => {
    try {
        const { students } = req.body;
        if (!Array.isArray(students)) {
            return res.status(400).json({ error: "Invalid data format. Expected an array of students." });
        }

        const loginData = readJson('studentLoginData.json');
        const studentsData = readJson('students.json');
        
        loginData.users = loginData.users || {};
        studentsData.students = studentsData.students || {};

        const uploadedStudentsMap = {};
        for (const s of students) {
            if (s.username) {
                uploadedStudentsMap[s.username] = s;
            }
        }

        const existingUserIds = Object.keys(studentsData.students);

        let added = 0;
        let removed = 0;
        let unchanged = 0;

        // 1. Remove students not in the uploaded file
        for (const existingId of existingUserIds) {
            const existingStudent = studentsData.students[existingId];
            const uploadedStudent = uploadedStudentsMap[existingId];

            if (!uploadedStudent) {
                delete loginData.users[existingId];
                delete studentsData.students[existingId];
                db.collection('users').doc(existingId).delete().catch(e => console.error(e));
                db.collection('students').doc(existingId).delete().catch(e => console.error(e));
                removed++;
            } else if (existingStudent.class === uploadedStudent.class) {
                unchanged++;
            }
        }

        // 2. Add or Overwrite students
        for (const userId of Object.keys(uploadedStudentsMap)) {
            const uploadedStudent = uploadedStudentsMap[userId];
            const existingStudent = studentsData.students[userId];

            if (!existingStudent || existingStudent.class !== uploadedStudent.class) {
                const { name, email, password, rollno, department, class: className } = uploadedStudent;
                
                loginData.users[userId] = {
                    email: email || `${userId.toLowerCase()}@example.com`,
                    password: password || 'defaultPass123',
                    role: "student",
                    userId,
                    department: department || "Unassigned"
                };

                studentsData.students[userId] = {
                    name: name || "Unknown",
                    rollNo: rollno || "",
                    class: className || "",
                    semester: existingStudent ? existingStudent.semester : 1,
                    department: department || "Unassigned"
                };

                // run async non-blocking for firebase saves to speed up endpoint
                db.collection('users').doc(userId).set(loginData.users[userId]).catch(e => console.error(e));
                db.collection('students').doc(userId).set(studentsData.students[userId]).catch(e => console.error(e));
                added++;
            }
        }

        writeJson('studentLoginData.json', loginData);
        writeJson('students.json', studentsData);

        logActivity('user', `Student data synced via file upload. Added: ${added}, Removed: ${removed}`, 'Admin', 'hsl(38, 92%, 50%)', '📤');

        res.status(200).json({ message: `Sync complete. Added/Updated: ${added}. Removed: ${removed}. Unchanged: ${unchanged}.` });

    } catch (error) {
        console.error("Sync Students Error:", error);
        res.status(500).json({ error: "Failed to sync student data." });
    }
};

exports.addStudent = async (req, res) => {
    try {
        const { userId, name, email, password, department, className, rollNo, semester } = req.body;
        if (!userId || !name || !email || !password || !department) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Update studentLoginData.json
        const loginData = readJson('studentLoginData.json');
        loginData.users = loginData.users || {};
        loginData.users[userId] = {
            email,
            password,
            role: "student",
            userId,
            department
        };
        writeJson('studentLoginData.json', loginData);

        // 2. Update students.json
        const studentsData = readJson('students.json');
        studentsData.students = studentsData.students || {};
        studentsData.students[userId] = {
            name,
            rollNo: rollNo || "",
            class: className || "",
            semester: semester || 1,
            department
        };
        writeJson('students.json', studentsData);

        // 3. Update Firebase 'users' collection (for authController)
        await db.collection('users').doc(userId).set({
            email,
            password,
            role: "student",
            userId,
            department
        });

        // 4. Update Firebase 'students' collection (for StudentDashboard)
        await db.collection('students').doc(userId).set({
            name,
            rollNo: rollNo || "",
            class: className || "",
            semester: semester || 1,
            department
        });

        logActivity('user', `New student added (${name})`, 'Admin', 'hsl(234, 89%, 54%)', '👥');

        res.status(200).json({ message: "Student added successfully" });
    } catch (error) {
        console.error("Add Student Error:", error);
        res.status(500).json({ error: "Failed to add student" });
    }
};

exports.removeStudent = async (req, res) => {
    try {
        const { id } = req.params;
        
        // 1. Remove from JSONs
        const loginData = readJson('studentLoginData.json');
        if (loginData.users && loginData.users[id]) delete loginData.users[id];
        writeJson('studentLoginData.json', loginData);

        const studentsData = readJson('students.json');
        if (studentsData.students && studentsData.students[id]) delete studentsData.students[id];
        writeJson('students.json', studentsData);

        // 2. Remove from Firebase
        await db.collection('users').doc(id).delete();
        await db.collection('students').doc(id).delete();

        res.status(200).json({ message: "Student removed successfully" });
    } catch (error) {
        console.error("Remove Student Error:", error);
        res.status(500).json({ error: "Failed to remove student" });
    }
};

exports.addFaculty = async (req, res) => {
    try {
        const { userId, name, email, password, subject, classes } = req.body;
        if (!userId || !name || !email || !password) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // 1. Update facultyLoginData.json
        const loginData = readJson('facultyLoginData.json');
        loginData.users = loginData.users || {};
        loginData.users[userId] = {
            email,
            password,
            role: "faculty",
            userId
        };
        writeJson('facultyLoginData.json', loginData);

        // 2. Update faculty.json
        const facultyData = readJson('faculty.json');
        facultyData[userId] = {
            name,
            subject: subject || "Unassigned",
            classes: classes || []
        };
        writeJson('faculty.json', facultyData);

        // 3. Firebase users
        await db.collection('users').doc(userId).set({
            email,
            password,
            role: "faculty",
            userId
        });

        // 4. Firebase faculty
        await db.collection('faculty').doc(userId).set({
            name,
            subject: subject || "Unassigned",
            classes: classes || []
        });

        logActivity('user', `New faculty member added (${name})`, 'Admin', 'hsl(234, 89%, 54%)', '👤');

        res.status(200).json({ message: "Faculty added successfully" });
    } catch (error) {
        console.error("Add Faculty Error:", error);
        res.status(500).json({ error: "Failed to add faculty" });
    }
};

exports.removeFaculty = async (req, res) => {
    try {
        const { id } = req.params;
        
        const loginData = readJson('facultyLoginData.json');
        if (loginData.users && loginData.users[id]) {
            delete loginData.users[id];
            writeJson('facultyLoginData.json', loginData);
        } else if (loginData[id]) {
            // Check top level just in case
            delete loginData[id];
            writeJson('facultyLoginData.json', loginData);
        }

        const facultyData = readJson('faculty.json');
        if (facultyData[id]) {
            delete facultyData[id];
            writeJson('faculty.json', facultyData);
        }

        await db.collection('users').doc(id).delete();
        await db.collection('faculty').doc(id).delete();

        res.status(200).json({ message: "Faculty removed successfully" });
    } catch (error) {
        console.error("Remove Faculty Error:", error);
        res.status(500).json({ error: "Failed to remove faculty" });
    }
};
