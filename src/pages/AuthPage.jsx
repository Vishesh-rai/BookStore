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
import { Book, ChevronLeft, Github, Mail, UserPlus, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register, user, firebaseUser, loading, needsRegistration } = useAuth();
  
  const [role, setRole] = useState('reader');
  const [niche, setNiche] = useState('Education');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if logged in and registered
  useEffect(() => {
    if (user && !needsRegistration) {
      navigate(user.role === 'author' ? '/dashboard' : '/');
    }
  }, [user, needsRegistration, navigate]);

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
    setIsSubmitting(true);
    try {
      await register(role, name, role === 'author' ? niche : undefined);
    } catch (error) {
       setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] grid lg:grid-cols-2 bg-slate-950 overflow-hidden">
      {/* Left Panel - Visual */}
      <div className="hidden lg:flex relative bg-slate-950 overflow-hidden items-center justify-center p-12 border-r border-slate-800">
        <div className="absolute inset-0">
           <img 
            src="https://picsum.photos/seed/library-dark/1200/800?blur=5" 
            className="w-full h-full object-cover opacity-10" 
            alt="Library"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/90 to-blue-900/10" />
        </div>
        
        <div className="relative z-10 space-y-8 max-w-lg">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center shadow-3xl shadow-blue-500/30"
          >
            <Book className="h-10 w-10 text-white" />
          </motion.div>
          
          <div className="space-y-4">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-6xl font-bold text-white tracking-tighter leading-[1.1]"
            >
              The Modern <br />
              <span className="text-blue-500">Digital Library.</span>
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-xl text-slate-400 font-light leading-relaxed"
            >
              Access a curated collection of knowledge or share your stories with a global audience. Your journey starts here.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-4 pt-4"
          >
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img 
                  key={i} 
                  src={`https://i.pravatar.cc/150?u=${i}`} 
                  className="w-10 h-10 rounded-full border-2 border-slate-950" 
                  alt="Avatar"
                  referrerPolicy="no-referrer"
                />
              ))}
            </div>
            <p className="text-sm text-slate-500 font-medium">+12k readers joined this week</p>
          </motion.div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex items-center justify-center p-8 lg:p-16 relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/5 rounded-full blur-[100px] -z-10" />
        
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!firebaseUser ? (
              <motion.div 
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-10"
              >
                <div className="space-y-3">
                  <h3 className="text-4xl font-bold text-white tracking-tight">Get Started</h3>
                  <p className="text-slate-500 text-lg">Choose your preferred way to continue</p>
                </div>

                <div className="grid gap-4">
                  <Button 
                    onClick={handleSocialLogin}
                    className="w-full h-16 text-lg bg-white text-slate-950 hover:bg-slate-200 rounded-2xl transition-all flex items-center justify-center gap-3 font-bold group"
                  >
                    <Mail className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    Continue with Google
                  </Button>
                  
                  <div className="relative py-4 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                    <span className="relative bg-slate-950 px-4 text-xs text-slate-600 uppercase font-bold tracking-widest">or</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      variant="outline" 
                      className="h-14 rounded-2xl border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all text-slate-300 font-semibold gap-2"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </Button>
                    <Link to="/" className="h-full">
                      <Button 
                        variant="outline" 
                        className="w-full h-14 rounded-2xl border-slate-800 bg-slate-900/50 hover:bg-slate-800 transition-all text-slate-300 font-semibold gap-2"
                      >
                        Guest
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="register"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-500 text-xs font-bold uppercase tracking-wider mb-2">
                    <Sparkles className="w-3 h-3" />
                    Account Found
                  </div>
                  <h3 className="text-4xl font-bold text-white tracking-tight">One Last Step</h3>
                  <p className="text-slate-500">Configure your profile to start exploring.</p>
                </div>

                <form onSubmit={handleRegister} className="space-y-6">
                  <div className="space-y-6 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                    <div className="space-y-2">
                      <Label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">Display Name</Label>
                      <Input 
                        placeholder="John Doe" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        className="h-14 bg-slate-950 border-slate-800 focus:ring-blue-600/50 rounded-xl text-white font-medium" 
                        required 
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">I am a...</Label>
                      <Select value={role} onValueChange={(val) => setRole(val)} disabled={isSubmitting}>
                        <SelectTrigger className="h-14 bg-slate-950 border-slate-800 rounded-xl">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800 text-slate-200">
                          <SelectItem value="reader">Reader (I want to enjoy books)</SelectItem>
                          <SelectItem value="author">Author (I want to publish PDFs)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <AnimatePresence>
                      {role === 'author' && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2 overflow-hidden"
                        >
                          <Label className="text-slate-400 text-xs font-bold uppercase tracking-widest pl-1">My Primary Niche</Label>
                          <Select value={niche} onValueChange={(val) => setNiche(val)} disabled={isSubmitting}>
                            <SelectTrigger className="h-14 bg-slate-950 border-slate-800 rounded-xl">
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
                    </AnimatePresence>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full h-16 text-lg bg-blue-600 hover:bg-blue-500 rounded-2xl shadow-xl shadow-blue-900/30 font-bold transition-all disabled:opacity-70"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Setting up your account...
                      </div>
                    ) : (
                      'Finish & Launch'
                    )}
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
