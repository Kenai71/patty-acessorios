import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBEiBSkzrC8YcIzqrbW2tJwcp6Axy1hrCQ",
  authDomain: "patty-acessorios.firebaseapp.com",
  projectId: "patty-acessorios",
  storageBucket: "patty-acessorios.firebasestorage.app",
  messagingSenderId: "831061654412",
  appId: "1:831061654412:web:fde6e1397a39d32e2eb4a9",
  measurementId: "G-JK5ZLW1DNM"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };