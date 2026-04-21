/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validate connection on boot with a simpler check
async function testConnection() {
  try {
    // Attempting a simple read to check connectivity
    // Using getDoc (not FromServer) to allow for internal retry logic
    await getDoc(doc(db, 'system', 'ping'));
    console.log('Firebase connection initialized.');
  } catch (error) {
    if (error && error.message && error.message.includes('offline')) {
      console.warn("Firebase is starting in offline mode. It will sync once connection is stable.");
    } else {
      console.error("Firebase Initialization Notice:", error.code || error.message);
    }
  }
}

testConnection();
