import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';

vi.mock('xlsx', () => {
  const mockUtils = {
    aoa_to_sheet: vi.fn().mockReturnValue({}),
    book_new: vi.fn().mockReturnValue({}),
    book_append_sheet: vi.fn(),
  };
  return {
    default: {
      utils: mockUtils,
      writeFile: vi.fn(),
    },
    utils: mockUtils,
    writeFile: vi.fn(),
  };
});

import * as XLSX from 'xlsx';
import PendaftarTable from '@/components/admin/PendaftarTable';

const mockPendaftar = [
  {
    id: 'pendaftar-1',
    nomor_induk: '3301123456780001',
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
    nomor_induk: '3301123456780002',
    nama_lengkap: 'Fatimah Zahra',
    nama_ayah_kandung: 'Hendra Wijaya',
    nama_ibu_kandung: 'Nurul Hidayah',
    jenis_kelamin: 'P',
    tanggal_lahir: '2019-08-20',
    nomor_telepon: '089876543210',
    status_pendaftaran: 'Diterima',
    created_at: '2026-08-05T11:00:00Z',
  },
  {
    id: 'pendaftar-3',
    nomor_induk: '3301123456780003',
    nama_lengkap: 'Budi Santoso',
    nama_ayah_kandung: 'Supri',
    nama_ibu_kandung: 'Hartini',
    jenis_kelamin: 'L',
    tanggal_lahir: '2019-01-15',
    nomor_telepon: '081122334455',
    status_pendaftaran: 'Revisi',
    created_at: '2026-08-10T12:00:00Z',
  },
  {
    id: 'pendaftar-4',
    nomor_induk: '3301123456780004',
    nama_lengkap: 'Citra Dewi',
    nama_ayah_kandung: 'Joko',
    nama_ibu_kandung: 'Endang',
    jenis_kelamin: 'P',
    tanggal_lahir: '2019-03-25',
    nomor_telepon: '082233445566',
    status_pendaftaran: 'Ditolak',
    created_at: '2026-08-15T13:00:00Z',
  },
];

describe('Admin PendaftarTable Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders metric cards with correct counts', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    expect(screen.getByText('Total Pendaftar')).toBeDefined();
    expect(screen.getAllByText('4').length).toBeGreaterThanOrEqual(1);
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

  it('filters data by search query matching name or NIK', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const searchInput = screen.getByPlaceholderText(/cari nama siswa/i);

    // Search by NIK
    fireEvent.change(searchInput, { target: { value: '3301123456780002' } });
    expect(screen.getByText('Fatimah Zahra')).toBeDefined();
    expect(screen.queryByText('Ahmad Faiz')).toBeNull();

    // Search by Parent Name
    fireEvent.change(searchInput, { target: { value: 'Bambang' } });
    expect(screen.getByText('Ahmad Faiz')).toBeDefined();
    expect(screen.queryByText('Fatimah Zahra')).toBeNull();
  });

  it('filters data by date range', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const startDateInput = screen.getByLabelText('Tanggal Mulai');
    const endDateInput = screen.getByLabelText('Tanggal Selesai');

    fireEvent.change(startDateInput, { target: { value: '2026-08-04' } });
    fireEvent.change(endDateInput, { target: { value: '2026-08-06' } });

    expect(screen.getByText('Fatimah Zahra')).toBeDefined();
    expect(screen.queryByText('Ahmad Faiz')).toBeNull();
    expect(screen.queryByText('Citra Dewi')).toBeNull();
  });

  it('filters data by gender filter', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const genderSelect = screen.getByRole('combobox', { name: /filter gender/i });
    fireEvent.change(genderSelect, { target: { value: 'P' } });

    expect(screen.getByText('Fatimah Zahra')).toBeDefined();
    expect(screen.getByText('Citra Dewi')).toBeDefined();
    expect(screen.queryByText('Ahmad Faiz')).toBeNull();
  });

  it('supports selecting rows and triggers floating bulk action toolbar', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    
    // Select first row
    const rowCheckbox = screen.getByLabelText('Pilih Ahmad Faiz');
    fireEvent.click(rowCheckbox);

    // Bulk toolbar should appear with count 1
    const toolbar = screen.getByTestId('bulk-action-toolbar');
    expect(toolbar).toBeDefined();
    expect(within(toolbar).getByText('1')).toBeDefined();

    // Click select all
    const selectAllCheckbox = screen.getByLabelText('Pilih Semua');
    fireEvent.click(selectAllCheckbox);

    expect(within(toolbar).getByText('4')).toBeDefined();

    // Clear selection
    const clearBtn = screen.getByRole('button', { name: /batal pilih/i });
    fireEvent.click(clearBtn);
    expect(screen.queryByTestId('bulk-action-toolbar')).toBeNull();
  });

  it('opens WhatsApp quick modal when clicking WhatsApp on table row', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const waButtons = screen.getAllByRole('button', { name: /kirim pesan whatsapp/i });
    expect(waButtons.length).toBeGreaterThan(0);

    fireEvent.click(waButtons[0]);
    expect(screen.getByText(/Kirim Pesan WhatsApp Cepat/i)).toBeDefined();
  });

  it('opens WhatsApp modal from bulk action toolbar', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const selectAllCheckbox = screen.getByLabelText('Pilih Semua');
    fireEvent.click(selectAllCheckbox);

    const bulkWaBtn = screen.getByRole('button', { name: /kirim wa massal/i });
    fireEvent.click(bulkWaBtn);

    expect(screen.getByText(/Kirim Pesan WhatsApp Cepat/i)).toBeDefined();
    expect(screen.getByText(/Antrean Pengiriman \(4 Kontak\)/i)).toBeDefined();
  });

  it('handles export Excel (.xlsx) EMIS 4.0 button click', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const exportExcelBtn = screen.getByRole('button', { name: /export excel/i });
    expect(exportExcelBtn).toBeDefined();

    fireEvent.click(exportExcelBtn);
    expect(XLSX.writeFile).toHaveBeenCalled();
  });

  it('handles export CSV button click', () => {
    render(<PendaftarTable pendaftar={mockPendaftar} />);
    const exportBtn = screen.getByRole('button', { name: /export csv/i });
    expect(exportBtn).toBeDefined();

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
