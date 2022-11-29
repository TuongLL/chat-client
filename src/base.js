import firebase from "firebase/compat/app";
import { getStorage, ref } from "firebase/storage";

const app = firebase.initializeApp({
  apiKey: "AIzaSyCHEScvRWg9l0q_QHasNI-qfVn1ImDYFog",
  authDomain: "chat-app-6e93c.firebaseapp.com",
  databaseURL:
    "https://chat-app-6e93c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "chat-app-6e93c",
  storageBucket: "chat-app-6e93c.appspot.com",
  messagingSenderId: "253717891075",
  appId: "1:253717891075:web:ddf6c37a9153bb1b576636",
  measurementId: "G-C6W77ZD8XT",
});

export const storage = getStorage(app)
