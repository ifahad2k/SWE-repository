import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

console.log("[Firebase] Config loaded:", {
  apiKey: firebaseConfig.apiKey ? "✓" : "✗",
  authDomain: firebaseConfig.authDomain ? "✓" : "✗",
  projectId: firebaseConfig.projectId ? "✓" : "✗",
});

const hasValidFirebaseConfig = Object.values(firebaseConfig).every((value) => {
  if (!value) return false;
  const trimmed = String(value).trim();
  return trimmed !== "" && !trimmed.includes("your_");
});

let db = null;
let auth = null;

if (hasValidFirebaseConfig) {
  try {
    const app = initializeApp(firebaseConfig);
    console.log("[Firebase] App initialized successfully");
    db = getFirestore(app);
    console.log("[Firebase] Firestore initialized:", db);
    auth = getAuth(app);
    console.log("[Firebase] Auth initialized:", auth);
  } catch (error) {
    console.error("[Firebase] Initialization error:", error);
  }
} else {
  console.warn("Firebase env vars are missing or placeholders; using localStorage fallback");
  console.warn("Config values:", firebaseConfig);
}

export { db, auth };
