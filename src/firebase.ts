import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCx0rpF-Udx93H76in-kh8pLJ4jBRjcP7A",
  authDomain: "chat-app-62145.firebaseapp.com",
  projectId: "chat-app-62145",
  storageBucket: "chat-app-62145.appspot.com",
  messagingSenderId: "162981148719",
  appId: "1:162981148719:web:ce0b57fc401b21cf222eda"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
export const storage = getStorage(app);