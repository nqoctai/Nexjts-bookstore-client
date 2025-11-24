import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCTr5ZI0SbUCL8fcElMwtV86oa-HSFLbIs",
    authDomain: "bookstore-dc767.firebaseapp.com",
    projectId: "bookstore-dc767",
    storageBucket: "bookstore-dc767.firebasestorage.app",
    messagingSenderId: "679631373008",
    appId: "1:679631373008:web:2d9e34ffa94cd4e18294d5",
    measurementId: "G-D2W2Q5Q7G1",
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Google Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
    prompt: "select_account",
});
