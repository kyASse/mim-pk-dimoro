import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import PendaftaranForm from '../PendaftaranForm';

// Setup environment mocks
beforeAll(() => {
    class MockResizeObserver {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
    }
    global.ResizeObserver = MockResizeObserver as any;

    class MockIntersectionObserver {
        observe = vi.fn();
        unobserve = vi.fn();
        disconnect = vi.fn();
    }
    global.IntersectionObserver = MockIntersectionObserver as any;

    window.HTMLElement.prototype.scrollIntoView = vi.fn();
    window.HTMLElement.prototype.hasPointerCapture = vi.fn();
    window.HTMLElement.prototype.releasePointerCapture = vi.fn();
});

// Mock server action
vi.mock('@/app/pendaftaran/actions', () => ({
    submitPendaftaranAction: vi.fn(),
}));

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
        info: vi.fn(),
        warning: vi.fn(),
    },
}));

describe('PendaftaranForm Component', () => {
    it('renders all four main sections matching official physical form', () => {
        render(<PendaftaranForm />);

        // Section A
        expect(screen.getByText(/A\. Keterangan Anak \(Data Peserta Didik\)/i)).toBeDefined();
        expect(screen.getAllByText(/Nama Lengkap/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Nama Panggilan/i)).toBeDefined();
        expect(screen.getByText(/RA \/ TK Asal/i)).toBeDefined();
        expect(screen.getAllByText(/Alamat Tempat Tinggal/i).length).toBeGreaterThanOrEqual(1);
        expect(screen.getByText(/Hobi/i)).toBeDefined();
        expect(screen.getByText(/Transportasi ke Sekolah/i)).toBeDefined();

        // Section B
        expect(screen.getByText(/B\. Orang Tua \(Data Ayah & Ibu\)/i)).toBeDefined();
        expect(screen.getByText(/Nama Ayah Kandung/i)).toBeDefined();
        expect(screen.getByText(/Nama Ibu Kandung/i)).toBeDefined();
        expect(screen.getByText(/Alamat Orang Tua/i)).toBeDefined();
        expect(screen.getByText(/Penghasilan \/ Gaji Orang Tua/i)).toBeDefined();
        expect(screen.getByText(/Salin dari alamat tempat tinggal siswa/i)).toBeDefined();

        // Section C
        expect(screen.getByText(/C\. Wali Anak \(Opsional\)/i)).toBeDefined();
        expect(screen.getByText(/Nama Lengkap Wali/i)).toBeDefined();
        expect(screen.getByText(/Nomor Telepon\/HP \(WhatsApp\) Wali/i)).toBeDefined();

        // Section D
        expect(screen.getByText(/D\. Kebutuhan Khusus & Dokumen Pendukung \(Opsional\)/i)).toBeDefined();
        expect(screen.getAllByText(/Dokumen Pendukung/i).length).toBeGreaterThanOrEqual(1);

        // Submit button
        expect(screen.getByRole('button', { name: /Kirim Formulir Pendaftaran/i })).toBeDefined();
    });
});
