// Import Firebase Admin SDK
const admin = require("firebase-admin");

// Import your service account key (used to securely connect to Firebase)
const serviceAccount = require("./config/serviceAccountKey.json");

// Import the students data from students.json
const studentsData = require("./students.json");

// Initialize Firebase Admin using service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create Firestore database reference
const db = admin.firestore();

// Async function to import students
async function importStudents() {
  try {
    // Get the "students" object from students.json
    const students = studentsData.students;

    // Loop through each student ID (STU101, STU102, etc.)
    for (const id in students) {

      // Create document inside "students" collection
      // Document ID = id (example: STU101)
      // Document data = students[id]
      await db.collection("students").doc(id).set(students[id]);

      // Show success message in terminal
      console.log("Added student:", id);
    }

    // Final success message
    console.log("All students imported successfully.");
    process.exit();

  } catch (error) {
    // If error occurs, print it
    console.error("Error importing students:", error);
  }
}

// Call the function
importStudents();
