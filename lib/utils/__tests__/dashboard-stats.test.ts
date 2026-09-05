import { describe, it, expect } from 'vitest';
import {
  calculatePPDBDemographics,
  calculateDailyRegistrationTrends,
  calculateRombelSummary,
  calculateAttendanceSummary,
  formatAuditLogActivity,
  type PPDBApplicantBasic,
  type RombelItem,
  type RawAuditLog,
} from '../dashboard-stats';

describe('dashboard-stats utility', () => {
  describe('calculatePPDBDemographics', () => {
    it('calculates PPDB demographics and gender split correctly', () => {
      const mockApplicants: PPDBApplicantBasic[] = [
        { id: '1', jenis_kelamin: 'L', status_pendaftaran: 'Diterima' },
        { id: '2', jenis_kelamin: 'Laki-laki', status_pendaftaran: 'Menunggu Konfirmasi' },
        { id: '3', jenis_kelamin: 'P', status_pendaftaran: 'Diterima' },
        { id: '4', jenis_kelamin: 'Perempuan', status_pendaftaran: 'Ditolak' },
        { id: '5', jenis_kelamin: null, status_pendaftaran: 'Revisi' },
      ];

      const stats = calculatePPDBDemographics(mockApplicants);
      expect(stats.total).toBe(5);
      expect(stats.totalLaki).toBe(2);
      expect(stats.totalPerempuan).toBe(2);
      expect(stats.persenLaki).toBe(40);
      expect(stats.persenPerempuan).toBe(40);
      expect(stats.diterima).toBe(2);
      expect(stats.menunggu).toBe(1);
      expect(stats.revisi).toBe(1);
      expect(stats.ditolak).toBe(1);
    });

    it('handles null, undefined, or empty array safely', () => {
      const emptyStats = calculatePPDBDemographics([]);
      expect(emptyStats).toEqual({
        total: 0,
        totalLaki: 0,
        totalPerempuan: 0,
        persenLaki: 0,
        persenPerempuan: 0,
        diterima: 0,
        menunggu: 0,
        revisi: 0,
        ditolak: 0,
      });

      const nullStats = calculatePPDBDemographics(null);
      expect(nullStats.total).toBe(0);

      const undefinedStats = calculatePPDBDemographics(undefined);
      expect(undefinedStats.total).toBe(0);
    });

    it('handles status "Akun Dibuat" as diterima and case insensitivity / whitespace in gender', () => {
      const mockApplicants: PPDBApplicantBasic[] = [
        { id: '1', jenis_kelamin: ' laki - laki ', status_pendaftaran: 'Akun Dibuat' },
        { id: '2', jenis_kelamin: 'PEREMPUAN', status_pendaftaran: 'DITERIMA' },
        { id: '3', jenis_kelamin: 'l', status_pendaftaran: 'Belum Divalidasi' },
      ];

      const stats = calculatePPDBDemographics(mockApplicants);
      expect(stats.total).toBe(3);
      expect(stats.totalLaki).toBe(2);
      expect(stats.totalPerempuan).toBe(1);
      expect(stats.diterima).toBe(1);
      expect(stats.menunggu).toBe(2);
    });
  });

  describe('calculateDailyRegistrationTrends', () => {
    it('aggregates daily registration trends over 14 days', () => {
      const now = new Date('2026-08-30T10:00:00Z');
      const mockApplicants = [
        { id: '1', created_at: '2026-08-30T01:00:00Z' },
        { id: '2', created_at: '2026-08-30T04:00:00Z' },
        { id: '3', created_at: '2026-08-29T12:00:00Z' },
      ];

      const trends = calculateDailyRegistrationTrends(mockApplicants, 14, now);
      expect(trends.length).toBe(14);
      expect(trends[trends.length - 1].count).toBe(2); // today (Aug 30)
      expect(trends[trends.length - 1].dateStr).toBe('2026-08-30');
      expect(trends[trends.length - 2].count).toBe(1); // yesterday (Aug 29)
      expect(trends[trends.length - 2].dateStr).toBe('2026-08-29');
      expect(trends[0].count).toBe(0);
    });

    it('handles empty or null applicants array and invalid date strings', () => {
      const now = new Date('2026-08-30T10:00:00Z');
      const mockApplicants = [
        { id: '1', created_at: undefined },
        { id: '2', created_at: 'invalid-date' },
      ];

      const trends = calculateDailyRegistrationTrends(mockApplicants, 7, now);
      expect(trends.length).toBe(7);
      expect(trends.every((t) => t.count === 0)).toBe(true);

      const nullTrends = calculateDailyRegistrationTrends(null, 5, now);
      expect(nullTrends.length).toBe(5);
    });
  });

  describe('calculateRombelSummary', () => {
    it('summarizes rombel capacity and active student counts', () => {
      const mockRombels: RombelItem[] = [
        { id: 'r1', nama: 'Kelas 1A', kapasitas: 28, siswaCount: 26 },
        { id: 'r2', nama: 'Kelas 1B', kapasitas: 28, siswaCount: 28 },
      ];

      const summary = calculateRombelSummary(mockRombels);
      expect(summary.totalSiswa).toBe(54);
      expect(summary.totalKapasitas).toBe(56);
      expect(summary.occupancyRate).toBe(96.4);
      expect(summary.totalRombel).toBe(2);
      expect(summary.kelasPenuhCount).toBe(1);
    });

    it('handles empty or null rombel list and fallback capacities', () => {
      const empty = calculateRombelSummary([]);
      expect(empty).toEqual({
        totalSiswa: 0,
        totalKapasitas: 0,
        occupancyRate: 0,
        totalRombel: 0,
        kelasPenuhCount: 0,
      });

      const nullSummary = calculateRombelSummary(null);
      expect(nullSummary.totalRombel).toBe(0);

      const fallbackSummary = calculateRombelSummary([
        { id: 'r1', nama: 'Kelas 1A' }, // no kapasitas -> default 28, no siswaCount -> 0
      ]);
      expect(fallbackSummary.totalKapasitas).toBe(28);
      expect(fallbackSummary.totalSiswa).toBe(0);
      expect(fallbackSummary.occupancyRate).toBe(0);
      expect(fallbackSummary.kelasPenuhCount).toBe(0);
    });
  });

  describe('calculateAttendanceSummary', () => {
    it('generates dynamic daily attendance estimates based on active students', () => {
      const summary = calculateAttendanceSummary(120);
      expect(summary.totalSiswa).toBe(120);
      expect(summary.hadir + summary.sakit + summary.izin + summary.alpha).toBe(120);
      expect(summary.persenHadir).toBeGreaterThanOrEqual(95);
      expect(summary.statusKbm).toBe('KBM Efektif Aktif');
    });

    it('handles 0 or negative active student count with default fallback', () => {
      const summary = calculateAttendanceSummary(0);
      expect(summary.totalSiswa).toBe(120);
      expect(summary.hadir + summary.sakit + summary.izin + summary.alpha).toBe(120);
    });
  });

  describe('formatAuditLogActivity', () => {
    it('formats audit logs with human-readable action badges and table names', () => {
      const rawLog: RawAuditLog = {
        id: 'log-1',
        action: 'INSERT',
        table_name: 'pendaftar',
        created_at: '2026-08-30T08:00:00Z',
        user_id: 'u1',
        record_id: 'p-100',
        profiles: {
          nama_lengkap: 'Ust. Ahmad Fauzi',
          role: 'Admin',
        },
      };

      const formatted = formatAuditLogActivity(rawLog);
      expect(formatted.id).toBe('log-1');
      expect(formatted.userName).toBe('Ust. Ahmad Fauzi');
      expect(formatted.userRole).toBe('Admin');
      expect(formatted.actionLabel).toBe('Tambah Data');
      expect(formatted.actionVariant).toBe('emerald');
      expect(formatted.tableLabel).toBe('Pendaftaran PPDB');
      expect(formatted.recordId).toBe('p-100');
      expect(formatted.timestamp).not.toBe('-');
    });

    it('handles UPDATE and DELETE actions with corresponding labels and variants', () => {
      const updateLog: RawAuditLog = {
        id: 'log-2',
        action: 'UPDATE',
        table_name: 'berita',
        created_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        profiles: { email: 'admin@mim.sch.id' },
      };

      const formattedUpdate = formatAuditLogActivity(updateLog);
      expect(formattedUpdate.userName).toBe('admin@mim.sch.id');
      expect(formattedUpdate.actionLabel).toBe('Sunting Data');
      expect(formattedUpdate.actionVariant).toBe('indigo');
      expect(formattedUpdate.tableLabel).toBe('Berita & Artikel');
      expect(formattedUpdate.relativeTime).toContain('mnt lalu');

      const deleteLog: RawAuditLog = {
        id: 'log-3',
        action: 'DELETE',
        table_name: 'galeri',
        created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      };

      const formattedDelete = formatAuditLogActivity(deleteLog);
      expect(formattedDelete.userName).toBe('Administrator');
      expect(formattedDelete.actionLabel).toBe('Hapus Data');
      expect(formattedDelete.actionVariant).toBe('rose');
      expect(formattedDelete.tableLabel).toBe('Galeri Madrasah');
      expect(formattedDelete.relativeTime).toContain('jam lalu');
    });

    it('handles custom/unknown action and unmapped table names gracefully', () => {
      const customLog: RawAuditLog = {
        id: 'log-4',
        action: 'LOGIN',
        table_name: 'unknown_table',
        created_at: new Date(Date.now() - 2 * 86400 * 1000).toISOString(),
      };

      const formatted = formatAuditLogActivity(customLog);
      expect(formatted.actionLabel).toBe('Aktivitas');
      expect(formatted.actionVariant).toBe('slate');
      expect(formatted.tableLabel).toBe('unknown_table');
      expect(formatted.relativeTime).toContain('hari lalu');
    });

    it('handles invalid timestamp gracefully', () => {
      const invalidLog: RawAuditLog = {
        id: 'log-5',
        action: 'INSERT',
        table_name: '',
        created_at: 'invalid-date',
      };

      const formatted = formatAuditLogActivity(invalidLog);
      expect(formatted.timestamp).toBe('-');
      expect(formatted.relativeTime).toBe('Baru saja');
      expect(formatted.tableLabel).toBe('Sistem');
    });
  });
});
