/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion } from 'motion/react';

interface HeroProps {
  onSearch: (query: string) => void;
}

export function Hero({ onSearch }: HeroProps) {
  return (
    <section className="relative py-16 px-8 overflow-hidden">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-white tracking-tight"
          >
            Your Digital Library <span className="text-blue-500">Awaits</span>
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-500">
              <Search className="h-5 w-5" />
            </div>
            <Input
              type="text"
              placeholder="Search for titles, authors, or categories..."
              className="w-full h-16 bg-slate-900 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 focus-visible:ring-2 focus-visible:ring-blue-600/50 focus-visible:ring-offset-0 focus:border-blue-600 transition-all text-slate-200 placeholder:text-slate-600 shadow-xl text-lg border-2"
              onChange={(e) => onSearch(e.target.value)}
            />
          </motion.div>
        </div>
      </div>
    </section>

  );
}
