'use server';
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/lib/auth/guards";
import type { UserRole } from "@/lib/auth/types";
import { revalidatePath } from "next/cache";
import { extractStoragePath } from "@/lib/utils/storage";

const ALLOWED_BIAYA_ROLES: UserRole[] = ["super_admin", "admin", "admin_tu", "kepala_madrasah", "bendahara"];

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

export interface UnifiedBiayaItemInput {
    id?: number;
    komponen_biaya?: string;
    biaya_putra: number;
    biaya_putri: number;
}

export interface UpdateBiayaAndSppPayload {
    biaya: UnifiedBiayaItemInput[];
    catatanSpp: string;
    deletedIds?: number[];
}

export async function updateBiayaAndSppAction(payload: UpdateBiayaAndSppPayload): Promise<{ success: boolean; message: string }> {
    const auth = await requireRole(ALLOWED_BIAYA_ROLES);
    if (!auth.authorized) {
        return { success: false, message: auth.message || "Akses tidak diizinkan." };
    }

    try {
        const admin = await createAdminClient();

        // 1. Hapus item yang ditandai untuk dihapus
        if (Array.isArray(payload.deletedIds) && payload.deletedIds.length > 0) {
            const validDeleteIds = payload.deletedIds.filter(id => typeof id === 'number' && id > 0);
            if (validDeleteIds.length > 0) {
                const { error: deleteError } = await admin
                    .from('biaya_pendaftaran')
                    .delete()
                    .in('id', validDeleteIds);

                if (deleteError) {
                    console.error('Error deleting biaya_pendaftaran:', deleteError);
                    return { success: false, message: `Gagal menghapus komponen biaya: ${deleteError.message}` };
                }
            }
        }

        // 2. Pisahkan update existing dan insert new
        const itemsToUpdate = payload.biaya.filter(item => item && typeof item.id === 'number' && item.id > 0);
        const itemsToInsert = payload.biaya.filter(item => item && (!item.id || item.id <= 0));

        // Eksekusi Update
        for (const item of itemsToUpdate) {
            const putra = Math.max(0, Math.round(Number(item.biaya_putra) || 0));
            const putri = Math.max(0, Math.round(Number(item.biaya_putri) || 0));
            const komponen = (item.komponen_biaya || '').trim() || 'Komponen Biaya';

            const { error: biayaError } = await admin
                .from('biaya_pendaftaran')
                .update({
                    komponen_biaya: komponen,
                    biaya_putra: putra,
                    biaya_putri: putri,
                })
                .eq('id', item.id);

            if (biayaError) {
                console.error(`Error updating biaya_pendaftaran for id ${item.id}:`, biayaError);
                return { success: false, message: `Gagal memperbarui data biaya: ${biayaError.message}` };
            }
        }

        // Eksekusi Insert
        if (itemsToInsert.length > 0) {
            const insertPayload = itemsToInsert.map(item => ({
                komponen_biaya: (item.komponen_biaya || '').trim() || 'Komponen Biaya Baru',
                biaya_putra: Math.max(0, Math.round(Number(item.biaya_putra) || 0)),
                biaya_putri: Math.max(0, Math.round(Number(item.biaya_putri) || 0)),
            }));

            const { error: insertError } = await admin
                .from('biaya_pendaftaran')
                .insert(insertPayload);

            if (insertError) {
                console.error('Error inserting new biaya_pendaftaran:', insertError);
                return { success: false, message: `Gagal menambah komponen biaya baru: ${insertError.message}` };
            }
        }

        // 3. Update catatan-spp (kompatibel dengan JSON object dan block text)
        const newCatatanText = payload.catatanSpp || '';
        const { error: sppError } = await admin
            .from('konten_halaman')
            .update({
                isi: {
                    catatan: newCatatanText,
                    blocks: [{ text: newCatatanText }],
                },
            })
            .eq('slug', 'catatan-spp');

        if (sppError) {
            console.error('Error updating catatan SPP:', sppError);
            return { success: false, message: `Gagal memperbarui catatan SPP: ${sppError.message}` };
        }

        // 4. Revalidate seluruh halaman terkait
        revalidatePath('/admin/akademik');
        revalidatePath('/admin/akademik/edit-biaya');
        revalidatePath('/pendaftaran');
        revalidatePath('/portal/keuangan');
        revalidatePath('/admin/konten');

        return { success: true, message: 'Data rincian biaya dan catatan SPP berhasil diperbarui.' };
    } catch (err: any) {
        console.error('Unexpected error in updateBiayaAndSppAction:', err);
        return { success: false, message: `Terjadi kesalahan sistem: ${err?.message || 'Gagal menyimpan'}` };
    }
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
