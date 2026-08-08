// app/admin/berita/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { extractStoragePath } from "@/lib/utils/storage";

// =================================================================
// ACTION UNTUK MENGHAPUS BERITA
// =================================================================

/**
 * Menghapus berita dan gambar terkait dari storage.
 * @param beritaId - ID dari berita yang akan dihapus.
 * @param imageUrl - URL lengkap dari gambar yang akan dihapus dari storage.
 * @returns Objek yang menandakan keberhasilan atau kegagalan.
 */
export async function deleteBeritaAction(beritaId: number, imageUrl: string): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Sesi telah berakhir. Silakan login kembali." };

    const admin = await createAdminClient();

    // 1. Hapus gambar dari Storage terlebih dahulu
    try {
        const path = extractStoragePath(imageUrl, 'konten-publik');
        
        if (path) {
            const { error: storageError } = await admin.storage.from('konten-publik').remove([path]);
            if (storageError) {
                console.error("Peringatan: Gagal menghapus gambar dari storage:", storageError.message);
            }
        }
    } catch (error) {
        console.error("Error saat extracting storage path gambar:", error);
    }

    // 2. Hapus data berita dari tabel database
    const { error: dbError } = await admin
        .from('berita')
        .delete()
        .eq('id', beritaId);
    
    if (dbError) {
        console.error("Gagal menghapus berita dari database:", dbError);
        return { success: false, message: `Gagal menghapus data: ${dbError.message}` };
    }

    revalidatePath('/admin/berita');
    
    return { success: true, message: "Berita berhasil dihapus." };
}


// =================================================================
// ACTION UNTUK MEMPERBARUI BERITA
// =================================================================

type UpdateBeritaData = {
    judul: string;
    ringkasan: string;
    isi_lengkap: string;
    status?: string;
    tanggal_terbit?: string;
};

/**
 * Memperbarui data teks dari sebuah berita.
 */
export async function updateBeritaAction(beritaId: number, dataToUpdate: UpdateBeritaData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { success: false, message: "Sesi telah berakhir. Silakan login kembali." };

    const admin = await createAdminClient();

    const { error } = await admin
        .from('berita')
        .update(dataToUpdate)
        .eq('id', beritaId);
    
    if (error) {
        console.error("Gagal memperbarui berita:", error);
        return { success: false, message: `Gagal memperbarui data: ${error.message}` };
    }

    revalidatePath('/admin/berita');
    revalidatePath(`/admin/berita/edit/${beritaId}`);

    return { success: true, message: "Berita berhasil diperbarui." };
}

// =================================================================
// ACTION UNTUK MEMBUAT BERITA BARU
// =================================================================

/**
 * Membuat berita baru beserta upload gambar utama dan opsi tambah ke galeri.
 */
export async function createBeritaAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            return { success: false, message: "Sesi telah berakhir. Silakan login kembali." };
        }

        const admin = await createAdminClient();

        const judul = (formData.get('judul') as string)?.trim();
        const ringkasan = (formData.get('ringkasan') as string)?.trim();
        const isiLengkap = (formData.get('isiLengkap') as string)?.trim();
        const status = (formData.get('status') as string) || 'draft';
        const tanggalTerbit = (formData.get('tanggalTerbit') as string) || new Date().toISOString().split('T')[0];
        const tambahkanKeGaleri = formData.get('tambahkanKeGaleri') === 'true';
        const imageFile = formData.get('image') as File | null;

        if (!judul || !ringkasan || !isiLengkap) {
            return { success: false, message: "Judul, ringkasan, dan isi berita wajib diisi." };
        }

        if (!imageFile || imageFile.size === 0) {
            return { success: false, message: "Gambar utama berita wajib diunggah." };
        }

        if (imageFile.size > 10 * 1024 * 1024) {
            return { success: false, message: "Ukuran file gambar terlalu besar (maksimal 10MB)." };
        }

        // Upload gambar ke Storage
        const fileName = `${Date.now()}-${imageFile.name.replace(/\s+/g, '_')}`;
        const filePath = `berita/${fileName}`;
        const { error: uploadError } = await admin.storage
            .from('konten-publik')
            .upload(filePath, imageFile);

        if (uploadError) {
            return { success: false, message: `Gagal mengunggah gambar: ${uploadError.message}` };
        }

        // Dapatkan URL publik gambar
        const { data: { publicUrl } } = admin.storage
            .from('konten-publik')
            .getPublicUrl(filePath);

        // Simpan data berita
        const { error: insertError } = await admin
            .from('berita')
            .insert({
                judul,
                ringkasan,
                isi_lengkap: isiLengkap,
                image_url: publicUrl,
                penulis_id: user.id,
                status,
                tanggal_terbit: tanggalTerbit,
            });

        if (insertError) {
            // Cleanup upload jika simpan DB gagal
            await admin.storage.from('konten-publik').remove([filePath]);
            return { success: false, message: `Gagal menyimpan berita: ${insertError.message}` };
        }

        // Tambahkan ke galeri jika diminta
        if (tambahkanKeGaleri) {
            await admin
                .from('galeri')
                .insert({
                    image_url: publicUrl,
                    keterangan: judul,
                    kategori: 'Berita',
                });
        }

        revalidatePath('/admin/berita');
        revalidatePath('/galeri');
        revalidatePath('/berita');

        return { success: true, message: "Berita berhasil ditambahkan." };
    } catch (err: unknown) {
        const msg = (err as Error)?.message || "Terjadi kesalahan sistem saat membuat berita.";
        return { success: false, message: msg };
    }
}

