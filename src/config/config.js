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

console.log(FIREBASE_API_KEY);
console.log(AUTH_DOMAIN);
console.log(PROJECT_ID);
console.log(STORAGE_BUCKET);
console.log(MESSAGING_SENDER_ID);
console.log(DATABASE_URL);
console.log(APP_ID);
console.log(MEASUREMENT_ID);

export const firebaseConfig = {
  // apiKey: "AIzaSyC0ei8o_oog8s-0LjvK5q63oj2ydBFjWk8",
  // authDomain: "handyman-plus.firebaseapp.com",
  // databaseURL:
  //   "https://handyman-plus-default-rtdb.asia-southeast1.firebasedatabase.app",
  // projectId: "handyman-plus",
  // storageBucket: "handyman-plus.appspot.com",
  // messagingSenderId: "876177652588",
  // appId: "1:876177652588:web:97033d6b546bef8d6c5149",
  // measurementId: "G-8FKV7YLBCQ",

  apiKey: FIREBASE_API_KEY,
  authDomain: AUTH_DOMAIN,
  databaseURL: DATABASE_URL,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASUREMENT_ID,
};

// FIREBASE_API_KEY     = AIzaSyC0ei8o_oog8s-0LjvK5q63oj2ydBFjWk8
// AUTH_DOMAIN = handyman-plus.firebaseapp.com
// PROJECT_ID = handyman-plus
// STORAGE_BUCKET = handyman-plus.appspot.com
// MESSAGING_SENDER_ID = 876177652588
// DATABASE_URL = https://handyman-plus-default-rtdb.asia-southeast1.firebasedatabase.app/
// APP_ID = 1:876177652588:web:97033d6b546bef8d6c5149
// MEASUREMENT_ID = G-8FKV7YLBCQ
// PAYMONGO_API_KEY = c2tfbGl2ZV9kUWdadjZwTERCQnF5aTM4Y1Vkc2M1VTg6
