import { initializeApp } from "firebase/app";


// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDkeS1vNr_OvtD_6rBoJPzXNP-IqnTHA1s",
    authDomain: "team-1-b5d5c.firebaseapp.com",
    projectId: "team-1-b5d5c",
    storageBucket: "team-1-b5d5c.appspot.com",
    messagingSenderId: "807069479673",
    appId: "1:807069479673:web:fe8133bb29abd6190b6828",
    measurementId: "G-E36S4CNNZ4"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;