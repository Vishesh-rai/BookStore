/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { toast } from 'sonner';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [firebaseUser, setFirebaseUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [needsRegistration, setNeedsRegistration] = useState(false);

  const role = user?.role || 'guest';

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fUser) => {
      try {
        setFirebaseUser(fUser);
        if (fUser) {
          const userDoc = await getDoc(doc(db, 'users', fUser.uid));
          if (userDoc.exists()) {
            setUser({ id: fUser.uid, ...userDoc.data() });
            setNeedsRegistration(false);
          } else {
            setUser(null);
            setNeedsRegistration(true);
          }
        } else {
          setUser(null);
          setNeedsRegistration(false);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        setNeedsRegistration(true);
        toast.info("Welcome! Please complete your registration.");
      } else {
        setNeedsRegistration(false);
        setUser({ id: result.user.uid, ...userDoc.data() });
        toast.success("Welcome back!");
      }
    } catch (error) {
      console.error("Full Login Error:", error);
      if (error.code === 'auth/unauthorized-domain') {
        toast.error("Unauthorized Domain. Please add this URL to your Firebase Console settings.");
      } else if (error.code === 'auth/operation-not-allowed') {
        toast.error("Google login is not enabled in your Firebase Console.");
      } else if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(`Login failed: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const register = async (role, name, niche) => {
    if (!firebaseUser) throw new Error("No authenticated user found");

    try {
      // Simulate setup delay for better UX as requested
      const userData = {
        name,
        email: firebaseUser.email,
        role,
        niche,
        library: [],
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), userData);
      
      // Delay state update to allow animation to show
      setTimeout(() => {
        setUser({ id: firebaseUser.uid, ...userData });
        setNeedsRegistration(false);
        toast.success("Account created successfully!");
      }, 1500);

    } catch (error) {
      console.error("Registration failed:", error);
      toast.error("Registration failed. Please try again.");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setFirebaseUser(null);
      setNeedsRegistration(false);
      toast.success("Logged out successfully");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, firebaseUser, role, loading, needsRegistration, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
