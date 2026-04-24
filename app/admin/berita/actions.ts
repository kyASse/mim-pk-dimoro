// app/admin/berita/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// =================================================================
// ACTION UNTUK MENGHAPUS BERITA
// =================================================================

/**
 * Menghapus berita dan gambar terkait dari storage.
 * @param beritaId - ID dari berita yang akan dihapus.
 * @param imageUrl - URL lengkap dari gambar yang akan dihapus dari storage.
 * @returns Objek yang menandakan keberhasilan atau kegagalan.
 */
export async function deleteBeritaAction(beritaId: number, imageUrl: string) {
    const supabase = await createClient();

    // 1. Hapus gambar dari Storage terlebih dahulu
    try {
        // Ekstrak path file dari URL lengkap untuk digunakan di API storage
        const path = new URL(imageUrl).pathname.split('/konten-publik/')[1];
        
        if (path) {
            const { error: storageError } = await supabase.storage.from('konten-publik').remove([path]);
            if (storageError) {
                // Log error tapi jangan hentikan proses jika gambar tidak ditemukan
                console.error("Peringatan: Gagal menghapus gambar dari storage:", storageError.message);
            }
        }
    } catch (error) {
        console.error("Error saat parsing URL gambar:", error);
    }

    // 2. Hapus data berita dari tabel database
    const { error: dbError } = await supabase
        .from('berita')
        .delete()
        .eq('id', beritaId);
    
    if (dbError) {
        console.error("Gagal menghapus berita dari database:", dbError);
        return { success: false, message: `Gagal menghapus data: ${dbError.message}` };
    }

    // 3. Revalidasi path (PENTING!) untuk me-refresh cache halaman daftar berita
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
 * @param beritaId - ID dari berita yang akan diperbarui.
 * @param dataToUpdate - Objek berisi data baru untuk judul, ringkasan, dan isi.
 * @returns Objek yang menandakan keberhasilan atau kegagalan.
 */
export async function updateBeritaAction(beritaId: number, dataToUpdate: UpdateBeritaData) {
    const supabase = await createClient();

    const { error } = await supabase
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