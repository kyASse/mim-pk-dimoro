import { describe, it, expect, vi, beforeAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import TambahPrestasiForm from '../TambahPrestasiForm';

beforeAll(() => {
    global.ResizeObserver = class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
});

vi.mock('next/navigation', () => ({
    useRouter: () => ({
        push: vi.fn(),
        refresh: vi.fn(),
    }),
}));

// Mock createPrestasiAction
vi.mock('@/app/admin/akademik/actions', () => ({
    createPrestasiAction: vi.fn().mockResolvedValue({ success: true, message: 'Prestasi berhasil ditambahkan.' }),
}));

describe('TambahPrestasiForm Component', () => {
    it('renders all form inputs and the live preview card container', () => {
        render(<TambahPrestasiForm defaultYear={2026} />);

        expect(screen.getByLabelText(/nama santri \/ siswa/i)).toBeDefined();
        expect(screen.getByLabelText(/nama prestasi \/ kejuaraan/i)).toBeDefined();
        expect(screen.getByLabelText(/tahun/i)).toBeDefined();
        expect(screen.getByLabelText(/keterangan \/ penyelenggara/i)).toBeDefined();
        expect(screen.getByTestId('prestasi-live-preview')).toBeDefined();
    });

    it('updates live preview card dynamically as user types', () => {
        render(<TambahPrestasiForm defaultYear={2026} />);

        const namaSiswaInput = screen.getByLabelText(/nama santri \/ siswa/i);
        fireEvent.change(namaSiswaInput, { target: { value: 'Zaskia Adya' } });

        const namaPrestasiInput = screen.getByLabelText(/nama prestasi \/ kejuaraan/i);
        fireEvent.change(namaPrestasiInput, { target: { value: 'Juara 1 Pidato Bahasa Arab' } });

        const previewContainer = screen.getByTestId('prestasi-live-preview');
        expect(previewContainer.textContent).toContain('Zaskia Adya');
        expect(previewContainer.textContent).toContain('Juara 1 Pidato Bahasa Arab');
    });

    it('updates tingkat badge in live preview when user clicks a tingkat pill', () => {
        render(<TambahPrestasiForm defaultYear={2026} />);

        const nasionalPill = screen.getByRole('button', { name: /^Nasional/i });
        fireEvent.click(nasionalPill);

        const previewContainer = screen.getByTestId('prestasi-live-preview');
        expect(previewContainer.textContent).toContain('Nasional');
    });
});
