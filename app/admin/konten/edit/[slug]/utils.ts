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

function tryJsonParse(value: any): any {
    if (typeof value !== "string") return value;
    try {
        const parsed = JSON.parse(value);
        if (typeof parsed === "string") {
            return tryJsonParse(parsed);
        }
        return parsed;
    } catch {
        return value;
    }
}

export function parseCatatanSpp(rawIsi: any): CatatanSppIsi {
    if (!rawIsi) return { catatan: "" };
    
    const parsed = tryJsonParse(rawIsi);
    if (typeof parsed === "string") return { catatan: parsed };
    if (parsed && typeof parsed.catatan === "string") return { catatan: parsed.catatan };
    if (parsed && Array.isArray(parsed.blocks) && parsed.blocks[0]?.text) {
        return { catatan: parsed.blocks[0].text };
    }
    return { catatan: "" };
}

export function parsePersyaratan(rawIsi: any): PersyaratanIsi {
    const defaultVal: PersyaratanIsi = {
        persyaratan: { judul: "Persyaratan Dokumen", items: [] },
        jadwal: { judul: "Jadwal Pendaftaran", items: [] }
    };
    if (!rawIsi) return defaultVal;
    
    const parsed = tryJsonParse(rawIsi);
    if (typeof parsed === "string") {
        const items = parsed.split("\n").map(line => line.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
        return {
            persyaratan: {
                judul: "Persyaratan Dokumen",
                items: items
            },
            jadwal: {
                judul: "Jadwal Pendaftaran",
                items: []
            }
        };
    }
    
    let items: string[] = [];
    let jadwalItems: { tahap: string; periode: string }[] = [];
    
    // If it's the legacy block layout
    if (parsed && Array.isArray(parsed.blocks) && parsed.blocks[0]?.text) {
        const text = parsed.blocks[0].text as string;
        items = text.split("\n").map(line => line.replace(/^\d+\.\s*/, "").trim()).filter(Boolean);
    } else if (parsed) {
        items = parsed.persyaratan?.items || [];
        jadwalItems = parsed.jadwal?.items || [];
    }

    return {
        persyaratan: {
            judul: parsed?.persyaratan?.judul || "Persyaratan Dokumen",
            items: items
        },
        jadwal: {
            judul: parsed?.jadwal?.judul || "Jadwal Pendaftaran",
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
    
    const parsed = tryJsonParse(rawIsi);
    if (typeof parsed === "string") {
        const items = parsed.split("\n").map(line => {
            const parts = line.split(":");
            return {
                nama: parts[0]?.trim() || "Gelombang",
                periode: parts[1]?.trim() || ""
            };
        }).filter(Boolean);
        return {
            judul: "Jadwal Pendaftaran",
            items: items
        };
    }
    
    let items: { nama: string; periode: string }[] = [];
    
    if (parsed && Array.isArray(parsed.blocks) && parsed.blocks[0]?.text) {
        const text = parsed.blocks[0].text as string;
        items = text.split("\n").map(line => {
            const parts = line.split(":");
            return {
                nama: parts[0]?.trim() || "Gelombang",
                periode: parts[1]?.trim() || ""
            };
        }).filter(Boolean);
    } else if (parsed) {
        items = parsed.items || [];
    }

    return {
        judul: parsed?.judul || "Jadwal Pendaftaran",
        items: items
    };
}
