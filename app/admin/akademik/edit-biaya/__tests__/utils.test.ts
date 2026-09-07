import { describe, it, expect } from 'vitest';
import { formatRupiah, parseRupiah, calculateTotals, type BiayaItemRow } from '../utils';

describe('Edit Biaya Utils', () => {
  describe('formatRupiah', () => {
    it('should format numbers into Indonesian Rupiah format with thousand separators', () => {
      expect(formatRupiah(500000)).toBe('500.000');
      expect(formatRupiah(0)).toBe('0');
      expect(formatRupiah(1250000)).toBe('1.250.000');
      expect(formatRupiah(null as any)).toBe('0');
      expect(formatRupiah(undefined as any)).toBe('0');
    });
  });

  describe('parseRupiah', () => {
    it('should parse formatted string into integer number', () => {
      expect(parseRupiah('500.000')).toBe(500000);
      expect(parseRupiah('Rp 1.250.000')).toBe(1250000);
      expect(parseRupiah('0')).toBe(0);
      expect(parseRupiah('')).toBe(0);
      expect(parseRupiah(350000)).toBe(350000);
      expect(parseRupiah('-50.000')).toBe(0); // non-negative safeguard
    });
  });

  describe('calculateTotals', () => {
    it('should calculate total putra, total putri, and selisih accurately', () => {
      const items: BiayaItemRow[] = [
        { id: 1, komponen_biaya: 'Pendaftaran', biaya_putra: 100000, biaya_putri: 100000 },
        { id: 2, komponen_biaya: 'Seragam', biaya_putra: 450000, biaya_putri: 550000 },
        { id: 3, komponen_biaya: 'Kegiatan', biaya_putra: 200000, biaya_putri: 200000 },
      ];

      const totals = calculateTotals(items);
      expect(totals.totalPutra).toBe(750000);
      expect(totals.totalPutri).toBe(850000);
      expect(totals.diff).toBe(100000); // putri - putra
      expect(totals.formattedTotalPutra).toBe('Rp 750.000');
      expect(totals.formattedTotalPutri).toBe('Rp 850.000');
    });

    it('should handle empty or null values gracefully', () => {
      const items: BiayaItemRow[] = [
        { id: 1, komponen_biaya: 'Pendaftaran', biaya_putra: null as any, biaya_putri: undefined as any },
      ];

      const totals = calculateTotals(items);
      expect(totals.totalPutra).toBe(0);
      expect(totals.totalPutri).toBe(0);
      expect(totals.diff).toBe(0);
    });
  });
});
