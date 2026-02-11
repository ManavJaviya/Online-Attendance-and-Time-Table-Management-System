// Import Firebase Admin SDK
const admin = require("firebase-admin");

// Import your service account key (used to connect securely to Firebase)
const serviceAccount = require("./config/serviceAccountKey.json");

// Import the subjects data from your JSON file
const subjectsData = require("./subjects.json");

// Initialize Firebase Admin with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Create Firestore database reference
const db = admin.firestore();

// Async function to import subjects into Firestore
async function importSubjects() {
  try {
    // Get the "subjects" object from subjects.json
    const subjects = subjectsData.subjects;

    // Loop through each subject ID (like DataStructures, ComputerNetworks, etc.)
    for (const id in subjects) {

      // Create document inside "subjects" collection
      // Document ID = id (example: DataStructures)
      // Document data = subjects[id]
      await db.collection("subjects").doc(id).set(subjects[id]);

      // Show success message in terminal
      console.log(` Added subject: ${id}`);
    }

    // Final success message after loop completes
    console.log(" All subjects imported successfully!");

    // Exit the script automatically after completion
    process.exit();

  } catch (error) {
    // If any error happens, show it in terminal
    console.error(" Error importing subjects:", error);
  }
}

// Call the function to start importing
importSubjects();
