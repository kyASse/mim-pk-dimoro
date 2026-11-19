import { describe, it, expect, vi, beforeEach } from "vitest";
import { revalidatePath } from "next/cache";
import {
  saveHeroContentAction,
  saveHeadmasterContentAction,
  saveMainStatsAction,
  saveExtracurricularAction,
  deleteExtracurricularAction,
  saveStrukturOrganisasiAction,
} from "../actions";
import type { StrukturOrganisasiContent } from "@/lib/types/content";

// Mock next/cache
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock auth guards
const mockRequireRole = vi.fn();
vi.mock("@/lib/auth/guards", () => ({
  requireRole: () => mockRequireRole(),
}));

// Mock Supabase admin
const mockUpsert = vi.fn();
const mockUpdate = vi.fn();
const mockInsert = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn().mockImplementation(async () => ({
    from: mockFrom,
  })),
}));

describe("Admin Konten Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireRole.mockResolvedValue({
      authorized: true,
      user: { id: "admin-1" },
      profile: { role: "admin" },
    });

    mockFrom.mockReturnValue({
      upsert: mockUpsert,
      update: mockUpdate,
      insert: mockInsert,
      delete: mockDelete,
    });
    mockUpsert.mockResolvedValue({ error: null });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockInsert.mockResolvedValue({ error: null });
    mockEq.mockResolvedValue({ error: null });
  });

  it("fails when user is unauthorized", async () => {
    mockRequireRole.mockResolvedValueOnce({
      authorized: false,
      message: "Akses tidak diizinkan.",
    });

    const res = await saveHeroContentAction({
      eyebrow: "MIM",
      headline: "Headline",
      subheadline: "Sub",
      hero_image_url: "/img.jpg",
      floating_stat_number: "59",
      floating_stat_text: "Th",
      trust_badges: ["A"],
    });

    expect(res.success).toBe(false);
    expect(res.message).toContain("Akses tidak diizinkan");
  });

  it("successfully saves hero content and calls upsert", async () => {
    const res = await saveHeroContentAction({
      eyebrow: "MIM",
      headline: "Headline Baru",
      subheadline: "Sub",
      hero_image_url: "/img.jpg",
      floating_stat_number: "59",
      floating_stat_text: "Th",
      trust_badges: ["A"],
    });

    expect(res.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("konten_halaman");
    expect(mockUpsert).toHaveBeenCalled();
  });

  it("successfully saves headmaster content", async () => {
    const res = await saveHeadmasterContentAction({
      nama: "Anik Sulityowati",
      gelar: "S.Ag.",
      jabatan: "Kepala Madrasah",
      foto_url: "/kepsek.jpg",
      summary: "Sambutan",
      paragraphs: ["P1", "P2"],
    });

    expect(res.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("konten_halaman");
  });

  it("successfully saves main stats", async () => {
    const res = await saveMainStatsAction([
      { kunci: "siswa_aktif", nilai: "180+", deskripsi: "Siswa" },
    ]);

    expect(res.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("statistik_utama");
  });

  it("successfully deletes extracurricular item", async () => {
    const res = await deleteExtracurricularAction(5);
    expect(res.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("ekstrakurikuler");
    expect(mockDelete).toHaveBeenCalled();
    expect(mockEq).toHaveBeenCalledWith("id", 5);
  });

  const sampleStrukturData: StrukturOrganisasiContent = {
    hero: {
      badge: "Struktur Organisasi",
      judul: "Struktur Organisasi Madrasah",
      subjudul: "Susunan kepengurusan",
      tahun_ajaran: "2025/2026",
    },
    personil: [{ id: "p-1", nama: "Anik Sulityowati, S.Ag.", foto_url: "/avatar.png", gender: "P" }],
    komite: { id: "komite", jabatan: "Komite Madrasah", personil_id: "" },
    kamad: { id: "kamad", jabatan: "Kepala Madrasah", personil_id: "p-1" },
    administrasi: [{ id: "tu", jabatan: "Kepala TU", personil_id: "" }],
    waka: [{ id: "waka-1", jabatan: "Waka Kurikulum", personil_id: "" }],
    penunjang: [{ id: "penunjang-1", jabatan: "Pustakawan", personil_id: "" }],
    wali_kelas: [{ id: "wali-1", jabatan: "Wali Kelas 1", personil_id: "" }],
    dewan_guru_label: "Dewan Guru",
    guru_mapel: [{ id: "mapel-1", jabatan: "Guru PJOK", personil_id: "" }],
    siswa_label: "Siswa-Siswi MIM PK Dimoro",
  };

  it("saveStrukturOrganisasiAction upserts struktur-organisasi and revalidates paths", async () => {
    const res = await saveStrukturOrganisasiAction(sampleStrukturData);

    expect(res.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("konten_halaman");
    expect(mockUpsert).toHaveBeenCalledWith(
      {
        slug: "struktur-organisasi",
        judul: "Struktur Organisasi Madrasah",
        isi: sampleStrukturData,
      },
      { onConflict: "slug" }
    );
    expect(revalidatePath).toHaveBeenCalledWith("/struktur-organisasi");
    expect(revalidatePath).toHaveBeenCalledWith("/tentang-kami");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/konten");
  });

  it("saveStrukturOrganisasiAction rejects unauthorized callers", async () => {
    mockRequireRole.mockResolvedValueOnce({
      authorized: false,
      message: "Akses tidak diizinkan.",
    });

    const res = await saveStrukturOrganisasiAction(sampleStrukturData);

    expect(res.success).toBe(false);
    expect(res.message).toContain("Akses tidak diizinkan");
    expect(mockUpsert).not.toHaveBeenCalled();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
