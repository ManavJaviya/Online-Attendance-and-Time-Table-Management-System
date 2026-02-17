const admin = require("firebase-admin");
const serviceAccount = require("../config/serviceAccountKey.json");
const faculty = require("../faculty.json"); 

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

async function importFaculty() {
  try {
    console.log("Connected project:", serviceAccount.project_id);

    for (const id in faculty) {
      await db.collection("faculty").doc(id).set(faculty[id]);
      console.log("Added faculty:", id);
    }

    console.log("Faculty imported successfully.");
    process.exit(0);

  } catch (error) {
    console.error("IMPORT FAILED:", error);
    process.exit(1);
  }
}

importFaculty();
