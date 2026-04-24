// app/admin/kalender/actions.ts
'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createKegiatanAction(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const data = {
        judul: formData.get('judul') as string,
        tanggal: formData.get('tanggal') as string,
        tanggal_berakhir: (formData.get('tanggal_berakhir') as string) || null,
        waktu: (formData.get('waktu') as string) || null,
        kategori: formData.get('kategori') as string,
        deskripsi: formData.get('deskripsi') as string,
        warna: formData.get('warna') as string || '#3b82f6',
    };
    const { error } = await supabase.from('kalender_akademik').insert(data);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    return { success: true };
}

export async function updateKegiatanAction(kegiatanId: number, prevState: any, formData: FormData) {
    const supabase = await createClient();
    const data = {
        judul: formData.get('judul') as string,
        tanggal: formData.get('tanggal') as string,
        tanggal_berakhir: (formData.get('tanggal_berakhir') as string) || null,
        waktu: (formData.get('waktu') as string) || null,
        kategori: formData.get('kategori') as string,
        deskripsi: formData.get('deskripsi') as string,
        warna: formData.get('warna') as string || '#3b82f6',
    };
    const { error } = await supabase.from('kalender_akademik').update(data).eq('id', kegiatanId);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    return { success: true };
}

export async function deleteKegiatanAction(kegiatanId: number) {
    const supabase = await createClient();
    const { error } = await supabase.from('kalender_akademik').delete().eq('id', kegiatanId);
    if (error) { return { success: false, message: error.message }; }
    revalidatePath('/admin/kalender');
    return { success: true };
}