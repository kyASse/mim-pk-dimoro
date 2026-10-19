import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  updateOpiniStatusAction,
  toggleFeaturedOpiniAction,
  updateOpiniContentAction,
  deleteOpiniAction,
} from "../actions";
import { revalidatePath } from "next/cache";

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

describe("Admin Ruang Perspektif Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("updateOpiniStatusAction", () => {
    it("should fail if id is missing when updating status", async () => {
      const result = await updateOpiniStatusAction("", "terbit");
      expect(result.success).toBe(false);
      expect(result.error).toBe("ID naskah tidak valid");
    });

    it("should succeed when valid status is passed to supabase", async () => {
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: updateMock,
        }),
      });

      const result = await updateOpiniStatusAction("some-uuid", "terbit", "Catatan revisi");
      expect(result.success).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "terbit",
          catatan_redaksi: "Catatan revisi",
          waktu_terbit: expect.any(String),
          updated_at: expect.any(String),
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/admin/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/ruang-perspektif/some-uuid");
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should handle error when supabase fails to update status", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: () => ({
            eq: () => Promise.resolve({ error: { message: "Database error" } }),
          }),
        }),
      });

      const result = await updateOpiniStatusAction("some-uuid", "ditolak");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Database error");
    });
  });

  describe("updateOpiniContentAction", () => {
    it("should fail if id is missing", async () => {
      const result = await updateOpiniContentAction("", {
        judul: "Judul",
        kategori: "Pola Asuh & Parenting",
        ringkasan: "Ringkasan",
        isi_lengkap: "Isi",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("ID naskah tidak valid");
    });

    it("should update content successfully", async () => {
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: updateMock,
        }),
      });

      const result = await updateOpiniContentAction("some-uuid", {
        judul: "Judul Baru",
        kategori: "Pendidikan & Karakter",
        ringkasan: "Ringkasan baru",
        isi_lengkap: "Isi lengkap baru",
        catatan_redaksi: "Sudah disesuaikan",
      });
      expect(result.success).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          judul: "Judul Baru",
          kategori: "Pendidikan & Karakter",
          ringkasan: "Ringkasan baru",
          isi_lengkap: "Isi lengkap baru",
          catatan_redaksi: "Sudah disesuaikan",
          updated_at: expect.any(String),
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/admin/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/admin/ruang-perspektif/some-uuid");
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif");
    });

    it("should handle error when supabase fails to update content", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: () => ({
            eq: () => Promise.resolve({ error: { message: "Update error" } }),
          }),
        }),
      });

      const result = await updateOpiniContentAction("some-uuid", {
        judul: "Judul",
        kategori: "Pola Asuh & Parenting",
        ringkasan: "Ringkasan",
        isi_lengkap: "Isi",
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe("Update error");
    });
  });

  describe("toggleFeaturedOpiniAction", () => {
    it("should fail if id is missing", async () => {
      const result = await toggleFeaturedOpiniAction("", true);
      expect(result.success).toBe(false);
      expect(result.error).toBe("ID tidak valid");
    });

    it("should toggle featured successfully", async () => {
      const updateMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: updateMock,
        }),
      });

      const result = await toggleFeaturedOpiniAction("some-uuid", true);
      expect(result.success).toBe(true);
      expect(updateMock).toHaveBeenCalledWith(
        expect.objectContaining({
          is_featured: true,
          updated_at: expect.any(String),
        })
      );
      expect(revalidatePath).toHaveBeenCalledWith("/admin/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should handle error when supabase fails to toggle featured", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: () => ({
            eq: () => Promise.resolve({ error: { message: "Toggle error" } }),
          }),
        }),
      });

      const result = await toggleFeaturedOpiniAction("some-uuid", false);
      expect(result.success).toBe(false);
      expect(result.error).toBe("Toggle error");
    });
  });

  describe("deleteOpiniAction", () => {
    it("should fail if id is missing", async () => {
      const result = await deleteOpiniAction("");
      expect(result.success).toBe(false);
      expect(result.error).toBe("ID tidak valid");
    });

    it("should delete opinion successfully", async () => {
      const deleteMock = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      });
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          delete: deleteMock,
        }),
      });

      const result = await deleteOpiniAction("some-uuid");
      expect(result.success).toBe(true);
      expect(deleteMock).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should handle error when supabase fails to delete", async () => {
      const { createClient } = await import("@/lib/supabase/server");
      (createClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          delete: () => ({
            eq: () => Promise.resolve({ error: { message: "Delete error" } }),
          }),
        }),
      });

      const result = await deleteOpiniAction("some-uuid");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Delete error");
    });
  });
});
