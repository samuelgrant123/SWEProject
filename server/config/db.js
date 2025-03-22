import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCA5bJzNpPLaRUtTW9oF1lqo04_-zrG5C0",
    authDomain: "introsweproject.firebaseapp.com",
    projectId: "introsweproject",
    storageBucket: "introsweproject.firebasestorage.app",
    messagingSenderId: "484900005716",
    appId: "1:484900005716:web:6697636dcdb87cdea18ac1",
    measurementId: "G-LEKB4LE4L5"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
