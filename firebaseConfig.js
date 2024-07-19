// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDDjI7yScWWii4x3kptJfG23jfyyRR-45k",
  authDomain: "hdb4-88d11.firebaseapp.com",
  projectId: "hdb4-88d11",
  storageBucket: "hdb4-88d11.appspot.com",
  messagingSenderId: "829021793366",
  appId: "1:829021793366:web:60dc8ecf1a5a862e4d9ff7",
  measurementId: "G-FS9VKQ1R2H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
