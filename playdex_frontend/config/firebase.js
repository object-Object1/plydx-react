import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage"


const firebaseConfig = {
  apiKey: "AIzaSyCom402KTymf81jJb6wDWxlZGLGd-p83tM",
  authDomain: "dex1-63b19.firebaseapp.com",
  projectId: "dex1-63b19",
  storageBucket: "dex1-63b19.appspot.com",
  messagingSenderId: "986526334807",
  appId: "1:986526334807:web:ee0fe843db49b7f59ec812",
  measurementId: "G-41WW262N2Q"
};

export const app = initializeApp(firebaseConfig, "dex");
export const storage = getStorage(app);