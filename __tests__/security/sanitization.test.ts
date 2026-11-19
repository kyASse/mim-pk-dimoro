import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { sanitizeHtml } from '@/lib/utils/sanitize-html';
import OpiniArticleReader from '@/components/ruang-perspektif/OpiniArticleReader';
import { OpiniPublicDetail } from '@/lib/types/ruang-perspektif';

describe('Security Utility: sanitizeHtml', () => {
  it('should preserve safe formatting tags', () => {
    const input = '<p>Paragraf <strong>tebal</strong> dan <em>miring</em></p>';
    expect(sanitizeHtml(input)).toBe(input);
  });

  it('should strip script tags and their content', () => {
    const malicious = '<p>Normal</p><script>alert("XSS")</script>';
    const cleaned = sanitizeHtml(malicious);
    expect(cleaned).not.toContain('<script>');
    expect(cleaned).not.toContain('alert');
    expect(cleaned).toContain('<p>Normal</p>');
  });

  it('should strip malicious event handlers (onerror, onload, onclick)', () => {
    const malicious = '<img src="x" onerror="alert(1)" /><p onclick="hack()">Klik</p>';
    const cleaned = sanitizeHtml(malicious);
    expect(cleaned).not.toContain('onerror');
    expect(cleaned).not.toContain('onclick');
    expect(cleaned).not.toContain('alert(1)');
  });

  it('should strip javascript: pseudo-protocols in links', () => {
    const malicious = '<a href="javascript:alert(1)">Klik saya</a>';
    const cleaned = sanitizeHtml(malicious);
    expect(cleaned).not.toContain('javascript:');
  });

  it('should strip dangerous tags like iframe, object, embed, and svg', () => {
    const malicious = '<iframe src="https://evil.com"></iframe><object data="evil.swf"></object><svg onload="alert(1)">test</svg>';
    const cleaned = sanitizeHtml(malicious);
    expect(cleaned).not.toContain('<iframe');
    expect(cleaned).not.toContain('evil.com');
    expect(cleaned).not.toContain('<object');
    expect(cleaned).not.toContain('<svg');
  });

  it('should handle empty or non-string input safely', () => {
    expect(sanitizeHtml('')).toBe('');
    // @ts-expect-error testing invalid type input
    expect(sanitizeHtml(null)).toBe('');
    // @ts-expect-error testing invalid type input
    expect(sanitizeHtml(undefined)).toBe('');
  });

  it('should neutralize malicious XSS scripts and handlers when rendered in OpiniArticleReader', () => {
    const item: OpiniPublicDetail = {
      id: 'xss-test',
      slug: 'xss-test',
      judul: 'XSS Test',
      ringkasan: 'Ringkasan',
      isi_lengkap: '<p>Aman</p><script>alert("hacked")</script><img src="x" onerror="alert(1)" /><a href="javascript:alert(2)">Link</a>',
      kategori: 'Pendidikan & Karakter',
      nama_penulis: 'Hacker',
      peran_penulis: 'umum',
      keterangan_peran: 'Tamu',
      foto_penulis_url: null,
      gambar_sampul_url: null,
      is_featured: false,
      waktu_terbit: '2026-10-19T08:00:00Z',
      waktu_baca_menit: 1,
      dibaca_count: 1,
    };
    const { container } = render(React.createElement(OpiniArticleReader, { item }));
    expect(container.querySelector('script')).toBeNull();
    expect(container.innerHTML).not.toContain('onerror');
    expect(container.innerHTML).not.toContain('alert');
    expect(container.innerHTML).not.toContain('javascript:');
    expect(container.textContent).toContain('Aman');
  });
});
