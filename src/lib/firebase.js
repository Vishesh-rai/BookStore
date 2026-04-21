/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYnt-W3imeGgOq3dFayyrHOZx3azXlFiI",
  authDomain: "studio-2620729134-4606b.firebaseapp.com",
  projectId: "studio-2620729134-4606b",
  storageBucket: "studio-2620729134-4606b.firebasestorage.app",
  messagingSenderId: "497662035787",
  appId: "1:497662035787:web:11b5064aca80fd6d020ace"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Validate connection on boot as per instructions
async function testConnection() {
  try {
    await getDocFromServer(doc(db, '_internal', 'connection-test'));
    console.log('Firebase connection established.');
  } catch (error) {
    if (error && error.message) {
      if (error.message.includes('the client is offline')) {
        console.error("Firebase Offline: Please check your internet connection or Firebase configuration.");
      } else if (error.code === 'permission-denied') {
        console.error("Firebase Permissions: Your Security Rules are blocking access.");
      } else {
        console.error("Firebase Connection Error:", error.message);
      }
    }
  }
}

testConnection();
