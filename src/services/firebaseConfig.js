import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY_CANAL,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN_CANAL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID_CANAL,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET_CANAL,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID_CANAL,
  appId: process.env.REACT_APP_FIREBASE_APP_ID_CANAL
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { app };
