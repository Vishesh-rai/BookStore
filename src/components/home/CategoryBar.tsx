/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Niche } from '@/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CategoryBarProps {
  selected: string;
  onSelect: (category: string) => void;
}

const CATEGORIES = ['All', 'Education', 'Comic', 'Novel', 'Poetry'];

export function CategoryBar({ selected, onSelect }: CategoryBarProps) {
  return (
    <div className="w-full border-b border-slate-800 bg-slate-950/50 backdrop-blur sticky top-16 z-40">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((cat) => (
            <Button
              key={cat}
              variant="ghost"
              onClick={() => onSelect(cat)}
              className={cn(
                "rounded-lg whitespace-nowrap transition-all px-4 py-2 text-sm",
                selected === cat 
                  ? "bg-blue-600/10 text-blue-400 font-medium" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}

