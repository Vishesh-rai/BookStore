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
import { Book } from '../types';

export const subscribeToBooks = (callback: (books: Book[]) => void) => {
  const q = query(collection(db, 'books'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const books = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
    callback(books);
  });
};

export const publishBook = async (bookData: Omit<Book, 'id' | 'likes' | 'dislikes' | 'downloadCount' | 'createdAt'>) => {
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

export const updateBookLikes = async (bookId: string, isLike: boolean) => {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, {
    [isLike ? 'likes' : 'dislikes']: increment(1)
  });
};

export const registerDownload = async (bookId: string) => {
  const bookRef = doc(db, 'books', bookId);
  await updateDoc(bookRef, {
    downloadCount: increment(1)
  });
};

export const addToLibrary = async (userId: string, book: Book) => {
  const libRef = doc(db, 'users', userId, 'library', book.id);
  await setDoc(libRef, book);
};

export const getLibrary = async (userId: string) => {
  const q = collection(db, 'users', userId, 'library');
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Book));
};

export const INITIAL_BOOKS: Book[] = []; // Keep for compatibility during migration
