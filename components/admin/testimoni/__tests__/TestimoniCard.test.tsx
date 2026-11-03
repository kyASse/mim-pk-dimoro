import React from 'react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TestimoniCard from '../TestimoniCard';

describe('TestimoniCard', () => {
  const mockItem = {
    id: 1,
    nama_orang_tua: 'Ahmad Dahlan',
    status_orang_tua: 'Wali Murid Kelas 3',
    isi_testimoni: 'Sekolah yang sangat mendidik karakter islami anak saya.',
    is_featured: true,
    created_at: '2026-10-15T10:00:00Z',
  };

  it('renders author name, role, quote, and featured badge correctly', () => {
    const onPreview = vi.fn();
    render(<TestimoniCard item={mockItem} onPreview={onPreview} />);

    expect(screen.getByText('Ahmad Dahlan')).toBeInTheDocument();
    expect(screen.getByText('Wali Murid Kelas 3')).toBeInTheDocument();
    expect(screen.getByText(/Sekolah yang sangat mendidik karakter/i)).toBeInTheDocument();
    expect(screen.getByText('Tampil di Beranda')).toBeInTheDocument();
  });

  it('triggers onPreview when preview button is clicked', () => {
    const onPreview = vi.fn();
    render(<TestimoniCard item={mockItem} onPreview={onPreview} />);

    const previewBtn = screen.getByRole('button', { name: /preview testimoni/i });
    fireEvent.click(previewBtn);

    expect(onPreview).toHaveBeenCalledWith(mockItem);
  });

  it('triggers onToggleFeatured when toggle switch is clicked', async () => {
    const onToggle = vi.fn();
    render(<TestimoniCard item={mockItem} onPreview={vi.fn()} onToggleFeatured={onToggle} />);

    const toggle = screen.getByRole('switch');
    fireEvent.click(toggle);

    expect(onToggle).toHaveBeenCalledWith(1, true);
  });

  it('displays Disembunyikan when is_featured is false', () => {
    const hiddenItem = { ...mockItem, is_featured: false };
    render(<TestimoniCard item={hiddenItem} onPreview={vi.fn()} />);

    expect(screen.getByText('Disembunyikan')).toBeInTheDocument();
  });

  it('disables the switch when isToggling is true', () => {
    render(
      <TestimoniCard
        item={mockItem}
        onPreview={vi.fn()}
        onToggleFeatured={vi.fn()}
        isToggling={true}
      />
    );

    const toggle = screen.getByRole('switch');
    expect(toggle).toBeDisabled();
  });
});
