'use client';

import React from 'react';
import { Search, X, CalendarDays, ListOrdered, Download } from 'lucide-react';
import { getCategoryConfig } from '@/lib/constants/calendar';

export interface CalendarHeaderBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string | null;
  onCategoryChange: (cat: string | null) => void;
  activeView: 'grid' | 'agenda';
  onViewChange: (view: 'grid' | 'agenda') => void;
  categories: string[];
  onSyncAll?: () => void;
}

export default function CalendarHeaderBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  activeView,
  onViewChange,
  categories,
  onSyncAll,
}: CalendarHeaderBarProps) {
  return (
    <div className="p-1.5 sm:p-2 bg-emerald-950/5 dark:bg-white/5 ring-1 ring-emerald-950/10 dark:ring-white/10 rounded-2xl sm:rounded-3xl">
      <div className="bg-white dark:bg-card rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm space-y-3 sm:space-y-3.5 border border-slate-100 dark:border-slate-800/80">
        {/* Top Controls: Search + View Switcher + Sync Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3">
          {/* Search Input Bar */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Cari agenda atau kegiatan..."
              aria-label="Cari agenda atau kegiatan"
              className="w-full pl-9 pr-9 h-10 sm:h-9 text-sm sm:text-xs rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                aria-label="Hapus pencarian"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Group: View Toggle Pill + Sync Button */}
          <div className="flex items-center gap-2 shrink-0">
            {/* View Switcher Pill */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900/90 rounded-xl border border-slate-200/60 dark:border-slate-800">
              <button
                type="button"
                onClick={() => onViewChange('grid')}
                className={`h-8 sm:h-7 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'grid'
                    ? 'bg-white dark:bg-card text-emerald-800 dark:text-emerald-300 shadow-sm border border-slate-200/50 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5" />
                <span>Kalender</span>
              </button>
              <button
                type="button"
                onClick={() => onViewChange('agenda')}
                className={`h-8 sm:h-7 px-3 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  activeView === 'agenda'
                    ? 'bg-white dark:bg-card text-emerald-800 dark:text-emerald-300 shadow-sm border border-slate-200/50 dark:border-slate-700'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Agenda</span>
              </button>
            </div>

            {/* Sync Button */}
            {onSyncAll && (
              <button
                type="button"
                onClick={onSyncAll}
                className="h-10 sm:h-9 px-3 rounded-xl border border-emerald-200 dark:border-emerald-800/80 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 active:scale-[0.98] transition-all text-xs font-semibold flex items-center gap-1.5 shrink-0"
                title="Ekspor dan sinkronkan seluruh jadwal ke kalender ponsel (.ics)"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sync Semua</span>
                <span className="sm:hidden">.ics</span>
              </button>
            )}
          </div>
        </div>

        {/* Category Filter Chips Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 scrollbar-none sm:flex-wrap">
          <button
            type="button"
            onClick={() => onCategoryChange(null)}
            className={`shrink-0 whitespace-nowrap min-w-max px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === null
                ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-600'
                : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            Semua
          </button>

          {categories.map((category) => {
            const config = getCategoryConfig(category);
            const isSelected = selectedCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => onCategoryChange(category)}
                className={`shrink-0 whitespace-nowrap min-w-max px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-600'
                    : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: config.dotColor }}
                />
                <span>{category}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
