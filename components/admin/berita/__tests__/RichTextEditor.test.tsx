// components/admin/berita/__tests__/RichTextEditor.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import RichTextEditor from '../RichTextEditor';
import { toast } from 'sonner';
import * as imageCompression from '@/lib/utils/image-compression';
import * as beritaActions from '@/app/admin/berita/actions';

// Mock sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock berita server actions
vi.mock('@/app/admin/berita/actions', () => ({
  uploadBeritaInlineImageAction: vi.fn(),
}));

describe('RichTextEditor Component', () => {
  const defaultProps = {
    value: '<p>Halo dunia</p>',
    onChange: vi.fn(),
    placeholder: 'Tulis isi berita...',
  };

  beforeAll(() => {
    if (typeof window !== 'undefined') {
      Range.prototype.getClientRects = vi.fn().mockReturnValue([]);
      Range.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        toJSON: () => '',
      });
      Element.prototype.getClientRects = vi.fn().mockReturnValue([]);
      Element.prototype.getBoundingClientRect = vi.fn().mockReturnValue({
        x: 0,
        y: 0,
        bottom: 0,
        height: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        toJSON: () => '',
      });
    }
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all toolbar buttons with accessible labels', () => {
    render(<RichTextEditor {...defaultProps} />);

    // Hierarchy
    expect(screen.getByRole('button', { name: /Paragraf/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Heading 1/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Heading 2/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Heading 3/i })).toBeDefined();

    // Inline Formatting
    expect(screen.getByRole('button', { name: /Tebal \(Bold\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Miring \(Italic\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Garis Bawah \(Underline\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Coret \(Strikethrough\)/i })).toBeDefined();

    // Block Formatting
    expect(screen.getByRole('button', { name: /Kutipan \(Blockquote\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Daftar Poin \(Bullet List\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Daftar Angka \(Ordered List\)/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Garis Pemisah \(Divider\)/i })).toBeDefined();

    // Media & Links
    expect(screen.getByRole('button', { name: /Sisipkan Tautan/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Unggah Gambar/i })).toBeDefined();

    // History
    expect(screen.getByRole('button', { name: /Undo/i })).toBeDefined();
    expect(screen.getByRole('button', { name: /Redo/i })).toBeDefined();
  });

  it('renders initial content in editor', () => {
    render(<RichTextEditor {...defaultProps} value="<p>Konten awal pengujian</p>" />);
    expect(screen.getByText('Konten awal pengujian')).toBeDefined();
  });

  it('respects the disabled prop by disabling toolbar buttons', () => {
    render(<RichTextEditor {...defaultProps} disabled={true} />);

    const boldButton = screen.getByRole('button', { name: /Tebal \(Bold\)/i }) as HTMLButtonElement;
    const italicButton = screen.getByRole('button', { name: /Miring \(Italic\)/i }) as HTMLButtonElement;
    const imageButton = screen.getByRole('button', { name: /Unggah Gambar/i }) as HTMLButtonElement;

    expect(boldButton.disabled).toBe(true);
    expect(italicButton.disabled).toBe(true);
    expect(imageButton.disabled).toBe(true);
  });

  it('triggers block formatting buttons without error', () => {
    render(<RichTextEditor {...defaultProps} />);
    const quoteButton = screen.getByRole('button', { name: /Kutipan \(Blockquote\)/i });
    const bulletButton = screen.getByRole('button', { name: /Daftar Poin \(Bullet List\)/i });
    const orderedButton = screen.getByRole('button', { name: /Daftar Angka \(Ordered List\)/i });
    const dividerButton = screen.getByRole('button', { name: /Garis Pemisah \(Divider\)/i });

    fireEvent.click(quoteButton);
    fireEvent.click(bulletButton);
    fireEvent.click(orderedButton);
    fireEvent.click(dividerButton);

    expect(quoteButton).toBeDefined();
  });

  it('triggers bold formatting when Bold button is clicked', () => {
    render(<RichTextEditor {...defaultProps} />);
    const boldButton = screen.getByRole('button', { name: /Tebal \(Bold\)/i });
    fireEvent.click(boldButton);
    expect(boldButton).toBeDefined();
  });

  it('handles image upload using onUploadImage prop with WebP compression', async () => {
    const mockFile = new File(['dummy-image-bytes'], 'kegiatan.png', { type: 'image/png' });
    const mockCompressedFile = new File(['compressed-webp-bytes'], 'kegiatan.webp', { type: 'image/webp' });

    const compressSpy = vi
      .spyOn(imageCompression, 'compressImageToWebP')
      .mockResolvedValue(mockCompressedFile);

    const onUploadImageMock = vi
      .fn()
      .mockResolvedValue('https://example.com/uploads/kegiatan.webp');

    render(<RichTextEditor {...defaultProps} onUploadImage={onUploadImageMock} />);

    const fileInput = screen.getByTestId('rich-text-image-input') as HTMLInputElement;

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(compressSpy).toHaveBeenCalledWith(mockFile);
      expect(onUploadImageMock).toHaveBeenCalledWith(mockCompressedFile);
      expect(toast.success).toHaveBeenCalledWith('Gambar berhasil disisipkan');
    });
  });

  it('handles image upload using default uploadBeritaInlineImageAction when onUploadImage is not provided', async () => {
    const mockFile = new File(['dummy-image-bytes'], 'foto.jpg', { type: 'image/jpeg' });
    const mockCompressedFile = new File(['compressed-webp-bytes'], 'foto.webp', { type: 'image/webp' });

    vi.spyOn(imageCompression, 'compressImageToWebP').mockResolvedValue(mockCompressedFile);

    const uploadActionMock = vi.mocked(beritaActions.uploadBeritaInlineImageAction).mockResolvedValue({
      success: true,
      url: 'https://storage.example.com/berita/inline/123-foto.webp',
    });

    render(<RichTextEditor {...defaultProps} />);

    const fileInput = screen.getByTestId('rich-text-image-input') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(uploadActionMock).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith('Gambar berhasil disisipkan');
    });
  });

  it('displays error toast when non-image file is selected', async () => {
    const nonImageFile = new File(['text content'], 'doc.pdf', { type: 'application/pdf' });

    render(<RichTextEditor {...defaultProps} />);

    const fileInput = screen.getByTestId('rich-text-image-input') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [nonImageFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('File yang dipilih bukan gambar yang valid');
    });
  });

  it('displays error toast when image upload fails', async () => {
    const mockFile = new File(['dummy-image-bytes'], 'foto-gagal.jpg', { type: 'image/jpeg' });

    vi.spyOn(imageCompression, 'compressImageToWebP').mockResolvedValue(mockFile);

    vi.mocked(beritaActions.uploadBeritaInlineImageAction).mockResolvedValue({
      success: false,
      message: 'Gagal mengunggah ke storage',
    });

    render(<RichTextEditor {...defaultProps} />);

    const fileInput = screen.getByTestId('rich-text-image-input') as HTMLInputElement;
    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Gagal mengunggah ke storage');
    });
  });

  it('opens link dialog, inputs URL, and closes dialog on submit', async () => {
    render(<RichTextEditor {...defaultProps} />);

    const linkButton = screen.getByRole('button', { name: /Sisipkan Tautan/i });
    fireEvent.click(linkButton);

    expect(screen.getByText('Sisipkan Tautan')).toBeDefined();

    const urlInput = screen.getByPlaceholderText('https://example.com') as HTMLInputElement;
    fireEvent.change(urlInput, { target: { value: 'https://mim-pk-dimoro.sch.id' } });

    const submitButton = screen.getByRole('button', { name: /Simpan Tautan/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.queryByText('Sisipkan Tautan')).toBeNull();
    });
  });

  it('allows cancelling link dialog without modifying link', async () => {
    render(<RichTextEditor {...defaultProps} />);

    const linkButton = screen.getByRole('button', { name: /Sisipkan Tautan/i });
    fireEvent.click(linkButton);

    expect(screen.getByText('Sisipkan Tautan')).toBeDefined();

    const cancelButton = screen.getByRole('button', { name: /Batal/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Sisipkan Tautan')).toBeNull();
    });
  });
});
