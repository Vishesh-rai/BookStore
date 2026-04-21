/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

// Validate connection on boot as per instructions
async function testConnection() {
  try {
    // Attempting to fetch a non-existent doc to trigger a server request
    await getDocFromServer(doc(db, '_internal', 'connection-test'));
    console.log('Firebase connection established.');
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration: Potential offline state detected.");
    }
  }
}

testConnection();
