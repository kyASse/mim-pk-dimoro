import { describe, it, expect, vi, beforeEach } from "vitest";
import { submitOpiniAction } from "../actions";
import { createClient } from "@/lib/supabase/server";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

const VALID_ARTICLE_CONTENT = `Pendidikan karakter anak tidak cukup hanya disampaikan melalui teori dan ceramah di kelas. Anak-anak adalah peniru yang sangat ulung. Mereka memperhatikan setiap gerak-gerik, tutur kata, dan perilaku orang dewasa di sekitar mereka, baik itu guru di sekolah maupun orang tua di rumah. Oleh karena itu, keteladanan nyata menjadi kunci utama dalam pembentukan akhlak mulia siswa madrasah kita tercinta.

Di MIM PK Dimoro, kami membiasakan nilai-nilai islami mulai dari senyum, sapa, salam, hingga pelaksanaan ibadah salat dhuha berjamaah setiap pagi. Melalui pembiasaan yang konsisten ini, anak-anak belajar merasakan manisnya beribadah dan berbuat baik tanpa merasa terbebani atau dipaksa oleh siapapun. Kerja sama antara rumah dan madrasah sangat diperlukan agar nilai-nilai kebaikan yang ditanamkan di sekolah terus berlanjut di rumah. Mari bersama-sama menjadi cermin kebaikan bagi putra-putri kita menuju generasi yang berakhlak mulia dan berprestasi tinggi.`;

describe("submitOpiniAction", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("should fail if bot fills honeypot field", async () => {
    const formData = new FormData();
    formData.append("website_url", "http://spam.org");

    const result = await submitOpiniAction(formData);
    expect(result.success).toBe(false);
    expect(result.error).toContain("Spam");
  });

  it("should fail if required fields are missing", async () => {
    const formData = new FormData();
    formData.append("nama_penulis", "Ahmad");

    const result = await submitOpiniAction(formData);
    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });

  it("should successfully submit opinion without images", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: null });
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: mockInsert,
      }),
      storage: {
        from: vi.fn(),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>);

    const formData = new FormData();
    formData.append("nama_penulis", "Ust. Abdullah");
    formData.append("peran_penulis", "guru");
    formData.append("keterangan_peran", "Guru PAI Kelas 5");
    formData.append("kontak_wa", "081234567890");
    formData.append("email", "abdullah@example.com");
    formData.append("judul", "Membangun Karakter Islami Anak Melalui Keteladanan");
    formData.append("kategori", "Pola Asuh & Parenting");
    formData.append("ringkasan", "Keteladanan orang tua dan guru adalah pondasi utama dalam membentuk akhlak anak di era serba digital.");
    formData.append("isi_lengkap", VALID_ARTICLE_CONTENT);

    const result = await submitOpiniAction(formData);

    expect(result.success).toBe(true);
    expect(result.message).toContain("Alhamdulillah");
    expect(mockSupabase.from).toHaveBeenCalledWith("opini_perspektif");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        judul: "Membangun Karakter Islami Anak Melalui Keteladanan",
        kategori: "Pola Asuh & Parenting",
        nama_penulis: "Ust. Abdullah",
        peran_penulis: "guru",
        keterangan_peran: "Guru PAI Kelas 5",
        kontak_wa: "081234567890",
        email: "abdullah@example.com",
        status: "menunggu_kurasi",
        is_featured: false,
        foto_penulis_url: null,
        gambar_sampul_url: null,
      })
    );
  });

  it("should handle optional image uploads to 'opini' bucket", async () => {
    const mockUploadFoto = vi.fn().mockResolvedValue({
      data: { path: "penulis/test-slug-1.jpg" },
      error: null,
    });
    const mockUploadSampul = vi.fn().mockResolvedValue({
      data: { path: "sampul/test-slug-2.jpg" },
      error: null,
    });
    const mockGetPublicUrlFoto = vi.fn().mockReturnValue({
      data: { publicUrl: "https://supabase.co/storage/v1/object/public/opini/penulis/test-slug-1.jpg" },
    });
    const mockGetPublicUrlSampul = vi.fn().mockReturnValue({
      data: { publicUrl: "https://supabase.co/storage/v1/object/public/opini/sampul/test-slug-2.jpg" },
    });
    const mockInsert = vi.fn().mockResolvedValue({ error: null });

    const mockStorageBucket = {
      upload: vi.fn().mockImplementation((path: string, _file: File) => {
        if (path.startsWith("penulis/")) return mockUploadFoto();
        return mockUploadSampul();
      }),
      getPublicUrl: vi.fn().mockImplementation((path: string) => {
        if (path.startsWith("penulis/")) return mockGetPublicUrlFoto();
        return mockGetPublicUrlSampul();
      }),
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: mockInsert,
      }),
      storage: {
        from: vi.fn().mockReturnValue(mockStorageBucket),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>);

    const formData = new FormData();
    formData.append("nama_penulis", "Siti Aminah");
    formData.append("peran_penulis", "wali_murid");
    formData.append("keterangan_peran", "Wali Murid Kelas 3");
    formData.append("kontak_wa", "+628123456789");
    formData.append("judul", "Menumbuhkan Minat Baca Anak Sejak Dini di Rumah");
    formData.append("kategori", "Kisah Inspiratif");
    formData.append("ringkasan", "Membaca bersama sebelum tidur menciptakan ikatan batin sekaligus meningkatkan literasi anak sejak usia dini.");
    formData.append("isi_lengkap", VALID_ARTICLE_CONTENT);

    const fotoFile = new File(["dummy content"], "avatar.jpg", { type: "image/jpeg" });
    const sampulFile = new File(["dummy content"], "cover.png", { type: "image/png" });
    formData.append("foto_penulis", fotoFile);
    formData.append("gambar_sampul", sampulFile);

    const result = await submitOpiniAction(formData);

    expect(result.success).toBe(true);
    expect(mockStorageBucket.upload).toHaveBeenCalledTimes(2);
    expect(mockSupabase.storage.from).toHaveBeenCalledWith("opini");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        foto_penulis_url: "https://supabase.co/storage/v1/object/public/opini/penulis/test-slug-1.jpg",
        gambar_sampul_url: "https://supabase.co/storage/v1/object/public/opini/sampul/test-slug-2.jpg",
      })
    );
  });

  it("should return error when database insert fails", async () => {
    const mockInsert = vi.fn().mockResolvedValue({ error: { message: "DB Error" } });
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        insert: mockInsert,
      }),
      storage: {
        from: vi.fn(),
      },
    };
    vi.mocked(createClient).mockResolvedValue(mockSupabase as unknown as Awaited<ReturnType<typeof createClient>>);

    const formData = new FormData();
    formData.append("nama_penulis", "Ahmad Fulan");
    formData.append("peran_penulis", "umum");
    formData.append("keterangan_peran", "Praktisi Pendidikan");
    formData.append("kontak_wa", "081234567890");
    formData.append("judul", "Tantangan Pendidikan Dasar di Era Kecerdasan Buatan");
    formData.append("kategori", "Inovasi Pembelajaran");
    formData.append("ringkasan", "Bagaimana sekolah dasar merespons perkembangan teknologi kecerdasan buatan secara bijak dan proporsional.");
    formData.append("isi_lengkap", VALID_ARTICLE_CONTENT);

    const result = await submitOpiniAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toContain("Gagal menyimpan naskah ke database");
  });

  it("should fail if photo file has unsupported MIME type", async () => {
    const formData = new FormData();
    formData.append("nama_penulis", "Ahmad Fulan");
    formData.append("peran_penulis", "umum");
    formData.append("keterangan_peran", "Praktisi Pendidikan");
    formData.append("kontak_wa", "081234567890");
    formData.append("judul", "Tantangan Pendidikan Dasar di Era Kecerdasan Buatan");
    formData.append("kategori", "Inovasi Pembelajaran");
    formData.append("ringkasan", "Bagaimana sekolah dasar merespons perkembangan teknologi kecerdasan buatan secara bijak.");
    formData.append("isi_lengkap", VALID_ARTICLE_CONTENT);

    const badFile = new File(["dummy content"], "exploit.svg", { type: "image/svg+xml" });
    formData.append("foto_penulis", badFile);

    const result = await submitOpiniAction(formData);
    expect(result.success).toBe(false);
    expect(result.error).toContain("Format foto penulis harus JPG, PNG, atau WEBP");
  });

  it("should fail if cover file has unsupported MIME type", async () => {
    const formData = new FormData();
    formData.append("nama_penulis", "Ahmad Fulan");
    formData.append("peran_penulis", "umum");
    formData.append("keterangan_peran", "Praktisi Pendidikan");
    formData.append("kontak_wa", "081234567890");
    formData.append("judul", "Tantangan Pendidikan Dasar di Era Kecerdasan Buatan");
    formData.append("kategori", "Inovasi Pembelajaran");
    formData.append("ringkasan", "Bagaimana sekolah dasar merespons perkembangan teknologi kecerdasan buatan secara bijak.");
    formData.append("isi_lengkap", VALID_ARTICLE_CONTENT);

    const badCover = new File(["dummy content"], "exploit.exe", { type: "application/x-msdownload" });
    formData.append("gambar_sampul", badCover);

    const result = await submitOpiniAction(formData);
    expect(result.success).toBe(false);
    expect(result.error).toContain("Format gambar sampul harus JPG, PNG, atau WEBP");
  });

  it("should catch unexpected errors and return error message", async () => {
    vi.mocked(createClient).mockRejectedValue(new Error("Network connection crashed"));

    const formData = new FormData();
    formData.append("nama_penulis", "Ahmad Fulan");
    formData.append("peran_penulis", "umum");
    formData.append("keterangan_peran", "Praktisi Pendidikan");
    formData.append("kontak_wa", "081234567890");
    formData.append("judul", "Tantangan Pendidikan Dasar di Era Kecerdasan Buatan");
    formData.append("kategori", "Inovasi Pembelajaran");
    formData.append("ringkasan", "Bagaimana sekolah dasar merespons perkembangan teknologi kecerdasan buatan secara bijak dan proporsional.");
    formData.append("isi_lengkap", VALID_ARTICLE_CONTENT);

    const result = await submitOpiniAction(formData);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Network connection crashed");
  });
});
