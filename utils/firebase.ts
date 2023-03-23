import { getFirestore } from 'firebase/firestore'
// Import the functions you need from the SDKs you need
import { initializeApp, getApp, getApps } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: "chartgpt-messenger-ed3bb.firebaseapp.com",
    projectId: "chartgpt-messenger-ed3bb",
    storageBucket: "chartgpt-messenger-ed3bb.appspot.com",
    messagingSenderId: "950601888774",
    appId: "1:950601888774:web:677918d13804beaa013f87"
};


// Initialize Firebase
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app)

export { db }