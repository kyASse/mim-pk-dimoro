"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { opiniSubmissionSchema } from "@/lib/validations/ruang-perspektif";
import { generateOpiniSlug } from "@/lib/utils/ruang-perspektif";

const ALLOWED_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];

export async function submitOpiniAction(
  formData: FormData
): Promise<{ success: boolean; error?: string; message?: string }> {
  try {
    const rawData = {
      nama_penulis: formData.get("nama_penulis")?.toString() || "",
      peran_penulis: formData.get("peran_penulis")?.toString() || "",
      keterangan_peran: formData.get("keterangan_peran")?.toString() || "",
      kontak_wa: formData.get("kontak_wa")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      judul: formData.get("judul")?.toString() || "",
      kategori: formData.get("kategori")?.toString() || "",
      ringkasan: formData.get("ringkasan")?.toString() || "",
      isi_lengkap: formData.get("isi_lengkap")?.toString() || "",
      website_url: formData.get("website_url")?.toString() || "",
    };

    // Honeypot anti-spam check
    if (rawData.website_url && rawData.website_url.trim().length > 0) {
      return { success: false, error: "Spam submission detected" };
    }

    const validated = opiniSubmissionSchema.safeParse(rawData);
    if (!validated.success) {
      const firstError = validated.error.errors[0]?.message || "Data naskah tidak valid";
      return { success: false, error: firstError };
    }

    const supabase = await createClient();
    const slug = generateOpiniSlug(validated.data.judul);

    // Optional: Handle Foto Penulis & Gambar Sampul upload
    let fotoPenulisUrl: string | null = null;
    let gambarSampulUrl: string | null = null;

    const fotoFile = formData.get("foto_penulis") as File | null;
    if (fotoFile && fotoFile.size > 0) {
      if (!ALLOWED_IMAGE_MIMES.includes(fotoFile.type)) {
        return { success: false, error: "Format foto penulis harus JPG, PNG, atau WEBP" };
      }
      if (fotoFile.size > 2 * 1024 * 1024) {
        return { success: false, error: "Ukuran foto penulis maksimal 2 MB" };
      }

      const ext = fotoFile.name.split(".").pop();
      const fileName = `penulis/${slug}-${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("opini")
        .upload(fileName, fotoFile, { upsert: true });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage.from("opini").getPublicUrl(uploadData.path);
        fotoPenulisUrl = publicUrlData.publicUrl;
      }
    }

    const sampulFile = formData.get("gambar_sampul") as File | null;
    if (sampulFile && sampulFile.size > 0) {
      if (!ALLOWED_IMAGE_MIMES.includes(sampulFile.type)) {
        return { success: false, error: "Format gambar sampul harus JPG, PNG, atau WEBP" };
      }
      if (sampulFile.size > 3 * 1024 * 1024) {
        return { success: false, error: "Ukuran gambar sampul maksimal 3 MB" };
      }

      const ext = sampulFile.name.split(".").pop();
      const fileName = `sampul/${slug}-${Date.now()}.${ext}`;
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from("opini")
        .upload(fileName, sampulFile, { upsert: true });

      if (!uploadErr && uploadData) {
        const { data: publicUrlData } = supabase.storage.from("opini").getPublicUrl(uploadData.path);
        gambarSampulUrl = publicUrlData.publicUrl;
      }
    }

    const { error: insertError } = await supabase.from("opini_perspektif").insert({
      slug,
      judul: validated.data.judul,
      ringkasan: validated.data.ringkasan,
      isi_lengkap: validated.data.isi_lengkap,
      kategori: validated.data.kategori,
      nama_penulis: validated.data.nama_penulis,
      peran_penulis: validated.data.peran_penulis,
      keterangan_peran: validated.data.keterangan_peran,
      kontak_wa: validated.data.kontak_wa,
      email: validated.data.email || null,
      foto_penulis_url: fotoPenulisUrl,
      gambar_sampul_url: gambarSampulUrl,
      status: "menunggu_kurasi",
      is_featured: false,
    });

    if (insertError) {
      console.error("Error inserting opini:", insertError);
      return { success: false, error: "Gagal menyimpan naskah ke database. Silakan coba kembali." };
    }

    revalidatePath("/admin/ruang-perspektif");

    return {
      success: true,
      message: "Alhamdulillah! Naskah opini Anda berhasil dikirim ke Meja Redaksi untuk ditelaah.",
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Terjadi kesalahan internal";
    console.error("Unexpected error in submitOpiniAction:", err);
    return { success: false, error: errorMsg };
  }
}
