// lib/utils/__tests__/pesan-templates.test.ts
import { describe, it, expect } from 'vitest';
import {
  QUICK_REPLY_TEMPLATES,
  getQuickReplyTemplateById,
  type QuickReplyCategory,
} from '../pesan-templates';
import { SCHOOL_NAME } from '@/lib/school-config';

describe('pesan-templates', () => {
  it('exports exactly 4 quick reply templates with required categories', () => {
    expect(QUICK_REPLY_TEMPLATES).toHaveLength(4);
    const ids = QUICK_REPLY_TEMPLATES.map((t) => t.id);
    expect(ids).toEqual(['ppdb', 'biaya', 'program', 'kunjungan']);
  });

  it('contains proper label and description for each template', () => {
    QUICK_REPLY_TEMPLATES.forEach((template) => {
      expect(template.id).toBeDefined();
      expect(template.label).toBeTruthy();
      expect(template.description).toBeTruthy();
      expect(typeof template.generateText).toBe('function');
    });
  });

  describe('Template: ppdb', () => {
    const ppdbTemplate = QUICK_REPLY_TEMPLATES.find((t) => t.id === 'ppdb')!;

    it('interpolates sender name and subject correctly', () => {
      const text = ppdbTemplate.generateText({
        namaPengirim: 'Ahmad Fauzi',
        subjek: 'Pendaftaran Kelas 1',
      });

      expect(text).toContain('Ahmad Fauzi');
      expect(text).toContain('Pendaftaran Kelas 1');
      expect(text).toContain('PPDB');
      expect(text).toContain(SCHOOL_NAME);
      expect(text).toContain('Akta Kelahiran');
      expect(text).toContain('Kartu Keluarga');
    });

    it('handles null or empty subject gracefully', () => {
      const textWithoutSubject = ppdbTemplate.generateText({
        namaPengirim: 'Siti Nurhaliza',
        subjek: null,
      });

      expect(textWithoutSubject).toContain('Siti Nurhaliza');
      expect(textWithoutSubject).not.toContain('null');
      expect(textWithoutSubject).not.toContain('undefined');
    });
  });

  describe('Template: biaya', () => {
    const biayaTemplate = QUICK_REPLY_TEMPLATES.find((t) => t.id === 'biaya')!;

    it('interpolates sender name and mentions tuition fee details', () => {
      const text = biayaTemplate.generateText({
        namaPengirim: 'Budi Santoso',
        subjek: 'Info Biaya Masuk',
      });

      expect(text).toContain('Budi Santoso');
      expect(text).toContain('Info Biaya Masuk');
      expect(text).toContain('SPP');
      expect(text).toContain('Seragam');
      expect(text).toContain('beasiswa');
    });

    it('handles empty subject', () => {
      const text = biayaTemplate.generateText({
        namaPengirim: 'Ibu Rahma',
        subjek: '',
      });

      expect(text).toContain('Ibu Rahma');
      expect(text).not.toContain('terkait ""');
    });
  });

  describe('Template: program', () => {
    const programTemplate = QUICK_REPLY_TEMPLATES.find((t) => t.id === 'program')!;

    it('interpolates sender name and mentions school programs', () => {
      const text = programTemplate.generateText({
        namaPengirim: 'Hendra Gunawan',
        subjek: 'Program Tahfidz',
      });

      expect(text).toContain('Hendra Gunawan');
      expect(text).toContain('Program Tahfidz');
      expect(text).toContain("Tahfidzul Qur'an");
      expect(text).toContain('Full Day');
    });
  });

  describe('Template: kunjungan', () => {
    const kunjunganTemplate = QUICK_REPLY_TEMPLATES.find((t) => t.id === 'kunjungan')!;

    it('interpolates sender name and mentions visit hours and invitation', () => {
      const text = kunjunganTemplate.generateText({
        namaPengirim: 'Dr. Anwar',
        subjek: 'Rencana Kunjungan',
      });

      expect(text).toContain('Dr. Anwar');
      expect(text).toContain('Rencana Kunjungan');
      expect(text).toContain('Senin - Sabtu');
      expect(text).toContain('07.30');
      expect(text).toContain('Observasi');
    });
  });

  describe('Edge Cases', () => {
    it('handles names with special characters (quotes, apostrophes, dashes)', () => {
      const specialName = 'H. M. Syarifudin, M.Pd.I (O\'Connor)';
      QUICK_REPLY_TEMPLATES.forEach((tpl) => {
        const text = tpl.generateText({
          namaPengirim: specialName,
          subjek: 'Konsultasi & Tanya Jawab',
        });
        expect(text).toContain(specialName);
        expect(text).toContain('Konsultasi & Tanya Jawab');
      });
    });

    it('handles undefined subject gracefully across all templates', () => {
      QUICK_REPLY_TEMPLATES.forEach((tpl) => {
        const text = tpl.generateText({
          namaPengirim: 'Fatimah',
          subjek: undefined,
        });
        expect(text).toContain('Fatimah');
        expect(text).not.toContain('undefined');
        expect(text).not.toContain('null');
      });
    });
  });

  describe('getQuickReplyTemplateById', () => {
    it('returns the correct template by id', () => {
      const template = getQuickReplyTemplateById('ppdb');
      expect(template).toBeDefined();
      expect(template?.id).toBe('ppdb');
    });

    it('returns undefined for invalid id', () => {
      const template = getQuickReplyTemplateById('invalid_id' as QuickReplyCategory);
      expect(template).toBeUndefined();
    });
  });
});
