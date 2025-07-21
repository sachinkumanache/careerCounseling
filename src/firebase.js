// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC3tj9eTJExEyL3BJUYCyDccIxApAHpVuM",
  authDomain: "careercounselingapp-83bcb.firebaseapp.com",
  databaseURL:
    "https://careercounselingapp-83bcb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "careercounselingapp-83bcb",
  storageBucket: "careercounselingapp-83bcb.firebasestorage.app",
  messagingSenderId: "781426299849",
  appId: "1:781426299849:web:09c07a906076a08b7a8e18",
  measurementId: "G-4MPCSLHWGM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const database = getDatabase(app);
export const storage = getStorage(app);
