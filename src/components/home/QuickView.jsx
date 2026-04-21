/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ThumbsUp, User } from 'lucide-react';

export function QuickView({ book, onClose, onDownload }) {
  if (!book) return null;

  return (
    <Sheet open={!!book} onOpenChange={onClose}>
      <SheetContent side="right" className="sm:max-w-lg w-full overflow-y-auto bg-slate-950 border-slate-800 text-slate-200">
        <SheetHeader className="space-y-6">
          <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
            <img
              src={book.coverImage}
              alt={book.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="space-y-4">
            <Badge className="bg-blue-600/10 text-blue-400 border-none uppercase text-[10px] tracking-widest font-bold px-2 py-1">{book.category}</Badge>
            <SheetTitle className="text-4xl font-bold leading-tight text-white tracking-tight">
              {book.title}
            </SheetTitle>
            <div className="flex items-center gap-4 text-slate-400">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{book.authorName}</span>
              </div>
              <span className="text-xs opacity-50">•</span>
              <Badge variant="outline" className="border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                {book.authorNiche} Author
              </Badge>
            </div>
          </div>
        </SheetHeader>

        <div className="py-10 space-y-8">
          <div className="space-y-3">
            <h4 className="font-bold uppercase tracking-widest text-[10px] text-slate-500">Summary</h4>
            <SheetDescription className="text-lg text-slate-300 leading-relaxed font-light">
              {book.description}
            </SheetDescription>
          </div>

          <div className="grid grid-cols-3 gap-4 border-y border-slate-800 py-8">
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">{book.likes}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Likes</p>
            </div>
            <div className="text-center border-x border-slate-800">
              <p className="text-3xl font-bold text-white mb-1">{book.downloadCount}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">PDF Hits</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-white mb-1">{book.createdAt ? new Date(book.createdAt).getFullYear() : 'N/A'}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Release</p>
            </div>
          </div>

          <div className="flex gap-4">
            <Button className="flex-1 h-14 text-lg bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/20 font-bold" onClick={() => onDownload(book)}>
              <Download className="w-5 h-5 mr-3" />
              Download PDF
            </Button>
            <Button variant="outline" className="h-14 w-14 p-0 rounded-2xl border-slate-800 bg-slate-900 hover:bg-slate-800 hover:text-white transition-colors">
              <ThumbsUp className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
