// app/admin/testimoni/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from 'next/navigation';
import { requireAdminSession } from "@/lib/auth/guard";

// CREATE Action
export async function createTestimoniAction(formData: FormData) {
    try {
        await requireAdminSession();
        const supabase = await createClient();
        
        const data = {
            nama_orang_tua: formData.get('nama_orang_tua') as string,
            status_orang_tua: formData.get('status_orang_tua') as string,
            isi_testimoni: formData.get('isi_testimoni') as string,
            is_featured: formData.get('is_featured') === 'on', // Checkbox value is 'on' or null
        };

        const { error } = await supabase.from('testimoni').insert(data);

        if (error) {
            return { success: false, message: `Gagal membuat testimoni: ${error.message}` };
        }
        
        revalidatePath('/admin/testimoni');
        revalidatePath('/');
        return { success: true, message: "Testimoni berhasil dibuat." };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : 'Unauthorized' };
    }
}

// UPDATE Action
export async function updateTestimoniAction(testimoniId: number, formData: FormData) {
    try {
        await requireAdminSession();
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : 'Unauthorized' };
    }

    const supabase = await createClient();

    const data = {
        nama_orang_tua: formData.get('nama_orang_tua') as string,
        status_orang_tua: formData.get('status_orang_tua') as string,
        isi_testimoni: formData.get('isi_testimoni') as string,
        is_featured: formData.get('is_featured') === 'on',
    };

    const { error } = await supabase
        .from('testimoni')
        .update(data)
        .eq('id', testimoniId);
    
    if (error) {
        // Sebaiknya redirect dengan pesan error, atau tangani di client
        console.error(error);
        redirect(`/admin/testimoni/edit/${testimoniId}?error=true`);
    }

    revalidatePath('/admin/testimoni');
    revalidatePath(`/admin/testimoni/edit/${testimoniId}`);
    revalidatePath('/');
    redirect('/admin/testimoni'); // Redirect kembali ke daftar setelah sukses
}

// DELETE Action
export async function deleteTestimoniAction(testimoniId: number) {
    try {
        await requireAdminSession();
        const supabase = await createClient();

        const { error } = await supabase
            .from('testimoni')
            .delete()
            .eq('id', testimoniId);
        
        if (error) {
            return { success: false, message: `Gagal menghapus testimoni: ${error.message}` };
        }

        revalidatePath('/admin/testimoni');
        revalidatePath('/');
        return { success: true, message: "Testimoni berhasil dihapus." };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : 'Unauthorized' };
    }
}

// TOGGLE FEATURED Action
export async function toggleFeaturedTestimoniAction(testimoniId: number, currentFeatured: boolean) {
    try {
        await requireAdminSession();
        const supabase = await createClient();
        const newFeaturedState = !currentFeatured;

        const { error } = await supabase
            .from('testimoni')
            .update({ is_featured: newFeaturedState })
            .eq('id', testimoniId);

        if (error) {
            return { success: false, message: `Gagal mengubah status testimoni: ${error.message}` };
        }

        revalidatePath('/admin/testimoni');
        revalidatePath('/');
        return { 
            success: true, 
            message: newFeaturedState ? "Testimoni ditampilkan di beranda." : "Testimoni disembunyikan dari beranda.",
            is_featured: newFeaturedState
        };
    } catch (err: unknown) {
        return { success: false, message: err instanceof Error ? err.message : 'Unauthorized' };
    }
}
