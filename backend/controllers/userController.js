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
