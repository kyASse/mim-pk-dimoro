import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import React from 'react';
import PrestasiManagement, { type PrestasiItem } from '../PrestasiManagement';

const mockPrestasiList: PrestasiItem[] = [
    {
        id: 1,
        tahun: 2026,
        nama_prestasi: 'Juara 1 Lomba Tahfidz Al-Qur\'an',
        tingkat: 'Nasional',
        nama_siswa: 'Ahmad Fauzi',
        deskripsi: 'Diselenggarakan oleh Kemenag',
        dokumentasi_url: '1/foto-tahfidz.jpg',
        created_at: '2026-02-15T08:00:00Z',
    },
    {
        id: 2,
        tahun: 2026,
        nama_prestasi: 'Medali Emas Olimpiade Sains',
        tingkat: 'Internasional',
        nama_siswa: 'Aisyah Putri',
        deskripsi: 'International Islamic Science Olympiad',
        dokumentasi_url: null,
        created_at: '2026-03-10T10:00:00Z',
    },
    {
        id: 3,
        tahun: 2025,
        nama_prestasi: 'Juara 2 Kaligrafi Kontemporer',
        tingkat: 'Kabupaten',
        nama_siswa: 'Budi Santoso',
        deskripsi: 'Lomba MAPSI Kabupaten Bantul',
        dokumentasi_url: null,
        created_at: '2025-10-01T09:00:00Z',
    },
];

describe('PrestasiManagement Component', () => {
    it('renders metric cards with calculated numbers correctly', () => {
        render(<PrestasiManagement initialData={mockPrestasiList} currentYear={2026} />);

        const totalCard = screen.getByTestId('metric-total-prestasi');
        expect(within(totalCard).getByText('3')).toBeDefined();

        const yearCard = screen.getByTestId('metric-tahun-ini');
        expect(within(yearCard).getByText('2')).toBeDefined();

        const nationalCard = screen.getByTestId('metric-nasional-internasional');
        expect(within(nationalCard).getByText('2')).toBeDefined();
    });

    it('filters data in real time when typing in search input', () => {
        render(<PrestasiManagement initialData={mockPrestasiList} currentYear={2026} />);

        const searchInput = screen.getByPlaceholderText(/cari nama siswa, prestasi/i);
        fireEvent.change(searchInput, { target: { value: 'Aisyah' } });

        // Item 2 should be present (both table and mobile list)
        expect(screen.getAllByTestId('delete-btn-2').length).toBeGreaterThan(0);
        // Item 1 and 3 should be filtered out
        expect(screen.queryAllByTestId('delete-btn-1')).toHaveLength(0);
        expect(screen.queryAllByTestId('delete-btn-3')).toHaveLength(0);
    });

    it('filters data when selecting tingkat pill tabs', () => {
        render(<PrestasiManagement initialData={mockPrestasiList} currentYear={2026} />);

        const kabupatenTab = screen.getByRole('button', { name: /^Kabupaten/i });
        fireEvent.click(kabupatenTab);

        expect(screen.getAllByTestId('delete-btn-3').length).toBeGreaterThan(0);
        expect(screen.queryAllByTestId('delete-btn-1')).toHaveLength(0);
        expect(screen.queryAllByTestId('delete-btn-2')).toHaveLength(0);
    });

    it('displays empty state when search finds no results', () => {
        render(<PrestasiManagement initialData={mockPrestasiList} currentYear={2026} />);

        const searchInput = screen.getByPlaceholderText(/cari nama siswa, prestasi/i);
        fireEvent.change(searchInput, { target: { value: 'Zzzzz Tidak Ada' } });

        expect(screen.getByText(/tidak ada data prestasi yang cocok/i)).toBeDefined();
        expect(screen.getByRole('button', { name: /reset filter/i })).toBeDefined();
    });

    it('resets filter when clicking Reset Filter button', () => {
        render(<PrestasiManagement initialData={mockPrestasiList} currentYear={2026} />);

        const searchInput = screen.getByPlaceholderText(/cari nama siswa, prestasi/i) as HTMLInputElement;
        fireEvent.change(searchInput, { target: { value: 'Zzzzz' } });

        const resetBtn = screen.getByRole('button', { name: /reset filter/i });
        fireEvent.click(resetBtn);

        expect(searchInput.value).toBe('');
        expect(screen.getAllByTestId('delete-btn-1').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('delete-btn-2').length).toBeGreaterThan(0);
        expect(screen.getAllByTestId('delete-btn-3').length).toBeGreaterThan(0);
    });
});
