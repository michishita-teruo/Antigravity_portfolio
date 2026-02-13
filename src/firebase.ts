import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDbrJWkAGTd5lK8QyIHtqskTXuNUPPU4kU",
    authDomain: "antigravity-portfolio-374fa.firebaseapp.com",
    projectId: "antigravity-portfolio-374fa",
    storageBucket: "antigravity-portfolio-374fa.firebasestorage.app",
    messagingSenderId: "13990456728",
    appId: "1:13990456728:web:2046137b2b27dfc2740fed",
    measurementId: "G-RSWVMW9HLD"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
