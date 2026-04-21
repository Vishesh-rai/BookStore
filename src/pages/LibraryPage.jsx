/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { getLibrary } from '@/lib/books';
import { BookGrid } from '@/components/home/BookGrid';
import { QuickView } from '@/components/home/QuickView';
import { BookOpen, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export function LibraryPage() {
  const { user, loading: authLoading } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    async function fetchLibrary() {
      if (user) {
        try {
          const libraryBooks = await getLibrary(user.id);
          setBooks(libraryBooks);
        } catch (error) {
          console.error("Failed to fetch library:", error);
        } finally {
          setLoading(false);
        }
      } else if (!authLoading) {
        setLoading(false);
      }
    }
    fetchLibrary();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="min-h-[calc(100vh-64px)] bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-slate-950 px-6 py-12">
      <div className="container mx-auto max-w-7xl space-y-12">
        <header className="space-y-4">
          <div className="flex items-center gap-3 text-blue-500">
            <BookOpen className="w-6 h-6" />
            <span className="text-sm font-bold uppercase tracking-widest text-blue-500/80">Personal Collection</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">My Library</h1>
          <p className="text-slate-400 text-lg max-w-2xl font-light">
            All the books you've saved and shared in one place. Keep track of your reading journey.
          </p>
        </header>

        {books.length > 0 ? (
          <BookGrid books={books} onQuickView={setSelectedBook} />
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-32 bg-slate-900/30 rounded-3xl border border-slate-800 border-dashed"
          >
            <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center mb-6">
              <GraduationCap className="w-10 h-10 text-slate-500" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Your library is empty</h3>
            <p className="text-slate-500 text-center max-w-sm">
              Discover new books in the explore section and add them to your collection to see them here.
            </p>
          </motion.div>
        )}
      </div>

      <QuickView 
        book={selectedBook} 
        onClose={() => setSelectedBook(null)}
        onDownload={(book) => window.open(book.pdfUrl, '_blank')}
      />
    </div>
  );
}
