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

vi.mock("@/lib/supabase/admin", () => ({
  createAdminClient: vi.fn(),
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
      const singleMock = vi.fn().mockResolvedValue({
        data: { slug: "artikel-uji" },
        error: null,
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
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
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif/artikel-uji");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should handle error when supabase fails to update status", async () => {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: "Database error" } }),
              }),
            }),
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

    it("should update content successfully and revalidate slug path", async () => {
      const singleMock = vi.fn().mockResolvedValue({
        data: { slug: "opini-baru" },
        error: null,
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
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
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif/opini-baru");
    });

    it("should handle error when supabase fails to update content", async () => {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: "Update error" } }),
              }),
            }),
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
      const singleMock = vi.fn().mockResolvedValue({
        data: { slug: "opini-featured" },
        error: null,
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const updateMock = vi.fn().mockReturnValue({ eq: eqMock });

      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
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
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif/opini-featured");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should handle error when supabase fails to toggle featured", async () => {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          update: () => ({
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: "Toggle error" } }),
              }),
            }),
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
      const singleMock = vi.fn().mockResolvedValue({
        data: { slug: "opini-deleted" },
        error: null,
      });
      const selectMock = vi.fn().mockReturnValue({ single: singleMock });
      const eqMock = vi.fn().mockReturnValue({ select: selectMock });
      const deleteMock = vi.fn().mockReturnValue({ eq: eqMock });

      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          delete: deleteMock,
        }),
      });

      const result = await deleteOpiniAction("some-uuid");
      expect(result.success).toBe(true);
      expect(deleteMock).toHaveBeenCalled();
      expect(revalidatePath).toHaveBeenCalledWith("/admin/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif");
      expect(revalidatePath).toHaveBeenCalledWith("/ruang-perspektif/opini-deleted");
      expect(revalidatePath).toHaveBeenCalledWith("/");
    });

    it("should handle error when supabase fails to delete", async () => {
      const { createAdminClient } = await import("@/lib/supabase/admin");
      (createAdminClient as unknown as ReturnType<typeof vi.fn>).mockResolvedValue({
        from: () => ({
          delete: () => ({
            eq: () => ({
              select: () => ({
                single: () => Promise.resolve({ data: null, error: { message: "Delete error" } }),
              }),
            }),
          }),
        }),
      });

      const result = await deleteOpiniAction("some-uuid");
      expect(result.success).toBe(false);
      expect(result.error).toBe("Delete error");
    });
  });
});
