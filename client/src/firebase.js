// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-b5473.firebaseapp.com",
  projectId: "mern-estate-b5473",
  storageBucket: "mern-estate-b5473.appspot.com",
  messagingSenderId: "492133302612",
  appId: "1:492133302612:web:e41109b002d068271208c1"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);