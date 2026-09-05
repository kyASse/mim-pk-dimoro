'use client';

import React from 'react';
import type { CalendarEvent } from '@/lib/utils/calendar-query';
import { getCategoryConfig } from '@/lib/constants/calendar';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface CalendarGridViewProps {
  currentDate: Date;
  onNavigateMonth: (dir: 'prev' | 'next') => void;
  onToday: () => void;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onSelectDate: (date: Date) => void;
}

const bulanIndonesia = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

const hariHeaders = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];

function formatDateToIsoString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function CalendarGridView({
  currentDate,
  onNavigateMonth,
  onToday,
  events,
  selectedDate,
  onSelectDate,
}: CalendarGridViewProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const today = new Date();
  const todayIso = formatDateToIsoString(today);
  const selectedIso = selectedDate ? formatDateToIsoString(selectedDate) : null;

  // Monday-first calculation
  const firstDayOfMonth = new Date(year, month, 1);
  const startingDayOffset = (firstDayOfMonth.getDay() + 6) % 7;
  const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

  // Grid cells
  interface DayCellData {
    date: Date;
    dateIso: string;
    dayNumber: number;
    isCurrentMonth: boolean;
    isToday: boolean;
    isSelected: boolean;
  }

  const cells: DayCellData[] = [];

  // Previous month padding
  for (let i = startingDayOffset - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    const dateIso = formatDateToIsoString(d);
    cells.push({
      date: d,
      dateIso,
      dayNumber: d.getDate(),
      isCurrentMonth: false,
      isToday: dateIso === todayIso,
      isSelected: dateIso === selectedIso,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInCurrentMonth; day++) {
    const d = new Date(year, month, day);
    const dateIso = formatDateToIsoString(d);
    cells.push({
      date: d,
      dateIso,
      dayNumber: day,
      isCurrentMonth: true,
      isToday: dateIso === todayIso,
      isSelected: dateIso === selectedIso,
    });
  }

  // Next month padding (complete to next multiple of 7)
  const remainder = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remainder; day++) {
    const d = new Date(year, month + 1, day);
    const dateIso = formatDateToIsoString(d);
    cells.push({
      date: d,
      dateIso,
      dayNumber: day,
      isCurrentMonth: false,
      isToday: dateIso === todayIso,
      isSelected: dateIso === selectedIso,
    });
  }

  // Helper to match events for a given day
  const getEventsForDay = (dateIso: string) => {
    return events.filter((event) => {
      const start = event.tanggal.slice(0, 10);
      const end = (event.tanggal_berakhir || event.tanggal).slice(0, 10);
      return dateIso >= start && dateIso <= end;
    });
  };

  return (
    <div className="p-1.5 sm:p-2 bg-emerald-950/5 dark:bg-white/5 ring-1 ring-emerald-950/10 dark:ring-white/10 rounded-2xl sm:rounded-3xl">
      <div className="bg-white dark:bg-card rounded-xl sm:rounded-2xl p-3 sm:p-5 shadow-sm border border-slate-100 dark:border-slate-800">
        {/* Navigation & Month Header */}
        <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => onNavigateMonth('prev')}
              aria-label="Bulan Sebelumnya"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-950 dark:hover:text-emerald-200 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            <h2 className="text-base sm:text-xl font-bold text-emerald-950 dark:text-emerald-100 px-2 min-w-[140px] sm:min-w-[190px] text-center">
              {bulanIndonesia[month]} {year}
            </h2>

            <button
              type="button"
              onClick={() => onNavigateMonth('next')}
              aria-label="Bulan Berikutnya"
              className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-emerald-100 hover:text-emerald-900 dark:hover:bg-emerald-950 dark:hover:text-emerald-200 transition-colors"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToday}
            className="h-8 sm:h-9 px-3 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors"
          >
            Hari Ini
          </button>
        </div>

        {/* Day-of-Week Column Headers (Monday to Sunday) */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5 mb-1.5 text-center">
          {hariHeaders.map((hari, idx) => (
            <div
              key={hari}
              className={`py-1.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-lg ${
                idx >= 5
                  ? 'text-rose-600 dark:text-rose-400 bg-rose-50/50 dark:bg-rose-950/20'
                  : 'text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50'
              }`}
            >
              {hari}
            </div>
          ))}
        </div>

        {/* Calendar Day Grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-1.5">
          {cells.map((cell) => {
            const dayEvents = getEventsForDay(cell.dateIso);
            const visibleEvents = dayEvents.slice(0, 2);
            const extraCount = dayEvents.length - visibleEvents.length;

            return (
              <div
                key={cell.dateIso}
                onClick={() => onSelectDate(cell.date)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDate(cell.date);
                  }
                }}
                className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between text-left select-none relative group ${
                  cell.isSelected
                    ? 'ring-2 ring-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-400'
                    : cell.isCurrentMonth
                    ? 'bg-white dark:bg-card border-slate-200/80 dark:border-slate-800 hover:border-emerald-400 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 shadow-xs'
                    : 'bg-slate-50/40 dark:bg-slate-900/30 border-slate-100 dark:border-slate-800/40 text-slate-400 dark:text-slate-600 opacity-60'
                }`}
              >
                {/* Day Header Row */}
                <div className="flex items-center justify-between mb-1">
                  {cell.isToday ? (
                    <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center text-[11px] sm:text-xs shadow-sm">
                      {cell.dayNumber}
                    </span>
                  ) : (
                    <span
                      className={`text-xs sm:text-sm font-bold ${
                        cell.isCurrentMonth
                          ? 'text-slate-800 dark:text-slate-200'
                          : 'text-slate-400 dark:text-slate-600'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>
                  )}

                  {dayEvents.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 sm:hidden" />
                  )}
                </div>

                {/* Event Pills (Desktop / Mobile previews) */}
                <div className="space-y-1 overflow-hidden flex-1 flex flex-col justify-start">
                  {visibleEvents.map((event) => {
                    const catConfig = getCategoryConfig(event.kategori);

                    return (
                      <div
                        key={event.id}
                        title={`${event.judul} (${event.kategori})`}
                        className={`text-[10px] sm:text-[11px] leading-tight px-1.5 py-0.5 rounded-md truncate font-medium flex items-center gap-1 border ${catConfig.bgClass} ${catConfig.textClass} ${catConfig.borderClass}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: catConfig.dotColor }}
                        />
                        <span className="truncate">{event.judul}</span>
                      </div>
                    );
                  })}

                  {extraCount > 0 && (
                    <div className="text-[9.5px] sm:text-[10.5px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-center truncate">
                      +{extraCount} lagi
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
