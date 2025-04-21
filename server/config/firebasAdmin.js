import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';

initializeApp({
  credential: applicationDefault(),
  databaseURL: 'https://disasterdash-a77b2-default-rtdb.firebaseio.com/'
});

export const rtdb = getDatabase();
