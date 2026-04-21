/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/auth';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { LibraryPage } from './pages/LibraryPage';
import { Toaster } from './components/ui/sonner';
import { ExternalLink, X } from 'lucide-react';

function JoinPrompt() {
  const { user } = useAuth();
  const [show, setShow] = useState(true);

  if (user || !show) return null;

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-blue-600 text-white rounded-2xl p-4 shadow-2xl shadow-blue-900/50 flex items-center gap-4 border border-blue-400/20 z-50 animate-bounce">
      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0">
        <ExternalLink className="w-5 h-5" />
      </div>
      <div className="flex-1">
        <h5 className="text-sm font-bold">Join BookStore!</h5>
        <p className="text-xs text-blue-100">Sign up to download and interact.</p>
      </div>
      <button onClick={() => setShow(false)} className="text-white/60 hover:text-white">
        <X className="w-4 h-4" />
      </button>
      <Link to="/auth" className="absolute inset-0 z-0" />
    </div>
  );
}

function AppRoutes() {
  const { role, user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 transition-colors duration-300 selection:bg-blue-500/30">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route 
          path="/library" 
          element={user ? <LibraryPage /> : <Navigate to="/auth" />} 
        />
        <Route 
          path="/dashboard" 
          element={role === 'author' ? <DashboardPage /> : <Navigate to="/" />} 
        />
        <Route 
          path="/upload" 
          element={role === 'author' ? <DashboardPage /> : <Navigate to="/" />} 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <JoinPrompt />
      <Toaster position="bottom-right" theme="dark" />
    </div>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
