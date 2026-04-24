// app/admin/pendaftar/actions.ts
'use server';

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { sendCustomRecoveryEmail } from "@/lib/auth/recovery";
import type { User } from '@supabase/supabase-js';

type PendaftarData = {
    id: string;
    nama_lengkap: string | null;
    email: string | null;
};
export async function updateStatusPendaftaran(id: string, status: string) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('pendaftar')
        .update({ status_pendaftaran: status })
        .eq('id', id);

    if (!error) revalidatePath('/admin/pendaftar');
    return { success: !error, message: error?.message };
}

export async function updatePendaftarData(id: string, data: any) {
    const supabase = await createClient();
    const { error } = await supabase
        .from('pendaftar')
        .update(data)
        .eq('id', id);

    if (!error) revalidatePath('/admin/pendaftar');
    return { success: !error, message: error?.message };
}

export async function acceptAndCreatePortalAccountAction(pendaftar: PendaftarData) {
    const supabase = await createClient();
    const supabaseAdmin = await createAdminClient();

    if (!pendaftar.email) {
        return { success: false, message: "Gagal: Pendaftar tidak memiliki alamat email." };
    }

    let newUser: User | null = null;

    try {
        await supabase.from('pendaftar').update({ status_pendaftaran: 'Diterima' }).eq('id', pendaftar.id).throwOnError();

        const { data: { users }, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError) throw listError;
        
        const existingUser = users.find(user => user.email === pendaftar.email);
        if (existingUser) {
            throw new Error(`Akun dengan email ${pendaftar.email} sudah terdaftar.`);
        }

        const { data, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: pendaftar.email,
            email_confirm: true,
        });
        if (createError || !data.user) throw createError || new Error("Gagal membuat user baru di Auth.");
        newUser = data.user;

        await supabase.from('siswa').insert({
            profile_orang_tua_id: newUser.id,
            nama_lengkap: pendaftar.nama_lengkap,
            pendaftar_asli_id: pendaftar.id,
        }).throwOnError();

    await sendCustomRecoveryEmail(pendaftar.email);
        
        await supabase.from('pendaftar').update({ status_pendaftaran: 'Akun Dibuat' }).eq('id', pendaftar.id).throwOnError();
        
        revalidatePath('/admin/pendaftar');
        revalidatePath(`/admin/pendaftar/detail/${pendaftar.id}`);

        return { success: true, message: `Pendaftar diterima dan akun portal untuk ${pendaftar.email} berhasil dibuat.` };

    } catch (error: any) {
        console.error("Terjadi error di acceptAndCreatePortalAccountAction:", error);

        if (newUser) {
            console.log(`Rollback: Menghapus user yang gagal dibuat: ${newUser.id}`);
            await supabaseAdmin.auth.admin.deleteUser(newUser.id);
        }
        
        await supabase.from('pendaftar').update({ status_pendaftaran: 'Menunggu Konfirmasi' }).eq('id', pendaftar.id);
        revalidatePath(`/admin/pendaftar/detail/${pendaftar.id}`);
        return { success: false, message: error.message || "Terjadi kesalahan yang tidak diketahui." };
    }
}