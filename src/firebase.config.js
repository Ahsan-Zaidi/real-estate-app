import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBgD4N74VRs0jGTgUmqEOhIL6XmwWIbehk",
  authDomain: "real-estate-app-6649c.firebaseapp.com",
  projectId: "real-estate-app-6649c",
  storageBucket: "real-estate-app-6649c.appspot.com",
  messagingSenderId: "770604706734",
  appId: "1:770604706734:web:652f5cdf512c60ed65f63f"
};

// Initialize Firebase
initializeApp(firebaseConfig);

export const db = getFirestore();