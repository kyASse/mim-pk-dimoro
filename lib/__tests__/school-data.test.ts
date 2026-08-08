import { describe, it, expect } from 'vitest';
import {
  HEADMASTER_WELCOME,
  VISION_MISSION,
  EXCELLENT_PROGRAMS,
  INTEGRATED_CURRICULUM,
  COMPETENT_EDUCATORS,
} from '../school-data';

describe('Centralized School Data Layer (lib/school-data.ts)', () => {
  describe('HEADMASTER_WELCOME', () => {
    it('should have correct headmaster name and title', () => {
      expect(HEADMASTER_WELCOME.name).toBe('Hj. Anik Sulityowati, S.Ag.');
      expect(HEADMASTER_WELCOME.title).toBe('Kepala MI Muhammadiyah Dimoro');
    });

    it('should contain at least 5 paragraphs', () => {
      expect(HEADMASTER_WELCOME.paragraphs.length).toBeGreaterThanOrEqual(5);
    });
  });

  describe('VISION_MISSION', () => {
    it('should have vision containing "Terwujudnya generasi Islami"', () => {
      expect(VISION_MISSION.vision).toContain('Terwujudnya generasi Islami');
    });

    it('should have 7 vision indicators', () => {
      expect(VISION_MISSION.visionIndicators).toHaveLength(7);
    });

    it('should have 8 mission items', () => {
      expect(VISION_MISSION.missions).toHaveLength(8);
    });
  });

  describe('EXCELLENT_PROGRAMS', () => {
    it('should have correct Tahfidz program title and target', () => {
      expect(EXCELLENT_PROGRAMS.tahfidz.title).toBe("Program Tahfidz Al-Qur'an");
      expect(EXCELLENT_PROGRAMS.tahfidz.target).toContain('1 juz');
    });

    it('should have Klinik Belajar with title "Klinik Belajar"', () => {
      expect(EXCELLENT_PROGRAMS.klinikBelajar.title).toBe('Klinik Belajar');
    });

    it('should have 6 graduate profile items', () => {
      expect(EXCELLENT_PROGRAMS.graduateProfiles).toHaveLength(6);
    });
  });

  describe('INTEGRATED_CURRICULUM', () => {
    it('should have 8 curriculum pillars', () => {
      expect(INTEGRATED_CURRICULUM.pillars).toHaveLength(8);
    });
  });

  describe('COMPETENT_EDUCATORS', () => {
    it('should have 8 educator programs', () => {
      expect(COMPETENT_EDUCATORS.programs).toHaveLength(8);
    });

    it('should have 5 educator commitments', () => {
      expect(COMPETENT_EDUCATORS.commitments).toHaveLength(5);
    });
  });
});
