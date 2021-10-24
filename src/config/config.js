import {
  FIREBASE_API_KEY,
  AUTH_DOMAIN,
  PROJECT_ID,
  STORAGE_BUCKET,
  MESSAGING_SENDER_ID,
  DATABASE_URL,
  APP_ID,
  MEASUREMENT_ID,
} from "@env";

FIREBASE_API_KEY;
AUTH_DOMAIN;
PROJECT_ID;
STORAGE_BUCKET;
MESSAGING_SENDER_ID;
DATABASE_URL;
APP_ID;
MEASUREMENT_ID;

export const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
