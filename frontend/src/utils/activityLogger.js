import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

export const logActivityToDb = async (type, title, user, color, icon) => {
  try {
    await addDoc(collection(db, "activities"), {
      type,
      title,
      user,
      color,
      icon,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error logging activity to DB:", error);
  }
};
