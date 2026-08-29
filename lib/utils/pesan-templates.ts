// lib/utils/pesan-templates.ts
import {
  SCHOOL_NAME,
  SCHOOL_DOMAIN,
  SCHOOL_WHATSAPP,
  SCHOOL_CONTACT_PERSON,
} from '@/lib/school-config';

export type QuickReplyCategory = 'ppdb' | 'biaya' | 'program' | 'kunjungan';

export interface QuickReplyTemplate {
  id: QuickReplyCategory;
  label: string;
  description: string;
  generateText: (context: { namaPengirim: string; subjek?: string | null }) => string;
}

export const QUICK_REPLY_TEMPLATES: QuickReplyTemplate[] = [
  {
    id: 'ppdb',
    label: 'Informasi PPDB & Syarat',
    description: 'Informasi alur pendaftaran santri baru, syarat berkas, dan narahubung panitia.',
    generateText: ({ namaPengirim, subjek }) => {
      const subjekText = subjek ? ` terkait "${subjek}"` : '';
      return (
        `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${namaPengirim},\n\n` +
        `Terima kasih atas ketertarikan Bapak/Ibu terhadap ${SCHOOL_NAME}${subjekText}.\n\n` +
        `Pendaftaran Peserta Didik Baru (PPDB) ${SCHOOL_NAME} dapat dilakukan secara online melalui website resmi kami (${SCHOOL_DOMAIN}/pendaftaran) atau hadir langsung ke sekretariat madrasah.\n\n` +
        `Syarat pendaftaran umum:\n` +
        `1. Mengisi formulir pendaftaran\n` +
        `2. Fotokopi Akta Kelahiran\n` +
        `3. Fotokopi Kartu Keluarga (KK)\n` +
        `4. Pas foto calon santri/siswa terbaru\n\n` +
        `Untuk informasi lebih lanjut mengenai jadwal gelombang pendaftaran, Bapak/Ibu dapat menghubungi Panitia PPDB (${SCHOOL_CONTACT_PERSON}: ${SCHOOL_WHATSAPP}).\n\n` +
        `Wassalamu’alaikum Wr. Wb.\n` +
        `Panitia PPDB ${SCHOOL_NAME}`
      );
    },
  },
  {
    id: 'biaya',
    label: 'Rincian Biaya & SPP',
    description: 'Rincian komponen pembiayaan, SPP bulanan terjangkau, dan opsi beasiswa/keringanan.',
    generateText: ({ namaPengirim, subjek }) => {
      const subjekText = subjek ? ` terkait "${subjek}"` : '';
      return (
        `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${namaPengirim},\n\n` +
        `Terima kasih telah menghubungi ${SCHOOL_NAME}${subjekText}.\n\n` +
        `Mengenai rincian biaya pendidikan di ${SCHOOL_NAME}, komponen pembiayaan meliputi:\n` +
        `1. Infaq Pengembangan Pendidikan / Gedung\n` +
        `2. Paket Seragam Sekolah\n` +
        `3. Buku Paket & Modul Pembelajaran\n` +
        `4. SPP Bulanan yang sangat terjangkau\n\n` +
        `Kami juga menyediakan program beasiswa serta keringanan biaya bagi santri berprestasi dan keluarga yang berhak (syarat dan ketentuan berlaku).\n\n` +
        `Untuk rincian brosur pembiayaan lengkap, Bapak/Ibu dipersilakan menghubungi kami via WhatsApp atau berkunjung langsung ke madrasah.\n\n` +
        `Wassalamu’alaikum Wr. Wb.\n` +
        `Admin ${SCHOOL_NAME}`
      );
    },
  },
  {
    id: 'program',
    label: 'Program Unggulan & Jadwal',
    description: 'Program unggulan Tahfidz, Full Day, karakter Islami, dan jam belajar KBM.',
    generateText: ({ namaPengirim, subjek }) => {
      const subjekText = subjek ? ` terkait "${subjek}"` : '';
      return (
        `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${namaPengirim},\n\n` +
        `Terima kasih atas minat Bapak/Ibu terhadap program pendidikan di ${SCHOOL_NAME}${subjekText}.\n\n` +
        `${SCHOOL_NAME} menyelenggarakan pendidikan unggul berbasis nilai Islam dengan program:\n` +
        `1. Program Tahfidzul Qur'an & Tartil Metode Terpadu\n` +
        `2. Pembiasaan Karakter & Ibadah Islami Harian (Sholat Dhuha, Dhuhur Berjamaah)\n` +
        `3. Pembelajaran Aktif & Kreatif (Full Day School)\n` +
        `4. Ekstrakurikuler Beragam (Kepanduan HW/Pramuka, Tapak Suci, Sains, Seni)\n\n` +
        `Jam Kegiatan Belajar Mengajar (KBM) berlangsung dari hari Senin s.d. Sabtu (pukul 07.00 - 13.30 WIB, disesuaikan dengan jenjang kelas).\n\n` +
        `Wassalamu’alaikum Wr. Wb.\n` +
        `Tim Akademik ${SCHOOL_NAME}`
      );
    },
  },
  {
    id: 'kunjungan',
    label: 'Undangan Kunjungan / Observasi',
    description: 'Undangan silaturahmi, konsultasi tatap muka, dan observasi lingkungan madrasah.',
    generateText: ({ namaPengirim, subjek }) => {
      const subjekText = subjek ? ` terkait "${subjek}"` : '';
      return (
        `Assalamu’alaikum Wr. Wb. Bapak/Ibu ${namaPengirim},\n\n` +
        `Terima kasih telah menghubungi ${SCHOOL_NAME}${subjekText}.\n\n` +
        `Kami sangat menyambut hangat kehadiran Bapak/Ibu untuk bersilaturahmi dan melakukan Kunjungan / Observasi lingkungan sekolah secara langsung di kampus ${SCHOOL_NAME}.\n\n` +
        `Jadwal Pelayanan & Observasi:\n` +
        `• Hari: Senin - Sabtu\n` +
        `• Waktu: Pukul 07.30 - 13.00 WIB\n` +
        `• Lokasi: Kantor Sekretariat ${SCHOOL_NAME}\n\n` +
        `Bapak/Ibu dapat berkonsultasi langsung dengan dewan guru dan melihat suasana pembelajaran para santri. Mohon konfirmasi perkiraan waktu kedatangan terlebih dahulu.\n\n` +
        `Wassalamu’alaikum Wr. Wb.\n` +
        `Admin ${SCHOOL_NAME}`
      );
    },
  },
];

export function getQuickReplyTemplateById(
  id: QuickReplyCategory
): QuickReplyTemplate | undefined {
  return QUICK_REPLY_TEMPLATES.find((template) => template.id === id);
}
