// lib/email/sender.ts
'use server';

// Minimal request body type for Resend email API
type ResendEmailRequestBody = {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
};

type SendEmailArgs = {
  to: string;
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

export async function sendEmail({ to, subject, html, text, from }: SendEmailArgs) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const FROM_EMAIL = from || process.env.EMAIL_FROM;

  if (!RESEND_API_KEY) {
    throw new Error('RESEND_API_KEY belum dikonfigurasi.');
  }
  if (!FROM_EMAIL) {
    throw new Error('EMAIL_FROM belum dikonfigurasi.');
  }

  const body: ResendEmailRequestBody = {
    from: FROM_EMAIL,
    to: [to],
    subject,
    ...(html ? { html } : {}),
    ...(text ? { text } : {}),
  };

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    // Avoid leaking the key client-side; this runs on server only.
    cache: 'no-store',
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Gagal mengirim email: ${res.status} ${res.statusText} ${errText}`);
  }

  return await res.json().catch(() => ({}));
}
