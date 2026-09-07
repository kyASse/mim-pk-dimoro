import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getHeroContent,
  getHeadmasterContent,
  getVisionMissionContent,
  getSchoolIdentityContent,
  getProgramContent,
  getPublicFAQ,
  getPPDBFlowContent,
  getMainStats,
  getExtracurriculars,
} from "@/lib/services/public-content";

// Mock Supabase server client
const mockMaybeSingle = vi.fn();
const mockSelect = vi.fn();
const mockFrom = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockImplementation(async () => ({
    from: mockFrom,
  })),
}));

describe("public-content service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFrom.mockReturnValue({
      select: mockSelect,
    });
    mockSelect.mockReturnValue({
      eq: vi.fn().mockReturnValue({
        maybeSingle: mockMaybeSingle,
      }),
      order: vi.fn().mockResolvedValue({ data: null, error: null }),
    });
  });

  it("getHeroContent returns safe fallback when database returns null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const hero = await getHeroContent();
    expect(hero).toBeDefined();
    expect(hero.headline).toBeDefined();
    expect(hero.hero_image_url).toBe("/images/mim_hero_main.jpg");
  });

  it("getHeadmasterContent returns safe fallback when database returns null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const kepsek = await getHeadmasterContent();
    expect(kepsek).toBeDefined();
    expect(kepsek.nama).toContain("Anik Sulityowati");
    expect(kepsek.paragraphs.length).toBeGreaterThan(0);
  });

  it("getVisionMissionContent returns safe fallback when database returns null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const vm = await getVisionMissionContent();
    expect(vm).toBeDefined();
    expect(vm.motto).toBeDefined();
    expect(vm.misi.length).toBeGreaterThan(0);
  });

  it("getSchoolIdentityContent returns safe fallback when database returns null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const identity = await getSchoolIdentityContent();
    expect(identity).toBeDefined();
    expect(identity.npsn).toBe("60711720");
    expect(identity.akreditasi).toBe("A");
  });

  it("getProgramContent returns safe fallback when database returns null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const program = await getProgramContent();
    expect(program).toBeDefined();
    expect(program.fase_bawah.judul).toContain("Fase A & B");
    expect(program.fase_atas.judul).toContain("Fase B & C");
  });

  it("getPublicFAQ returns safe fallback when database returns null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const faq = await getPublicFAQ();
    expect(Array.isArray(faq)).toBe(true);
    expect(faq.length).toBeGreaterThan(0);
  });

  it("getPPDBFlowContent returns safe fallback when database returns null", async () => {
    mockMaybeSingle.mockResolvedValueOnce({ data: null, error: null });

    const flow = await getPPDBFlowContent();
    expect(flow).toBeDefined();
    expect(flow.formulir_pdf_url).toContain(".pdf");
    expect(flow.alur_online.length).toBeGreaterThan(0);
  });

  it("getMainStats returns default stats when table is empty", async () => {
    mockSelect.mockReturnValueOnce({
      order: vi.fn().mockResolvedValueOnce({ data: [], error: null }),
    });

    const stats = await getMainStats();
    expect(Array.isArray(stats)).toBe(true);
    expect(stats.length).toBe(4);
    expect(stats.some((s: { kunci: string }) => s.kunci === "siswa_aktif")).toBe(true);
  });

  it("getExtracurriculars returns default extracurriculars when table is empty", async () => {
    mockSelect.mockReturnValueOnce({
      order: vi.fn().mockResolvedValueOnce({ data: [], error: null }),
    });

    const eskul = await getExtracurriculars();
    expect(Array.isArray(eskul)).toBe(true);
    expect(eskul.length).toBeGreaterThan(0);
    expect(
      eskul.some((e: { nama_eskul: string }) =>
        e.nama_eskul.toLowerCase().includes("tapak suci")
      )
    ).toBe(true);
  });
});
