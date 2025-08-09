// Import the functions you need from the SDKs you need.
// Yeh line hum ab use nahi kar rahe hain kyunki initialization main.js mein hoga,
// lekin ise rakhe rehne se koi problem nahi hai.
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// Maine iske aage "export" laga diya hai taaki main.js ise use kar sake.
export const firebaseConfig = {
  apiKey: "AIzaSyC6YEgAXn8tIxdFPldZN1ap5ATi3BDOGq4",
  authDomain: "ai-technocrafts-app-store.firebaseapp.com",
  projectId: "ai-technocrafts-app-store",
  // Maine storageBucket URL ko theek kar diya hai.
  storageBucket: "ai-technocrafts-app-store.appspot.com",
  messagingSenderId: "497852129252",
  appId: "1:497852129252:web:3ce7c231ff1a00b2f5f1f1"
};

// Initialize Firebase
// Maine is line ko comment kar diya hai (disable kar diya hai)
// kyunki ab hum Firebase ko main.js file ke andar initialize kar rahe hain.
// const app = initializeApp(firebaseConfig);
