import { describe, it, expect } from "vitest";
import {
  parseHeroContent,
  parseHeadmasterContent,
  parseVisionMissionContent,
  parseSchoolIdentityContent,
  parseProgramKurikulumContent,
  parseFAQContent,
  parsePPDBFlowContent,
  parseBerandaKeunggulanContent,
} from "../content-parsers";

describe("content-parsers defensive fallback tests", () => {
  it("harus mengembalikan data default beranda hero saat input null/undefined", () => {
    const hero = parseHeroContent(null);
    expect(hero.headline).toBeDefined();
    expect(hero.hero_image_url).toBe("/images/mim_hero_main.jpg");
    expect(hero.floating_stat_number).toBe("59");
    expect(hero.trust_badges.length).toBeGreaterThan(0);
  });

  it("harus menggabungkan data parsial hero dengan nilai default", () => {
    const customHero = parseHeroContent({
      headline: "Headline Kustom Baru",
      hero_image_url: "https://supabase.co/storage/v1/object/public/konten-publik/konten/hero/new.webp",
    });
    expect(customHero.headline).toBe("Headline Kustom Baru");
    expect(customHero.hero_image_url).toContain("new.webp");
    // Fallback fields should still be present
    expect(customHero.floating_stat_number).toBe("59");
    expect(customHero.subheadline).toBeDefined();
  });

  it("harus mengembalikan data default sambutan kepala madrasah saat input null", () => {
    const kepsek = parseHeadmasterContent(null);
    expect(kepsek.nama).toContain("Anik Sulityowati");
    expect(kepsek.jabatan).toContain("Kepala");
    expect(kepsek.paragraphs.length).toBeGreaterThan(0);
    expect(kepsek.foto_url).toBeDefined();
  });

  it("harus mengembalikan data visi misi dan motto saat input null", () => {
    const vm = parseVisionMissionContent(null);
    expect(vm.motto).toContain("Unggul dalam Prestasi");
    expect(vm.visi).toBeDefined();
    expect(vm.indikator_visi.length).toBe(7);
    expect(vm.misi.length).toBe(8);
  });

  it("harus mengembalikan identitas resmi madrasah lengkap", () => {
    const identity = parseSchoolIdentityContent(null);
    expect(identity.npsn).toBe("60711720");
    expect(identity.nsm).toBe("111233110050");
    expect(identity.akreditasi).toBe("A");
    expect(identity.kabupaten).toBe("Sukoharjo");
  });

  it("harus mengembalikan struktur program & kurikulum fase", () => {
    const program = parseProgramKurikulumContent(null);
    expect(program.showcase_image_url).toBe("/images/mim_hero_main.jpg");
    expect(program.fase_bawah.judul).toContain("Fase A & B");
    expect(program.fase_atas.judul).toContain("Fase B & C");
    expect(program.fase_bawah.jam_kbm.length).toBeGreaterThan(0);
  });

  it("harus mengembalikan daftar FAQ default 5 butir saat null", () => {
    const faq = parseFAQContent(null);
    expect(faq.items.length).toBe(5);
    expect(faq.items[0].question).toContain("PPDB");
  });

  it("harus mengembalikan alur PPDB dan formulir PDF default saat null", () => {
    const ppdb = parsePPDBFlowContent(null);
    expect(ppdb.formulir_pdf_url).toBe("/Formulir Pendaftaran MIM PK Dimoro.pdf");
    expect(ppdb.alur_online.length).toBe(5);
    expect(ppdb.alur_offline.length).toBe(4);
  });

  it("harus mengembalikan bento keunggulan 4 butir saat null", () => {
    const bento = parseBerandaKeunggulanContent(null);
    expect(bento.items.length).toBe(4);
    expect(bento.items[0].title).toBe("Kurikulum Terpadu Islami");
  });
});
