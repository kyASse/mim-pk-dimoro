// lib/utils/__tests__/pesan-utils.test.ts
import { describe, it, expect } from 'vitest';
import {
  formatWhatsAppNumber,
  generateWhatsAppReplyUrl,
  generateMailtoUrl,
  calculatePesanStats,
  generateDefaultReplyMessage,
} from '../pesan-utils';
import { PesanMasuk } from '@/types/pesan';
import { SCHOOL_NAME } from '@/lib/school-config';

describe('pesan-utils', () => {
  describe('formatWhatsAppNumber', () => {
    it('normalizes local 08xx number to international 628xx format', () => {
      expect(formatWhatsAppNumber('08123456789')).toBe('628123456789');
    });

    it('handles number with spaces, dashes, and + signs', () => {
      expect(formatWhatsAppNumber('+62 812-3456-7890')).toBe('6281234567890');
      expect(formatWhatsAppNumber('0812-3456-7890')).toBe('6281234567890');
    });

    it('returns empty string when number is null or empty', () => {
      expect(formatWhatsAppNumber(null)).toBe('');
      expect(formatWhatsAppNumber('')).toBe('');
      expect(formatWhatsAppNumber(undefined)).toBe('');
    });
  });

  describe('generateDefaultReplyMessage', () => {
    it('creates polite school template with sender name and subject', () => {
      const msg = generateDefaultReplyMessage('Ahmad Subarjo', 'Info PPDB');
      expect(msg).toContain('Ahmad Subarjo');
      expect(msg).toContain('Info PPDB');
      expect(msg).toContain(SCHOOL_NAME);
    });

    it('handles null or empty subject gracefully', () => {
      const msg = generateDefaultReplyMessage('Ahmad Subarjo', null);
      expect(msg).toContain('Ahmad Subarjo');
      expect(msg).toContain(SCHOOL_NAME);
    });
  });

  describe('generateWhatsAppReplyUrl', () => {
    it('generates wa.me URL with properly encoded text', () => {
      const url = generateWhatsAppReplyUrl('08123456789', 'Halo Ahmad');
      expect(url).toBe('https://wa.me/628123456789?text=Halo%20Ahmad');
    });

    it('returns empty string if phone number is invalid or empty', () => {
      expect(generateWhatsAppReplyUrl('', 'Halo')).toBe('');
      expect(generateWhatsAppReplyUrl(null, 'Halo')).toBe('');
    });
  });

  describe('generateMailtoUrl', () => {
    it('generates mailto link with encoded subject and body', () => {
      const url = generateMailtoUrl('wali@example.com', 'Info PPDB', 'Halo Bapak');
      expect(url).toContain('mailto:wali@example.com');
      expect(url).toContain(encodeURIComponent(`Re: Info PPDB - ${SCHOOL_NAME}`));
      expect(url).toContain('body=Halo%20Bapak');
    });

    it('returns empty string if email is missing', () => {
      expect(generateMailtoUrl('', 'Info', 'Halo')).toBe('');
    });
  });

  describe('calculatePesanStats', () => {
    it('accurately counts total, belum_dibaca, dibaca, and dibalas', () => {
      const mockData: PesanMasuk[] = [
        {
          id: 1,
          nama_pengirim: 'User 1',
          email_pengirim: 'u1@test.com',
          telepon: '081',
          subjek: 'Sub 1',
          isi_pesan: 'Pesan 1',
          status: 'belum_dibaca',
          created_at: '2026-08-21T10:00:00Z',
          updated_at: '2026-08-21T10:00:00Z',
        },
        {
          id: 2,
          nama_pengirim: 'User 2',
          email_pengirim: 'u2@test.com',
          telepon: '082',
          subjek: 'Sub 2',
          isi_pesan: 'Pesan 2',
          status: 'dibaca',
          created_at: '2026-08-21T10:00:00Z',
          updated_at: '2026-08-21T10:00:00Z',
        },
        {
          id: 3,
          nama_pengirim: 'User 3',
          email_pengirim: 'u3@test.com',
          telepon: '083',
          subjek: 'Sub 3',
          isi_pesan: 'Pesan 3',
          status: 'dibalas',
          created_at: '2026-08-21T10:00:00Z',
          updated_at: '2026-08-21T10:00:00Z',
        },
      ];

      const stats = calculatePesanStats(mockData);
      expect(stats.total).toBe(3);
      expect(stats.belumDibaca).toBe(1);
      expect(stats.dibaca).toBe(1);
      expect(stats.dibalas).toBe(1);
    });

    it('handles null or empty list', () => {
      const stats = calculatePesanStats(null);
      expect(stats.total).toBe(0);
      expect(stats.belumDibaca).toBe(0);
      expect(stats.dibaca).toBe(0);
      expect(stats.dibalas).toBe(0);
    });
  });
});
