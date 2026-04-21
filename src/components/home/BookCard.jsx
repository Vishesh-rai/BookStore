/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Download, ThumbsDown, ThumbsUp, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Link } from 'react-router-dom';
import { updateBookLikes, registerDownload } from '@/lib/books';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function BookCard({ book, onQuickView }) {
  const { role, user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [showGuestModal, setShowGuestModal] = useState(false);

  // Check if user has already liked/disliked this book
  useEffect(() => {
    if (user && book) {
      const checkInteraction = async () => {
        try {
          const interactionDoc = await getDoc(doc(db, 'books', book.id, 'interactions', user.id));
          if (interactionDoc.exists()) {
            const data = interactionDoc.data();
            if (data.type === 'like') setLiked(true);
            if (data.type === 'dislike') setDisliked(true);
          }
        } catch (e) {
          console.error("Error checking interaction:", e);
        }
      };
      checkInteraction();
    }
  }, [user, book]);

  const handleAction = async (actionName, action) => {
    if (role === 'guest') {
      setShowGuestModal(true);
      return;
    }
    await action();
  };

  const toggleLike = async () => {
    if (liked) return;
    try {
      await updateBookLikes(book.id, user.id, true);
      setLiked(true);
      setDisliked(false);
      toast.success(`Liked ${book.title}`);
    } catch (error) {
      toast.error('Failed to update like.');
    }
  };

  const toggleDislike = async () => {
    if (disliked) return;
    try {
      await updateBookLikes(book.id, user.id, false);
      setDisliked(true);
      setLiked(false);
    } catch (error) {
      toast.error('Failed to update dislike.');
    }
  };

  const handleDownload = async () => {
    try {
      toast.info(`Starting download: ${book.title}`);
      await registerDownload(book.id);
      window.open(book.pdfUrl, '_blank');
    } catch (error) {
      toast.error('Failed to update download stats.');
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -8 }}
        transition={{ type: 'spring', stiffness: 300 }}
      >
        <Card className="group bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-600 transition-all hover:shadow-2xl hover:shadow-black">
          <div className="relative aspect-[3/4] bg-slate-800 overflow-hidden">
            <img
              src={book.imageUrl}
              alt={book.title}
              className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-500"
              referrerPolicy="no-referrer"
              onError={(e) => { e.target.src = 'https://picsum.photos/seed/book/400/600'; }}
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Button size="sm" variant="secondary" onClick={() => onQuickView(book)} className="bg-slate-50 text-slate-900 border-none">
                <Eye className="w-4 h-4 mr-2" />
                Quick View
              </Button>
            </div>
            <div className="absolute top-3 right-3">
              <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                {book.category}
              </span>
            </div>
          </div>
          
          <CardContent className="p-4 space-y-3">
            <div className="space-y-1">
              <h4 className="font-bold text-white leading-tight line-clamp-1">{book.title}</h4>
              <p className="text-sm text-slate-500">{book.authorName}</p>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleAction('like', toggleLike)}
                  className={`flex items-center gap-1 transition-all hover:scale-110 ${liked ? 'text-blue-500' : 'text-slate-500 hover:text-blue-500'}`}
                >
                  <ThumbsUp className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                  <span className="text-xs">{book.likesCount || 0}</span>
                </button>
                <button 
                  onClick={() => handleAction('dislike', toggleDislike)}
                  className={`text-slate-500 hover:text-red-500 hover:scale-110 transition-all ${disliked ? 'text-red-500' : 'text-slate-500'}`}
                >
                  <ThumbsDown className={`w-4 h-4 ${disliked ? 'fill-current' : ''}`} />
                </button>
              </div>
              
              <button 
                onClick={() => handleAction('download', handleDownload)}
                className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>


      {/* Guest Access Modal */}
      <Dialog open={showGuestModal} onOpenChange={setShowGuestModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">Join BookStore</DialogTitle>
            <DialogDescription className="text-base py-4">
              Join thousands of readers and authors. Register now to like books and download PDFs for your personal library!
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <Link to="/auth" onClick={() => setShowGuestModal(false)}>
              <Button className="w-full h-12 text-lg">Create a Free Account</Button>
            </Link>
            <Button variant="ghost" onClick={() => setShowGuestModal(false)}>
              Maybe Later
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
