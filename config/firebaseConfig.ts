import { initializeApp } from 'firebase/app';
import {
  initializeAuth
} from 'firebase/auth';
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAvUQhMlNNZVwPSaSci_wWJZIz5sjra7Vw",
  authDomain: "crmbasic-6b0fc.firebaseapp.com",
  projectId: "crmbasic-6b0fc",
  storageBucket: "crmbasic-6b0fc.firebasestorage.app",
  messagingSenderId: "665573180869",
  appId: "1:665573180869:web:38e003c28e61ed0d47b7ac",
  measurementId: "G-MMQL54ZNFN"
};

const app = initializeApp(firebaseConfig);
 export const auth = initializeAuth(app, {
});
export const db = getFirestore(app);
