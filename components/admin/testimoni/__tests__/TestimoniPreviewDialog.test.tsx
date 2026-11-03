import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TestimoniPreviewDialog from '../TestimoniPreviewDialog';

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

describe('TestimoniPreviewDialog', () => {
  const mockItem = {
    id: 42,
    nama_orang_tua: 'Ibu Siti Rahma',
    status_orang_tua: 'Wali Murid Kelas 1',
    isi_testimoni: 'Fasilitas dan ustadz/ustadzah di MIM PK Dimoro sangat sabar.',
    is_featured: true,
    created_at: '2026-10-20T08:30:00Z',
  };

  it('renders modal content with author name, role, quote, and creation date when open', () => {
    render(
      <TestimoniPreviewDialog
        item={mockItem}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByText('Pratinjau Testimoni Publik')).toBeInTheDocument();
    expect(screen.getByText('Ibu Siti Rahma')).toBeInTheDocument();
    expect(screen.getByText('Wali Murid Kelas 1')).toBeInTheDocument();
    expect(screen.getByText(/Fasilitas dan ustadz\/ustadzah/i)).toBeInTheDocument();
    expect(screen.getByText(/Tampil di Beranda/i)).toBeInTheDocument();
    expect(screen.getByText('#42')).toBeInTheDocument();
    expect(screen.getByText(/20 Oktober 2026/i)).toBeInTheDocument();
  });

  it('does not render content when closed', () => {
    render(
      <TestimoniPreviewDialog
        item={mockItem}
        open={false}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.queryByText('Pratinjau Testimoni Publik')).not.toBeInTheDocument();
  });

  it('renders Disembunyikan status badge when is_featured is false', () => {
    const hiddenItem = {
      ...mockItem,
      is_featured: false,
    };

    render(
      <TestimoniPreviewDialog
        item={hiddenItem}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    expect(screen.getByText('Disembunyikan')).toBeInTheDocument();
  });

  it('renders edit link pointing to /admin/testimoni/edit/:id', () => {
    render(
      <TestimoniPreviewDialog
        item={mockItem}
        open={true}
        onOpenChange={vi.fn()}
      />
    );

    const editLink = screen.getByRole('link', { name: /edit testimoni/i });
    expect(editLink).toBeInTheDocument();
    expect(editLink).toHaveAttribute('href', '/admin/testimoni/edit/42');
  });

  it('triggers onToggleFeatured when toggle switch is clicked', () => {
    const onToggle = vi.fn();
    render(
      <TestimoniPreviewDialog
        item={mockItem}
        open={true}
        onOpenChange={vi.fn()}
        onToggleFeatured={onToggle}
      />
    );

    const toggle = screen.getByRole('switch', { name: /toggle status featured/i });
    fireEvent.click(toggle);

    expect(onToggle).toHaveBeenCalledWith(42, true);
  });

  it('disables the toggle switch when isToggling is true', () => {
    render(
      <TestimoniPreviewDialog
        item={mockItem}
        open={true}
        onOpenChange={vi.fn()}
        onToggleFeatured={vi.fn()}
        isToggling={true}
      />
    );

    const toggle = screen.getByRole('switch', { name: /toggle status featured/i });
    expect(toggle).toBeDisabled();
  });

  it('calls onOpenChange(false) when close button is clicked', () => {
    const onOpenChange = vi.fn();
    render(
      <TestimoniPreviewDialog
        item={mockItem}
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    const closeBtn = screen.getByRole('button', { name: /tutup/i });
    fireEvent.click(closeBtn);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
