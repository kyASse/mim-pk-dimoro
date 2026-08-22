import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import PendaftarTable from '@/components/admin/PendaftarTable';

const mockPendaftar = [
  {
    id: 'pendaftar-1',
    nama_lengkap: 'Ahmad Faiz',
    nama_ayah_kandung: 'Bambang Sutrisno',
    nama_ibu_kandung: 'Siti Aminah',
    jenis_kelamin: 'L',
    tanggal_lahir: '2019-05-12',
    nomor_telepon: '081234567890',
    status_pendaftaran: 'Menunggu Persetujuan',
    created_at: '2026-08-01T10:00:00Z',
  },
  {
    id: 'pendaftar-2',
    nama_lengkap: 'Fatimah Zahra',
    nama_ayah_kandung: 'Hendra Wijaya',
    nama_ibu_kandung: 'Nurul Hidayah',
    jenis_kelamin: 'P',
    tanggal_lahir: '2019-08-20',
    nomor_telepon: '089876543210',
    status_pendaftaran: 'Diterima',
    created_at: '2026-08-02T11:00:00Z',
  },
  {
    id: 'pendaftar-3',
    nama_lengkap: 'Budi Santoso',
    nama_ayah_kandung: 'Supri',
    nama_ibu_kandung: 'Hartini',
    jenis_kelamin: 'L',
    tanggal_lahir: '2019-01-15',
    nomor_telepon: '081122334455',
    status_pendaftaran: 'Revisi',
    created_at: '2026-08-03T12:00:00Z',
  },
  {
    id: 'pendaftar-4',
    nama_lengkap: 'Citra Dewi',
    nama_ayah_kandung: 'Joko',
    nama_ibu_kandung: 'Endang',
    jenis_kelamin: 'P',
    tanggal_lahir: '2019-03-25',
    nomor_telepon: '082233445566',
    status_pendaftaran: 'Ditolak',
    created_at: '2026-08-04T13:00:00Z',
  },
];

describe('Admin PendaftarTable Component', () => {
  it('renders metric cards with correct counts', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    expect(screen.getByText('Total Pendaftar')).toBeDefined();
    expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1); // Total count in cards / tabs
    expect(screen.getByText('Validasi Ulang / Revisi')).toBeDefined();
  });

  it('filters data when metric card or status tab is clicked', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    
    // Click on Diterima filter tab
    const diterimaTab = screen.getByRole('tab', { name: /diterima/i });
    fireEvent.click(diterimaTab);

    expect(screen.getByText('Fatimah Zahra')).toBeDefined();
    expect(screen.queryByText('Ahmad Faiz')).toBeNull();

    // Click on Semua tab
    const semuaTab = screen.getByRole('tab', { name: /semua/i });
    fireEvent.click(semuaTab);
    expect(screen.getByText('Ahmad Faiz')).toBeDefined();
    expect(screen.getByText('Fatimah Zahra')).toBeDefined();
  });

  it('filters data by clicking interactive metric card', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    
    // Click metric card for Ditolak
    const ditolakCard = screen.getByTestId('metric-card-Ditolak');
    fireEvent.click(ditolakCard);

    expect(screen.getByText('Citra Dewi')).toBeDefined();
    expect(screen.queryByText('Ahmad Faiz')).toBeNull();
  });

  it('filters data by search query', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const searchInput = screen.getByPlaceholderText(/cari nama siswa/i);
    fireEvent.change(searchInput, { target: { value: 'Bambang' } });

    expect(screen.getByText('Ahmad Faiz')).toBeDefined();
    expect(screen.queryByText('Fatimah Zahra')).toBeNull();
  });

  it('filters data by gender filter', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const genderSelect = screen.getByRole('combobox', { name: /filter gender/i });
    fireEvent.change(genderSelect, { target: { value: 'P' } });

    expect(screen.getByText('Fatimah Zahra')).toBeDefined();
    expect(screen.getByText('Citra Dewi')).toBeDefined();
    expect(screen.queryByText('Ahmad Faiz')).toBeNull();
  });

  it('uses MIM official registration code and not TK25 prefix', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    expect(screen.queryByText(/TK25-/i)).toBeNull();
    expect(screen.getAllByText(/MIM-/i).length).toBeGreaterThan(0);
  });

  it('renders quick action buttons (Detail, WhatsApp)', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const detailLinks = screen.getAllByRole('link', { name: /detail/i });
    expect(detailLinks.length).toBeGreaterThan(0);
    const waLinks = screen.getAllByRole('link', { name: /whatsapp/i });
    expect(waLinks.length).toBeGreaterThan(0);
  });

  it('handles export CSV button click', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const exportBtn = screen.getByRole('button', { name: /export csv/i });
    expect(exportBtn).toBeDefined();

    // Mock document.createElement
    const clickSpy = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
      const el = originalCreateElement(tagName);
      if (tagName === 'a') {
        el.click = clickSpy;
      }
      return el;
    });

    fireEvent.click(exportBtn);
    expect(clickSpy).toHaveBeenCalled();
    vi.restoreAllMocks();
  });
});
