import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import 'dotenv/config';

const apiKey = process.env.API_KEY;
const authDomain = process.env.AUTH_DOMAIN;
const projectId = process.env.PROJECT_ID;
const storageBucket = process.env.STORAGE_BUCKET;
const messagingSenderId = process.env.SENDER_ID;
const appId = process.env.APP_ID;
const measurementId = process.env.MEASUREMENT_ID;


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

export default {db, app};
