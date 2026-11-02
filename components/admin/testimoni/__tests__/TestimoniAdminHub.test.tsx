import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TestimoniAdminHub from '../TestimoniAdminHub';
import { toggleFeaturedTestimoniAction } from '@/app/admin/testimoni/actions';
import { toast } from 'sonner';

// Mock server action
vi.mock('@/app/admin/testimoni/actions', () => ({
  toggleFeaturedTestimoniAction: vi.fn(),
  deleteTestimoniAction: vi.fn(),
}));

// Mock sonner
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: any) => (
    /* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */
    <img {...props} />
  ),
}));

// Mock motion/react
vi.mock('motion/react', () => ({
  motion: {
    div: ({ children, whileInView: _whileInView, initial: _initial, viewport: _viewport, transition: _transition, ...props }: any) => (
      <div {...props}>{children}</div>
    ),
  },
  useReducedMotion: () => false,
}));

describe('TestimoniAdminHub', () => {
  const sampleData = [
    {
      id: 1,
      nama_orang_tua: 'Bapak Hendra',
      status_orang_tua: 'Wali Kelas 2',
      isi_testimoni: 'Pembelajaran tahfidz sangat baik.',
      is_featured: true,
      created_at: new Date().toISOString(), // recent
    },
    {
      id: 2,
      nama_orang_tua: 'Ibu Ratna',
      status_orang_tua: 'Wali Kelas 5',
      isi_testimoni: 'Guru-guru sangat komunikatif.',
      is_featured: false,
      created_at: '2026-01-01T00:00:00Z', // older
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calculates and renders metric stats correctly', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    expect(screen.getByTestId('stat-total-count')).toHaveTextContent('2');
    expect(screen.getByTestId('stat-featured-count')).toHaveTextContent('1');
    expect(screen.getByTestId('stat-regular-count')).toHaveTextContent('1');
    expect(screen.getByTestId('stat-recent-count')).toHaveTextContent('1');
  });

  it('filters data when searching by parent name or quote text', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    const searchInput = screen.getByPlaceholderText(/Cari nama orang tua/i);
    fireEvent.change(searchInput, { target: { value: 'Hendra' } });

    expect(screen.getByText('Bapak Hendra')).toBeInTheDocument();
    expect(screen.queryByText('Ibu Ratna')).not.toBeInTheDocument();
  });

  it('clears search input when clear X button is clicked', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    const searchInput = screen.getByPlaceholderText(/Cari nama orang tua/i);
    fireEvent.change(searchInput, { target: { value: 'Hendra' } });
    expect(screen.queryByText('Ibu Ratna')).not.toBeInTheDocument();

    const clearButton = screen.getByRole('button', { name: /hapus pencarian/i });
    fireEvent.click(clearButton);

    expect(searchInput).toHaveValue('');
    expect(screen.getByText('Ibu Ratna')).toBeInTheDocument();
  });

  it('filters data when switching status tab to featured', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    const featuredTab = screen.getByRole('tab', { name: /Tampil di Beranda/i });
    fireEvent.click(featuredTab);

    expect(screen.getByText('Bapak Hendra')).toBeInTheDocument();
    expect(screen.queryByText('Ibu Ratna')).not.toBeInTheDocument();
  });

  it('filters data when clicking a metric card', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    // Click on regular (Belum Ditampilkan) metric card
    const regularCard = screen.getByTestId('stat-regular-count').closest('button') || screen.getByTestId('stat-regular-count').closest('[role="button"]') || screen.getByTestId('stat-regular-count');
    fireEvent.click(regularCard);

    expect(screen.getByText('Ibu Ratna')).toBeInTheDocument();
    expect(screen.queryByText('Bapak Hendra')).not.toBeInTheDocument();
  });

  it('switches view mode between Grid and Table', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    // Switch to Table view
    const tableBtn = screen.getByRole('button', { name: /Tampilan Tabel/i });
    fireEvent.click(tableBtn);

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Bapak Hendra')).toBeInTheDocument();
    expect(screen.getByText('Ibu Ratna')).toBeInTheDocument();

    // Switch back to Grid view
    const gridBtn = screen.getByRole('button', { name: /Tampilan Grid/i });
    fireEvent.click(gridBtn);
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('calls toggleFeaturedTestimoniAction and updates local state on quick toggle', async () => {
    vi.mocked(toggleFeaturedTestimoniAction).mockResolvedValueOnce({
      success: true,
      message: 'Testimoni disembunyikan dari beranda.',
      is_featured: false,
    });

    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    // Find the toggle for Bapak Hendra (currently featured: true)
    const toggles = screen.getAllByRole('switch', { name: /toggle status featured/i });
    fireEvent.click(toggles[0]);

    await waitFor(() => {
      expect(toggleFeaturedTestimoniAction).toHaveBeenCalledWith(1, true);
      expect(toast.success).toHaveBeenCalledWith('Testimoni disembunyikan dari beranda.');
    });
  });

  it('opens preview dialog when preview button is clicked', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    const previewButtons = screen.getAllByRole('button', { name: /preview testimoni/i });
    fireEvent.click(previewButtons[0]);

    expect(screen.getByText('Pratinjau Testimoni Publik')).toBeInTheDocument();
  });

  it('shows empty state when no matching results and allows resetting filter', () => {
    render(<TestimoniAdminHub initialTestimoni={sampleData} />);

    const searchInput = screen.getByPlaceholderText(/Cari nama orang tua/i);
    fireEvent.change(searchInput, { target: { value: 'NamaYangTidakAda' } });

    expect(screen.getByText(/Tidak ada testimoni yang ditemukan/i)).toBeInTheDocument();

    const resetBtn = screen.getByRole('button', { name: /reset filter/i });
    fireEvent.click(resetBtn);

    expect(screen.getByText('Bapak Hendra')).toBeInTheDocument();
    expect(screen.getByText('Ibu Ratna')).toBeInTheDocument();
  });
});
