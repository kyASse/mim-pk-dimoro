import { describe, it, expect, vi, beforeEach } from "vitest";
import { saveIKWMContentAction } from "../actions";
import { DEFAULT_IKWM_CONTENT } from "@/lib/utils/content-parsers";
import { revalidatePath } from "next/cache";

const mockUpsert = vi.fn();
const mockFrom = vi.fn();
const mockRequireRole = vi.fn();

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/auth/guards", () => ({
  requireRole: () => mockRequireRole(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn().mockImplementation(async () => ({
    from: mockFrom,
  })),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({ data: { user: { id: "admin-1" } }, error: null }),
    },
    from: mockFrom,
  }),
}));

describe("IKWM Admin Server Action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRequireRole.mockResolvedValue({
      authorized: true,
      user: { id: "admin-1" },
      profile: { role: "admin" },
    });
    mockFrom.mockReturnValue({
      upsert: mockUpsert,
    });
    mockUpsert.mockResolvedValue({ error: null });
  });

  it("harus berhasil menyimpan payload konten IKWM ke Supabase", async () => {
    const result = await saveIKWMContentAction(DEFAULT_IKWM_CONTENT);
    expect(result.success).toBe(true);
    expect(result.message).toContain("berhasil");
    expect(mockFrom).toHaveBeenCalledWith("konten_halaman");
    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        slug: "ikatan-wali-murid",
        judul: "Ikatan Wali Murid (IKWM)",
        isi: DEFAULT_IKWM_CONTENT,
      }),
      { onConflict: "slug" }
    );
    expect(revalidatePath).toHaveBeenCalledWith("/ikatan-wali-murid");
    expect(revalidatePath).toHaveBeenCalledWith("/admin/konten");
  });

  it("gagal ketika user tidak terotorisasi", async () => {
    mockRequireRole.mockResolvedValueOnce({
      authorized: false,
      message: "Akses tidak diizinkan.",
    });

    const result = await saveIKWMContentAction(DEFAULT_IKWM_CONTENT);
    expect(result.success).toBe(false);
    expect(result.message).toContain("Akses tidak diizinkan");
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("menangani error database saat upsert gagal", async () => {
    mockUpsert.mockResolvedValueOnce({
      error: { message: "Database connection failed" },
    });

    const result = await saveIKWMContentAction(DEFAULT_IKWM_CONTENT);
    expect(result.success).toBe(false);
    expect(result.message).toContain("Database connection failed");
  });
});
