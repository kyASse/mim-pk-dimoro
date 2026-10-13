import { describe, it, expect } from "vitest";
import { parseIKWMContent, extractYouTubeVideoId, DEFAULT_IKWM_CONTENT } from "../content-parsers";

describe("IKWM Content Parser & YouTube Helper", () => {
  it("harus mengekstrak ID video YouTube dari berbagai variasi URL", () => {
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://youtu.be/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s")).toBe("dQw4w9WgXcQ");
    expect(extractYouTubeVideoId("invalid-url")).toBeNull();
    expect(extractYouTubeVideoId("")).toBeNull();
    expect(extractYouTubeVideoId(null as unknown as string)).toBeNull();
    expect(extractYouTubeVideoId(undefined as unknown as string)).toBeNull();
  });

  it("harus mengembalikan data default lengkap saat payload bernilai null atau undefined", () => {
    const fromNull = parseIKWMContent(null);
    expect(fromNull.hero.judul).toBe(DEFAULT_IKWM_CONTENT.hero.judul);
    expect(fromNull.kata_pengantar.nama_ketua).toBe("Kardiyanto");
    expect(fromNull.kata_pengantar.sambutan.length).toBeGreaterThan(0);
    expect(fromNull.video.display_mode).toBe("placeholder");
    expect(fromNull.struktural.pengurus_inti.length).toBeGreaterThan(0);
    expect(fromNull.kegiatan.length).toBeGreaterThan(0);

    const fromUndefined = parseIKWMContent(undefined);
    expect(fromUndefined.hero.judul).toBe(DEFAULT_IKWM_CONTENT.hero.judul);
    expect(fromUndefined.video.display_mode).toBe("placeholder");
  });

  it("harus dapat mem-parsing payload dalam bentuk JSON string dari database", () => {
    const jsonString = JSON.stringify({
      hero: { judul: "Judul dari JSON String" },
      kata_pengantar: { nama_ketua: "Bapak Kardiyanto" },
    });
    const parsed = parseIKWMContent(jsonString);
    expect(parsed.hero.judul).toBe("Judul dari JSON String");
    expect(parsed.kata_pengantar.nama_ketua).toBe("Bapak Kardiyanto");
    expect(parsed.video.display_mode).toBe("placeholder"); // Fallback preserved
  });

  it("harus mempertahankan data kustom dan melengkapi field yang hilang dengan fallback", () => {
    const custom = parseIKWMContent({
      hero: {
        judul: "Kustom Judul IKWM",
      },
      video: {
        display_mode: "active",
        youtube_url: "https://youtu.be/dQw4w9WgXcQ",
      },
    });

    expect(custom.hero.judul).toBe("Kustom Judul IKWM");
    expect(custom.video.display_mode).toBe("active");
    expect(custom.kata_pengantar.nama_ketua).toBeDefined(); // Fallback preserved
    expect(custom.hero.badge).toBe(DEFAULT_IKWM_CONTENT.hero.badge);
  });

  it("harus menormalkan display_mode video yang tidak valid menjadi placeholder", () => {
    const invalidMode = parseIKWMContent({
      video: {
        display_mode: "not-a-valid-mode" as any,
      },
    });

    expect(invalidMode.video.display_mode).toBe("placeholder");
  });

  it("harus mempertahankan struktural dan kegiatan kustom jika array valid diberikan", () => {
    const custom = parseIKWMContent({
      struktural: {
        pengurus_inti: [
          {
            id: "custom-1",
            nama: "Ketua Kustom",
            jabatan: "Ketua",
            divisi: "Pimpinan Harian",
          },
        ],
      },
      kegiatan: [
        {
          id: "keg-1",
          kategori: "parenting",
          badge_label: "Baru",
          judul: "Parenting Akbar",
          deskripsi: "Deskripsi",
          jadwal: "Ahad",
          foto_url: "/images/custom.jpg",
        },
      ],
    });

    expect(custom.struktural.pengurus_inti).toHaveLength(1);
    expect(custom.struktural.pengurus_inti[0].nama).toBe("Ketua Kustom");
    expect(custom.struktural.bidang.length).toBeGreaterThan(0); // Fallback preserved
    expect(custom.kegiatan).toHaveLength(1);
    expect(custom.kegiatan[0].judul).toBe("Parenting Akbar");
  });
});
