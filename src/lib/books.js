/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc, 
  serverTimestamp, 
  updateDoc, 
  doc, 
  increment,
  setDoc,
  where,
  getDocs,
  getDoc
} from 'firebase/firestore';
import { db } from './firebase';

export const subscribeToBooks = (callback) => {
  const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(books);
  });
};

export const publishBook = async (bookData) => {
  try {
    const fullBook = {
      ...bookData,
      likesCount: 0,
      dislikesCount: 0,
      downloads: 0,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'books'), fullBook);
  } catch (error) {
    console.error("Error publishing book:", error);
    throw error;
  }
};

export const updateBookLikes = async (bookId, userId, isLike) => {
  const bookRef = doc(db, 'books', bookId);
  const likeRef = doc(db, 'books', bookId, 'interactions', userId);
  
  const likeDoc = await getDoc(likeRef);
  
  if (likeDoc.exists()) {
    const data = likeDoc.data();
    if (data.type === (isLike ? 'like' : 'dislike')) {
      return; // Already did this action
    }
    
    // Toggle action
    await updateDoc(bookRef, {
      [isLike ? 'likesCount' : 'dislikesCount']: increment(1),
      [isLike ? 'dislikesCount' : 'likesCount']: increment(-1)
    });
  } else {
    // New action
    await updateDoc(bookRef, {
      [isLike ? 'likesCount' : 'dislikesCount']: increment(1)
    });
  }
  
  await setDoc(likeRef, { type: isLike ? 'like' : 'dislike', updatedAt: serverTimestamp() });
};

export const registerDownload = async (bookId) => {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, {
    downloads: increment(1)
  });
};

export const addToLibrary = async (userId, book) => {
  const libRef = doc(db, 'users', userId, 'library', book.id);
  await setDoc(libRef, book);
};

export const getLibrary = async (userId) => {
  const q = collection(db, 'users', userId, 'library');
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const subscribeToAuthorBooks = (authorId, callback) => {
  const q = query(
    collection(db, 'books'), 
    where('authorId', '==', authorId),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(books);
  });
};

export const INITIAL_BOOKS = [];
