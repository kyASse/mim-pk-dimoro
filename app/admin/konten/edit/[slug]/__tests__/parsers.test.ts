import { describe, it, expect } from "vitest";
import {
    parseCatatanSpp,
    parsePersyaratan,
    parseJadwalPendaftaran
} from "../utils";



describe("Legacy Fallback Data Parsers", () => {
    describe("parseCatatanSpp", () => {
        it("should return empty catatan for null or undefined input", () => {
            expect(parseCatatanSpp(null)).toEqual({ catatan: "" });
            expect(parseCatatanSpp(undefined)).toEqual({ catatan: "" });
        });

        it("should return string input as catatan", () => {
            expect(parseCatatanSpp("Biaya SPP Rp 100.000")).toEqual({
                catatan: "Biaya SPP Rp 100.000"
            });
        });

        it("should parse stringified JSON object representation", () => {
            expect(parseCatatanSpp('{"catatan": "Biaya SPP Rp 100.000"}')).toEqual({
                catatan: "Biaya SPP Rp 100.000"
            });
        });

        it("should parse double-stringified JSON object representation", () => {
            expect(parseCatatanSpp('"{\\"catatan\\": \\"Biaya SPP Rp 100.000\\"}"')).toEqual({
                catatan: "Biaya SPP Rp 100.000"
            });
        });

        it("should parse stringified JSON string representation", () => {
            expect(parseCatatanSpp('"Biaya SPP Rp 100.000"')).toEqual({
                catatan: "Biaya SPP Rp 100.000"
            });
        });

        it("should parse structured catatan object", () => {
            expect(parseCatatanSpp({ catatan: "Biaya SPP" })).toEqual({
                catatan: "Biaya SPP"
            });
        });

        it("should parse legacy blocks structure", () => {
            const raw = {
                blocks: [
                    { text: "Catatan SPP dari blocks" }
                ]
            };
            expect(parseCatatanSpp(raw)).toEqual({
                catatan: "Catatan SPP dari blocks"
            });
        });

        it("should fallback to empty string for other inputs", () => {
            expect(parseCatatanSpp({})).toEqual({ catatan: "" });
            expect(parseCatatanSpp(123)).toEqual({ catatan: "" });
        });
    });

    describe("parsePersyaratan", () => {
        it("should return default value for null or undefined input", () => {
            const expectedDefault = {
                persyaratan: { judul: "Persyaratan Dokumen", items: [] },
                jadwal: { judul: "Jadwal Pendaftaran", items: [] }
            };
            expect(parsePersyaratan(null)).toEqual(expectedDefault);
            expect(parsePersyaratan(undefined)).toEqual(expectedDefault);
        });

        it("should parse legacy blocks text split by newlines", () => {
            const raw = {
                blocks: [
                    { text: "1. Akta Kelahiran\n2. Kartu Keluarga\n3. Ijazah" }
                ]
            };
            const result = parsePersyaratan(raw);
            expect(result.persyaratan.items).toEqual([
                "Akta Kelahiran",
                "Kartu Keluarga",
                "Ijazah"
            ]);
            expect(result.jadwal.items).toEqual([]);
        });

        it("should parse new structured format correctly", () => {
            const raw = {
                persyaratan: {
                    judul: "Custom Persyaratan",
                    items: ["A", "B"]
                },
                jadwal: {
                    judul: "Custom Jadwal",
                    items: [
                        { tahap: "Gelombang 1", periode: "Januari" }
                    ]
                }
            };
            expect(parsePersyaratan(raw)).toEqual({
                persyaratan: {
                    judul: "Custom Persyaratan",
                    items: ["A", "B"]
                },
                jadwal: {
                    judul: "Custom Jadwal",
                    items: [
                        { tahap: "Gelombang 1", periode: "Januari" }
                    ]
                }
            });
        });

        it("should parse stringified JSON representation", () => {
            const raw = JSON.stringify({
                persyaratan: {
                    judul: "Custom Persyaratan",
                    items: ["A", "B"]
                },
                jadwal: {
                    judul: "Custom Jadwal",
                    items: [
                        { tahap: "Gelombang 1", periode: "Januari" }
                    ]
                }
            });
            expect(parsePersyaratan(raw)).toEqual({
                persyaratan: {
                    judul: "Custom Persyaratan",
                    items: ["A", "B"]
                },
                jadwal: {
                    judul: "Custom Jadwal",
                    items: [
                        { tahap: "Gelombang 1", periode: "Januari" }
                    ]
                }
            });
        });
    });

    describe("parseJadwalPendaftaran", () => {
        it("should return default value for null or undefined", () => {
            const expectedDefault = {
                judul: "Jadwal Pendaftaran",
                items: []
            };
            expect(parseJadwalPendaftaran(null)).toEqual(expectedDefault);
            expect(parseJadwalPendaftaran(undefined)).toEqual(expectedDefault);
        });

        it("should parse legacy blocks text split by colon", () => {
            const raw = {
                blocks: [
                    { text: "Gelombang 1: Januari - Februari\nGelombang 2: Maret" }
                ]
            };
            const result = parseJadwalPendaftaran(raw);
            expect(result.judul).toBe("Jadwal Pendaftaran");
            expect(result.items).toEqual([
                { nama: "Gelombang 1", periode: "Januari - Februari" },
                { nama: "Gelombang 2", periode: "Maret" }
            ]);
        });

        it("should parse new structured format correctly", () => {
            const raw = {
                judul: "Jadwal Gelombang",
                items: [
                    { nama: "Gelombang A", periode: "Mei 2026" }
                ]
            };
            expect(parseJadwalPendaftaran(raw)).toEqual({
                judul: "Jadwal Gelombang",
                items: [
                    { nama: "Gelombang A", periode: "Mei 2026" }
                ]
            });
        });

        it("should parse stringified JSON representation", () => {
            const raw = JSON.stringify({
                judul: "Jadwal Gelombang",
                items: [
                    { nama: "Gelombang A", periode: "Mei 2026" }
                ]
            });
            expect(parseJadwalPendaftaran(raw)).toEqual({
                judul: "Jadwal Gelombang",
                items: [
                    { nama: "Gelombang A", periode: "Mei 2026" }
                ]
            });
        });
    });
});
