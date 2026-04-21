
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { BookOpen } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950"
    >
      <div className="relative">
        {/* Pulsing ring */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ 
            repeat: Infinity, 
            duration: 2, 
            ease: "easeOut" 
          }}
          className="absolute inset-0 border-4 border-blue-500 rounded-full"
        />
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { repeat: Infinity, duration: 8, ease: "linear" },
            scale: { repeat: Infinity, duration: 2, ease: "easeInOut" }
          }}
          className="relative z-10 w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20"
        >
          <BookOpen className="w-12 h-12 text-white" />
        </motion.div>
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <h2 className="text-xl font-bold text-white tracking-tight">BookStore</h2>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          <span className="text-slate-400 text-sm font-medium ml-1">Loading your library...</span>
        </div>
      </motion.div>
    </motion.div>
  );
}
