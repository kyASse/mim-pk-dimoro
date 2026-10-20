import { z } from "zod";

export const KATEGORI_OPINI_LIST = [
  "Pola Asuh & Parenting",
  "Pendidikan & Karakter",
  "Inovasi Pembelajaran",
  "Kisah Inspiratif",
  "Opini Bebas",
] as const;

export const PERAN_PENULIS_LIST = [
  "guru",
  "wali_murid",
  "alumni",
  "umum",
] as const;

export const opiniSubmissionSchema = z.object({
  nama_penulis: z.string().trim().min(3, "Nama penulis minimal 3 karakter").max(80, "Nama maksimal 80 karakter"),
  peran_penulis: z.enum(PERAN_PENULIS_LIST, {
    errorMap: () => ({ message: "Pilih peran penulis yang valid" }),
  }),
  keterangan_peran: z.string().trim().min(3, "Keterangan peran minimal 3 karakter").max(100, "Keterangan peran maksimal 100 karakter"),
  kontak_wa: z.string().trim().regex(/^(08|\+628)[0-9]{8,13}$/, "Format nomor WhatsApp tidak valid (contoh: 08123456789 atau +628123456789)"),
  email: z.string().trim().email("Format email tidak valid").optional().or(z.literal("")),
  judul: z.string().trim().min(10, "Judul minimal 10 karakter").max(150, "Judul maksimal 150 karakter"),
  kategori: z.enum(KATEGORI_OPINI_LIST, {
    errorMap: () => ({ message: "Pilih kategori opini yang valid" }),
  }),
  ringkasan: z.string().trim().min(30, "Ringkasan minimal 30 karakter").max(300, "Ringkasan maksimal 300 karakter"),
  isi_lengkap: z.string().trim().min(800, "Isi naskah minimal sekitar 250 kata (800 karakter)").max(15000, "Isi naskah maksimal 15.000 karakter"),
  website_url: z.string().max(0, "Bot submission detected").optional(),
});

export const opiniAdminUpdateSchema = z.object({
  judul: z.string().trim().min(10, "Judul minimal 10 karakter").max(150),
  slug: z.string().trim().min(5, "Slug minimal 5 karakter"),
  kategori: z.enum(KATEGORI_OPINI_LIST),
  ringkasan: z.string().trim().min(30).max(300),
  isi_lengkap: z.string().trim().min(100),
  status: z.enum(["menunggu_kurasi", "terbit", "ditolak", "arsip"]),
  catatan_redaksi: z.string().trim().nullable().optional(),
  is_featured: z.boolean(),
});
