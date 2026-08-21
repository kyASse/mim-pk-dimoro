// lib/utils/pesan-utils.ts
import { PesanMasuk, PesanStats } from '@/types/pesan';
import { SCHOOL_NAME } from '@/lib/school-config';

/**
 * Normalizes phone numbers to standard WhatsApp format without '+' or spaces.
 * E.g., '08123456789' -> '628123456789', '+62 812-3456' -> '628123456'
 */
export function formatWhatsAppNumber(phone: string | null | undefined): string {
  if (!phone) return '';
  const cleaned = phone.replace(/[\s-+()]/g, '');
  if (!cleaned) return '';
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  return cleaned;
}

/**
 * Generates default polite response template on behalf of MIM PK Dimoro
 */
export function generateDefaultReplyMessage(
  namaPengirim: string,
  subjek: string | null | undefined
): string {
  const subjekText = subjek ? ` terkait "${subjek}"` : '';
  return `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${namaPengirim},\n\nTerima kasih telah menghubungi ${SCHOOL_NAME}${subjekText}.\n\n[Tulis balasan pesan Anda di sini]\n\nWassalamu’alaikum Wr. Wb.\nAdmin ${SCHOOL_NAME}`;
}

/**
 * Generates wa.me URL with encoded message
 */
export function generateWhatsAppReplyUrl(
  phone: string | null | undefined,
  message: string
): string {
  const formatted = formatWhatsAppNumber(phone);
  if (!formatted) return '';
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${formatted}?text=${encodedMessage}`;
}

/**
 * Generates mailto URL with encoded subject and message body
 */
export function generateMailtoUrl(
  email: string,
  subjek: string | null | undefined,
  body: string
): string {
  if (!email) return '';
  const subjectPrefix = subjek ? `Re: ${subjek} - ${SCHOOL_NAME}` : `Tanggapan Pesan - ${SCHOOL_NAME}`;
  const encodedSubject = encodeURIComponent(subjectPrefix);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
}

/**
 * Calculates message metrics (total, belum_dibaca, dibaca, dibalas)
 */
export function calculatePesanStats(pesanList: PesanMasuk[] | null | undefined): PesanStats {
  if (!pesanList || !Array.isArray(pesanList)) {
    return { total: 0, belumDibaca: 0, dibaca: 0, dibalas: 0 };
  }

  return pesanList.reduce(
    (acc, item) => {
      acc.total += 1;
      if (item.status === 'belum_dibaca') acc.belumDibaca += 1;
      else if (item.status === 'dibaca') acc.dibaca += 1;
      else if (item.status === 'dibalas') acc.dibalas += 1;
      return acc;
    },
    { total: 0, belumDibaca: 0, dibaca: 0, dibalas: 0 }
  );
}
