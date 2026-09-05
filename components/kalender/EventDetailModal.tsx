'use client';

import React from 'react';
import type { CalendarEvent } from '@/lib/utils/calendar-query';
import { getCategoryConfig } from '@/lib/constants/calendar';
import { createGoogleCalendarUrl, downloadICalFile } from '@/lib/utils/calendar-export';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Calendar, Clock, CalendarRange, ExternalLink, Download } from 'lucide-react';

export interface EventDetailModalProps {
  date: Date | null;
  events: CalendarEvent[];
  isOpen: boolean;
  onClose: () => void;
}

const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const namaBulan = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

function formatFullDate(d: Date): string {
  const dayName = namaHari[d.getDay()];
  const dayNum = d.getDate();
  const monthName = namaBulan[d.getMonth()];
  const year = d.getFullYear();
  return `${dayName}, ${dayNum} ${monthName} ${year}`;
}

function formatDateToIsoString(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function EventDetailModal({
  date,
  events,
  isOpen,
  onClose,
}: EventDetailModalProps) {
  if (!date) return null;

  const dateIso = formatDateToIsoString(date);
  const formattedTitle = formatFullDate(date);

  // Filter events active on this date
  const eventsOnDate = events.filter((event) => {
    const start = event.tanggal.slice(0, 10);
    const end = (event.tanggal_berakhir || event.tanggal).slice(0, 10);
    return dateIso >= start && dateIso <= end;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg w-full max-h-[85vh] overflow-y-auto p-4 sm:p-6 rounded-2xl sm:rounded-3xl border border-emerald-950/10 dark:border-white/10 bg-white dark:bg-card">
        <DialogHeader className="space-y-1 text-left pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Calendar className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-wider">Detail Kegiatan</span>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            {formattedTitle}
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
            {eventsOnDate.length > 0
              ? `Terdapat ${eventsOnDate.length} agenda kegiatan pada tanggal ini.`
              : 'Tidak ada agenda kegiatan khusus pada tanggal ini.'}
          </DialogDescription>
        </DialogHeader>

        {eventsOnDate.length === 0 ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Tidak ada kegiatan terjadwal
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Hari ini berlangsung kegiatan belajar mengajar reguler atau hari libur operasional.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5 pt-2">
            {eventsOnDate.map((event) => {
              const catConfig = getCategoryConfig(event.kategori);
              const gcalUrl = createGoogleCalendarUrl(event);

              return (
                <div
                  key={event.id}
                  className="p-1.5 sm:p-2 bg-emerald-950/5 dark:bg-white/5 ring-1 ring-emerald-950/10 dark:ring-white/10 rounded-2xl"
                >
                  <div className="bg-white dark:bg-card rounded-xl p-3.5 sm:p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2.5">
                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${catConfig.bgClass} ${catConfig.textClass} ${catConfig.borderClass}`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ backgroundColor: catConfig.dotColor }}
                        />
                        <span>{event.kategori}</span>
                      </span>

                      {event.tanggal_berakhir && event.tanggal_berakhir !== event.tanggal && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                          <CalendarRange className="w-3 h-3 text-slate-500" />
                          <span>
                            {event.tanggal.slice(0, 10)} s/d {event.tanggal_berakhir.slice(0, 10)}
                          </span>
                        </span>
                      )}

                      {event.waktu && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{event.waktu}</span>
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                      {event.judul}
                    </h4>

                    {/* Description */}
                    {event.deskripsi && (
                      <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {event.deskripsi}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-end gap-2">
                      <a
                        href={gcalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="h-8 px-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900 transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Google Calendar</span>
                      </a>

                      <button
                        type="button"
                        onClick={() => downloadICalFile(event)}
                        className="h-8 px-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-xs font-semibold inline-flex items-center gap-1.5"
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
        )}
      </DialogContent>
    </Dialog>
  );
}
