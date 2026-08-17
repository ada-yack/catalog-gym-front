import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAs_85b_GR3FK0LLCU8xwDM1Ypnq_wFZ30",
  authDomain: "catalog-gym.firebaseapp.com",
  projectId: "catalog-gym",
  storageBucket: "catalog-gym.firebasestorage.app",
  messagingSenderId: "165779531967",
  appId: "1:165779531967:web:c0950fc5a58ea7f3527e0a",
  measurementId: "G-ZHX93L521M"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);