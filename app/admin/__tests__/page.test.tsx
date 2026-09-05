import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AdminDashboard from '../page';

// Mock redirect from next/navigation
const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({
  redirect: (url: string) => mockRedirect(url),
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/admin',
}));

// Mock LogoutButton component
vi.mock('@/components/logout-button', () => ({
  default: () => <button>Keluar</button>,
}));

// Mock Supabase client
const mockGetUser = vi.fn();
const mockFrom = vi.fn();

vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => Promise.resolve({
    auth: {
      getUser: mockGetUser,
    },
    from: mockFrom,
  })),
}));

describe('AdminDashboard Page Server Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to /auth/login if user is not authenticated', async () => {
    mockGetUser.mockResolvedValueOnce({ data: { user: null } });

    await AdminDashboard();
    expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
  });

  it('renders complete dashboard with metric cards, charts, news, quick access, and audit trail when authenticated', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: { id: 'user-1', email: 'admin@mim.sch.id' },
      },
    });

    // Mock each Supabase table query
    mockFrom.mockImplementation((tableName: string) => {
      if (tableName === 'profiles') {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({
            data: { nama_lengkap: 'Ust. Administrator', role: 'super_admin' },
          }),
        };
      }

      if (tableName === 'berita') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'b-1',
                judul: 'Prestasi Juara 1 Tahfidz',
                status: 'terbit',
                created_at: '2026-08-25T10:00:00Z',
              },
            ],
          }),
        };
      }

      if (tableName === 'pendaftar') {
        return {
          select: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'p-1',
                nama_lengkap: 'Ahmad Faiz',
                jenis_kelamin: 'L',
                status_pendaftaran: 'Diterima',
                created_at: '2026-08-30T09:00:00Z',
              },
              {
                id: 'p-2',
                nama_lengkap: 'Aisyah Putri',
                jenis_kelamin: 'P',
                status_pendaftaran: 'Menunggu Konfirmasi',
                created_at: '2026-08-29T11:00:00Z',
              },
            ],
          }),
        };
      }

      if (tableName === 'rombel') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          mockResolvedValue: {
            data: [
              { id: 'r-1', nama: 'Kelas 1A', tingkat: 1, kapasitas: 28, wali_kelas_nama: 'Ustz. Siti' },
            ],
          },
        };
      }

      if (tableName === 'siswa') {
        return {
          select: vi.fn().mockResolvedValue({
            data: [
              { id: 's-1', nama_lengkap: 'Ahmad Faiz', rombel_id: 'r-1', kelompok: 'Kelas 1A' },
            ],
          }),
        };
      }

      if (tableName === 'pesan_masuk') {
        return {
          select: vi.fn().mockResolvedValue({
            data: [
              { id: 1, status: 'belum_dibaca' },
              { id: 2, status: 'dibaca' },
            ],
          }),
        };
      }

      if (tableName === 'audit_logs') {
        return {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockResolvedValue({
            data: [
              {
                id: 'al-1',
                user_id: 'user-1',
                table_name: 'pendaftar',
                action: 'INSERT',
                record_id: 'p-1',
                created_at: '2026-08-30T09:00:00Z',
                profiles: {
                  nama_lengkap: 'Ust. Administrator',
                  role: 'super_admin',
                },
              },
            ],
          }),
        };
      }

      return {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        limit: vi.fn().mockResolvedValue({ data: [] }),
      };
    });

    const jsx = await AdminDashboard();
    render(jsx);

    // Verify greetings and header
    expect(screen.getByText(/Selamat datang,/i)).toBeInTheDocument();
    expect(screen.getAllByText('Ust. Administrator').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole('button', { name: /Cetak Laporan Eksekutif/i })).toBeInTheDocument();

    // Verify Metric Cards (can match multiple times due to print dossier table)
    expect(screen.getAllByText('Total Pendaftar PPDB').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('Total Siswa Aktif').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/Kehadiran Hari Ini/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Pesan Belum Dibalas')).toBeInTheDocument();

    // Verify Charts
    expect(screen.getByText('Tren Pendaftaran PPDB')).toBeInTheDocument();
    expect(screen.getByText('Perbandingan Gender Siswa & Siswi')).toBeInTheDocument();

    // Verify News and Quick Access
    expect(screen.getByText('Pembaruan Berita Terkini')).toBeInTheDocument();
    expect(screen.getByText('Prestasi Juara 1 Tahfidz')).toBeInTheDocument();
    expect(screen.getByText('Akses Cepat')).toBeInTheDocument();

    // Verify Audit Trail Feed
    expect(screen.getByText('Aktivitas Terbaru Sistem')).toBeInTheDocument();
  });
});
