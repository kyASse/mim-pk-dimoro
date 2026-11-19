/**
 * lib/utils/struktur-organisasi.ts
 * Helper resolusi avatar, personil rangkap jabatan, dan pengelompokan wali kelas
 * untuk halaman publik /struktur-organisasi dan tab CMS /admin/konten.
 */

import type { PersonilOrganisasi, SlotJabatan } from "@/lib/types/content";

export const AVATAR_MAN_PLACEHOLDER = "/avatar-man-placeholder.png";
export const AVATAR_WOMEN_PLACEHOLDER = "/avatar-women-placeholder.png";

const CANONICAL_GRADE_ORDER = ["I", "II", "III", "IV", "V", "VI"] as const;
const ROMAN_GRADE_REGEX = /\b(III|II|IV|VI|V|I)\b/i;

/**
 * Mengembalikan URL foto personil jika tersedia, atau fallback placeholder
 * berdasarkan gender ("L" -> man, default/"P" -> women).
 */
export function getPersonilAvatarUrl(
  personil: Pick<PersonilOrganisasi, "foto_url" | "gender"> | null | undefined
): string {
  const fotoUrl = typeof personil?.foto_url === "string" ? personil.foto_url.trim() : "";
  if (fotoUrl.length > 0) {
    return fotoUrl;
  }
  return personil?.gender === "L" ? AVATAR_MAN_PLACEHOLDER : AVATAR_WOMEN_PLACEHOLDER;
}

/**
 * Menyelesaikan profil personil dari sebuah slot jabatan berdasarkan `personil_id`.
 * Mengembalikan fallback "Belum Ditentukan" dengan placeholder saat tidak ditemukan.
 */
export function resolveSlotPersonil(
  slot: SlotJabatan,
  personilList: PersonilOrganisasi[]
): { nama: string; fotoUrl: string; isAssigned: boolean } {
  const targetId = typeof slot.personil_id === "string" ? slot.personil_id.trim() : "";
  if (!targetId) {
    return {
      nama: "Belum Ditentukan",
      fotoUrl: AVATAR_WOMEN_PLACEHOLDER,
      isAssigned: false,
    };
  }

  const matched = personilList.find((p) => p.id === targetId);
  if (!matched) {
    return {
      nama: "Belum Ditentukan",
      fotoUrl: AVATAR_WOMEN_PLACEHOLDER,
      isAssigned: false,
    };
  }

  return {
    nama: matched.nama,
    fotoUrl: getPersonilAvatarUrl(matched),
    isAssigned: true,
  };
}

/**
 * Mengelompokkan daftar slot Wali Kelas ke dalam kelompok tingkat kelas (I..VI)
 * agar rombel paralel (mis. III A & III B) tersusun vertikal per tingkat.
 */
export function groupWaliKelasByGrade(
  waliKelas: SlotJabatan[]
): { grade: string; slots: SlotJabatan[] }[] {
  if (!Array.isArray(waliKelas) || waliKelas.length === 0) {
    return [];
  }

  const grouped = new Map<string, SlotJabatan[]>();

  for (const slot of waliKelas) {
    const match = slot.jabatan.match(ROMAN_GRADE_REGEX);
    const grade = match ? match[1].toUpperCase() : "Lainnya";
    const existing = grouped.get(grade);
    if (existing) {
      existing.push(slot);
    } else {
      grouped.set(grade, [slot]);
    }
  }

  const result: { grade: string; slots: SlotJabatan[] }[] = [];

  for (const canonicalGrade of CANONICAL_GRADE_ORDER) {
    const slots = grouped.get(canonicalGrade);
    if (slots && slots.length > 0) {
      result.push({ grade: canonicalGrade, slots });
      grouped.delete(canonicalGrade);
    }
  }

  for (const [grade, slots] of grouped.entries()) {
    if (slots.length > 0) {
      result.push({ grade, slots });
    }
  }

  return result;
}
