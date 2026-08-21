import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import React from 'react';
import ContactFAQ, { getWhatsAppUrl, defaultFAQItems } from '../ContactFAQ';
import ContactForm from '../ContactForm';
import { SCHOOL_NAME, SCHOOL_WHATSAPP } from '@/lib/school-config';

// Mock ResizeObserver and pointer capture for Radix UI and jsdom
beforeAll(() => {
  class MockResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  global.ResizeObserver = MockResizeObserver as any;

  class MockIntersectionObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  global.IntersectionObserver = MockIntersectionObserver as any;

  window.HTMLElement.prototype.scrollIntoView = vi.fn();
  window.HTMLElement.prototype.hasPointerCapture = vi.fn();
  window.HTMLElement.prototype.releasePointerCapture = vi.fn();
});

// Mock Supabase client
const mockInsert = vi.fn();
const mockFrom = vi.fn().mockImplementation(() => ({
  insert: mockInsert,
}));

vi.mock('@/lib/supabase/client', () => ({
  createClient: () => ({
    from: mockFrom,
  }),
}));

// Mock Sonner toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    warning: vi.fn(),
  },
}));

describe('Contact Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ContactFAQ Component', () => {
    it('renders the FAQ header and all relevant questions', () => {
      render(<ContactFAQ />);

      // Header verification
      expect(
        screen.getByRole('heading', {
          name: /Pertanyaan yang Sering Diajukan \(FAQ\)/i,
        })
      ).toBeDefined();

      // Check all default FAQ topics: PPDB, Kurikulum Merdeka & ISMUBA, Biaya & Infaq, Ekstrakurikuler, Kunjungan
      expect(
        screen.getByText(new RegExp(`alur dan syarat pendaftaran siswa baru \\(PPDB\\) di ${SCHOOL_NAME}`, 'i'))
      ).toBeDefined();
      expect(
        screen.getByText(new RegExp(`Kurikulum apa yang diterapkan di ${SCHOOL_NAME}`, 'i'))
      ).toBeDefined();
      expect(
        screen.getByText(new RegExp(`rincian biaya pendidikan dan infaq di ${SCHOOL_NAME}`, 'i'))
      ).toBeDefined();
      expect(
        screen.getByText(/kegiatan ekstrakurikuler unggulan yang tersedia/i)
      ).toBeDefined();
      expect(
        screen.getByText(/kunjungan langsung ke madrasah/i)
      ).toBeDefined();
    });

    it('renders the quick help WhatsApp CTA with correctly formatted URL', () => {
      render(<ContactFAQ />);

      const waCtaLink = screen.getByRole('link', {
        name: /Hubungi via WhatsApp/i,
      });
      expect(waCtaLink).toBeDefined();

      const href = waCtaLink.getAttribute('href');
      expect(href).toBeDefined();
      expect(href).toContain('https://wa.me/');

      // Verify the phone number format in the URL
      const cleanExpectedDigits = SCHOOL_WHATSAPP.replace(/[^0-9]/g, '').replace(/^0/, '62');
      expect(href).toContain(cleanExpectedDigits);
      expect(href).toContain(encodeURIComponent(SCHOOL_NAME));
    });

    it('getWhatsAppUrl helper produces properly formatted international number and encoded text', () => {
      const url = getWhatsAppUrl('+62 821-3388-1991', 'Halo Admin');
      expect(url).toBe('https://wa.me/6282133881991?text=Halo%20Admin');

      const urlWithoutCustomText = getWhatsAppUrl('0821-3388-1991');
      expect(urlWithoutCustomText).toContain('https://wa.me/6282133881991?text=');
    });
  });

  describe('ContactForm Component', () => {
    it('renders all required form input fields and labels', () => {
      render(<ContactForm />);

      expect(screen.getByText(/^Nama Lengkap$/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Masukkan nama lengkap/i)).toBeDefined();

      expect(screen.getByText(/^Email$/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Masukkan email/i)).toBeDefined();

      expect(screen.getByText(/^No\. Telepon$/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Masukkan nomor telepon/i)).toBeDefined();

      expect(screen.getByText(/^Subjek$/i)).toBeDefined();
      expect(screen.getByText(/^Pesan$/i)).toBeDefined();
      expect(screen.getByPlaceholderText(/Tulis pesan Anda/i)).toBeDefined();

      expect(screen.getByRole('button', { name: /Kirim Pesan/i })).toBeDefined();
    });

    it('submits form successfully and displays success message containing SCHOOL_NAME and NOT containing TK ABA Mertosanan', async () => {
      mockInsert.mockResolvedValueOnce({ error: null });

      const { container } = render(<ContactForm />);

      const nameInput = screen.getByPlaceholderText(/Masukkan nama lengkap/i);
      const emailInput = screen.getByPlaceholderText(/Masukkan email/i);
      const phoneInput = screen.getByPlaceholderText(/Masukkan nomor telepon/i);
      const messageInput = screen.getByPlaceholderText(/Tulis pesan Anda/i);

      fireEvent.change(nameInput, { target: { value: 'Ahmad Fauzi' } });
      fireEvent.change(emailInput, { target: { value: 'ahmad@example.com' } });
      fireEvent.change(phoneInput, { target: { value: '081234567890' } });
      fireEvent.change(messageInput, { target: { value: 'Mohon info pendaftaran dan biaya pendidikan.' } });

      // Trigger Select component
      const selectTrigger = screen.getByRole('combobox');
      fireEvent.click(selectTrigger);

      // In Radix Select or test DOM, select an option or use form values
      const option = await screen.findByRole('option', { name: /Informasi Pendaftaran/i });
      fireEvent.click(option);

      const submitButton = screen.getByRole('button', { name: /Kirim Pesan/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalledTimes(1);
      });

      // Verify success screen contents
      expect(screen.getByText(/Pesan Terkirim!/i)).toBeDefined();
      
      const successText = container.textContent || '';
      // Crucial verification: MUST contain SCHOOL_NAME / MIM Dimoro and MUST NOT contain TK ABA Mertosanan
      expect(successText).toContain(SCHOOL_NAME);
      expect(successText).not.toContain('TK ABA Mertosanan');
    });
  });
});
