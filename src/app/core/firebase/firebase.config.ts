import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyC38w9gf0cl1s30hy_sLtQFQJYTuRkUsJk",
  authDomain: "catalog-gym.firebaseapp.com",
  projectId: "catalog-gym",
  storageBucket: "catalog-gym.firebasestorage.app",
  messagingSenderId: "165779531967",
  appId: "1:165779531967:web:d581145fc3a44145527e0a",
  measurementId: "G-JRVLPZ7DL0"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);