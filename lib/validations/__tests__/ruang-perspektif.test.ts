import { describe, it, expect } from "vitest";
import { opiniSubmissionSchema, opiniAdminUpdateSchema } from "../ruang-perspektif";

describe("Ruang Perspektif Validations", () => {
  describe("opiniSubmissionSchema", () => {
    const validPayload = {
      nama_penulis: "Ustadz Ahmad Fauzi",
      peran_penulis: "guru",
      keterangan_peran: "Guru Al-Islam & Kemuhammadiyahan",
      kontak_wa: "081234567890",
      email: "ahmad.fauzi@example.com",
      judul: "Menumbuhkan Kejujuran Siswa di Era Digital",
      kategori: "Pendidikan & Karakter",
      ringkasan: "Sebuah refleksi mendalam mengenai pentingnya keteladanan moral orang tua dan guru dalam mendampingi anak bermedia digital.",
      isi_lengkap: "a".repeat(850),
      website_url: "",
    };

    it("should accept valid submission payload", () => {
      const result = opiniSubmissionSchema.safeParse(validPayload);
      expect(result.success).toBe(true);
    });

    it("should reject invalid WhatsApp phone numbers", () => {
      const invalidPhones = ["12345", "0712345678", "abc08123", "+1234567890"];
      for (const phone of invalidPhones) {
        const result = opiniSubmissionSchema.safeParse({ ...validPayload, kontak_wa: phone });
        expect(result.success).toBe(false);
      }
    });

    it("should reject short content below 800 characters", () => {
      const result = opiniSubmissionSchema.safeParse({ ...validPayload, isi_lengkap: "Terlalu pendek" });
      expect(result.success).toBe(false);
    });

    it("should reject if bot fills the honeypot website_url field", () => {
      const result = opiniSubmissionSchema.safeParse({ ...validPayload, website_url: "https://spam.com" });
      expect(result.success).toBe(false);
    });
  });

  describe("opiniAdminUpdateSchema", () => {
    it("should validate admin updates and status transitions", () => {
      const validAdminPayload = {
        judul: "Menumbuhkan Kejujuran Siswa di Era Digital (Revisi)",
        slug: "menumbuhkan-kejujuran-siswa-era-digital",
        kategori: "Pendidikan & Karakter",
        ringkasan: "Ringkasan ringkas yang diperbarui oleh redaksi madrasah.",
        isi_lengkap: "Isi teks naskah yang sudah diedit dan dirapikan oleh redaksi madrasah agar memenuhi standar publikasi yang layak muat.",
        status: "terbit",
        catatan_redaksi: "Naskah sangat baik dan layak muat.",
        is_featured: true,
      };

      const result = opiniAdminUpdateSchema.safeParse(validAdminPayload);
      expect(result.success).toBe(true);
    });

    it("should reject short content below 100 characters", () => {
      const result = opiniAdminUpdateSchema.safeParse({
        judul: "Menumbuhkan Kejujuran Siswa di Era Digital (Revisi)",
        slug: "menumbuhkan-kejujuran-siswa-era-digital",
        kategori: "Pendidikan & Karakter",
        ringkasan: "Ringkasan ringkas yang diperbarui oleh redaksi madrasah.",
        isi_lengkap: "Terlalu pendek",
        status: "terbit",
        catatan_redaksi: "Naskah sangat baik dan layak muat.",
        is_featured: true,
      });
      expect(result.success).toBe(false);
    });
  });
});
