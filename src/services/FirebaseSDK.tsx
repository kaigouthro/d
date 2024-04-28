// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDmJsIwX6b2uFC4xqNg5YIRVKKzRHDgGHI",
  authDomain: "musa-13ea9.firebaseapp.com",
  projectId: "musa-13ea9",
  storageBucket: "musa-13ea9.appspot.com",
  messagingSenderId: "847501182700",
  appId: "1:847501182700:web:c0eac12cb79b9e9d6747c9",
  measurementId: "G-V2FVSDQXH9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);