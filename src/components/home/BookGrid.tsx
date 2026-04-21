/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Book } from '@/types';
import { BookCard } from './BookCard';
import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

interface BookGridProps {
  books: Book[];
  onQuickView: (book: Book) => void;
}

export function BookGrid({ books, onQuickView }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-6 rounded-full bg-slate-100 dark:bg-slate-800">
          <BookOpen className="w-12 h-12 text-muted-foreground opacity-50" />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-bold">No books found</h3>
          <p className="text-muted-foreground">Try adjusting your search or category filters.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-8">
      {books.map((book, index) => (
        <motion.div
          key={book.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
        >
          <BookCard book={book} onQuickView={onQuickView} />
        </motion.div>
      ))}
    </div>
  );
}
