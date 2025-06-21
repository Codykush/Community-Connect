// Firebase Configuration
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { 
    getFirestore, 
    collection, 
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-firestore.js";
import { 
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBTjckH6h4su0h6FremSQiA5nvCUhavuJU",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "let-s-connect-local-artisians",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { 
    db, 
    auth,
    collection, 
    getDocs,
    doc,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
};