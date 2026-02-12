// Import required Firebase functions
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/*
  Firebase Configuration
  This connects your React frontend to your Firebase project.
  These keys are safe to use in frontend.
*/

const firebaseConfig = {
  apiKey: "AIzaSyCMC0K9pdRA7zPZDypzth9Dy7yuBWv3pag",
  authDomain: "attendanceandttmanagement.firebaseapp.com",
  projectId: "attendanceandttmanagement",
  storageBucket: "attendanceandttmanagement.firebasestorage.app",
  messagingSenderId: "643987018498",
  appId: "1:643987018498:web:d865e48c35382662eda81b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore database
export const db = getFirestore(app);
