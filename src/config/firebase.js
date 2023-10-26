import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyAKuz7qMngtGeMdXnbGw4aPfLjKDX_3GME",
  authDomain: "expense-tracker-f5dfd.firebaseapp.com",
  projectId: "expense-tracker-f5dfd",
  storageBucket: "expense-tracker-f5dfd.appspot.com",
  messagingSenderId: "824282038438",
  appId: "1:824282038438:web:5d268f6ed27ee467fef467",
  measurementId: "G-PG97EGPLKP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);