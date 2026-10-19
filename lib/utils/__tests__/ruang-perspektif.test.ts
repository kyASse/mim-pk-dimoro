import { describe, it, expect } from "vitest";
import {
  generateOpiniSlug,
  estimateReadingTime,
  formatWhatsAppNumber,
  generateWhatsAppUrl,
} from "../ruang-perspektif";

describe("Ruang Perspektif Utilities", () => {
  describe("generateOpiniSlug", () => {
    it("should generate a clean slug from title", () => {
      const slug = generateOpiniSlug("Menumbuhkan Kejujuran Siswa di Era Digital (Refleksi PAI)!");
      expect(slug).toMatch(/^menumbuhkan-kejujuran-siswa-di-era-digital-refleksi-pai-[a-z0-9]{6}$/);
    });

    it("should remove punctuation and handle extra whitespace", () => {
      const slug = generateOpiniSlug("   Pendidikan  Karakter:   Kunci   Masa Depan!   ");
      expect(slug).toMatch(/^pendidikan-karakter-kunci-masa-depan-[a-z0-9]{6}$/);
    });
  });

  describe("estimateReadingTime", () => {
    it("should calculate reading time accurately", () => {
      const words200 = "kata ".repeat(200);
      expect(estimateReadingTime(words200)).toBe(1);

      const words600 = "kata ".repeat(600);
      expect(estimateReadingTime(words600)).toBe(3);
    });

    it("should return minimum 1 minute for short text or empty text", () => {
      expect(estimateReadingTime("")).toBe(1);
      expect(estimateReadingTime("Beberapa kata saja")).toBe(1);
    });
  });

  describe("formatWhatsAppNumber", () => {
    it("should convert leading 0 to 62", () => {
      expect(formatWhatsAppNumber("08123456789")).toBe("628123456789");
    });

    it("should preserve number starting with 62", () => {
      expect(formatWhatsAppNumber("628123456789")).toBe("628123456789");
    });

    it("should remove non-numeric characters like + and spaces", () => {
      expect(formatWhatsAppNumber("+62 812-3456-7890")).toBe("6281234567890");
    });
  });

  describe("generateWhatsAppUrl", () => {
    it("should generate proper WhatsApp url for published article", () => {
      const url = generateWhatsAppUrl({
        phone: "08123456789",
        namaPenulis: "Pak Budi",
        judul: "Pendidikan Ramah Anak",
        status: "terbit",
        urlArtikel: "https://mimpkdimoro.sch.id/ruang-perspektif/pendidikan-ramah-anak",
      });
      expect(url).toContain("https://wa.me/628123456789?text=");
      expect(decodeURIComponent(url)).toContain("resmi diterbitkan");
      expect(decodeURIComponent(url)).toContain("https://mimpkdimoro.sch.id/ruang-perspektif/pendidikan-ramah-anak");
    });

    it("should generate proper WhatsApp url for rejected article with editorial notes", () => {
      const url = generateWhatsAppUrl({
        phone: "+628123456789",
        namaPenulis: "Ibu Siti",
        judul: "Metode Belajar",
        status: "ditolak",
        catatanRedaksi: "Panjang naskah belum memenuhi syarat minimal 250 kata.",
      });
      expect(url).toContain("https://wa.me/628123456789?text=");
      expect(decodeURIComponent(url)).toContain("Panjang naskah belum memenuhi syarat minimal 250 kata");
    });

    it("should provide default note if catatanRedaksi is not supplied for rejected status", () => {
      const url = generateWhatsAppUrl({
        phone: "08123456789",
        namaPenulis: "Ahmad",
        judul: "Gagasan Madrasah",
        status: "ditolak",
      });
      expect(decodeURIComponent(url)).toContain("Perlu penyelarasan materi");
    });
  });
});
