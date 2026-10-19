import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getPublicOpinions,
  getFeaturedPublicOpinion,
  getPublicOpinionBySlug,
  getAdminOpinions,
  getAdminOpinionById,
} from "../ruang-perspektif";
import { OpiniPerspektif } from "@/lib/types/ruang-perspektif";

const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(async () => ({
    from: mockFrom,
  })),
}));

describe("Ruang Perspektif Service Layer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getPublicOpinions", () => {
    it("should return empty array if supabase throws error", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: new Error("DB Error") }),
          }),
        }),
      });

      const results = await getPublicOpinions();
      expect(results).toEqual([]);
    });

    it("should return mapped public opinions with reading time", async () => {
      const mockRawData = [
        {
          id: "opini-1",
          slug: "judul-satu-abc123",
          judul: "Judul Satu",
          ringkasan: "Ringkasan satu",
          isi_lengkap: "kata ".repeat(400),
          kategori: "Pendidikan & Karakter",
          nama_penulis: "Ustadz Ali",
          peran_penulis: "guru",
          keterangan_peran: "Guru PAI",
          foto_penulis_url: "https://example.com/foto.jpg",
          gambar_sampul_url: "https://example.com/sampul.jpg",
          is_featured: false,
          waktu_terbit: "2026-10-19T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockRawData, error: null }),
          }),
        }),
      });

      const results = await getPublicOpinions();
      expect(results).toHaveLength(1);
      expect(results[0]).toEqual({
        id: "opini-1",
        slug: "judul-satu-abc123",
        judul: "Judul Satu",
        ringkasan: "Ringkasan satu",
        kategori: "Pendidikan & Karakter",
        nama_penulis: "Ustadz Ali",
        peran_penulis: "guru",
        keterangan_peran: "Guru PAI",
        foto_penulis_url: "https://example.com/foto.jpg",
        gambar_sampul_url: "https://example.com/sampul.jpg",
        is_featured: false,
        waktu_terbit: "2026-10-19T00:00:00Z",
        waktu_baca_menit: 2,
      });
    });

    it("should apply filters for peran, kategori, and search", async () => {
      const mockEq2 = vi.fn();
      const mockEq3 = vi.fn();
      const mockOr = vi.fn();

      const mockQuery: any = {
        eq: vi.fn(),
        order: vi.fn().mockReturnThis(),
      };

      // Chaining setup
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      mockQuery.eq.mockReturnValueOnce(mockQuery); // eq("status", "terbit")
      mockQuery.order.mockReturnValueOnce(mockQuery);
      mockQuery.eq.mockImplementation((key: string, val: string) => {
        return mockQuery;
      });
      mockQuery.or = vi.fn().mockImplementation(() => {
        return Promise.resolve({ data: [], error: null });
      });

      await getPublicOpinions({
        peran: "wali_murid",
        kategori: "Pola Asuh & Parenting",
        search: " parenting ",
      });

      expect(mockQuery.eq).toHaveBeenCalledWith("status", "terbit");
      expect(mockQuery.eq).toHaveBeenCalledWith("peran_penulis", "wali_murid");
      expect(mockQuery.eq).toHaveBeenCalledWith("kategori", "Pola Asuh & Parenting");
      expect(mockQuery.or).toHaveBeenCalled();
    });
  });

  describe("getFeaturedPublicOpinion", () => {
    it("should return the featured opinion if present", async () => {
      const mockRawData = [
        {
          id: "opini-1",
          slug: "opini-1-slug",
          judul: "Biasa",
          ringkasan: "Ringkasan",
          isi_lengkap: "isi naskah",
          kategori: "Kisah Inspiratif",
          nama_penulis: "A",
          peran_penulis: "umum",
          keterangan_peran: null,
          foto_penulis_url: null,
          gambar_sampul_url: null,
          is_featured: false,
          waktu_terbit: "2026-10-18T00:00:00Z",
        },
        {
          id: "opini-2",
          slug: "opini-2-slug",
          judul: "Featured",
          ringkasan: "Ringkasan featured",
          isi_lengkap: "isi naskah featured",
          kategori: "Kisah Inspiratif",
          nama_penulis: "B",
          peran_penulis: "guru",
          keterangan_peran: null,
          foto_penulis_url: null,
          gambar_sampul_url: null,
          is_featured: true,
          waktu_terbit: "2026-10-19T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockRawData, error: null }),
          }),
        }),
      });

      const featured = await getFeaturedPublicOpinion();
      expect(featured?.id).toBe("opini-2");
    });

    it("should fallback to the first opinion if none is marked as featured", async () => {
      const mockRawData = [
        {
          id: "opini-1",
          slug: "opini-1-slug",
          judul: "Biasa",
          ringkasan: "Ringkasan",
          isi_lengkap: "isi",
          kategori: "Opini Bebas",
          nama_penulis: "A",
          peran_penulis: "umum",
          keterangan_peran: null,
          foto_penulis_url: null,
          gambar_sampul_url: null,
          is_featured: false,
          waktu_terbit: "2026-10-18T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockRawData, error: null }),
          }),
        }),
      });

      const featured = await getFeaturedPublicOpinion();
      expect(featured?.id).toBe("opini-1");
    });

    it("should return null if list is empty", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      });

      const featured = await getFeaturedPublicOpinion();
      expect(featured).toBeNull();
    });
  });

  describe("getPublicOpinionBySlug", () => {
    it("should return null if not found", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          }),
        }),
      });

      const result = await getPublicOpinionBySlug("non-existent");
      expect(result).toBeNull();
    });

    it("should return detailed opinion and trigger read count increment", async () => {
      const mockDetail = {
        id: "opini-123",
        slug: "pendidikan-islam-123456",
        judul: "Pendidikan Islam",
        ringkasan: "Ringkasan",
        isi_lengkap: "isi lengkap artikel yang cukup panjang...",
        kategori: "Pendidikan & Karakter",
        nama_penulis: "Ahmad",
        peran_penulis: "guru",
        keterangan_peran: "Guru Kelas 6",
        foto_penulis_url: null,
        gambar_sampul_url: null,
        is_featured: false,
        waktu_terbit: "2026-10-19T00:00:00Z",
        dibaca_count: 5,
      };

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          then: vi.fn(),
        }),
      });

      mockFrom.mockImplementation((table: string) => {
        return {
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                maybeSingle: vi.fn().mockResolvedValue({ data: mockDetail, error: null }),
              }),
            }),
          }),
          update: mockUpdate,
        };
      });

      const result = await getPublicOpinionBySlug("pendidikan-islam-123456");
      expect(result).not.toBeNull();
      expect(result?.id).toBe("opini-123");
      expect(result?.waktu_baca_menit).toBe(1);
      expect(mockUpdate).toHaveBeenCalledWith({ dibaca_count: 6 });
    });
  });

  describe("getAdminOpinions", () => {
    it("should return list of opinions for admin", async () => {
      const mockList: OpiniPerspektif[] = [
        {
          id: "op-1",
          slug: "slug-1",
          judul: "Judul 1",
          ringkasan: "Ringkasan 1",
          isi_lengkap: "Isi 1",
          kategori: "Pendidikan & Karakter",
          nama_penulis: "Penulis 1",
          peran_penulis: "guru",
          keterangan_peran: null,
          foto_penulis_url: null,
          gambar_sampul_url: null,
          kontak_wa: "08123456789",
          email: null,
          status: "menunggu_kurasi",
          catatan_redaksi: null,
          is_featured: false,
          waktu_terbit: null,
          dibaca_count: 0,
          created_at: "2026-10-19T00:00:00Z",
          updated_at: "2026-10-19T00:00:00Z",
        },
      ];

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockList, error: null }),
        }),
      });

      const result = await getAdminOpinions();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe("op-1");
    });

    it("should filter by status and search", async () => {
      const mockQuery: any = {
        order: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockResolvedValue({ data: [], error: null }),
      };

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue(mockQuery),
      });

      await getAdminOpinions({ status: "menunggu_kurasi", search: "Budi" });
      expect(mockQuery.eq).toHaveBeenCalledWith("status", "menunggu_kurasi");
      expect(mockQuery.or).toHaveBeenCalled();
    });
  });

  describe("getAdminOpinionById", () => {
    it("should return opinion by id", async () => {
      const mockOpini = {
        id: "op-xyz",
        judul: "Opini XYZ",
      };

      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: mockOpini, error: null }),
          }),
        }),
      });

      const result = await getAdminOpinionById("op-xyz");
      expect(result).toEqual(mockOpini);
    });

    it("should return null if error or not found", async () => {
      mockFrom.mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: new Error("Not found") }),
          }),
        }),
      });

      const result = await getAdminOpinionById("missing");
      expect(result).toBeNull();
    });
  });
});
