import admin from 'firebase-admin';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let firebaseApp;

try {
  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || 
    path.join(__dirname, '../../serviceAccountKey.json');
  
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

  firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET
  });

  console.log('✅ Firebase Admin initialized successfully');
} catch (error) {
  console.error('❌ Firebase Admin initialization error:', error.message);
  console.log('⚠️  Running without Firebase Admin SDK');
}

export const db = firebaseApp ? admin.firestore() : null;
export const storage = firebaseApp ? admin.storage() : null;
export const auth = firebaseApp ? admin.auth() : null;

export default admin;
