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
  getDocs
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
      likes: 0,
      dislikes: 0,
      downloadCount: 0,
      createdAt: serverTimestamp(),
    };
    await addDoc(collection(db, 'books'), fullBook);
  } catch (error) {
    console.error("Error publishing book:", error);
    throw error;
  }
};

export const updateBookLikes = async (bookId, isLike) => {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, {
    [isLike ? 'likes' : 'dislikes']: increment(1)
  });
};

export const registerDownload = async (bookId) => {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, {
    downloadCount: increment(1)
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
