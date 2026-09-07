'use client';

import React from 'react';
import type { CalendarEvent } from '@/lib/utils/calendar-query';
import { getCategoryConfig } from '@/lib/constants/calendar';
import { createGoogleCalendarUrl, downloadICalFile } from '@/lib/utils/calendar-export';
import { Calendar, Clock, ExternalLink, Download } from 'lucide-react';

export interface UpcomingEventsSectionProps {
  events: CalendarEvent[];
  onSelectEvent?: (event: CalendarEvent) => void;
}

function getCountdownBadge(startDateStr: string, endDateStr?: string): { label: string; tone: string } {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(startDateStr);
  start.setHours(0, 0, 0, 0);

  const diffMs = start.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) {
    if (endDateStr) {
      const end = new Date(endDateStr);
      end.setHours(23, 59, 59, 999);
      if (today <= end) {
        return { label: 'Sedang Berlangsung', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
      }
    }
    return { label: 'Hari Ini', tone: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800' };
  }

  if (diffDays === 1) {
    return { label: 'Besok', tone: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-800' };
  }

  if (diffDays >= 2 && diffDays <= 6) {
    return { label: `H-${diffDays} (${diffDays} hari lagi)`, tone: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-800' };
  }

  if (diffDays >= 7 && diffDays < 14) {
    const weeks = Math.floor(diffDays / 7);
    return { label: `${weeks} pekan lagi`, tone: 'bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-800' };
  }

  return { label: `${diffDays} hari lagi`, tone: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700' };
}

function formatIndonesianDate(dateStr: string, endDateStr?: string): string {
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };

  const start = new Date(dateStr);
  const startFormatted = start.toLocaleDateString('id-ID', options);

  if (!endDateStr || endDateStr === dateStr) {
    return startFormatted;
  }

  const end = new Date(endDateStr);
  const endFormatted = end.toLocaleDateString('id-ID', options);
  return `${startFormatted} - ${endFormatted}`;
}

export default function UpcomingEventsSection({
  events,
  onSelectEvent,
}: UpcomingEventsSectionProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Filter events whose end date (or start date) is >= today
  const upcomingAll = events
    .filter((event) => {
      const end = event.tanggal_berakhir ? new Date(event.tanggal_berakhir) : new Date(event.tanggal);
      end.setHours(23, 59, 59, 999);
      return end >= today;
    })
    .sort((a, b) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime());

  if (upcomingAll.length === 0) {
    return null;
  }

  // Filter within next 14 days
  const limit14Days = new Date(today);
  limit14Days.setDate(limit14Days.getDate() + 14);
  limit14Days.setHours(23, 59, 59, 999);

  const within14Days = upcomingAll.filter(
    (event) => new Date(event.tanggal) <= limit14Days
  );

  const displayEvents = within14Days.length > 0 ? within14Days.slice(0, 3) : upcomingAll.slice(0, 3);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-emerald-950 dark:text-emerald-200 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Agenda Terdekat</span>
        </h3>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {displayEvents.length} agenda penting
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
        {displayEvents.map((event) => {
          const countdown = getCountdownBadge(event.tanggal, event.tanggal_berakhir);
          const catConfig = getCategoryConfig(event.kategori);
          const gcalUrl = createGoogleCalendarUrl(event);

          return (
            <div
              key={event.id}
              className="p-1.5 sm:p-2 bg-emerald-950/5 dark:bg-white/5 ring-1 ring-emerald-950/10 dark:ring-white/10 rounded-2xl transition-transform hover:-translate-y-0.5 duration-200"
            >
              <div className="bg-white dark:bg-card rounded-xl p-3.5 sm:p-4 h-full flex flex-col justify-between border border-slate-100 dark:border-slate-800 shadow-sm">
                <div>
                  {/* Top Badges: Countdown + Category */}
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold tracking-wide uppercase border ${countdown.tone}`}
                    >
                      {countdown.label}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold border ${catConfig.bgClass} ${catConfig.textClass} ${catConfig.borderClass}`}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: catConfig.dotColor }}
                      />
                      <span className="truncate max-w-[110px]">{event.kategori}</span>
                    </span>
                  </div>

                  {/* Date & Time */}
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-1 mb-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>{formatIndonesianDate(event.tanggal, event.tanggal_berakhir)}</span>
                  </div>

                  {event.waktu && (
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mb-2">
                      <Clock className="w-3 h-3 shrink-0" />
                      <span>{event.waktu}</span>
                    </div>
                  )}

                  {/* Event Title */}
                  <h4
                    onClick={() => onSelectEvent?.(event)}
                    className={`font-bold text-slate-900 dark:text-white text-sm sm:text-base line-clamp-2 mb-1.5 ${
                      onSelectEvent ? 'cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400' : ''
                    }`}
                  >
                    {event.judul}
                  </h4>

                  {/* Description */}
                  {event.deskripsi && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mb-3">
                      {event.deskripsi}
                    </p>
                  )}
                </div>

                {/* Bottom Quick Calendar Actions */}
                <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 transition-colors"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span>Google Calendar</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadICalFile(event)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
                    title="Simpan file .ics ke perangkat"
                  >
                    <Download className="w-3 h-3" />
                    <span>.ics</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
