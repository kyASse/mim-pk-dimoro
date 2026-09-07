export interface ImageCompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  fallbackMimeType?: string;
}

/**
 * Extracts and replaces the existing file extension with .webp.
 */
export function getWebPFilename(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex <= 0) {
    return `${filename}.webp`;
  }
  return `${filename.substring(0, lastDotIndex)}.webp`;
}

/**
 * Calculates target dimensions preserving aspect ratio without upscaling.
 */
export function calculateTargetDimensions(
  width: number,
  height: number,
  maxWidth: number = 1600,
  maxHeight: number = 1600
): { width: number; height: number } {
  if (width <= 0 || height <= 0) {
    return { width: Math.max(1, width), height: Math.max(1, height) };
  }

  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  const ratio = Math.min(maxWidth / width, maxHeight / height);
  return {
    width: Math.max(1, Math.round(width * ratio)),
    height: Math.max(1, Math.round(height * ratio)),
  };
}

/**
 * Compresses an image file into WebP format on the client side.
 * Preserves aspect ratio up to maxWidth/maxHeight.
 * Safely falls back to the original file in SSR or unsupported environments.
 */
export async function compressImageToWebP(
  file: File,
  options?: ImageCompressionOptions
): Promise<File> {
  // 1. Validate file existence and type
  if (!file || typeof file.slice !== 'function') {
    return file;
  }

  // If already WebP or not a compressible image format (or vector SVG), return original
  if (
    !file.type ||
    !file.type.startsWith('image/') ||
    file.type === 'image/webp' ||
    file.type === 'image/svg+xml'
  ) {
    return file;
  }

  // 2. SSR/DOM environment check
  if (
    typeof window === 'undefined' ||
    typeof document === 'undefined' ||
    typeof document.createElement !== 'function' ||
    typeof URL === 'undefined' ||
    typeof URL.createObjectURL !== 'function' ||
    typeof URL.revokeObjectURL !== 'function'
  ) {
    return file;
  }

  const maxWidth = options?.maxWidth && options.maxWidth > 0 ? options.maxWidth : 1600;
  const maxHeight = options?.maxHeight && options.maxHeight > 0 ? options.maxHeight : 1600;
  const rawQuality = options?.quality ?? 0.85;
  const quality = Math.min(1.0, Math.max(0.1, rawQuality));

  let objectUrl: string | null = null;

  try {
    objectUrl = URL.createObjectURL(file);

    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = (e) => reject(e);
      image.src = objectUrl!;
    });

    const naturalWidth = img.naturalWidth || img.width;
    const naturalHeight = img.naturalHeight || img.height;

    if (!naturalWidth || !naturalHeight) {
      return file;
    }

    const { width: targetWidth, height: targetHeight } = calculateTargetDimensions(
      naturalWidth,
      naturalHeight,
      maxWidth,
      maxHeight
    );

    const canvas = document.createElement('canvas');
    canvas.width = targetWidth;
    canvas.height = targetHeight;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return file;
    }

    ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

    const targetMime = 'image/webp';
    const blob = await new Promise<Blob | null>((resolve) => {
      try {
        canvas.toBlob(
          (b) => resolve(b),
          targetMime,
          quality
        );
      } catch {
        resolve(null);
      }
    });

    if (!blob) {
      return file;
    }

    const newFilename = getWebPFilename(file.name);
    return new File([blob], newFilename, {
      type: targetMime,
      lastModified: Date.now(),
    });
  } catch {
    // Graceful fallback to original file if compression fails
    return file;
  } finally {
    if (objectUrl) {
      try {
        URL.revokeObjectURL(objectUrl);
      } catch {
        // Ignore cleanup errors
      }
    }
  }
}
