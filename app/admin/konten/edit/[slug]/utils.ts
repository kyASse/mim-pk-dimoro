export interface CatatanSppIsi {
    catatan: string;
}

export interface PersyaratanIsi {
    persyaratan: {
        judul: string;
        items: string[];
    };
    jadwal: {
        judul: string;
        items: { tahap: string; periode: string }[];
    };
}

export interface JadwalPendaftaranIsi {
    judul: string;
    items: { nama: string; periode: string }[];
}

export function parseCatatanSpp(rawIsi: any): CatatanSppIsi {
    if (!rawIsi) return { catatan: "" };
    if (typeof rawIsi === "string") return { catatan: rawIsi };
    if (typeof rawIsi.catatan === "string") return { catatan: rawIsi.catatan };
    if (Array.isArray(rawIsi.blocks) && rawIsi.blocks[0]?.text) {
        return { catatan: rawIsi.blocks[0].text };
    }
    return { catatan: "" };
}

export function parsePersyaratan(rawIsi: any): PersyaratanIsi {
    const defaultVal: PersyaratanIsi = {
        persyaratan: { judul: "Persyaratan Dokumen", items: [] },
        jadwal: { judul: "Jadwal Pendaftaran", items: [] }
    };
    if (!rawIsi) return defaultVal;
    
    let items: string[] = [];
    let jadwalItems: { tahap: string; periode: string }[] = [];
    
    // If it's the legacy block layout
    if (Array.isArray(rawIsi.blocks) && rawIsi.blocks[0]?.text) {
        const text = rawIsi.blocks[0].text as string;
        items = text.split("\n").map(line => line.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
    } else {
        items = rawIsi.persyaratan?.items || [];
        jadwalItems = rawIsi.jadwal?.items || [];
    }

    return {
        persyaratan: {
            judul: rawIsi.persyaratan?.judul || "Persyaratan Dokumen",
            items: items
        },
        jadwal: {
            judul: rawIsi.jadwal?.judul || "Jadwal Pendaftaran",
            items: jadwalItems
        }
    };
}

export function parseJadwalPendaftaran(rawIsi: any): JadwalPendaftaranIsi {
    const defaultVal: JadwalPendaftaranIsi = {
        judul: "Jadwal Pendaftaran",
        items: []
    };
    if (!rawIsi) return defaultVal;
    
    let items: { nama: string; periode: string }[] = [];
    
    if (Array.isArray(rawIsi.blocks) && rawIsi.blocks[0]?.text) {
        const text = rawIsi.blocks[0].text as string;
        items = text.split("\n").map(line => {
            const parts = line.split(":");
            return {
                nama: parts[0]?.trim() || "Gelombang",
                periode: parts[1]?.trim() || ""
            };
        }).filter(Boolean);
    } else {
        items = rawIsi.items || [];
    }

    return {
        judul: rawIsi.judul || "Jadwal Pendaftaran",
        items: items
    };
}
