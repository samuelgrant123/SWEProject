import { collection, getDocs } from "firebase/firestore"; // Import collection
import db from './server/config/db.js';

const users = collection(db, "users");

getDocs(users)
  .then(snapshot => {
    console.log("Firebase connected successfully! Retrieved users:");
    snapshot.forEach(doc => console.log(doc.id, "=>", doc.data()));
  })
  .catch(error => {
    console.error("Error connecting to Firebase: ", error);
  });