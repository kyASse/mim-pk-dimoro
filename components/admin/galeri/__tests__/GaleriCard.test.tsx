import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import GaleriCard, { GaleriItem } from '../GaleriCard';

// Mock next/image
vi.mock('next/image', () => ({
  default: ({ fill, ...props }: any) => <img {...props} />,
}));

// Mock EditImageButton and DeleteImageButton
vi.mock('@/app/admin/galeri/EditImageButton', () => ({
  default: ({ galeriId }: { galeriId: number }) => (
    <button data-testid={`edit-btn-${galeriId}`}>Edit</button>
  ),
}));

vi.mock('@/app/admin/galeri/DeleteImageButton', () => ({
  default: ({ galeriId }: { galeriId: number }) => (
    <button data-testid={`delete-btn-${galeriId}`}>Hapus</button>
  ),
}));

const mockItem: GaleriItem = {
  id: 10,
  image_url: 'https://example.com/kegiatan.jpg',
  keterangan: 'Upacara Hari Santri 2026 di Lapangan Madrasah',
  kategori: 'Ibadah',
  created_at: '2026-10-22T08:00:00Z',
};

describe('GaleriCard', () => {
  it('renders image, caption, category badge, and action triggers correctly', () => {
    const handlePreview = vi.fn();
    render(<GaleriCard item={mockItem} onPreview={handlePreview} />);

    expect(screen.getByText('Upacara Hari Santri 2026 di Lapangan Madrasah')).toBeDefined();
    expect(screen.getByText('Ibadah')).toBeDefined();
    expect(screen.getByTestId('edit-btn-10')).toBeDefined();
    expect(screen.getByTestId('delete-btn-10')).toBeDefined();

    const img = screen.getByAltText('Upacara Hari Santri 2026 di Lapangan Madrasah');
    expect(img.getAttribute('src')).toBe('https://example.com/kegiatan.jpg');
  });

  it('triggers onPreview when preview button is clicked', () => {
    const handlePreview = vi.fn();
    render(<GaleriCard item={mockItem} onPreview={handlePreview} />);

    const previewBtn = screen.getByTestId('preview-btn-10');
    fireEvent.click(previewBtn);

    expect(handlePreview).toHaveBeenCalledTimes(1);
    expect(handlePreview).toHaveBeenCalledWith(mockItem);
  });
});
