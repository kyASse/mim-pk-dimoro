import { describe, it, expect } from 'vitest';
import { extractStoragePath } from '../storage';

describe('extractStoragePath', () => {
  it('should return relative path when given a relative path', () => {
    expect(extractStoragePath('berita/123_image.png', 'konten-publik')).toBe('berita/123_image.png');
  });

  it('should extract relative path from a full Supabase public URL', () => {
    const url = 'https://xyz.supabase.co/storage/v1/object/public/konten-publik/berita/123_image.png';
    expect(extractStoragePath(url, 'konten-publik')).toBe('berita/123_image.png');
  });

  it('should handle invalid or empty inputs gracefully', () => {
    expect(extractStoragePath(null, 'konten-publik')).toBeNull();
    expect(extractStoragePath('', 'konten-publik')).toBeNull();
    expect(extractStoragePath('   ', 'konten-publik')).toBeNull();
  });

  it('should strip query parameters and hash fragments from URL', () => {
    const url = 'https://xyz.supabase.co/storage/v1/object/public/konten-publik/berita/123.png?t=1690000#section';
    expect(extractStoragePath(url, 'konten-publik')).toBe('berita/123.png');
  });

  it('should decode URI components such as encoded spaces', () => {
    const url = 'https://xyz.supabase.co/storage/v1/object/public/konten-publik/berita/foto%20kegiatan.jpg';
    expect(extractStoragePath(url, 'konten-publik')).toBe('berita/foto kegiatan.jpg');
  });
});

