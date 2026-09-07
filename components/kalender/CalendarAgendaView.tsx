'use client';

import React from 'react';
import type { CalendarEvent } from '@/lib/utils/calendar-query';
import { getCategoryConfig } from '@/lib/constants/calendar';
import { createGoogleCalendarUrl, downloadICalFile } from '@/lib/utils/calendar-export';
import { Calendar, Clock, CalendarRange, ExternalLink, Download, SearchX, RotateCcw } from 'lucide-react';

export interface CalendarAgendaViewProps {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
  onResetFilter?: () => void;
}

const bulanIndonesiaShort = [
  'JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN',
  'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES'
];

const bulanIndonesiaFull = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

function formatRangeDates(startDateStr: string, endDateStr?: string): string | null {
  if (!endDateStr || endDateStr === startDateStr) return null;

  const start = new Date(startDateStr);
  const end = new Date(endDateStr);

  const startFormatted = `${start.getDate()} ${bulanIndonesiaShort[start.getMonth()]} ${start.getFullYear()}`;
  const endFormatted = `${end.getDate()} ${bulanIndonesiaShort[end.getMonth()]} ${end.getFullYear()}`;

  return `${startFormatted} - ${endFormatted}`;
}

export default function CalendarAgendaView({
  events,
  onSelectEvent,
  onResetFilter,
}: CalendarAgendaViewProps) {
  // Empty state
  if (events.length === 0) {
    return (
      <div className="p-1.5 sm:p-2 bg-emerald-950/5 dark:bg-white/5 ring-1 ring-emerald-950/10 dark:ring-white/10 rounded-2xl sm:rounded-3xl">
        <div className="bg-white dark:bg-card rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 flex items-center justify-center mx-auto">
            <SearchX className="w-6 h-6" />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            Tidak ada kegiatan ditemukan
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Tidak ada agenda akademik yang sesuai dengan kata kunci pencarian atau kategori yang dipilih.
          </p>
          {onResetFilter && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onResetFilter}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filter</span>
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Sort events chronologically
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime()
  );

  // Group by Month & Year
  const groupedEvents: { [key: string]: { label: string; events: CalendarEvent[] } } = {};

  sortedEvents.forEach((event) => {
    const d = new Date(event.tanggal);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${bulanIndonesiaFull[d.getMonth()]} ${d.getFullYear()}`;

    if (!groupedEvents[key]) {
      groupedEvents[key] = { label, events: [] };
    }
    groupedEvents[key].events.push(event);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedEvents).map(([key, group]) => (
        <div key={key} className="space-y-3">
          {/* Month Section Header */}
          <div className="flex items-center gap-2 pb-2 border-b border-emerald-950/10 dark:border-white/10">
            <Calendar className="w-4 h-4 text-emerald-700 dark:text-emerald-400" />
            <h3 className="text-base sm:text-lg font-bold text-emerald-950 dark:text-emerald-100">
              {group.label}
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-auto">
              {group.events.length} kegiatan
            </span>
          </div>

          {/* List of Events in Month */}
          <div className="space-y-3">
            {group.events.map((event) => {
              const eventDate = new Date(event.tanggal);
              const dayNum = eventDate.getDate();
              const monthShort = bulanIndonesiaShort[eventDate.getMonth()];
              const dayName = namaHari[eventDate.getDay()];
              const catConfig = getCategoryConfig(event.kategori);
              const dateRangeText = formatRangeDates(event.tanggal, event.tanggal_berakhir);
              const gcalUrl = createGoogleCalendarUrl(event);

              return (
                <div
                  key={event.id}
                  className="p-1.5 sm:p-2 bg-emerald-950/5 dark:bg-white/5 ring-1 ring-emerald-950/10 dark:ring-white/10 rounded-2xl transition-transform hover:-translate-y-0.5 duration-200"
                >
                  <div className="bg-white dark:bg-card rounded-xl p-3.5 sm:p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    {/* Left: Date Badge Box + Content */}
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                      {/* Large Date Badge Box */}
                      <div className="w-14 sm:w-16 shrink-0 text-center py-2 px-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs">
                        <span className="block text-lg sm:text-2xl font-black text-emerald-900 dark:text-emerald-100 leading-none mb-0.5">
                          {dayNum}
                        </span>
                        <span className="block text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 leading-tight">
                          {monthShort}
                        </span>
                        <span className="block text-[9.5px] text-emerald-600/80 dark:text-emerald-400/70 leading-tight">
                          {dayName}
                        </span>
                      </div>

                      {/* Event Details */}
                      <div className="min-w-0 flex-1 space-y-1">
                        {/* Category & Range Badges */}
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${catConfig.bgClass} ${catConfig.textClass} ${catConfig.borderClass}`}
                          >
                            <span
                              className="w-1.5 h-1.5 rounded-full shrink-0"
                              style={{ backgroundColor: catConfig.dotColor }}
                            />
                            <span>{event.kategori}</span>
                          </span>

                          {dateRangeText && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                              <CalendarRange className="w-3 h-3 text-slate-500" />
                              <span>{dateRangeText}</span>
                            </span>
                          )}

                          {event.waktu && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                              <Clock className="w-3 h-3 text-slate-500" />
                              <span>{event.waktu}</span>
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4
                          onClick={() => onSelectEvent?.(event)}
                          className={`font-bold text-slate-900 dark:text-white text-sm sm:text-base leading-snug ${
                            onSelectEvent ? 'cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400' : ''
                          }`}
                        >
                          {event.judul}
                        </h4>

                        {/* Description */}
                        {event.deskripsi && (
                          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-0.5">
                            {event.deskripsi}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex sm:flex-col items-center gap-1.5 shrink-0 self-end sm:self-center w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800/80">
                      <a
                        href={gcalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/70 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Calendar</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => downloadICalFile(event)}
                        className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
                        title="Unduh jadwal .ics"
                      >
                        <Download className="w-3 h-3" />
                        <span>Unduh .ics</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
