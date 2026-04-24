'use server';
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// --- ACTIONS UNTUK BIAYA ---
export async function updateBiayaAction(formData: FormData) {
    const supabase = await createClient();
    const entries = Array.from(formData.entries());
    const biayaData: any[] = [];
    
    entries.forEach(([key, value]) => {
        const match = key.match(/biaya\[(\d+)\]\[(\w+)\]/);
        if (match) {
            const index = parseInt(match[1]);
            const field = match[2];
            if (!biayaData[index]) biayaData[index] = {};
            biayaData[index][field] = value;
        }
    });

    const updates = biayaData.map(item => ({
        id: parseInt(item.id),
        biaya_putra: parseInt(item.putra) || 0,
        biaya_putri: parseInt(item.putri) || 0,
    }));

    const { error } = await supabase.from('biaya_pendaftaran').upsert(updates);
    if (error) { redirect(`/admin/akademik/edit-biaya?error=${error.message}`); }

    revalidatePath('/admin/akademik');
    redirect('/admin/akademik');
}

export async function updateCatatanSppAction(formData: FormData) {
    const supabase = await createClient();
    const newCatatan = formData.get('catatan-spp') as string;

    const { error } = await supabase
        .from('konten_halaman')
        .update({ isi: { catatan: newCatatan } })
        .eq('slug', 'catatan-spp');

    if (error) { redirect(`/admin/akademik/edit-biaya?error=${error.message}`); }
    
    revalidatePath('/admin/akademik');
    redirect('/admin/akademik');
}

// --- ACTIONS UNTUK PRESTASI ---

// CREATE
export async function createPrestasiAction(prevState: any, formData: FormData) {
    const supabase = await createClient();
    const data = {
        tahun: parseInt(formData.get('tahun') as string),
        nama_prestasi: formData.get('nama_prestasi') as string,
        tingkat: formData.get('tingkat') as string,
        deskripsi: formData.get('deskripsi') as string,
        nama_siswa: formData.get('nama_siswa') as string,
    };
    const { error } = await supabase.from('prestasi').insert(data);
    if (error) { return { success: false, message: `Gagal membuat prestasi: ${error.message}` }; }

    revalidatePath('/admin/akademik');
    redirect('/admin/akademik');
}

// UPDATE
export async function updatePrestasiAction(prestasiId: number, formData: FormData) {
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
                await supabase.storage.from('dokumentasi-prestasi').remove([oldData.dokumentasi_url]);
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
                await supabase.storage.from('dokumentasi-prestasi').remove([oldData.dokumentasi_url]);
                await supabase.from('prestasi').update({ dokumentasi_url: null }).eq('id', prestasiId);
            }
        }

        revalidatePath('/admin/akademik');
        revalidatePath(`/admin/akademik/prestasi/edit/${prestasiId}`);
        return { success: true, message: "Aksi berhasil dijalankan." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}

// DELETE
export async function deletePrestasiAction(prestasiId: number) {
    const supabase = await createClient();
    try {
        const { data: prestasi } = await supabase.from('prestasi').select('dokumentasi_url').eq('id', prestasiId).single();
        if (prestasi?.dokumentasi_url) {
            await supabase.storage.from('dokumentasi-prestasi').remove([prestasi.dokumentasi_url]);
        }
        const { error } = await supabase.from('prestasi').delete().eq('id', prestasiId);
        if (error) throw error;

        revalidatePath('/admin/akademik');
        return { success: true, message: "Prestasi berhasil dihapus." };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}