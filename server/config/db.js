import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import 'dotenv/config';

// const apiKey = process.env.API_KEY;
// const authDomain = process.env.AUTH_DOMAIN;
// const projectId = process.env.PROJECT_ID;
// const storageBucket = process.env.STORAGE_BUCKET;
// const messagingSenderId = process.env.SENDER_ID;
// const appId = process.env.APP_ID;
// const measurementId = process.env.MEASUREMENT_ID;

const apiKey = "AIzaSyDCxdecZb3qufue6W179YBcvJDsxtDTi9k";
const authDomain = "disasterdash-a77b2.firebaseapp.com";
const projectId = "disasterdash-a77b2";
const storageBucket = "disasterdash-a77b2.firebasestorage.app";
const messagingSenderId = "329859835226";
const appId = "1:329859835226:web:b297bc78714128a6a97f63";
const measurementId = "G-NNP2R9MN4D";


const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db, app};
