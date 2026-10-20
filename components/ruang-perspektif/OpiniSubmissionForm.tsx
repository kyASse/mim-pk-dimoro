"use client";

import { useState } from "react";
import { submitOpiniAction } from "@/app/ruang-perspektif/actions";
import { KATEGORI_OPINI_LIST } from "@/lib/validations/ruang-perspektif";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import OpiniRichTextEditor from "./OpiniRichTextEditor";
import { CheckCircle2, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function OpiniSubmissionForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isiLengkapHtml, setIsiLengkapHtml] = useState("");
  const [isiLengkapText, setIsiLengkapText] = useState("");

  const wordCount = isiLengkapText.trim().split(/\s+/).filter(Boolean).length;
  const isWordCountSufficient = wordCount >= 250;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const formData = new FormData(e.currentTarget);
    const result = await submitOpiniAction(formData);

    setLoading(false);
    if (!result.success) {
      setError(result.error || "Gagal mengirimkan naskah");
    } else {
      setSuccess(result.message || "Naskah berhasil dikirim!");
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto my-12 p-8 rounded-3xl border border-emerald-500/30 bg-emerald-500/5 text-center space-y-4">
        <CheckCircle2 className="size-12 text-emerald-600 mx-auto" />
        <h2 className="text-2xl font-bold text-foreground">Alhamdulillah, Naskah Terkirim!</h2>
        <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
          {success} Redaksi madrasah akan menelaah naskah Anda dan memberikan kabar via WhatsApp.
        </p>
        <Button asChild className="rounded-full mt-4">
          <Link href="/ruang-perspektif">Kembali ke Ruang Perspektif</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-8 p-6 sm:p-10 rounded-3xl border border-border/50 bg-card/60">
      <div className="space-y-2">
        <Link href="/ruang-perspektif" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2">
          <ArrowLeft className="size-3.5" /> Kembali
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
          Formulir Pengiriman Opini
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Silakan lengkapi formulir di bawah ini. Naskah akan dikurasi secara ramah oleh Meja Redaksi madrasah sebelum dipublikasikan.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-xs sm:text-sm text-destructive flex items-start gap-2">
          <AlertCircle className="size-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {/* Honeypot hidden */}
      <input type="text" name="website_url" className="hidden" tabIndex={-1} autoComplete="off" />

      {/* Bagian 1: Identitas Penulis */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-primary border-b pb-2">
          1. Identitas Penulis
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="nama_penulis" className="text-xs font-semibold text-foreground">
              Nama Lengkap *
            </label>
            <Input
              id="nama_penulis"
              name="nama_penulis"
              required
              placeholder="Contoh: Budi Santoso, S.Pd."
              className="h-10 text-sm sm:h-8 sm:text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="peran_penulis" className="text-xs font-semibold text-foreground">
              Peran Anda *
            </label>
            <select
              id="peran_penulis"
              name="peran_penulis"
              required
              className="w-full rounded-md border border-input bg-background px-3 h-10 text-sm sm:h-8 sm:text-xs"
            >
              <option value="guru">Guru & Tenaga Pendidik</option>
              <option value="wali_murid">Wali Murid / Orang Tua</option>
              <option value="alumni">Alumni</option>
              <option value="umum">Pemerhati Pendidikan / Umum</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="keterangan_peran" className="text-xs font-semibold text-foreground">
              Keterangan Peran / Kelas *
            </label>
            <Input
              id="keterangan_peran"
              name="keterangan_peran"
              required
              placeholder="Cth: Wali dari Fatih (Kelas 3) / Guru Kelas 5"
              className="h-10 text-sm sm:h-8 sm:text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="kontak_wa" className="text-xs font-semibold text-foreground">
              Nomor WhatsApp *
            </label>
            <Input
              id="kontak_wa"
              name="kontak_wa"
              required
              placeholder="Cth: 081234567890"
              className="h-10 text-sm sm:h-8 sm:text-xs"
            />
            <span className="text-[11px] text-muted-foreground block">
              Hanya untuk konfirmasi redaksi, tidak dipublikasikan.
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-xs font-semibold text-foreground">
              Email (Opsional)
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="alamat@email.com"
              className="h-10 text-sm sm:h-8 sm:text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="foto_penulis" className="text-xs font-semibold text-foreground">
              Foto Penulis (Opsional, Maks 2MB)
            </label>
            <Input
              id="foto_penulis"
              name="foto_penulis"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="h-10 text-sm sm:h-8 sm:text-xs"
            />
          </div>
        </div>
      </div>

      {/* Bagian 2: Naskah Opini */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-primary border-b pb-2">
          2. Naskah Opini
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2 space-y-1.5">
            <label htmlFor="judul" className="text-xs font-semibold text-foreground">
              Judul Opini *
            </label>
            <Input
              id="judul"
              name="judul"
              required
              placeholder="Tuliskan judul yang menarik dan mencerminkan isi..."
              className="h-10 text-sm sm:h-8 sm:text-xs"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="kategori" className="text-xs font-semibold text-foreground">
              Kategori *
            </label>
            <select
              id="kategori"
              name="kategori"
              required
              className="w-full rounded-md border border-input bg-background px-3 h-10 text-sm sm:h-8 sm:text-xs"
            >
              {KATEGORI_OPINI_LIST.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="ringkasan" className="text-xs font-semibold text-foreground">
            Ringkasan / Abstrak (1-2 Kalimat) *
          </label>
          <Textarea
            id="ringkasan"
            name="ringkasan"
            required
            rows={2}
            placeholder="Tuliskan intisari atau gagasan pokok tulisan Anda..."
            className="text-sm sm:text-xs"
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="isi_lengkap" className="text-xs font-semibold text-foreground">
              Isi Lengkap Opini *
            </label>
            <span
              className={`text-[11px] font-medium ${
                isWordCountSufficient ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600"
              }`}
            >
              {wordCount} kata {isWordCountSufficient ? "(Memenuhi syarat min. 250 kata)" : "(Kurang dari 250 kata)"}
            </span>
          </div>
          <OpiniRichTextEditor
            value={isiLengkapHtml}
            onChange={(html, text) => {
              setIsiLengkapHtml(html);
              setIsiLengkapText(text);
            }}
            placeholder="Tuliskan gagasan, pemikiran, atau opini Anda secara runtut dan rapi..."
            disabled={loading}
          />
          <textarea
            id="isi_lengkap"
            name="isi_lengkap"
            value={isiLengkapHtml}
            onChange={(e) => {
              const val = e.target.value;
              setIsiLengkapHtml(val);
              const plain = val.replace(/<[^>]*>/g, " ");
              setIsiLengkapText(plain);
            }}
            className="sr-only"
            tabIndex={-1}
            aria-hidden="true"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="gambar_sampul" className="text-xs font-semibold text-foreground">
            Foto Sampul / Ilustrasi Pendukung (Opsional, Maks 3MB)
          </label>
          <Input
            id="gambar_sampul"
            name="gambar_sampul"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="h-10 text-sm sm:h-8 sm:text-xs"
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full rounded-full h-11 text-sm font-semibold"
      >
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin mr-2" /> Mengirimkan ke Meja Redaksi...
          </>
        ) : (
          "Kirim Naskah ke Meja Redaksi"
        )}
      </Button>
    </form>
  );
}
