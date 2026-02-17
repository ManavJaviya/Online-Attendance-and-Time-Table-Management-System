/*
  importStudentLogin.js

  Purpose:
  This script reads studentLoginData.json
  and inserts all student login records
  into the "users" collection in Firestore.

  Used for:
  Bulk creating student authentication records.
*/

const admin = require("firebase-admin");

// Import service account key (Backend Admin Access)
const serviceAccount = require("../config/serviceAccountKey.json");

// Import student login JSON file
const studentLoginData = require("../studentLoginData.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore reference
const db = admin.firestore();

async function importStudents() {
  try {
    // Get "users" object from JSON
    const users = studentLoginData.users;

    // Loop through each student
    for (const id in users) {
      await db.collection("users").doc(id).set(users[id]);
      console.log("Student Added:", id);
    }

    console.log("All student login data imported successfully.");
    process.exit();

  } catch (error) {
    console.error("Error importing students:", error);
  }
}

importStudents();
