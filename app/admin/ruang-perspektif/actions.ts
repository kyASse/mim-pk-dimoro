"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { StatusOpini, KategoriOpini } from "@/lib/types/ruang-perspektif";
import { revalidatePath } from "next/cache";

export async function updateOpiniStatusAction(
  id: string,
  status: StatusOpini,
  catatanRedaksi?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) return { success: false, error: "ID naskah tidak valid" };

    const supabase = await createAdminClient();
    const updatePayload: {
      status: StatusOpini;
      updated_at: string;
      catatan_redaksi?: string;
      waktu_terbit?: string;
    } = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (catatanRedaksi !== undefined) {
      updatePayload.catatan_redaksi = catatanRedaksi;
    }

    if (status === "terbit") {
      updatePayload.waktu_terbit = new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from("opini_perspektif")
      .update(updatePayload)
      .eq("id", id)
      .select("slug")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    revalidatePath("/admin/ruang-perspektif");
    revalidatePath(`/admin/ruang-perspektif/${id}`);
    revalidatePath("/ruang-perspektif");
    if (updated?.slug) {
      revalidatePath(`/ruang-perspektif/${updated.slug}`);
    }
    revalidatePath("/");

    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal memperbarui status";
    return { success: false, error: errorMsg };
  }
}

export async function updateOpiniContentAction(
  id: string,
  data: {
    judul: string;
    kategori: KategoriOpini;
    ringkasan: string;
    isi_lengkap: string;
    catatan_redaksi?: string | null;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) return { success: false, error: "ID naskah tidak valid" };

    const supabase = await createAdminClient();
    const { data: updated, error } = await supabase
      .from("opini_perspektif")
      .update({
        judul: data.judul,
        kategori: data.kategori,
        ringkasan: data.ringkasan,
        isi_lengkap: data.isi_lengkap,
        catatan_redaksi: data.catatan_redaksi,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select("slug")
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/ruang-perspektif");
    revalidatePath(`/admin/ruang-perspektif/${id}`);
    revalidatePath("/ruang-perspektif");
    if (updated?.slug) {
      revalidatePath(`/ruang-perspektif/${updated.slug}`);
    }
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menyimpan perubahan";
    return { success: false, error: errorMsg };
  }
}

export async function toggleFeaturedOpiniAction(
  id: string,
  isFeatured: boolean
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };

    const supabase = await createAdminClient();
    const { data: updated, error } = await supabase
      .from("opini_perspektif")
      .update({ is_featured: isFeatured, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select("slug")
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/ruang-perspektif");
    revalidatePath("/ruang-perspektif");
    if (updated?.slug) {
      revalidatePath(`/ruang-perspektif/${updated.slug}`);
    }
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal mengubah status sorotan";
    return { success: false, error: errorMsg };
  }
}

export async function deleteOpiniAction(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (!id) return { success: false, error: "ID tidak valid" };

    const supabase = await createAdminClient();
    const { data: deleted, error } = await supabase
      .from("opini_perspektif")
      .delete()
      .eq("id", id)
      .select("slug")
      .single();

    if (error) return { success: false, error: error.message };

    revalidatePath("/admin/ruang-perspektif");
    revalidatePath("/ruang-perspektif");
    if (deleted?.slug) {
      revalidatePath(`/ruang-perspektif/${deleted.slug}`);
    }
    revalidatePath("/");
    return { success: true };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Gagal menghapus naskah";
    return { success: false, error: errorMsg };
  }
}
