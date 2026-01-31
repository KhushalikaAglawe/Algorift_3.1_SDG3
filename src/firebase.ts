// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7sdxOU39bkRLqIwUFeSozLCqkpL7oPEY",
  authDomain: "healthbridge1-543a1.firebaseapp.com",
  projectId: "healthbridge1-543a1",
  storageBucket: "healthbridge1-543a1.appspot.com",
  messagingSenderId: "728593305828",
  appId: "1:728593305828:web:a70cc10c164b42e7505cf1",
  measurementId: "G-EDWZZZTJSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Auth & Firestore exports
export const auth = getAuth(app);
export const db = getFirestore(app);

// Optional: Analytics
export const analytics = getAnalytics(app);
