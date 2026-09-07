import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  saveHeroContentAction,
  saveHeadmasterContentAction,
  saveMainStatsAction,
  saveExtracurricularAction,
  deleteExtracurricularAction,
} from "../actions";

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
});
