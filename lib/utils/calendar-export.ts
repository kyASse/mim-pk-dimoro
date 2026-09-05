// lib/utils/calendar-export.ts

import type { CalendarEvent } from './calendar-query';

/**
 * Format string tanggal (YYYY-MM-DD atau ISO) ke format tanggal iCalendar (YYYYMMDD)
 */
export function formatToICalDate(dateInput: string | Date): string {
  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      return `${match[1]}${match[2]}${match[3]}`;
    }
  }
  const d = new Date(dateInput);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Mengambil tanggal berikutnya (H+1) dalam format iCalendar (YYYYMMDD)
 * Diperlukan untuk DTEND pada event all-day karena spesifikasi RFC 5545 mensyaratkan DTEND bersifat eksklusif.
 */
export function getNextDayICalDate(dateInput: string | Date): string {
  let d: Date;
  if (typeof dateInput === 'string') {
    const match = dateInput.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      d = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    } else {
      d = new Date(dateInput);
    }
  } else {
    d = new Date(dateInput.getTime());
  }
  d.setDate(d.getDate() + 1);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

/**
 * Escape karakter khusus sesuai spesifikasi RFC 5545
 */
export function escapeICalText(text: string): string {
  return text
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\n|\r/g, '\\n');
}

/**
 * Membuat blok VEVENT standar iCalendar (RFC 5545) untuk satu event
 */
export function generateICalEvent(event: CalendarEvent): string {
  const startDateStr = formatToICalDate(event.tanggal);
  const endDateRaw = event.tanggal_berakhir || event.tanggal;
  const endDateStr = getNextDayICalDate(endDateRaw);

  const uid = `event-${event.id || 'mim'}-${startDateStr}@mimpkdimoro.sch.id`;
  const now = new Date();
  const dtstamp = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

  let description = event.deskripsi || '';
  if (event.waktu) {
    description = description ? `Waktu: ${event.waktu}\n\n${description}` : `Waktu: ${event.waktu}`;
  }

  const lines = [
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART;VALUE=DATE:${startDateStr}`,
    `DTEND;VALUE=DATE:${endDateStr}`,
    `SUMMARY:${escapeICalText(event.judul)}`,
    description ? `DESCRIPTION:${escapeICalText(description)}` : '',
    event.kategori ? `CATEGORIES:${escapeICalText(event.kategori)}` : '',
    'STATUS:CONFIRMED',
    'END:VEVENT',
  ].filter(Boolean);

  return lines.join('\r\n');
}

/**
 * Membungkus daftar event dalam struktur VCALENDAR lengkap (RFC 5545)
 */
export function generateICalContent(
  events: CalendarEvent | CalendarEvent[],
  calendarName: string = 'Kalender Akademik MIM PK Dimoro'
): string {
  const eventList = Array.isArray(events) ? events : [events];
  const vevents = eventList.map(generateICalEvent).join('\r\n');

  const header = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//MIM PK Dimoro//Academic Calendar//ID',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${calendarName}`,
  ].join('\r\n');

  const footer = 'END:VCALENDAR';

  return `${header}\r\n${vevents}\r\n${footer}`;
}

/**
 * Men-download file iCalendar (.ics) pada environment browser
 */
export function downloadICalFile(
  events: CalendarEvent | CalendarEvent[],
  filename: string = 'kalender-akademik.ics'
): void {
  if (typeof window === 'undefined') return;

  const content = generateICalContent(events);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename.endsWith('.ics') ? filename : `${filename}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Membuat tautan "Add to Google Calendar" untuk suatu event
 */
export function createGoogleCalendarUrl(event: CalendarEvent): string {
  const startDateStr = formatToICalDate(event.tanggal);
  const endDateRaw = event.tanggal_berakhir || event.tanggal;
  const endDateStr = getNextDayICalDate(endDateRaw);

  const dates = `${startDateStr}/${endDateStr}`;

  let details = event.deskripsi || '';
  if (event.waktu) {
    details = details ? `Waktu: ${event.waktu}\n\n${details}` : `Waktu: ${event.waktu}`;
  }
  if (event.kategori) {
    details = details ? `${details}\nKategori: ${event.kategori}` : `Kategori: ${event.kategori}`;
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.judul,
    dates: dates,
  });

  if (details) {
    params.set('details', details);
  }

  params.set('location', 'MIM PK Dimoro');

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
