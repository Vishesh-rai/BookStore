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
import { Book as BookIcon, Heart, Download, Link as LinkIcon, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { publishBook, subscribeToAuthorBooks } from '@/lib/books';

export function DashboardPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('upload');
  const [authorBooks, setAuthorBooks] = useState([]);
  
  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Education');
  const [imageUrl, setImageUrl] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  
  const [isUploading, setIsUploading] = useState(false);
  const [fakeProgress, setFakeProgress] = useState(0);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = subscribeToAuthorBooks(user.id, setAuthorBooks);
    return () => unsubscribe();
  }, [user]);

  const stats = useMemo(() => {
    const totals = authorBooks.reduce((acc, book) => {
      acc.downloads += book.downloads || 0;
      acc.likes += book.likesCount || 0;
      return acc;
    }, { downloads: 0, likes: 0 });

    return [
      { label: 'Total Downloads', value: totals.downloads.toLocaleString(), icon: <Download className="w-5 h-5 text-blue-500" /> },
      { label: 'Total Likes', value: totals.likes.toLocaleString(), icon: <Heart className="w-5 h-5 text-red-500" /> },
      { label: 'Publications', value: authorBooks.length.toLocaleString(), icon: <BookIcon className="w-5 h-5 text-purple-500" /> },
    ];
  }, [authorBooks]);

  const isValidImageUrl = (url) => {
    return url && url.match(/^https?:\/\/.*\.(jpeg|jpg|png|webp|gif)$/i) || url.startsWith('http');
  };

  const isGoogleDriveLink = (url) => {
    return url.includes('drive.google.com');
  };

  const convertGDriveLink = (url) => {
    if (!isGoogleDriveLink(url)) return url;
    try {
      const parts = url.split('/');
      let fileId = '';
      if (url.includes('id=')) {
        fileId = url.split('id=')[1].split('&')[0];
      } else {
        const dIndex = parts.indexOf('d');
        if (dIndex !== -1 && parts[dIndex + 1]) {
          fileId = parts[dIndex + 1];
        }
      }
      return fileId ? `https://drive.google.com/uc?export=download&id=${fileId}` : url;
    } catch (e) {
      return url;
    }
  };

  const simulateProgress = () => {
    setFakeProgress(0);
    return new Promise((resolve) => {
      let current = 0;
      const interval = setInterval(() => {
        current += Math.random() * 30;
        if (current >= 100) {
          setFakeProgress(100);
          clearInterval(interval);
          resolve();
        } else {
          setFakeProgress(current);
        }
      }, 200);
    });
  };

  const handlePublish = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error('You must be logged in to publish.');
      return;
    }

    if (!title || !description || !imageUrl || !pdfUrl) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (!isValidImageUrl(imageUrl)) {
      toast.error('Please enter a valid image URL.');
      return;
    }

    setIsUploading(true);
    
    try {
      await simulateProgress();
      
      const finalPdfUrl = convertGDriveLink(pdfUrl);

      await publishBook({
        title,
        description,
        category,
        authorId: user.id,
        authorName: user.name,
        authorNiche: user.niche || 'Education',
        imageUrl,
        pdfUrl: finalPdfUrl,
      });
      
      toast.success('Book published successfully!');
      setTitle('');
      setDescription('');
      setImageUrl('');
      setPdfUrl('');
      setFakeProgress(0);
    } catch (error) {
      console.error("Publish error:", error);
      toast.error('Failed to publish book. Please try again.');
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
              <form onSubmit={handlePublish} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Book Title</Label>
                    <Input 
                      placeholder="e.g. Master React in 30 Days" 
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      className="bg-slate-950 border-slate-800 focus:ring-blue-600/50 text-white placeholder:text-slate-600"
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
                    className="min-h-[150px] resize-none bg-slate-950 border-slate-800 focus:ring-blue-600/50 text-white placeholder:text-slate-600"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Cover Image URL</Label>
                    <div className="relative">
                      <Input 
                        placeholder="https://example.com/cover.jpg" 
                        value={imageUrl}
                        onChange={e => setImageUrl(e.target.value)}
                        className="bg-slate-950 border-slate-800 focus:ring-blue-600/50 text-white placeholder:text-slate-600 pr-10"
                        required 
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {isValidImageUrl(imageUrl) ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : imageUrl ? (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        ) : null}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">Supports direct PNG, JPG, or WebP links.</p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-300">PDF Document Link</Label>
                    <div className="relative">
                      <Input 
                        placeholder="Google Drive link or PDF URL" 
                        value={pdfUrl}
                        onChange={e => setPdfUrl(e.target.value)}
                        className="bg-slate-950 border-slate-800 focus:ring-blue-600/50 text-white placeholder:text-slate-600 pr-10"
                        required 
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {pdfUrl ? (
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : null}
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500">Google Drive links will be converted for direct download.</p>
                  </div>
                </div>

                {isUploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Publishing to Library...</span>
                      <span>{Math.round(fakeProgress)}%</span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${fakeProgress}%` }}
                        className="bg-blue-600 h-full shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                      />
                    </div>
                  </div>
                )}

                <Button type="submit" size="lg" className="w-full h-14 text-lg rounded-2xl bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20" disabled={isUploading}>
                  {isUploading ? 'Processing...' : 'Publish to Library'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-8">
            <Card className="rounded-3xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden">
              <CardHeader className="bg-slate-900/80 border-b border-slate-800">
                <CardTitle className="text-white text-lg">Preview</CardTitle>
              </CardHeader>
              <CardContent className="p-0 flex items-center justify-center bg-slate-950 aspect-[3/4] group relative">
                {imageUrl && isValidImageUrl(imageUrl) ? (
                  <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-600">
                    <ImagePlus className="w-12 h-12" />
                    <span className="text-xs">Image Preview</span>
                  </div>
                )}
                {title && (
                  <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm font-bold truncate">{title}</p>
                    <p className="text-slate-400 text-[10px]">{category}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="rounded-3xl border border-slate-800 bg-slate-900/50 shadow-xl">
              <CardHeader>
                <CardTitle className="text-white">Your Publications</CardTitle>
                <CardDescription className="text-slate-500">Live status of your books.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {authorBooks.length > 0 ? (
                  authorBooks.map(book => (
                    <div key={book.id} className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800">
                      <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                        <img 
                          src={book.imageUrl} 
                          className="w-full h-full object-cover" 
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            e.target.src = 'https://picsum.photos/seed/book/200/300';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-200 truncate">{book.title}</p>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Download className="w-3 h-3" /> {book.downloads || 0}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] text-slate-500">
                            <Heart className="w-3 h-3" /> {book.likesCount || 0}
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
