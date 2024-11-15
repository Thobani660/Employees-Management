// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDlYNePH7t2eFjxRq8X2eoyNlyqm7RPbCY",
  authDomain: "employeesmanagement-fbcfb.firebaseapp.com",
  projectId: "employeesmanagement-fbcfb",
  storageBucket: "employeesmanagement-fbcfb.firebasestorage.app",
  messagingSenderId: "6341530097",
  appId: "1:6341530097:web:bdda21253b8c6930097450",
  measurementId: "G-81HVJYGYXT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Firebase Authentication

export { auth };  // Export auth for use in other files
