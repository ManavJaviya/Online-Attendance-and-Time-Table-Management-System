// Import Firebase Admin SDK
const admin = require("firebase-admin");

// Import your service account key
const serviceAccount = require("./config/serviceAccountKey.json");

// Import faculty data from faculty.json
const facultyData = require("./faculty.json");

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create Firestore reference
const db = admin.firestore();

// Async function to import faculty
async function importFaculty() {
  try {
    // Get the "faculty" object from faculty.json
    const faculty = facultyData.faculty;

    // Loop through each faculty ID (FAC201, FAC202, etc.)
    for (const id in faculty) {

      // Create document inside "faculty" collection
      // Document ID = id (example: FAC201)
      // Document data = faculty[id]
      await db.collection("faculty").doc(id).set(faculty[id]);

      // Show success message in terminal
      console.log("Added faculty:", id);
    }

    // Final success message
    console.log("All faculty imported successfully.");
    process.exit();

  } catch (error) {
    // If error occurs, print it
    console.error("Error importing faculty:", error);
  }
}

// Call the function
importFaculty();
