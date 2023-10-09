// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database"


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyB7o6ASL3E9qhlsKWOh3F3wWN_WNlMTlPA",
  authDomain: "falldetectionapp-56e73.firebaseapp.com",
  databaseURL: "https://falldetectionapp-56e73-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "falldetectionapp-56e73",
  storageBucket: "falldetectionapp-56e73.appspot.com",
  messagingSenderId: "1035385034655",
  appId: "1:1035385034655:web:442b92bb6c15a44061cfaa",
  measurementId: "G-R1LNR46SSR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getDatabase(app);


