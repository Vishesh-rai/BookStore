/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Book, ChevronLeft, Github, Mail, UserPlus } from 'lucide-react';
import { motion } from 'motion/react';

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register, user, firebaseUser, loading } = useAuth();
  
  const [role, setRole] = useState('reader');
  const [niche, setNiche] = useState('Education');
  const [name, setName] = useState('');

  // Effect to navigate if already registered
  useEffect(() => {
    if (user) {
      navigate(user.role === 'author' ? '/dashboard' : '/');
    }
  }, [user, navigate]);

  // Set initial name from firebase if available
  useEffect(() => {
    if (firebaseUser && !name) {
      setName(firebaseUser.displayName || '');
    }
  }, [firebaseUser, name]);

  const handleSocialLogin = async () => {
    await login();
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    await register(role, name, role === 'author' ? niche : undefined);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 bg-slate-950">
      <div className="hidden lg:flex relative bg-slate-950 overflow-hidden items-center justify-center p-12 border-r border-slate-800">
        <div className="absolute top-0 left-0 w-full h-full">
           <img 
            src="https://picsum.photos/seed/library-dark/1200/800?blur=5" 
            className="w-full h-full object-cover opacity-20" 
            alt="Library"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 space-y-6 max-w-lg text-white">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-900/50">
            <Book className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-5xl font-bold text-white tracking-tight leading-tight">Elevate Your Reading Experience</h2>
          <p className="text-xl text-slate-400 font-light">Join a global community of readers and creators. Access thousands of books or publish your own stories.</p>
          
          <div className="flex items-center gap-6 py-8">
            <div className="h-14 w-14 rounded-2xl border border-slate-800 flex items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer">
              <Mail className="h-6 w-6 text-slate-300" />
            </div>
            <div className="h-14 w-14 rounded-2xl border border-slate-800 flex items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer">
              <Github className="h-6 w-6 text-slate-300" />
            </div>
            <div className="h-14 w-14 rounded-2xl border border-slate-800 flex items-center justify-center bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer">
              <UserPlus className="h-6 w-6 text-slate-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md space-y-8">
          <div className="flex items-center gap-2 mb-8">
            <Link to="/">
              <Button variant="ghost" size="sm" className="text-slate-400 hover:text-white hover:bg-slate-900 gap-2">
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>

          {!firebaseUser ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center shadow-xl">
                  <UserPlus className="h-10 w-10 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-white">Welcome Back</h3>
                  <p className="text-slate-500">Sign in to access your digital library</p>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  onClick={handleSocialLogin}
                  className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-500 rounded-2xl transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-900/20"
                >
                  <Mail className="h-6 w-6" />
                  Continue with Google
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    onClick={handleSocialLogin}
                    className="h-14 rounded-2xl border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all text-slate-300 gap-2"
                  >
                    <Mail className="h-4 w-4" />
                    Github
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleSocialLogin}
                    className="h-14 rounded-2xl border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all text-slate-300 gap-2"
                  >
                    <UserPlus className="h-4 w-4" />
                    Email
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="w-20 h-20 bg-blue-600/10 border border-blue-500/20 rounded-full flex items-center justify-center shadow-xl">
                  <UserPlus className="h-10 w-10 text-blue-500" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-3xl font-bold text-white">Select Your Role</h3>
                  <p className="text-slate-500">Tell us how you'll be using BookStore</p>
                </div>
              </div>

              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-slate-300">Display Name</Label>
                    <Input 
                      placeholder="Your name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="h-14 bg-slate-900 border-slate-800 focus:ring-blue-600/50 rounded-xl text-white placeholder:text-slate-600" 
                      required 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-300">Join as</Label>
                    <Select value={role} onValueChange={(val) => setRole(val)}>
                      <SelectTrigger className="h-14 bg-slate-900 border-slate-800 rounded-xl">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                        <SelectItem value="reader">Reader</SelectItem>
                        <SelectItem value="author">Author</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {role === 'author' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-2"
                    >
                      <Label className="text-slate-300">Primary Niche</Label>
                      <Select value={niche} onValueChange={(val) => setNiche(val)}>
                        <SelectTrigger className="h-14 bg-slate-900 border-slate-800 rounded-xl">
                          <SelectValue placeholder="Select niche" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="Education">Education</SelectItem>
                          <SelectItem value="Comic">Comic</SelectItem>
                          <SelectItem value="Novel">Novel</SelectItem>
                          <SelectItem value="Poetry">Poetry</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  )}
                </div>

                <Button type="submit" className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-lg shadow-blue-900/20 mt-6">
                  Complete Registration
                </Button>
              </form>
            </motion.div>
          )}

          <div className="pt-8 text-center">
            <Link to="/" className="text-sm text-slate-600 hover:text-slate-400 transition-colors">
              Continue with Guest Access
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
