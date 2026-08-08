// app/admin/kalender/actions.ts
'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createKegiatanAction(prevState: unknown, formData: FormData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const data = {
        judul: (formData.get('judul') as string)?.trim(),
        tanggal: (formData.get('tanggal') as string)?.trim(),
        tanggal_berakhir: (formData.get('tanggal_berakhir') as string)?.trim() || null,
        waktu: (formData.get('waktu') as string)?.trim() || null,
        kategori: (formData.get('kategori') as string)?.trim(),
        deskripsi: (formData.get('deskripsi') as string)?.trim() || null,
        warna: (formData.get('warna') as string)?.trim() || '#3b82f6',
    };

    if (!data.judul || !data.tanggal || !data.kategori) {
        return { success: false, message: "Judul, tanggal, dan kategori wajib diisi." };
    }

    const { error } = await supabase.from('kalender_akademik').insert(data);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    return { success: true, message: "Kegiatan berhasil ditambahkan." };
}

export async function updateKegiatanAction(kegiatanId: number, prevState: unknown, formData: FormData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const data = {
        judul: (formData.get('judul') as string)?.trim(),
        tanggal: (formData.get('tanggal') as string)?.trim(),
        tanggal_berakhir: (formData.get('tanggal_berakhir') as string)?.trim() || null,
        waktu: (formData.get('waktu') as string)?.trim() || null,
        kategori: (formData.get('kategori') as string)?.trim(),
        deskripsi: (formData.get('deskripsi') as string)?.trim() || null,
        warna: (formData.get('warna') as string)?.trim() || '#3b82f6',
    };

    if (!data.judul || !data.tanggal || !data.kategori) {
        return { success: false, message: "Judul, tanggal, dan kategori wajib diisi." };
    }

    const { error } = await supabase.from('kalender_akademik').update(data).eq('id', kegiatanId);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    return { success: true, message: "Kegiatan berhasil diperbarui." };
}

export async function deleteKegiatanAction(kegiatanId: number): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const { error } = await supabase.from('kalender_akademik').delete().eq('id', kegiatanId);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    return { success: true, message: "Kegiatan berhasil dihapus." };
}