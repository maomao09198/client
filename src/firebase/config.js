import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDfjdSsE5G8zsUXwdWVuKTzjm8JTv5zbuc",
  authDomain: "habittracker-610c8.firebaseapp.com",
  projectId: "habittracker-610c8",
  storageBucket: "habittracker-610c8.firebasestorage.app",
  messagingSenderId: "150368343581",
  appId: "1:150368343581:web:c83ef164bd8b5b31d4d8f4"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);