import { describe, it, expect } from "vitest";
import {
  DEFAULT_STRUKTUR_ORGANISASI,
  parseStrukturOrganisasiContent,
} from "@/lib/utils/content-parsers";
import {
  getPersonilAvatarUrl,
  resolveSlotPersonil,
  groupWaliKelasByGrade,
} from "@/lib/utils/struktur-organisasi";

describe("parseStrukturOrganisasiContent", () => {
  it("mengembalikan DEFAULT_STRUKTUR_ORGANISASI dengan 20 personil unik dan 10 wali kelas saat input null", () => {
    const data = parseStrukturOrganisasiContent(null);
    expect(data.personil).toHaveLength(20);
    expect(new Set(data.personil.map((p) => p.id)).size).toBe(20);
    expect(data.kamad.jabatan).toContain("Kepala Madrasah");
    expect(data.komite.jabatan).toContain("Komite");
    expect(data.administrasi).toHaveLength(2);
    expect(data.waka).toHaveLength(4);
    expect(data.waka[0].sub_unit?.jabatan).toContain("Perpus");
    expect(data.waka[3].sub_unit?.jabatan).toContain("BP");
    expect(data.penunjang).toHaveLength(2);
    expect(data.wali_kelas).toHaveLength(10);
    expect(data.guru_mapel).toHaveLength(5);
    expect(data.dewan_guru_label).toBe("Dewan Guru");
    expect(data.siswa_label).toBe("Siswa");
    expect(data).toEqual(DEFAULT_STRUKTUR_ORGANISASI);
  });

  it("melakukan fallback per-seksi jika payload korup atau parsial", () => {
    const partial = parseStrukturOrganisasiContent({
      hero: { judul: "Struktur Baru" },
      personil: "bukan-array",
      wali_kelas: [],
    });
    expect(partial.hero.judul).toBe("Struktur Baru");
    expect(partial.hero.badge).toBe(DEFAULT_STRUKTUR_ORGANISASI.hero.badge);
    expect(partial.personil).toHaveLength(20);
    expect(partial.wali_kelas).toHaveLength(10);
  });

  it("mem-parse string JSON yang valid dan mempertahankan data custom termasuk sub_unit dan rangkap jabatan", () => {
    const customPayload = JSON.stringify({
      hero: {
        badge: "Custom Badge",
        judul: "Struktur Kustom",
        subjudul: "Subjudul Kustom",
        tahun_ajaran: "2027/2028",
      },
      personil: [
        { id: "guru-a", nama: "Ustadz A, S.Pd", foto_url: "https://cdn.test/a.webp", gender: "L" },
      ],
      komite: { id: "komite", jabatan: "Ketua Komite", personil_id: "guru-a" },
      kamad: { id: "kamad", jabatan: "Kepala Madrasah", personil_id: "guru-a" },
      waka: [
        {
          id: "waka-1",
          jabatan: "Waka Kurikulum",
          personil_id: "guru-a",
          sub_unit: { id: "sub-1", jabatan: "Koord. Lab", personil_id: "" },
        },
      ],
      dewan_guru_label: "Para Pendidik",
      siswa_label: "Peserta Didik",
    });

    const parsed = parseStrukturOrganisasiContent(customPayload);
    expect(parsed.hero.tahun_ajaran).toBe("2027/2028");
    expect(parsed.personil).toHaveLength(1);
    expect(parsed.komite.personil_id).toBe("guru-a");
    expect(parsed.kamad.personil_id).toBe("guru-a");
    expect(parsed.waka).toHaveLength(1);
    expect(parsed.waka[0].sub_unit?.jabatan).toBe("Koord. Lab");
    expect(parsed.waka[0].sub_unit?.personil_id).toBe("");
    expect(parsed.dewan_guru_label).toBe("Para Pendidik");
    expect(parsed.siswa_label).toBe("Peserta Didik");
  });
});

describe("struktur-organisasi helpers", () => {
  it("getPersonilAvatarUrl memilih placeholder berdasarkan gender saat foto_url kosong", () => {
    expect(getPersonilAvatarUrl({ foto_url: "", gender: "L" })).toBe("/avatar-man-placeholder.png");
    expect(getPersonilAvatarUrl({ foto_url: "", gender: "P" })).toBe("/avatar-women-placeholder.png");
    expect(getPersonilAvatarUrl({ foto_url: "   " })).toBe("/avatar-women-placeholder.png");
    expect(getPersonilAvatarUrl(null)).toBe("/avatar-women-placeholder.png");
    expect(getPersonilAvatarUrl({ foto_url: "https://cdn.test/a.webp", gender: "L" })).toBe("https://cdn.test/a.webp");
  });

  it("resolveSlotPersonil mengembalikan fallback 'Belum Ditentukan' jika personil_id hilang atau tidak ditemukan", () => {
    const resolved = resolveSlotPersonil(
      { id: "slot-1", jabatan: "Waka Humas", personil_id: "tidak-ada" },
      []
    );
    expect(resolved).toEqual({
      nama: "Belum Ditentukan",
      fotoUrl: "/avatar-women-placeholder.png",
      isAssigned: false,
    });
  });

  it("resolveSlotPersonil mengembalikan nama dan fotoUrl personil yang cocok", () => {
    const resolved = resolveSlotPersonil(
      { id: "slot-2", jabatan: "Komite Madrasah", personil_id: "bandowi" },
      DEFAULT_STRUKTUR_ORGANISASI.personil
    );
    expect(resolved).toEqual({
      nama: "Bandowi",
      fotoUrl: "/avatar-man-placeholder.png",
      isAssigned: true,
    });
  });

  it("groupWaliKelasByGrade mengelompokkan 10 wali kelas ke dalam 6 tingkat kelas I..VI", () => {
    const defaults = parseStrukturOrganisasiContent(null);
    const groups = groupWaliKelasByGrade(defaults.wali_kelas);
    expect(groups.map((g) => g.grade)).toEqual(["I", "II", "III", "IV", "V", "VI"]);
    expect(groups[2].slots.map((s) => s.jabatan)).toEqual(["Wali Kelas III A", "Wali Kelas III B"]);
    expect(groups[5].slots.map((s) => s.jabatan)).toEqual(["Wali Kelas VI A", "Wali Kelas VI B"]);
  });

  it("groupWaliKelasByGrade mengembalikan array kosong jika input kosong", () => {
    expect(groupWaliKelasByGrade([])).toEqual([]);
  });
});
