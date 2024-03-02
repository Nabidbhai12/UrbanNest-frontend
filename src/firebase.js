// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "urbannest-3c24c.firebaseapp.com",
  projectId: "urbannest-3c24c",
  storageBucket: "urbannest-3c24c.appspot.com",
  messagingSenderId: "620710002787",
  appId: "1:620710002787:web:1830fb7663a56f19d8f856",
  measurementId: "G-744SPKR5BP"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

