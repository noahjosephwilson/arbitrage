import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBCr4Z3mFmEogMA94sfatzhCf4QMghPd9w",
  authDomain: "arbitrage-2075e.firebaseapp.com",
  projectId: "arbitrage-2075e",
  storageBucket: "arbitrage-2075e.firebasestorage.app",
  messagingSenderId: "213938706150",
  appId: "1:213938706150:web:90fff77b19edfe973a4d27",
  measurementId: "G-7C4J93HQVN"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
