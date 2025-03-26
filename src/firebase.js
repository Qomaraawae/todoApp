import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAK25HSLtbLhye8j7qmkZ92QUEODOfIqXc",
  authDomain: "todoapp-9b1a2.firebaseapp.com",
  projectId: "todoapp-9b1a2",
  storageBucket: "todoapp-9b1a2.firebasestorage.app",
  messagingSenderId: "684845618397",
  appId: "1:684845618397:web:808c1fa560273cb4dff734",
  measurementId: "G-771P3EYPY5",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

let analytics;
if (typeof window !== "undefined") {
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.error("Error initializing Analytics:", error);
  }
}

export { app, db, analytics };
