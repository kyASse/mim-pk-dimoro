import { describe, it, expect } from 'vitest';
import {
  calculatePendaftarStats,
  getStatusBadgeVariant,
  getStatusDisplayText,
  type PendaftarData
} from '../pendaftar-stats';

describe('pendaftar-stats utilities', () => {
  describe('calculatePendaftarStats', () => {
    it('should return all zeros if pendaftarData is null', () => {
      const stats = calculatePendaftarStats(null);
      expect(stats).toEqual({
        totalPendaftar: 0,
        menungguPersetujuan: 0,
        pendaftarDisetujui: 0,
        validasiUlang: 0,
        pendaftarDitolak: 0,
      });
    });

    it('should calculate stats correctly for a mixed array of data', () => {
      const mockData: PendaftarData[] = [
        { id: '1', status_pendaftaran: 'Diterima' },
        { id: '2', status_pendaftaran: 'Revisi' },
        { id: '3', status_pendaftaran: 'Ditolak' },
        { id: '4', status_pendaftaran: 'Belum Divalidasi' },
        { id: '5', status_pendaftaran: 'Diproses' },
        { id: '6', status_pendaftaran: 'Diterima' },
      ];

      const stats = calculatePendaftarStats(mockData);
      expect(stats).toEqual({
        totalPendaftar: 6,
        pendaftarDisetujui: 2, // 2 Diterima
        validasiUlang: 1, // 1 Revisi
        pendaftarDitolak: 1, // 1 Ditolak
        menungguPersetujuan: 2, // 1 Belum Divalidasi, 1 Diproses
      });
    });

    it('should handle an empty array', () => {
      const stats = calculatePendaftarStats([]);
      expect(stats).toEqual({
        totalPendaftar: 0,
        menungguPersetujuan: 0,
        pendaftarDisetujui: 0,
        validasiUlang: 0,
        pendaftarDitolak: 0,
      });
    });
  });

  describe('getStatusBadgeVariant', () => {
    it('should return correct variant for Diterima', () => {
      expect(getStatusBadgeVariant('Diterima')).toBe('default');
    });

    it('should return correct variant for Revisi', () => {
      expect(getStatusBadgeVariant('Revisi')).toBe('outline');
    });

    it('should return correct variant for Ditolak', () => {
      expect(getStatusBadgeVariant('Ditolak')).toBe('destructive');
    });

    it('should return secondary for unknown status', () => {
      expect(getStatusBadgeVariant('Unknown')).toBe('secondary');
    });
  });

  describe('getStatusDisplayText', () => {
    it('should return the status text correctly', () => {
      expect(getStatusDisplayText('Diterima')).toBe('Diterima');
      expect(getStatusDisplayText('Revisi')).toBe('Revisi');
      expect(getStatusDisplayText('Ditolak')).toBe('Ditolak');
      expect(getStatusDisplayText('Belum Divalidasi')).toBe('Belum Divalidasi');
    });

    it('should fallback correctly for empty status', () => {
      expect(getStatusDisplayText('')).toBe('Belum Divalidasi');
    });

    it('should return the passed status if not matching specific cases', () => {
      expect(getStatusDisplayText('Diproses')).toBe('Diproses');
    });
  });
});
