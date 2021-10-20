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
  // prod
  //   apiKey: "AIzaSyC0ei8o_oog8s-0LjvK5q63oj2ydBFjWk8",
  //   authDomain: "handyman-plus.firebaseapp.com",
  //   projectId: "handyman-plus",
  //   storageBucket: "handyman-plus.appspot.com",
  //   messagingSenderId: "876177652588",
  //   databaseURL:
  //     "https://handyman-plus-default-rtdb.asia-southeast1.firebasedatabase.app/",
  //   appId: "1:876177652588:web:97033d6b546bef8d6c5149",
  //   measurementId: "G-8FKV7YLBCQ",
  // dev
  apiKey: FIREBASE_API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  databaseURL: DATABASE_URL,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};
