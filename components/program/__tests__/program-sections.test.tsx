import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import React from "react";
import IntegratedCurriculumSection from "../IntegratedCurriculumSection";
import ProgramPage from "@/app/program/page";
import { INTEGRATED_CURRICULUM, EXCELLENT_PROGRAMS } from "@/lib/school-data";

// Setup mocks for framer-motion
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    li: ({ children, ...props }: any) => <li {...props}>{children}</li>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe("Program Page & Components", () => {
  describe("IntegratedCurriculumSection", () => {
    it("renders title, description, and 8 curriculum pillar tabs", () => {
      render(<IntegratedCurriculumSection />);

      expect(screen.getByText(INTEGRATED_CURRICULUM.title)).toBeDefined();
      expect(screen.getByText(INTEGRATED_CURRICULUM.description)).toBeDefined();

      // Verify all 8 pillars are rendered in the tab triggers
      const pillarTitles = [
        "Akademik",
        "Al-Islam",
        "Kemuhammadiyahan",
        "Karakter Islami",
        "Kepemimpinan",
        "Life Skill",
        "Ekstrakurikuler",
        "Pembiasaan Harian",
      ];

      pillarTitles.forEach((title) => {
        expect(screen.getByRole("tab", { name: new RegExp(title, "i") })).toBeDefined();
      });
    });

    it("displays default pillar (Akademik) details and items", () => {
      render(<IntegratedCurriculumSection />);

      const akademikDetail = INTEGRATED_CURRICULUM.pillarDetails.find(
        (p) => p.id === "akademik"
      );
      expect(screen.getByText(akademikDetail!.description)).toBeDefined();
      expect(screen.getByText(akademikDetail!.items[0])).toBeDefined();
      expect(screen.getByText(akademikDetail!.items[1])).toBeDefined();
    });
  });

  describe("Program Page (app/program/page.tsx)", () => {
    it("renders Program page with Tahfidz Al-Qur'an full objective, 7 activities, and 4 graduate targets", () => {
      render(<ProgramPage />);

      // Tahfidz section checks
      expect(screen.getAllByText(EXCELLENT_PROGRAMS.tahfidz.title).length).toBeGreaterThan(0);
      expect(screen.getByText(EXCELLENT_PROGRAMS.tahfidz.objective)).toBeDefined();

      // 7 activities check
      expect(screen.getByText("7 Rangkaian Kegiatan Tahfidz:")).toBeDefined();
      EXCELLENT_PROGRAMS.tahfidz.activities.forEach((act) => {
        expect(screen.getByText(act)).toBeDefined();
      });

      // 4 graduate targets check (including 1 juz target)
      expect(screen.getByText("4 Target Capaian Lulusan:")).toBeDefined();
      EXCELLENT_PROGRAMS.tahfidz.graduateTargets.forEach((tgt) => {
        expect(screen.getByText(tgt)).toBeDefined();
      });
    });

    it("renders Klinik Belajar full objective, 3 target audience points, 8 activities, 5 learning approaches, and expectation statement", () => {
      render(<ProgramPage />);

      // Klinik Belajar section checks
      expect(screen.getByText(EXCELLENT_PROGRAMS.klinikBelajar.title)).toBeDefined();
      expect(screen.getByText(EXCELLENT_PROGRAMS.klinikBelajar.objective)).toBeDefined();

      // 3 target audience check
      expect(screen.getByText("3 Sasaran Peserta Klinik Belajar:")).toBeDefined();
      EXCELLENT_PROGRAMS.klinikBelajar.targetAudience.forEach((aud) => {
        expect(screen.getByText(aud)).toBeDefined();
      });

      // 8 activities check
      expect(screen.getByText("8 Kegiatan Utama Klinik Belajar:")).toBeDefined();
      EXCELLENT_PROGRAMS.klinikBelajar.activities.forEach((act) => {
        expect(screen.getByText(act)).toBeDefined();
      });

      // 5 learning approaches check
      expect(screen.getByText("5 Pendekatan Pembelajaran:")).toBeDefined();
      EXCELLENT_PROGRAMS.klinikBelajar.learningApproaches.forEach((appr) => {
        expect(screen.getByText(appr)).toBeDefined();
      });

      // Expectation statement check
      expect(
        screen.getByText(`"${EXCELLENT_PROGRAMS.klinikBelajar.expectationStatement}"`)
      ).toBeDefined();
    });
  });
});
