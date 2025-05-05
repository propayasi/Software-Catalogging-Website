// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrg78XB8OqEVy9jUwFD2VzzXGeih7n_4k",
  authDomain: "component-catalog-app.firebaseapp.com",
  projectId: "component-catalog-app",
  storageBucket: "component-catalog-app.firebasestorage.app",
  messagingSenderId: "22358917026",
  appId: "1:22358917026:web:b4424cd42e843114e3fcfb",
  measurementId: "G-ENB2G7D18S"
};

export const componentStorageName = "components";
export const usersStorageName = "users";
export const userCollectionsName = "user_collections";

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
