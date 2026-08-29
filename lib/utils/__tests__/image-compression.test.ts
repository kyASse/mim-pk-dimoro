import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  compressImageToWebP,
  getWebPFilename,
  calculateTargetDimensions,
} from '../image-compression';

describe('image-compression utility', () => {
  describe('getWebPFilename', () => {
    it('should replace single extension with .webp', () => {
      expect(getWebPFilename('foto-kegiatan.jpg')).toBe('foto-kegiatan.webp');
      expect(getWebPFilename('foto-kegiatan.jpeg')).toBe('foto-kegiatan.webp');
      expect(getWebPFilename('foto-kegiatan.png')).toBe('foto-kegiatan.webp');
      expect(getWebPFilename('foto-kegiatan.BMP')).toBe('foto-kegiatan.webp');
    });

    it('should replace only the last extension when multiple dots exist', () => {
      expect(getWebPFilename('dokumen.sekolah.v2.jpg')).toBe('dokumen.sekolah.v2.webp');
    });

    it('should append .webp if no extension exists', () => {
      expect(getWebPFilename('banner-sekolah')).toBe('banner-sekolah.webp');
    });
  });

  describe('calculateTargetDimensions', () => {
    it('should not upscale if image dimensions are within maximum constraints', () => {
      const result = calculateTargetDimensions(1200, 800, 1600, 1600);
      expect(result).toEqual({ width: 1200, height: 800 });
    });

    it('should scale down landscape image proportionally when width exceeds maxWidth', () => {
      const result = calculateTargetDimensions(3200, 1600, 1600, 1600);
      expect(result).toEqual({ width: 1600, height: 800 });
    });

    it('should scale down portrait image proportionally when height exceeds maxHeight', () => {
      const result = calculateTargetDimensions(1000, 2000, 1600, 1600);
      expect(result).toEqual({ width: 800, height: 1600 });
    });

    it('should scale down when both width and height exceed max constraints', () => {
      // 4000x3000 constrained to 1000x1000 => ratio is min(1000/4000 = 0.25, 1000/3000 = 0.333) = 0.25
      const result = calculateTargetDimensions(4000, 3000, 1000, 1000);
      expect(result).toEqual({ width: 1000, height: 750 });
    });

    it('should handle invalid or zero dimensions safely', () => {
      expect(calculateTargetDimensions(0, 0)).toEqual({ width: 1, height: 1 });
      expect(calculateTargetDimensions(-100, -50)).toEqual({ width: 1, height: 1 });
    });
  });

  describe('compressImageToWebP', () => {
    const originalCreateObjectURL = globalThis.URL?.createObjectURL;
    const originalRevokeObjectURL = globalThis.URL?.revokeObjectURL;
    const originalImage = globalThis.Image;

    beforeEach(() => {
      vi.restoreAllMocks();
    });

    afterEach(() => {
      if (originalCreateObjectURL) {
        globalThis.URL.createObjectURL = originalCreateObjectURL;
      }
      if (originalRevokeObjectURL) {
        globalThis.URL.revokeObjectURL = originalRevokeObjectURL;
      }
      if (originalImage) {
        globalThis.Image = originalImage;
      }
    });

    it('should return original file if file is invalid or null/undefined', async () => {
      // @ts-expect-error testing null input
      const resultNull = await compressImageToWebP(null);
      expect(resultNull).toBeNull();

      // @ts-expect-error testing undefined input
      const resultUndefined = await compressImageToWebP(undefined);
      expect(resultUndefined).toBeUndefined();
    });

    it('should return original file if already WebP', async () => {
      const webpFile = new File(['dummy content'], 'test.webp', { type: 'image/webp' });
      const result = await compressImageToWebP(webpFile);
      expect(result).toBe(webpFile);
    });

    it('should return original file if not an image MIME type', async () => {
      const pdfFile = new File(['dummy content'], 'document.pdf', { type: 'application/pdf' });
      const resultPdf = await compressImageToWebP(pdfFile);
      expect(resultPdf).toBe(pdfFile);

      const txtFile = new File(['dummy text'], 'notes.txt', { type: 'text/plain' });
      const resultTxt = await compressImageToWebP(txtFile);
      expect(resultTxt).toBe(txtFile);
    });

    it('should return original file if file is SVG vector image', async () => {
      const svgFile = new File(['<svg></svg>'], 'logo.svg', { type: 'image/svg+xml' });
      const result = await compressImageToWebP(svgFile);
      expect(result).toBe(svgFile);
    });

    it('should return original file if URL.createObjectURL is unavailable (SSR fallback)', async () => {
      const jpgFile = new File(['jpg-content'], 'test.jpg', { type: 'image/jpeg' });
      // @ts-expect-error testing SSR environment where URL.createObjectURL is undefined
      globalThis.URL.createObjectURL = undefined;

      const result = await compressImageToWebP(jpgFile);
      expect(result).toBe(jpgFile);
    });

    it('should successfully compress a JPEG/PNG file to WebP with correct filename and type', async () => {
      const revokeMock = vi.fn();
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      globalThis.URL.revokeObjectURL = revokeMock;

      // Mock Image
      class MockImage {
        width = 2400;
        height = 1200;
        naturalWidth = 2400;
        naturalHeight = 1200;
        onload: (() => void) | null = null;
        onerror: ((err: unknown) => void) | null = null;
        _src = '';

        set src(value: string) {
          this._src = value;
          setTimeout(() => {
            if (this.onload) this.onload();
          }, 0);
        }

        get src() {
          return this._src;
        }
      }
      // @ts-expect-error mocking Image
      globalThis.Image = MockImage;

      // Mock Canvas and Context
      const mockDrawImage = vi.fn();
      const mockGetContext = vi.fn().mockReturnValue({
        drawImage: mockDrawImage,
      });

      const mockBlob = new Blob(['mock-webp-data'], { type: 'image/webp' });
      const mockToBlob = vi.fn((callback: (blob: Blob | null) => void, mime: string, quality: number) => {
        expect(mime).toBe('image/webp');
        expect(quality).toBe(0.85);
        callback(mockBlob);
      });

      const originalCreateElement = document.createElement.bind(document);
      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: mockGetContext,
            toBlob: mockToBlob,
          } as unknown as HTMLCanvasElement;
        }
        return originalCreateElement(tagName);
      });

      const inputJpg = new File(['raw image content'], 'banner-sekolah.jpg', { type: 'image/jpeg' });
      const compressedFile = await compressImageToWebP(inputJpg);

      expect(compressedFile).toBeInstanceOf(File);
      expect(compressedFile.name).toBe('banner-sekolah.webp');
      expect(compressedFile.type).toBe('image/webp');
      expect(revokeMock).toHaveBeenCalledWith('blob:mock-url');
      expect(mockDrawImage).toHaveBeenCalledWith(expect.anything(), 0, 0, 1600, 800);
    });

    it('should respect custom quality and clamp it properly', async () => {
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      class MockImage {
        width = 800;
        height = 600;
        naturalWidth = 800;
        naturalHeight = 600;
        onload: (() => void) | null = null;
        set src(_: string) {
          setTimeout(() => this.onload && this.onload(), 0);
        }
      }
      // @ts-expect-error mocking Image
      globalThis.Image = MockImage;

      let capturedQuality: number | undefined;
      const mockToBlob = vi.fn((callback: (blob: Blob | null) => void, _mime: string, quality: number) => {
        capturedQuality = quality;
        callback(new Blob(['webp-data'], { type: 'image/webp' }));
      });

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
            toBlob: mockToBlob,
          } as unknown as HTMLCanvasElement;
        }
        return document.createElement(tagName);
      });

      const inputPng = new File(['png-data'], 'photo.png', { type: 'image/png' });

      // Custom quality 0.5
      await compressImageToWebP(inputPng, { quality: 0.5 });
      expect(capturedQuality).toBe(0.5);

      // Clamped quality: under 0.1 clamped to 0.1
      await compressImageToWebP(inputPng, { quality: 0.01 });
      expect(capturedQuality).toBe(0.1);

      // Clamped quality: over 1.0 clamped to 1.0
      await compressImageToWebP(inputPng, { quality: 1.5 });
      expect(capturedQuality).toBe(1.0);
    });

    it('should fallback gracefully to original file if image decoding fails (onerror)', async () => {
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      const revokeMock = vi.fn();
      globalThis.URL.revokeObjectURL = revokeMock;

      class BrokenMockImage {
        onload: (() => void) | null = null;
        onerror: ((e: unknown) => void) | null = null;
        set src(_: string) {
          setTimeout(() => {
            if (this.onerror) this.onerror(new Error('Corrupt image data'));
          }, 0);
        }
      }
      // @ts-expect-error mocking Image
      globalThis.Image = BrokenMockImage;

      const corruptFile = new File(['corrupt content'], 'bad-image.jpg', { type: 'image/jpeg' });
      const result = await compressImageToWebP(corruptFile);

      expect(result).toBe(corruptFile);
      expect(revokeMock).toHaveBeenCalledWith('blob:mock-url');
    });

    it('should fallback gracefully to original file if canvas.toBlob returns null', async () => {
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      class MockImage {
        width = 800;
        height = 600;
        onload: (() => void) | null = null;
        set src(_: string) {
          setTimeout(() => this.onload && this.onload(), 0);
        }
      }
      // @ts-expect-error mocking Image
      globalThis.Image = MockImage;

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
            toBlob: (callback: (b: Blob | null) => void) => callback(null),
          } as unknown as HTMLCanvasElement;
        }
        return document.createElement(tagName);
      });

      const inputFile = new File(['image-data'], 'sample.png', { type: 'image/png' });
      const result = await compressImageToWebP(inputFile);

      expect(result).toBe(inputFile);
    });

    it('should fallback gracefully if canvas 2D context is not available', async () => {
      globalThis.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      globalThis.URL.revokeObjectURL = vi.fn();

      class MockImage {
        width = 800;
        height = 600;
        onload: (() => void) | null = null;
        set src(_: string) {
          setTimeout(() => this.onload && this.onload(), 0);
        }
      }
      // @ts-expect-error mocking Image
      globalThis.Image = MockImage;

      vi.spyOn(document, 'createElement').mockImplementation((tagName: string) => {
        if (tagName === 'canvas') {
          return {
            width: 0,
            height: 0,
            getContext: vi.fn().mockReturnValue(null),
          } as unknown as HTMLCanvasElement;
        }
        return document.createElement(tagName);
      });

      const inputFile = new File(['image-data'], 'sample.png', { type: 'image/png' });
      const result = await compressImageToWebP(inputFile);

      expect(result).toBe(inputFile);
    });
  });
});
