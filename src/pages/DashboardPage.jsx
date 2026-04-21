/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Book as BookIcon, FileUp, ImagePlus, Heart, Download } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { publishBook, subscribeToAuthorBooks } from '@/lib/books';
import { uploadFile } from '@/lib/storage';
import { useRef } from 'react';

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [authorBooks, setAuthorBooks] = useState([]);
  
  const coverInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');
  const [coverFile, setCoverFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);
  
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ cover: 0, pdf: 0 });

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToAuthorBooks(user.id, setAuthorBooks);
    return () => unsubscribe();
  }, [user]);

  const stats = useMemo(() => {
    const totals = authorBooks.reduce((acc, book) => {
      acc.downloads += book.downloadCount || 0;
      acc.likes += book.likes || 0;
      acc.dislikes += book.dislikes || 0;
      return acc;
    }, { downloads: 0, likes: 0, dislikes: 0 });

    return [
      { label: 'Total Downloads', value: totals.downloads.toLocaleString(), icon: <Download className="w-5 h-5 text-blue-500" /> },
      { label: 'Total Likes', value: totals.likes.toLocaleString(), icon: <Heart className="w-5 h-5 text-red-500" /> },
      { label: 'Publications', value: authorBooks.length.toLocaleString(), icon: <BookIcon className="w-5 h-5 text-purple-500" /> },
    ];
  }, [authorBooks]);
 
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to publish a book.');
      return;
    }

    if (!coverFile || !pdfFile) {
      toast.error('Please select both a cover image and a PDF document.');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress({ cover: 0, pdf: 0 });

    try {
      // 1. Upload Cover
      const coverPath = `books/${user.id}/${Date.now()}_cover_${coverFile.name}`;
      const coverUrl = await uploadFile(coverFile, coverPath, (p) => 
        setUploadProgress(prev => ({ ...prev, cover: p }))
      );

      // 2. Upload PDF
      const pdfPath = `books/${user.id}/${Date.now()}_doc_${pdfFile.name}`;
      const pdfUrlFinal = await uploadFile(pdfFile, pdfPath, (p) => 
        setUploadProgress(prev => ({ ...prev, pdf: p }))
      );

      // 3. Save Metadata
      await publishBook({
        title,
        description,
        category,
        authorId: user.id,
        authorName: user.name,
        authorNiche: user.niche || 'Education',
        coverImage: coverUrl,
        pdfUrl: pdfUrlFinal,
      });
      
      toast.success('Book published successfully!');
      setTitle('');
      setDescription('');
      setCoverFile(null);
      setPdfFile(null);
      setUploadProgress({ cover: 0, pdf: 0 });
    } catch (error) {
      console.error("Upload error:", error);
      toast.error('Failed to publish book. Please check your connection and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-bold text-white tracking-tight">Author Studio</h1>
          <p className="text-slate-400 text-lg">Manage your publications and track your performance.</p>
        </div>
        
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-2xl w-fit">
          <Button 
            variant={activeTab === 'upload' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('upload')}
            className={`rounded-xl px-6 ${activeTab === 'upload' ? 'bg-blue-600' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Upload Portal
          </Button>
          <Button 
            variant={activeTab === 'analytics' ? 'default' : 'ghost'} 
            onClick={() => setActiveTab('analytics')}
            className={`rounded-xl px-6 ${activeTab === 'analytics' ? 'bg-blue-600' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
          >
            Analytics
          </Button>
        </div>
      </div>

      {activeTab === 'upload' ? (
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-3xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl">
            <CardHeader className="bg-slate-900 border-b border-slate-800 p-8">
              <CardTitle className="text-2xl text-white">Publish New Book</CardTitle>
              <CardDescription className="text-slate-400">Fill in the details below to publish your PDF.</CardDescription>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleUpload} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Book Title</Label>
                    <Input 
                      placeholder="e.g. Master React in 30 Days" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="bg-slate-950 border-slate-800 focus:ring-blue-600/50"
                      required 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">Category</Label>
                    <Select value={category} onValueChange={(val) => setCategory(val)}>
                      <SelectTrigger className="bg-slate-950 border-slate-800">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Comic">Comic</SelectItem>
                        <SelectItem value="Novel">Novel</SelectItem>
                        <SelectItem value="Poetry">Poetry</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Description</Label>
                  <Textarea 
                    placeholder="Tell your readers what your book is about..." 
                    className="min-h-[150px] resize-none bg-slate-950 border-slate-800 focus:ring-blue-600/50"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input 
                    type="file" 
                    ref={coverInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                  />
                  <div 
                    onClick={() => coverInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${coverFile ? 'border-green-600 bg-green-600/5' : 'border-slate-800 hover:border-blue-600 hover:bg-blue-600/5'}`}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-transform ${coverFile ? 'bg-green-600' : 'bg-slate-800 group-hover:scale-110'}`}>
                      <ImagePlus className={`h-6 w-6 ${coverFile ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">
                        {coverFile ? coverFile.name : 'Upload Cover Image'}
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG (Max 5MB)</p>
                      {isUploading && uploadProgress.cover > 0 && (
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${uploadProgress.cover}%` }} />
                        </div>
                      )}
                    </div>
                  </div>

                  <input 
                    type="file" 
                    ref={pdfInputRef} 
                    className="hidden" 
                    accept="application/pdf"
                    onChange={(e) => setPdfFile(e.target.files?.[0] || null)}
                  />
                  <div 
                    onClick={() => pdfInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${pdfFile ? 'border-green-600 bg-green-600/5' : 'border-slate-800 hover:border-blue-600 hover:bg-blue-600/5'}`}
                  >
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center transition-transform ${pdfFile ? 'bg-green-600' : 'bg-slate-800 group-hover:scale-110'}`}>
                      <FileUp className={`h-6 w-6 ${pdfFile ? 'text-white' : 'text-slate-400'}`} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-200">
                        {pdfFile ? pdfFile.name : 'Upload PDF Document'}
                      </p>
                      <p className="text-xs text-slate-500">Max 20MB</p>
                      {isUploading && uploadProgress.pdf > 0 && (
                        <div className="w-full bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                          <div className="bg-blue-500 h-full transition-all duration-300" style={{ width: `${uploadProgress.pdf}%` }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20" disabled={isUploading}>
                  {isUploading ? 'Publishing...' : 'Publish to Library'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="rounded-3xl border border-slate-800 bg-slate-900/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Your Publications</CardTitle>
                <CardDescription className="text-slate-500">Live status of your books.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authorBooks.length > 0 ? (
                  authorBooks.map(book => (
                    <div key={book.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0">
                        <img src={book.coverImage} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{book.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Download className="w-3 h-3" /> {book.downloadCount || 0}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Heart className="w-3 h-3" /> {book.likes || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center bg-slate-950/50 rounded-2xl border border-slate-800 border-dashed">
                    <p className="text-slate-500 text-sm italic">No books published yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="p-8 rounded-3xl bg-blue-600 text-white space-y-4 relative overflow-hidden shadow-2xl shadow-blue-900/40">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
               <h3 className="text-xl font-bold relative z-10">Pro Tip</h3>
               <p className="text-blue-100 relative z-10 font-light leading-relaxed">
                 Use high-quality vertical covers (2:3 aspect ratio) to increase click-through rates by up to 40%.
               </p>
               <Button variant="link" className="text-white p-0 h-auto relative z-10 font-bold decoration-white/30 underline-offset-4">Read documentation</Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {stats.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="rounded-3xl border border-slate-800 bg-slate-900 shadow-xl p-8 hover:border-slate-600 transition-all duration-300">
                <div className="flex justify-between items-start mb-6">
                  <div className="p-3 rounded-2xl bg-slate-800">
                    {item.icon}
                  </div>
                </div>
                <p className="text-slate-400 font-medium mb-1 uppercase tracking-wider text-xs">{item.label}</p>
                <p className="text-4xl font-bold font-display tracking-tight text-white">{item.value}</p>
              </Card>
            </motion.div>
          ))}
        </div>
       )}
    </div>
  );
}
