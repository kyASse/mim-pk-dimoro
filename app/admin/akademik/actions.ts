'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { extractStoragePath } from "@/lib/utils/storage";

interface BiayaInput {
    id?: string;
    putra?: string;
    putri?: string;
}

// --- ACTIONS UNTUK BIAYA ---
export async function updateBiayaAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const entries = Array.from(formData.entries());
    const biayaData: BiayaInput[] = [];
    
    entries.forEach(([key, value]) => {
        const match = key.match(/biaya\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!biayaData[index]) biayaData[index] = {};
            biayaData[index][field as keyof BiayaInput] = value as string;
        }
    });

    for (const item of biayaData) {
        if (!item || !item.id) continue;
        
        const id = parseInt(item.id);
        const putra = parseInt(item.putra || '0') || 0;
        const putri = parseInt(item.putri || '0') || 0;

        const { error } = await supabase
            .from('biaya_pendaftaran')
            .update({
                biaya_putra: putra,
                biaya_putri: putri,
            })
            .eq('id', id);

        if (error) {
            console.error(`Error updating biaya_pendaftaran for id ${id}:`, error);
            return { success: false, message: `Gagal memperbarui data biaya: ${error.message}` };
        }
    }

    revalidatePath('/admin/akademik');
    return { success: true, message: "Biaya pendaftaran berhasil diperbarui." };
}

export async function updateCatatanSppAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const newCatatan = formData.get('catatan-spp') as string;

    const { error } = await supabase
        .from('konten_halaman')
        .update({ isi: { catatan: newCatatan } })
        .eq('slug', 'catatan-spp');

    if (error) {
        return { success: false, message: `Gagal memperbarui catatan SPP: ${error.message}` };
    }
    
    revalidatePath('/admin/akademik');
    return { success: true, message: "Catatan SPP berhasil diperbarui." };
}

// --- ACTIONS UNTUK PRESTASI ---

// CREATE
export async function createPrestasiAction(prevState: unknown, formData: FormData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const tahunStr = formData.get('tahun') as string;
    const nama_prestasi = (formData.get('nama_prestasi') as string)?.trim();
    const tingkat = (formData.get('tingkat') as string)?.trim();
    const deskripsi = (formData.get('deskripsi') as string)?.trim() || null;
    const nama_siswa = (formData.get('nama_siswa') as string)?.trim();
    const tahun = parseInt(tahunStr, 10);

    if (!tahunStr || isNaN(tahun) || !nama_prestasi || !tingkat || !nama_siswa) {
        return { success: false, message: 'Harap isi semua kolom wajib dengan benar.' };
    }

    const data = {
        tahun,
        nama_prestasi,
        tingkat,
        deskripsi,
        nama_siswa,
    };
    const { error } = await supabase.from('prestasi').insert(data);
    if (error) { return { success: false, message: `Gagal membuat prestasi: ${error.message}` }; }

    revalidatePath('/admin/akademik');
    return { success: true, message: "Prestasi berhasil ditambahkan." };
}

// UPDATE
export async function updatePrestasiAction(prestasiId: number, formData: FormData): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    const action = formData.get('action') as string;

    try {
        if (action === 'update_text') {
            const data = {
                tahun: parseInt(formData.get('tahun') as string),
                nama_prestasi: formData.get('nama_prestasi') as string,
                tingkat: formData.get('tingkat') as string,
                nama_siswa: formData.get('nama_siswa') as string,
                deskripsi: formData.get('deskripsi') as string,
            };
            const { error } = await supabase.from('prestasi').update(data).eq('id', prestasiId);
            if (error) throw error;
        }

        if (action === 'upload_image') {
            const imageFile = formData.get('image') as File;
            if (!imageFile || imageFile.size === 0) throw new Error("Tidak ada file gambar yang dipilih.");
            if (imageFile.size > 5 * 1024 * 1024) throw new Error("Ukuran file terlalu besar (maksimal 5MB).");
            
            const { data: oldData } = await supabase.from('prestasi').select('dokumentasi_url').eq('id', prestasiId).single();
            if (oldData?.dokumentasi_url) {
                const storagePath = extractStoragePath(oldData.dokumentasi_url, 'dokumentasi-prestasi');
                if (storagePath) {
                    await supabase.storage.from('dokumentasi-prestasi').remove([storagePath]);
                }
            }
            
            const filePath = `${prestasiId}/${Date.now()}_${imageFile.name}`;
            const { error: uploadError } = await supabase.storage.from('dokumentasi-prestasi').upload(filePath, imageFile);
            if (uploadError) throw uploadError;
            
            const { error: dbError } = await supabase.from('prestasi').update({ dokumentasi_url: filePath }).eq('id', prestasiId);
            if (dbError) throw dbError;
        }

        if (action === 'delete_image') {
            const { data: oldData } = await supabase.from('prestasi').select('dokumentasi_url').eq('id', prestasiId).single();
            if (oldData?.dokumentasi_url) {
                const storagePath = extractStoragePath(oldData.dokumentasi_url, 'dokumentasi-prestasi');
                if (storagePath) {
                    await supabase.storage.from('dokumentasi-prestasi').remove([storagePath]);
                }
                await supabase.from('prestasi').update({ dokumentasi_url: null }).eq('id', prestasiId);
            }
        }

        revalidatePath('/admin/akademik');
        revalidatePath(`/admin/akademik/prestasi/edit/${prestasiId}`);
        return { success: true, message: "Aksi berhasil dijalankan." };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
}

// DELETE
export async function deletePrestasiAction(prestasiId: number): Promise<{ success: boolean; message?: string }> {
    const supabase = await createClient();
    try {
        const { data: prestasi } = await supabase.from('prestasi').select('dokumentasi_url').eq('id', prestasiId).single();
        if (prestasi?.dokumentasi_url) {
            const storagePath = extractStoragePath(prestasi.dokumentasi_url, 'dokumentasi-prestasi');
            if (storagePath) {
                await supabase.storage.from('dokumentasi-prestasi').remove([storagePath]);
            }
        }
        const { error } = await supabase.from('prestasi').delete().eq('id', prestasiId);
        if (error) throw error;

        revalidatePath('/admin/akademik');
        return { success: true, message: "Prestasi berhasil dihapus." };
    } catch (error: unknown) {
        return { success: false, message: (error as Error).message };
    }
}