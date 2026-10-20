import { createClient } from "@/lib/supabase/server";
import {
  OpiniPerspektif,
  OpiniPublicItem,
  OpiniPublicDetail,
  KategoriOpini,
  PeranPenulis,
} from "@/lib/types/ruang-perspektif";
import { estimateReadingTime } from "@/lib/utils/ruang-perspektif";

interface RawPublicOpinionRow {
  id: string;
  slug: string;
  judul: string;
  ringkasan: string;
  isi_lengkap: string;
  kategori: KategoriOpini;
  nama_penulis: string;
  peran_penulis: PeranPenulis;
  keterangan_peran: string | null;
  foto_penulis_url: string | null;
  gambar_sampul_url: string | null;
  is_featured: boolean;
  waktu_terbit: string;
}

interface RawPublicOpinionDetailRow extends RawPublicOpinionRow {
  dibaca_count: number;
}

export async function getPublicOpinions(filter?: {
  peran?: string;
  kategori?: string;
  search?: string;
}): Promise<OpiniPublicItem[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("opini_perspektif")
      .select(
        "id, slug, judul, ringkasan, isi_lengkap, kategori, nama_penulis, peran_penulis, keterangan_peran, foto_penulis_url, gambar_sampul_url, is_featured, waktu_terbit"
      )
      .eq("status", "terbit")
      .order("waktu_terbit", { ascending: false });

    if (filter?.peran && filter.peran !== "semua") {
      query = query.eq("peran_penulis", filter.peran);
    }
    if (filter?.kategori && filter.kategori !== "semua") {
      query = query.eq("kategori", filter.kategori);
    }
    if (filter?.search) {
      const trimmedSearch = filter.search.trim();
      if (trimmedSearch) {
        query = query.or(`judul.ilike.%${trimmedSearch}%,nama_penulis.ilike.%${trimmedSearch}%`);
      }
    }

    const { data, error } = await query;
    if (error || !data) return [];

    const rows = data as unknown as RawPublicOpinionRow[];
    return rows.map((item) => ({
      id: item.id,
      slug: item.slug,
      judul: item.judul,
      ringkasan: item.ringkasan,
      kategori: item.kategori,
      nama_penulis: item.nama_penulis,
      peran_penulis: item.peran_penulis,
      keterangan_peran: item.keterangan_peran,
      foto_penulis_url: item.foto_penulis_url,
      gambar_sampul_url: item.gambar_sampul_url,
      is_featured: item.is_featured,
      waktu_terbit: item.waktu_terbit,
      waktu_baca_menit: estimateReadingTime(item.isi_lengkap || ""),
    }));
  } catch (err) {
    console.error("Error in getPublicOpinions:", err);
    return [];
  }
}

export async function getFeaturedPublicOpinion(): Promise<OpiniPublicItem | null> {
  const opinions = await getPublicOpinions();
  const featured = opinions.find((item) => item.is_featured);
  return featured || opinions[0] || null;
}

export async function getPublicOpinionBySlug(
  slug: string,
  options: { incrementView?: boolean } = { incrementView: true }
): Promise<OpiniPublicDetail | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("opini_perspektif")
      .select(
        "id, slug, judul, ringkasan, isi_lengkap, kategori, nama_penulis, peran_penulis, keterangan_peran, foto_penulis_url, gambar_sampul_url, is_featured, waktu_terbit, dibaca_count"
      )
      .eq("slug", slug)
      .eq("status", "terbit")
      .maybeSingle();

    if (error || !data) return null;

    const row = data as unknown as RawPublicOpinionDetailRow;

    // Increment read counter asynchronously when requested
    if (options.incrementView) {
      if (typeof (supabase as unknown as { rpc?: unknown }).rpc === "function") {
        void supabase.rpc("increment_opini_reads", { opini_slug: row.slug }).then();
      } else {
        void supabase
          .from("opini_perspektif")
          .update({ dibaca_count: (row.dibaca_count || 0) + 1 })
          .eq("id", row.id)
          .then();
      }
    }

    return {
      id: row.id,
      slug: row.slug,
      judul: row.judul,
      ringkasan: row.ringkasan,
      isi_lengkap: row.isi_lengkap,
      kategori: row.kategori,
      nama_penulis: row.nama_penulis,
      peran_penulis: row.peran_penulis,
      keterangan_peran: row.keterangan_peran,
      foto_penulis_url: row.foto_penulis_url,
      gambar_sampul_url: row.gambar_sampul_url,
      is_featured: row.is_featured,
      waktu_terbit: row.waktu_terbit,
      dibaca_count: row.dibaca_count,
      waktu_baca_menit: estimateReadingTime(row.isi_lengkap || ""),
    };
  } catch (err) {
    console.error("Error in getPublicOpinionBySlug:", err);
    return null;
  }
}

export async function getAdminOpinions(filter?: {
  status?: string;
  search?: string;
}): Promise<OpiniPerspektif[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("opini_perspektif")
      .select("*")
      .order("created_at", { ascending: false });

    if (filter?.status && filter.status !== "semua") {
      query = query.eq("status", filter.status);
    }
    if (filter?.search) {
      const trimmedSearch = filter.search.trim();
      if (trimmedSearch) {
        query = query.or(`judul.ilike.%${trimmedSearch}%,nama_penulis.ilike.%${trimmedSearch}%`);
      }
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data as unknown as OpiniPerspektif[];
  } catch (err) {
    console.error("Error in getAdminOpinions:", err);
    return [];
  }
}

export async function getAdminOpinionById(id: string): Promise<OpiniPerspektif | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("opini_perspektif")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) return null;
    return data as unknown as OpiniPerspektif;
  } catch (err) {
    console.error("Error in getAdminOpinionById:", err);
    return null;
  }
}
