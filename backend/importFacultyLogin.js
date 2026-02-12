/*
  importFacultyLogin.js

  Purpose:
  This script reads facultyLoginData.json
  and inserts faculty authentication records
  into the "users" collection.

  Used for:
  Bulk creating faculty login accounts.
*/

const admin = require("firebase-admin");

// Import service account key
const serviceAccount = require("./config/serviceAccountKey.json");

// Import faculty login JSON file
const facultyLoginData = require("./facultyLoginData.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Firestore reference
const db = admin.firestore();

async function importFaculty() {
  try {
    const users = facultyLoginData.users;

    // Loop through each faculty entry
    for (const id in users) {
      await db.collection("users").doc(id).set(users[id]);
      console.log("Faculty Added:", id);
    }

    console.log("All faculty login data imported successfully.");
    process.exit();

  } catch (error) {
    console.error("Error importing faculty:", error);
  }
}

importFaculty();
