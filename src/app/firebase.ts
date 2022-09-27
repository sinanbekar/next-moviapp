import firebaseConfig from "../config/firebase";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebase = initializeApp(firebaseConfig);

export const auth = getAuth(firebase);
export const db = getFirestore(firebase);
export default firebase;
