// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBl2tUg32jMkujG5PKOsPvF9IvrEiCk9Vc",
  authDomain: "ecosmartghv2.firebaseapp.com",
  projectId: "ecosmartghv2",
  storageBucket: "ecosmartghv2.firebasestorage.app",
  messagingSenderId: "717462674320",
  appId: "1:717462674320:web:6f0941273aff8981c7b115",
  measurementId: "G-53XJHHMYMC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);