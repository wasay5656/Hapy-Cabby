/**
 * Happy Cappy — Firebase Firestore Configuration
 * 
 * HOW TO ADD YOUR OWN FIREBASE CONFIGURATION:
 * ==========================================
 * 1. Go to Firebase Console: https://console.firebase.google.com/
 * 2. Create a new Firebase project (or choose an existing one).
 * 3. In Project Settings > General, scroll down to "Your apps" and click the Web icon (</>).
 * 4. Register app "Happy Cappy" and copy the `firebaseConfig` keys.
 * 5. Create a Firestore Database in test mode or with the rules provided in firestore.rules.
 * 6. Either:
 *    A) Paste your keys into your `.env` or `.env.local` file:
 *       VITE_FIREBASE_API_KEY="your-api-key"
 *       VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
 *       VITE_FIREBASE_PROJECT_ID="your-project-id"
 *       VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
 *       VITE_FIREBASE_MESSAGING_SENDER_ID="1234567890"
 *       VITE_FIREBASE_APP_ID="1:1234567890:web:abcdef123456"
 * 
 *    OR B) Replace the placeholder values directly below in `DEFAULT_FIREBASE_CONFIG`.
 */

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

// Default placeholders — Replace with your real Firebase web configuration
export const DEFAULT_FIREBASE_CONFIG = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "YOUR_FIREBASE_API_KEY_HERE",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "YOUR_APP_ID",
};

/**
 * Checks whether real Firebase credentials are provided or if placeholders are still present.
 */
export function isFirebaseConfigured(): boolean {
  const cfg = DEFAULT_FIREBASE_CONFIG;
  return Boolean(
    cfg.apiKey &&
    !cfg.apiKey.includes('YOUR_') &&
    cfg.projectId &&
    !cfg.projectId.includes('YOUR_')
  );
}

let app: FirebaseApp | null = null;
let db: Firestore | null = null;

try {
  if (isFirebaseConfigured()) {
    app = getApps().length > 0 ? getApp() : initializeApp(DEFAULT_FIREBASE_CONFIG);
    db = getFirestore(app);
  } else {
    // Graceful initialization or placeholder notice
    // db remains null, triggering the resilient hybrid fallback in src/services/cards.ts
    console.info(
      'Happy Cappy: Firebase is running with fallback storage. To connect real Firestore, add your credentials in .env or src/firebase.ts'
    );
  }
} catch (error) {
  console.warn('Firebase initialization notice:', error);
}

export { app, db };
