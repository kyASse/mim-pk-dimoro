import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { render, screen } from '@testing-library/react';
import KelolaTestimoniPage, { metadata } from '../page';
import * as serverLib from '@/lib/supabase/server';

// Mock redirect
const mockRedirect = vi.fn();
vi.mock('next/navigation', () => ({
    redirect: (path: string) => mockRedirect(path),
}));

// Mock next/link
vi.mock('next/link', () => ({
    default: ({ children, href, ...props }: any) => (
        <a href={href} {...props}>
            {children}
        </a>
    ),
}));

// Mock TestimoniAdminHub
vi.mock('@/components/admin/testimoni/TestimoniAdminHub', () => ({
    default: ({ initialTestimoni }: { initialTestimoni: any[] }) => (
        <div data-testid="mock-testimoni-admin-hub" data-count={initialTestimoni.length}>
            TestimoniAdminHub Mock ({initialTestimoni.length} items)
        </div>
    ),
}));

describe('KelolaTestimoniPage (app/admin/testimoni/page.tsx)', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('exports the correct page metadata', () => {
        expect(metadata.title).toBe('Manajemen Testimoni | Admin MIM PK Dimoro');
    });

    it('redirects to /auth/login when user is not authenticated', async () => {
        vi.spyOn(serverLib, 'createClient').mockResolvedValueOnce({
            auth: {
                getUser: vi.fn().mockResolvedValueOnce({ data: { user: null } }),
            },
        } as any);

        await KelolaTestimoniPage();
        expect(mockRedirect).toHaveBeenCalledWith('/auth/login');
    });

    it('renders error state when Supabase query returns an error', async () => {
        vi.spyOn(serverLib, 'createClient').mockResolvedValueOnce({
            auth: {
                getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: 'admin-1' } } }),
            },
            from: vi.fn().mockReturnValueOnce({
                select: vi.fn().mockReturnValueOnce({
                    order: vi.fn().mockResolvedValueOnce({
                        data: null,
                        error: { message: 'Database connection failed' },
                    }),
                }),
            }),
        } as any);

        const jsx = await KelolaTestimoniPage();
        render(jsx as React.ReactElement);

        expect(screen.getByText('Gagal memuat data testimoni')).toBeDefined();
        expect(screen.getByText(/Database connection failed/i)).toBeDefined();
    });

    it('renders header, breadcrumbs, action buttons, and TestimoniAdminHub when authenticated', async () => {
        const mockTestimoni = [
            {
                id: 1,
                nama_orang_tua: 'Budi Santoso',
                status_orang_tua: 'Wali Kelas 3',
                is_featured: true,
                isi_testimoni: 'Madrasah yang sangat bagus dalam pembinaan akhlak anak.',
                created_at: '2026-03-01T08:00:00Z',
                created_by: 'admin-1',
            },
            {
                id: 2,
                nama_orang_tua: 'Siti Aminah',
                status_orang_tua: 'Alumni 2025',
                is_featured: false,
                isi_testimoni: 'Kurikulum modern berkarakter Islami.',
                created_at: '2026-03-02T09:00:00Z',
                created_by: 'admin-1',
            },
        ];

        vi.spyOn(serverLib, 'createClient').mockResolvedValueOnce({
            auth: {
                getUser: vi.fn().mockResolvedValueOnce({ data: { user: { id: 'admin-1' } } }),
            },
            from: vi.fn().mockReturnValueOnce({
                select: vi.fn().mockReturnValueOnce({
                    order: vi.fn().mockResolvedValueOnce({
                        data: mockTestimoni,
                        error: null,
                    }),
                }),
            }),
        } as any);

        const jsx = await KelolaTestimoniPage();
        render(jsx as React.ReactElement);

        // Header Title & Subtitle
        expect(screen.getByText('Manajemen Testimoni & Aspirasi')).toBeDefined();
        expect(
            screen.getByText(
                'Kelola testimoni dan apresiasi orang tua siswa untuk dipublikasikan pada halaman utama madrasah'
            )
        ).toBeDefined();

        // Breadcrumbs
        expect(screen.getByText('Dasbor')).toBeDefined();
        expect(screen.getByText('Testimoni')).toBeDefined();

        // Action Buttons
        const previewHomeLink = screen.getByRole('link', { name: /Lihat di Beranda/i });
        expect(previewHomeLink).toBeDefined();
        expect(previewHomeLink.getAttribute('href')).toBe('/#testimoni');
        expect(previewHomeLink.getAttribute('target')).toBe('_blank');

        const tambahLink = screen.getByRole('link', { name: /Tambah Testimoni/i });
        expect(tambahLink).toBeDefined();
        expect(tambahLink.getAttribute('href')).toBe('/admin/testimoni/tambah');

        // TestimoniAdminHub integration
        const hubEl = screen.getByTestId('mock-testimoni-admin-hub');
        expect(hubEl).toBeDefined();
        expect(hubEl.getAttribute('data-count')).toBe('2');
    });
});
