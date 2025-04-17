// client/src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDCxdecZb3qufue6W179YBcvJDsxtDTi9k",
  authDomain: "disasterdash-a77b2.firebaseapp.com",
  projectId: "disasterdash-a77b2",
  storageBucket: "disasterdash-a77b2.appspot.com",
  messagingSenderId: "329859835226",
  appId: "1:329859835226:web:b297bc78714128a6a97f63",
  measurementId: "G-NNP2R9MN4D"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
