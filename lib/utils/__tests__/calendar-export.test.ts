import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  categoryColors,
  availableCategories,
  getCategoryConfig,
} from '@/lib/constants/calendar';
import {
  generateICalEvent,
  generateICalContent,
  downloadICalFile,
  createGoogleCalendarUrl,
} from '../calendar-export';
import type { CalendarEvent } from '../calendar-query';

describe('Calendar Constants & Category Configs', () => {
  it('maintains backward compatibility with categoryColors and availableCategories', () => {
    expect(categoryColors).toBeDefined();
    expect(typeof categoryColors['Libur Umum']).toBe('string');
    expect(availableCategories).toContain('Libur Umum');
    expect(availableCategories).toContain('Kegiatan Sekolah');
    expect(availableCategories.length).toBeGreaterThan(5);
  });

  it('maps known categories to WCAG AA compliant styling', () => {
    const liburConfig = getCategoryConfig('Libur Umum');
    expect(liburConfig.label).toBe('Libur Umum');
    expect(liburConfig.bgClass).toBe('bg-rose-50');
    expect(liburConfig.borderClass).toBe('border-rose-200');
    expect(liburConfig.textClass).toBe('text-rose-900');
    expect(liburConfig.dotColor).toBe('#e11d48');

    const kegiatanConfig = getCategoryConfig('Kegiatan Sekolah');
    expect(kegiatanConfig.bgClass).toBe('bg-emerald-50');
    expect(kegiatanConfig.borderClass).toBe('border-emerald-200');
    expect(kegiatanConfig.textClass).toBe('text-emerald-900');
    expect(kegiatanConfig.dotColor).toBe('#16a34a');

    const parentingConfig = getCategoryConfig('Parenting');
    expect(parentingConfig.bgClass).toBe('bg-blue-50');
    expect(parentingConfig.borderClass).toBe('border-blue-200');
    expect(parentingConfig.textClass).toBe('text-blue-900');
    expect(parentingConfig.dotColor).toBe('#2563eb');
  });

  it('provides a safe fallback for unknown or null categories', () => {
    const unknownConfig = getCategoryConfig('Kategori Tidak Diketahui');
    expect(unknownConfig.label).toBe('Kategori Tidak Diketahui');
    expect(unknownConfig.bgClass).toBe('bg-slate-50');
    expect(unknownConfig.borderClass).toBe('border-slate-200');
    expect(unknownConfig.textClass).toBe('text-slate-900');
    expect(unknownConfig.dotColor).toBe('#64748b');

    const nullConfig = getCategoryConfig(null);
    expect(nullConfig.label).toBe('Lainnya');
    expect(nullConfig.bgClass).toBe('bg-slate-50');
  });
});

describe('Calendar Export Engine (iCalendar RFC 5545 & Google Calendar)', () => {
  const singleDayEvent: CalendarEvent = {
    id: 101,
    judul: 'Upacara HUT RI ke-80',
    tanggal: '2025-08-17',
    kategori: 'Kegiatan Sekolah',
    deskripsi: 'Upacara bendera peringatan kemerdekaan di lapangan sekolah.',
    waktu: '07:00 - 09:30 WIB',
    warna: '#16a34a',
  };

  const multiDayEvent: CalendarEvent = {
    id: 102,
    judul: 'Libur Akhir Semester Gasal',
    tanggal: '2025-12-22',
    tanggal_berakhir: '2026-01-02',
    kategori: 'Libur Semester',
    deskripsi: 'Libur semester gasal untuk seluruh jenjang.',
    warna: '#0284c7',
  };

  describe('generateICalEvent', () => {
    it('generates valid RFC 5545 VEVENT for single-day event with exclusive DTEND', () => {
      const icalEvent = generateICalEvent(singleDayEvent);

      expect(icalEvent).toContain('BEGIN:VEVENT');
      expect(icalEvent).toContain('UID:event-101-20250817@mimpkdimoro.sch.id');
      expect(icalEvent).toContain('DTSTART;VALUE=DATE:20250817');
      // For single-day all-day event on Aug 17, DTEND must be Aug 18
      expect(icalEvent).toContain('DTEND;VALUE=DATE:20250818');
      expect(icalEvent).toContain('SUMMARY:Upacara HUT RI ke-80');
      expect(icalEvent).toContain('CATEGORIES:Kegiatan Sekolah');
      expect(icalEvent).toContain('DESCRIPTION:Waktu: 07:00 - 09:30 WIB\\n\\nUpacara bendera peringatan kemerdekaan di lapangan sekolah.');
      expect(icalEvent).toContain('STATUS:CONFIRMED');
      expect(icalEvent).toContain('END:VEVENT');
    });

    it('generates valid RFC 5545 VEVENT for multi-day event with exclusive DTEND', () => {
      const icalEvent = generateICalEvent(multiDayEvent);

      expect(icalEvent).toContain('BEGIN:VEVENT');
      expect(icalEvent).toContain('DTSTART;VALUE=DATE:20251222');
      // Multi-day ending 2026-01-02, exclusive DTEND must be 2026-01-03
      expect(icalEvent).toContain('DTEND;VALUE=DATE:20260103');
      expect(icalEvent).toContain('SUMMARY:Libur Akhir Semester Gasal');
      expect(icalEvent).toContain('CATEGORIES:Libur Semester');
      expect(icalEvent).toContain('END:VEVENT');
    });

    it('properly escapes special characters in iCal text', () => {
      const specialEvent: CalendarEvent = {
        id: 103,
        judul: 'Rapat Guru, Staf & Komite; Penting!',
        tanggal: '2025-09-01',
        kategori: 'Kegiatan Sekolah',
        deskripsi: 'Agenda:\n1. Kurikulum\n2. Evaluasi; persiapan.',
        warna: '#16a34a',
      };

      const ical = generateICalEvent(specialEvent);
      expect(ical).toContain('SUMMARY:Rapat Guru\\, Staf & Komite\\; Penting!');
      expect(ical).toContain('DESCRIPTION:Agenda:\\n1. Kurikulum\\n2. Evaluasi\\; persiapan.');
    });
  });

  describe('generateICalContent', () => {
    it('wraps multiple events in standard VCALENDAR format', () => {
      const icalCalendar = generateICalContent([singleDayEvent, multiDayEvent]);

      expect(icalCalendar).toContain('BEGIN:VCALENDAR');
      expect(icalCalendar).toContain('VERSION:2.0');
      expect(icalCalendar).toContain('PRODID:-//MIM PK Dimoro//Academic Calendar//ID');
      expect(icalCalendar).toContain('CALSCALE:GREGORIAN');
      expect(icalCalendar).toContain('METHOD:PUBLISH');
      expect(icalCalendar).toContain('X-WR-CALNAME:Kalender Akademik MIM PK Dimoro');
      expect(icalCalendar).toContain('SUMMARY:Upacara HUT RI ke-80');
      expect(icalCalendar).toContain('SUMMARY:Libur Akhir Semester Gasal');
      expect(icalCalendar).toContain('END:VCALENDAR');
    });

    it('supports custom calendar name and single event input', () => {
      const ical = generateICalContent(singleDayEvent, 'Kalender Khusus Guru');
      expect(ical).toContain('X-WR-CALNAME:Kalender Khusus Guru');
      expect(ical).toContain('SUMMARY:Upacara HUT RI ke-80');
    });
  });

  describe('createGoogleCalendarUrl', () => {
    it('creates correct Google Calendar URL for single day event', () => {
      const urlString = createGoogleCalendarUrl(singleDayEvent);
      const url = new URL(urlString);

      expect(url.origin).toBe('https://calendar.google.com');
      expect(url.pathname).toBe('/calendar/render');
      expect(url.searchParams.get('action')).toBe('TEMPLATE');
      expect(url.searchParams.get('text')).toBe('Upacara HUT RI ke-80');
      // Single-day dates parameter format: 20250817/20250818
      expect(url.searchParams.get('dates')).toBe('20250817/20250818');
      expect(url.searchParams.get('details')).toContain('07:00 - 09:30 WIB');
      expect(url.searchParams.get('details')).toContain('Upacara bendera peringatan kemerdekaan di lapangan sekolah.');
      expect(url.searchParams.get('location')).toBe('MIM PK Dimoro');
    });

    it('creates correct Google Calendar URL for multi-day event', () => {
      const urlString = createGoogleCalendarUrl(multiDayEvent);
      const url = new URL(urlString);

      expect(url.searchParams.get('text')).toBe('Libur Akhir Semester Gasal');
      // Multi-day dates format: 20251222/20260103
      expect(url.searchParams.get('dates')).toBe('20251222/20260103');
    });
  });

  describe('downloadICalFile', () => {
    beforeEach(() => {
      global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/test');
      global.URL.revokeObjectURL = vi.fn();
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('safely triggers anchor click and revokes object URL in browser', () => {
      const clickSpy = vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {});
      const appendSpy = vi.spyOn(document.body, 'appendChild');
      const removeSpy = vi.spyOn(document.body, 'removeChild');

      expect(() => {
        downloadICalFile(singleDayEvent, 'kalender.ics');
      }).not.toThrow();

      expect(global.URL.createObjectURL).toHaveBeenCalled();
      expect(appendSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(removeSpy).toHaveBeenCalled();
      expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('blob:http://localhost/test');
    });
  });
});
