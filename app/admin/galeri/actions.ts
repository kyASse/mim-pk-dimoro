// app/admin/galeri/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteGaleriAction(galeriId: number, imageUrl: string) {
    const supabase = await createClient();

    // Hapus gambar dari Storage
    try {
        const path = new URL(imageUrl).pathname.split('/konten-publik/')[1];
        if (path) {
            await supabase.storage.from('konten-publik').remove([path]);
        }
    } catch (error) {
        console.error("Peringatan: Gagal menghapus gambar galeri dari storage:", (error as Error).message);
    }

    // Hapus data dari tabel database
    const { error: dbError } = await supabase
        .from('galeri')
        .delete()
        .eq('id', galeriId);
    
    if (dbError) {
        return { success: false, message: `Gagal menghapus data: ${dbError.message}` };
    }

    revalidatePath('/admin/galeri');
    return { success: true, message: "Foto berhasil dihapus." };
}

export async function updateGaleriAction(
    galeriId: number,
    { keterangan, kategori, image }: { keterangan: string; kategori: string; image?: File | null }
) {
    const supabase = await createClient();

    let image_url: string | undefined;

    // Jika ada file gambar baru, upload ke storage dan dapatkan url baru
    if (image) {
        // Ganti 'konten-publik' sesuai bucket Anda
        const fileName = `galeri/galeri-${galeriId}-${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
            .from("konten-publik")
            .upload(fileName, image, { upsert: true });
        if (error) return { success: false, message: error.message };
        image_url = data?.path
            ? supabase.storage.from("konten-publik").getPublicUrl(data.path).data.publicUrl
            : undefined;
    }

    // Update data galeri
    const { error } = await supabase
        .from("galeri")
        .update({
            keterangan,
            kategori,
            ...(image_url ? { image_url } : {}),
        })
        .eq("id", galeriId);

    if (error) return { success: false, message: error.message };

    revalidatePath('/admin/galeri');
    return { success: true };
}