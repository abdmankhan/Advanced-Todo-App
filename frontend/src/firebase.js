// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCaRsn2wie-351OC7Q6_8Q-FnIpPcNGU-o",
  authDomain: "myawesome-3db1b.firebaseapp.com",
  projectId: "myawesome-3db1b",
  storageBucket: "myawesome-3db1b.firebasestorage.app",
  messagingSenderId: "424781709426",
  appId: "1:424781709426:web:27bd060670d2a846e542eb",
  measurementId: "G-KHC9C67QVL",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider, signInWithPopup };