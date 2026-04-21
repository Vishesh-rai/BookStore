/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { Hero } from '@/components/home/Hero';
import { CategoryBar } from '@/components/home/CategoryBar';
import { BookGrid } from '@/components/home/BookGrid';
import { QuickView } from '@/components/home/QuickView';
import { subscribeToBooks, registerDownload, addToLibrary } from '@/lib/books';
import { toast } from 'sonner';
import { useAuth } from '@/lib/auth';

export function HomePage() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [quickViewBook, setQuickViewBook] = useState(null);
  const { role, user } = useAuth();

  useEffect(() => {
    const unsubscribe = subscribeToBooks(setBooks);
    return () => unsubscribe();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const title = book.title || '';
      const authorName = book.authorName || '';
      const matchesSearch = 
        title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        authorName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || book.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [books, searchQuery, selectedCategory]);

  const handleDownload = async (book) => {
    if (role === 'guest') {
      toast.error('Please join BookStore to download PDFs!');
      return;
    }
    try {
      toast.info(`Starting download: ${book.title}`);
      await registerDownload(book.id);
      if (user) {
        await addToLibrary(user.id, book);
      }
      window.open(book.pdfUrl, '_blank');
      toast.success('Book added to your library!');
    } catch (error) {
      toast.error('Failed to update download count.');
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex bg-slate-950">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-slate-800 p-6 flex-col gap-8 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
        <section>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-4">Categories</h3>
          <div className="space-y-1">
            {['All', 'Education', 'Comic', 'Novel', 'Poetry'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === 'All' ? 'All' : cat)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  (selectedCategory === 'All' && cat === 'All') || selectedCategory === cat
                    ? 'bg-blue-600/10 text-blue-400 font-medium'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat === 'All' ? 'All Genre' : cat}
              </button>
            ))}
          </div>
        </section>

        {user && (
          <section className="mt-auto">
            <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl">
              <p className="text-xs text-slate-500 mb-2">My Niche</p>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded-md text-[10px] font-bold uppercase">
                  {user.niche || 'Reader'}
                </span>
              </div>
            </div>
          </section>
        )}
      </aside>

      <div className="flex-1 overflow-hidden">
        <Hero onSearch={setSearchQuery} />
        
        {/* Mobile Category Bar */}
        <div className="lg:hidden">
          <CategoryBar selected={selectedCategory} onSelect={setSelectedCategory} />
        </div>
        
        <main className="container mx-auto px-4 lg:px-8 py-8">
          <div className="space-y-4 mb-8">
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {selectedCategory === 'All' ? 'Trending Books' : `${selectedCategory} Books`}
            </h2>
            <div className="h-0.5 w-12 bg-blue-600 rounded-full" />
          </div>
          
          <BookGrid books={filteredBooks} onQuickView={setQuickViewBook} />
        </main>
      </div>

      <QuickView 
        book={quickViewBook} 
        onClose={() => setQuickViewBook(null)} 
        onDownload={handleDownload}
      />
    </div>
  );
}
