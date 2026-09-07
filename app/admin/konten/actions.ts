'use server';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth/guards";
import type { UserRole } from "@/lib/auth/types";
import {
  HeroContent,
  BerandaKeunggulanContent,
  HeadmasterContent,
  VisionMissionContent,
  SchoolIdentityContent,
  ProgramKurikulumContent,
  FAQItem,
  PPDBFlowContent,
  EkstrakurikulerItem,
  MainStatItem,
} from "@/lib/types/content";

const ALLOWED_CONTENT_ROLES: UserRole[] = ["super_admin", "admin", "admin_tu", "kepala_madrasah"];

// Helper untuk simpan atau perbarui data ke tabel konten_halaman
async function upsertPageContent(
  slug: string,
  judul: string,
  isi: Record<string, unknown>,
  pathsToRevalidate: string[]
): Promise<{ success: boolean; message: string }> {
  const auth = await requireRole(ALLOWED_CONTENT_ROLES);
  if (!auth.authorized) {
    return { success: false, message: auth.message || "Akses tidak diizinkan." };
  }

  try {
    const admin = await createAdminClient();
    const { error } = await admin
      .from("konten_halaman")
      .upsert(
        {
          slug,
          judul,
          isi,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "slug" }
      );

    if (error) {
      console.error(`[actions] Gagal upsert konten ${slug}:`, error);
      return { success: false, message: `Gagal menyimpan konten: ${error.message}` };
    }

    pathsToRevalidate.forEach((path) => revalidatePath(path));
    return { success: true, message: "Konten berhasil disimpan dan diperbarui!" };
  } catch (err: any) {
    console.error(`[actions] Unexpected error upserting ${slug}:`, err);
    return { success: false, message: `Terjadi kesalahan sistem: ${err?.message}` };
  }
}

/**
 * 1. Simpan Konten Hero Banner Beranda
 */
export async function saveHeroContentAction(
  data: HeroContent
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "beranda-hero",
    "Hero Banner Beranda",
    data as unknown as Record<string, unknown>,
    ["/", "/admin/konten"]
  );
}

/**
 * 2. Simpan Bento Keunggulan Beranda
 */
export async function saveBerandaKeunggulanAction(
  data: BerandaKeunggulanContent
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "beranda-keunggulan",
    "Bento Keunggulan Beranda",
    data as unknown as Record<string, unknown>,
    ["/", "/admin/konten"]
  );
}

/**
 * 3. Simpan Sambutan Kepala Madrasah
 */
export async function saveHeadmasterContentAction(
  data: HeadmasterContent
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "tentang-sambutan",
    "Sambutan Kepala Madrasah",
    data as unknown as Record<string, unknown>,
    ["/", "/tentang-kami", "/admin/konten"]
  );
}

/**
 * 4. Simpan Visi, Misi & Motto Madrasah
 */
export async function saveVisionMissionAction(
  data: VisionMissionContent
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "tentang-visi-misi",
    "Visi Misi dan Motto",
    data as unknown as Record<string, unknown>,
    ["/tentang-kami", "/admin/konten"]
  );
}

/**
 * 5. Simpan Identitas Resmi Madrasah
 */
export async function saveSchoolIdentityAction(
  data: SchoolIdentityContent
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "tentang-identitas",
    "Identitas Resmi Madrasah",
    data as unknown as Record<string, unknown>,
    ["/tentang-kami", "/admin/konten"]
  );
}

/**
 * 6. Simpan Program Kurikulum & Fase Jam KBM
 */
export async function saveProgramContentAction(
  data: ProgramKurikulumContent
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "program-kurikulum",
    "Program & Kurikulum Terpadu",
    data as unknown as Record<string, unknown>,
    ["/program", "/admin/konten"]
  );
}

/**
 * 7. Simpan Daftar FAQ Publik
 */
export async function saveFAQListAction(
  items: FAQItem[]
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "faq-list",
    "Daftar FAQ Publik",
    { items },
    ["/kontak", "/admin/konten"]
  );
}

/**
 * 8. Simpan Alur PPDB & Formulir PDF
 */
export async function savePPDBFlowAction(
  data: PPDBFlowContent
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    "ppdb-alur-berkas",
    "Alur Pendaftaran & Formulir PDF",
    data as unknown as Record<string, unknown>,
    ["/pendaftaran", "/admin/konten"]
  );
}

/**
 * 8b. Simpan Teks Konten Sederhana (Persyaratan, Jadwal, Catatan SPP)
 */
export async function saveTextContentAction(
  slug: string,
  judul: string,
  text: string
): Promise<{ success: boolean; message: string }> {
  return upsertPageContent(
    slug,
    judul,
    { blocks: [{ text }] },
    ["/pendaftaran", "/portal/keuangan", "/admin/konten"]
  );
}

/**
 * 9. Simpan 4 Angka Statistik Utama
 */
export async function saveMainStatsAction(
  stats: Array<{ kunci: string; nilai: string; deskripsi?: string }>
): Promise<{ success: boolean; message: string }> {
  const auth = await requireRole(ALLOWED_CONTENT_ROLES);
  if (!auth.authorized) {
    return { success: false, message: auth.message || "Akses tidak diizinkan." };
  }

  try {
    const admin = await createAdminClient();
    for (const item of stats) {
      const { error } = await admin
        .from("statistik_utama")
        .upsert(
          {
            kunci: item.kunci,
            nilai: item.nilai,
            deskripsi: item.deskripsi,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "kunci" }
        );

      if (error) {
        console.error(`[actions] Gagal update statistik ${item.kunci}:`, error);
      }
    }

    revalidatePath("/");
    revalidatePath("/admin/konten");
    return { success: true, message: "Statistik utama berhasil diperbarui!" };
  } catch (err: any) {
    console.error("[actions] Unexpected error saving main stats:", err);
    return { success: false, message: `Gagal memperbarui statistik: ${err?.message}` };
  }
}

/**
 * 10. Tambah / Edit Ekstrakurikuler
 */
export async function saveExtracurricularAction(
  item: EkstrakurikulerItem
): Promise<{ success: boolean; message: string }> {
  const auth = await requireRole(ALLOWED_CONTENT_ROLES);
  if (!auth.authorized) {
    return { success: false, message: auth.message || "Akses tidak diizinkan." };
  }

  try {
    const admin = await createAdminClient();
    if (item.id && item.id > 0) {
      // Update
      const { error } = await admin
        .from("ekstrakurikuler")
        .update({
          nama_eskul: item.nama_eskul,
          deskripsi: item.deskripsi,
          jadwal: item.jadwal,
          image_url: item.image_url,
        })
        .eq("id", item.id);

      if (error) {
        return { success: false, message: `Gagal memperbarui eskul: ${error.message}` };
      }
    } else {
      // Insert baru
      const { error } = await admin
        .from("ekstrakurikuler")
        .insert({
          nama_eskul: item.nama_eskul,
          deskripsi: item.deskripsi,
          jadwal: item.jadwal,
          image_url: item.image_url,
        });

      if (error) {
        return { success: false, message: `Gagal menambah eskul: ${error.message}` };
      }
    }

    revalidatePath("/program");
    revalidatePath("/admin/konten");
    return { success: true, message: "Ekstrakurikuler berhasil disimpan!" };
  } catch (err: any) {
    console.error("[actions] Error saving extracurricular:", err);
    return { success: false, message: `Terjadi kesalahan: ${err?.message}` };
  }
}

/**
 * 11. Hapus Ekstrakurikuler
 */
export async function deleteExtracurricularAction(
  id: number
): Promise<{ success: boolean; message: string }> {
  const auth = await requireRole(ALLOWED_CONTENT_ROLES);
  if (!auth.authorized) {
    return { success: false, message: auth.message || "Akses tidak diizinkan." };
  }

  try {
    const admin = await createAdminClient();
    const { error } = await admin
      .from("ekstrakurikuler")
      .delete()
      .eq("id", id);

    if (error) {
      return { success: false, message: `Gagal menghapus eskul: ${error.message}` };
    }

    revalidatePath("/program");
    revalidatePath("/admin/konten");
    return { success: true, message: "Ekstrakurikuler berhasil dihapus!" };
  } catch (err: any) {
    console.error("[actions] Error deleting extracurricular:", err);
    return { success: false, message: `Terjadi kesalahan: ${err?.message}` };
  }
}

/**
 * 12. Simpan Data Kontak Sekolah (Alamat, WA, Email, Jam Buka, Medsos, Maps)
 */
export async function saveKontakSekolahAction(
  data: {
    id?: number;
    alamat: string;
    whatsapp: string;
    email_utama: string;
    email_admin: string;
    jam_operasional: string;
    maps_embed_url?: string | null;
    facebook_url?: string | null;
    instagram_url?: string | null;
    youtube_url?: string | null;
  }
): Promise<{ success: boolean; message: string }> {
  const auth = await requireRole(ALLOWED_CONTENT_ROLES);
  if (!auth.authorized) {
    return { success: false, message: auth.message || "Akses tidak diizinkan." };
  }

  try {
    const admin = await createAdminClient();
    const { error } = await admin
      .from("kontak_sekolah")
      .upsert(
        {
          id: data.id || 1,
          alamat: data.alamat,
          whatsapp: data.whatsapp,
          email_utama: data.email_utama,
          email_admin: data.email_admin,
          jam_operasional: data.jam_operasional,
          maps_embed_url: data.maps_embed_url || null,
          facebook_url: data.facebook_url || null,
          instagram_url: data.instagram_url || null,
          youtube_url: data.youtube_url || null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "id" }
      );

    if (error) {
      console.error("[actions] Gagal update kontak sekolah:", error);
      return { success: false, message: `Gagal memperbarui kontak: ${error.message}` };
    }

    revalidatePath("/kontak");
    revalidatePath("/");
    revalidatePath("/admin/konten");
    return { success: true, message: "Kontak sekolah berhasil diperbarui!" };
  } catch (err: any) {
    console.error("[actions] Unexpected error saving kontak:", err);
    return { success: false, message: `Terjadi kesalahan: ${err?.message}` };
  }
}
