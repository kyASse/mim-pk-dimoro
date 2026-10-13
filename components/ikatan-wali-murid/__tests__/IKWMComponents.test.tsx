import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import IKWMHero from "../IKWMHero";
import KataPengantarSection from "../KataPengantarSection";
import StrukturalSection from "../StrukturalSection";
import KegiatanBentoSection from "../KegiatanBentoSection";
import { DEFAULT_IKWM_CONTENT } from "@/lib/utils/content-parsers";

describe("IKWM Core Public Components", () => {
  describe("IKWMHero", () => {
    it("harus merender IKWMHero dengan judul dan periode", () => {
      render(<IKWMHero hero={DEFAULT_IKWM_CONTENT.hero} />);
      expect(screen.getByRole("heading", { level: 1, name: DEFAULT_IKWM_CONTENT.hero.judul })).toBeDefined();
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.hero.periode)).toBeDefined();
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.hero.badge)).toBeDefined();
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.hero.subjudul)).toBeDefined();
    });

    it("dapat menerima custom className", () => {
      const { container } = render(
        <IKWMHero hero={DEFAULT_IKWM_CONTENT.hero} className="custom-test-class" />
      );
      expect((container.firstChild as HTMLElement)?.className).toContain("custom-test-class");
    });
  });

  describe("KataPengantarSection", () => {
    it("harus merender KataPengantarSection dengan nama ketua dan kutipan", () => {
      render(<KataPengantarSection kataPengantar={DEFAULT_IKWM_CONTENT.kata_pengantar} />);
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.kata_pengantar.nama_ketua)).toBeDefined();
      expect(screen.getByText(new RegExp(DEFAULT_IKWM_CONTENT.kata_pengantar.kutipan_kunci, "i"))).toBeDefined();
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.kata_pengantar.judul)).toBeDefined();
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.kata_pengantar.jabatan)).toBeDefined();
    });

    it("harus merender seluruh paragraf sambutan", () => {
      render(<KataPengantarSection kataPengantar={DEFAULT_IKWM_CONTENT.kata_pengantar} />);
      DEFAULT_IKWM_CONTENT.kata_pengantar.sambutan.forEach((paragraph) => {
        expect(screen.getByText(paragraph)).toBeDefined();
      });
    });

    it("merender foto ketua dengan alt yang sesuai", () => {
      render(<KataPengantarSection kataPengantar={DEFAULT_IKWM_CONTENT.kata_pengantar} />);
      const img = screen.getByAltText(new RegExp(DEFAULT_IKWM_CONTENT.kata_pengantar.nama_ketua, "i"));
      expect(img).toBeDefined();
    });
  });

  describe("StrukturalSection", () => {
    it("harus merender StrukturalSection dengan pimpinan inti dan bidang", () => {
      render(<StrukturalSection struktural={DEFAULT_IKWM_CONTENT.struktural} />);
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.struktural.pengurus_inti[0].nama)).toBeDefined();
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.struktural.bidang[0].nama_bidang)).toBeDefined();
    });

    it("harus merender dewan pembina", () => {
      render(<StrukturalSection struktural={DEFAULT_IKWM_CONTENT.struktural} />);
      DEFAULT_IKWM_CONTENT.struktural.pembina.forEach((pembina) => {
        expect(screen.getByText(pembina.nama)).toBeDefined();
        expect(screen.getByText(pembina.jabatan)).toBeDefined();
      });
    });

    it("harus merender seluruh pengurus harian inti", () => {
      render(<StrukturalSection struktural={DEFAULT_IKWM_CONTENT.struktural} />);
      DEFAULT_IKWM_CONTENT.struktural.pengurus_inti.forEach((pengurus) => {
        expect(screen.getByText(pengurus.nama)).toBeDefined();
        expect(screen.getByText(pengurus.jabatan)).toBeDefined();
      });
    });

    it("harus merender seluruh koordinator dan anggota bidang", () => {
      render(<StrukturalSection struktural={DEFAULT_IKWM_CONTENT.struktural} />);
      DEFAULT_IKWM_CONTENT.struktural.bidang.forEach((b) => {
        expect(screen.getByText(b.nama_bidang)).toBeDefined();
        expect(screen.getByText(b.koordinator)).toBeDefined();
        b.anggota.forEach((anggota) => {
          expect(screen.getByText(anggota)).toBeDefined();
        });
      });
    });
  });

  describe("KegiatanBentoSection", () => {
    it("harus merender KegiatanBentoSection dengan program kerja", () => {
      render(<KegiatanBentoSection kegiatan={DEFAULT_IKWM_CONTENT.kegiatan} />);
      expect(screen.getByText(DEFAULT_IKWM_CONTENT.kegiatan[0].judul)).toBeDefined();
    });

    it("harus merender seluruh kegiatan dengan badge jadwal dan deskripsi", () => {
      render(<KegiatanBentoSection kegiatan={DEFAULT_IKWM_CONTENT.kegiatan} />);
      DEFAULT_IKWM_CONTENT.kegiatan.forEach((item) => {
        expect(screen.getByText(item.judul)).toBeDefined();
        expect(screen.getByText(item.deskripsi)).toBeDefined();
        expect(screen.getByText(item.jadwal)).toBeDefined();
      });
    });

    it("dapat merender keadaan kosong ketika tidak ada kegiatan", () => {
      render(<KegiatanBentoSection kegiatan={[]} />);
      expect(screen.getByText(/belum ada agenda kegiatan/i)).toBeDefined();
    });
  });
});
