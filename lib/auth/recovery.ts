// lib/auth/recovery.ts
'use server';

import { createAdminClient } from '@/lib/supabase/admin';
import { sendEmail } from '@/lib/email/sender';

export async function sendCustomRecoveryEmail(email: string) {
  // If email sending isn't configured, skip silently
  if (!process.env.RESEND_API_KEY) {
    console.warn('sendCustomRecoveryEmail: RESEND_API_KEY not set, skipping email send.');
    return;
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const admin = await createAdminClient();

  const { data, error } = await admin.auth.admin.generateLink({
    type: 'recovery',
    email,
    options: { redirectTo: `${site}/auth/update-password` },
  });
  if (error || !data?.properties?.action_link) {
    throw error || new Error('Gagal membuat tautan pemulihan.');
  }

  const actionLink = data.properties.action_link as string;
  const subject = 'Atur Ulang Kata Sandi Portal Orang Tua';
  const html = `
    <p>Halo,</p>
    <p>Silakan klik tautan berikut untuk mengatur kata sandi akun portal orang tua Anda:</p>
    <p><a href="${actionLink}">Atur Ulang Kata Sandi</a></p>
    <p>Jika tombol di atas tidak berfungsi, salin dan tempel tautan berikut di peramban Anda:</p>
    <p><code>${actionLink}</code></p>
    <p>Terima kasih.</p>
  `;

  await sendEmail({ to: email, subject, html });
}
