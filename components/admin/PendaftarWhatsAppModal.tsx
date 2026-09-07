"use client";

import { useState, useMemo } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  MessageCircle, 
  Calendar, 
  FileCheck, 
  GraduationCap, 
  Copy, 
  Check, 
  ExternalLink,
  Users,
  CheckCircle2,
  Clock
} from "lucide-react";
import { SCHOOL_NAME } from "@/lib/school-config";

export interface WhatsAppRecipient {
  id: string;
  nama_lengkap: string | null;
  nama_ayah_kandung?: string | null;
  nomor_telepon?: string | null;
  status_pendaftaran?: string | null;
  regId?: string;
}

interface PendaftarWhatsAppModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipients: WhatsAppRecipient[];
}

export type TemplateType = "observasi" | "berkas" | "kelulusan";

function formatPhoneNumber(phone?: string | null): string {
  if (!phone) return "";
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "62" + cleaned.slice(1);
  }
  if (cleaned.startsWith("62")) {
    return cleaned;
  }
  return "62" + cleaned;
}

export default function PendaftarWhatsAppModal({
  open,
  onOpenChange,
  recipients,
}: PendaftarWhatsAppModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("observasi");
  const [copied, setCopied] = useState(false);
  const [sentIds, setSentIds] = useState<Set<string>>(new Set());

  // Template form states
  const [tanggalTes, setTanggalTes] = useState("Sabtu, 28 Agustus 2026");
  const [waktuTes, setWaktuTes] = useState("08.00 - 10.30 WIB");
  const [lokasiTes, setLokasiTes] = useState(`Kampus ${SCHOOL_NAME}`);
  const [catatanBerkas, setCatatanBerkas] = useState(
    "Fotokopi Akta Kelahiran dan Kartu Keluarga belum terunggah dengan jelas."
  );

  // Active recipient for preview
  const primaryRecipient = recipients[0] || {
    id: "sample",
    nama_lengkap: "Ananda Calon Siswa",
    nama_ayah_kandung: "Bapak/Ibu Orang Tua",
    nomor_telepon: "081234567890",
    regId: "MIM-2026-001",
  };

  // Generate message text based on template
  const generateMessage = (recipient: WhatsAppRecipient): string => {
    const studentName = recipient.nama_lengkap || "(Nama Siswa)";
    const parentName = recipient.nama_ayah_kandung ? `Bapak/Ibu ${recipient.nama_ayah_kandung}` : "Bapak/Ibu Orang Tua";
    const regId = recipient.regId ? ` (${recipient.regId})` : "";

    switch (selectedTemplate) {
      case "observasi":
        return `Assalamu’alaikum Wr. Wb.
Yth. ${parentName} dari Ananda *${studentName}*${regId},

Kami menginformasikan jadwal *Tes Observasi & Wawancara Calon Siswa Baru* ${SCHOOL_NAME}:
📅 Tanggal: ${tanggalTes}
⏰ Waktu: ${waktuTes}
📍 Tempat: ${lokasiTes}

Mohon hadir tepat waktu dan mendampingi ananda.
Wassalamu’alaikum Wr. Wb.
Panitia PPDB ${SCHOOL_NAME}`;

      case "berkas":
        return `Assalamu’alaikum Wr. Wb.
Yth. ${parentName} dari Ananda *${studentName}*${regId},

Terima kasih telah mendaftar di ${SCHOOL_NAME}. Berdasarkan verifikasi awal tim panitia PPDB, terdapat dokumen yang perlu dilengkapi/diperbarui:
📝 Catatan: ${catatanBerkas}

Bapak/Ibu dapat memperbarui berkas melalui portal pendaftaran online atau menyerahkannya langsung ke kantor madrasah.
Wassalamu’alaikum Wr. Wb.
Panitia PPDB ${SCHOOL_NAME}`;

      case "kelulusan":
        return `Assalamu’alaikum Wr. Wb.
Alhamdulillah, kami mengucapkan SELAMAT kepada Ananda *${studentName}*${regId} yang telah dinyatakan *DITERIMA* sebagai Peserta Didik Baru di ${SCHOOL_NAME} Tahun Ajaran 2026/2027.

Tahap selanjutnya adalah proses daftar ulang dan pengukuran seragam madrasah. Rincian administrasi dapat diakses melalui portal wali murid.
Wassalamu’alaikum Wr. Wb.
Panitia PPDB ${SCHOOL_NAME}`;

      default:
        return "";
    }
  };

  const previewMessage = useMemo(() => {
    return generateMessage(primaryRecipient);
  }, [selectedTemplate, primaryRecipient, tanggalTes, waktuTes, lokasiTes, catatanBerkas]);

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(previewMessage);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin pesan:", err);
    }
  };

  const handleSendSingle = (recipient: WhatsAppRecipient) => {
    const rawPhone = recipient.nomor_telepon;
    if (!rawPhone) return;

    const formattedPhone = formatPhoneNumber(rawPhone);
    const message = generateMessage(recipient);
    const encoded = encodeURIComponent(message);
    const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = isMobile
      ? `https://wa.me/${formattedPhone}?text=${encoded}`
      : `https://web.whatsapp.com/send?phone=${formattedPhone}&text=${encoded}`;

    window.open(url, "_blank", "noopener,noreferrer");

    setSentIds((prev) => {
      const next = new Set(prev);
      next.add(recipient.id);
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <MessageCircle className="h-5 w-5" />
            <DialogTitle className="text-xl font-bold">Kirim Pesan WhatsApp Cepat</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground">
            Pilih template pesan resmi untuk {recipients.length} kontak calon siswa baru terpilih.
          </DialogDescription>
        </DialogHeader>

        {/* Template Selector */}
        <div className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <button
              type="button"
              onClick={() => setSelectedTemplate("observasi")}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                selectedTemplate === "observasi"
                  ? "border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-300 font-semibold shadow-sm"
                  : "border-border hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <Calendar className="h-4 w-4 shrink-0 text-emerald-600" />
              <span className="text-xs sm:text-sm">Jadwal Tes Observasi</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate("berkas")}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                selectedTemplate === "berkas"
                  ? "border-amber-600 bg-amber-50/50 dark:bg-amber-950/20 text-amber-900 dark:text-amber-300 font-semibold shadow-sm"
                  : "border-border hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <FileCheck className="h-4 w-4 shrink-0 text-amber-600" />
              <span className="text-xs sm:text-sm">Konfirmasi Berkas</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTemplate("kelulusan")}
              className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                selectedTemplate === "kelulusan"
                  ? "border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 font-semibold shadow-sm"
                  : "border-border hover:bg-muted/40 text-muted-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4 shrink-0 text-blue-600" />
              <span className="text-xs sm:text-sm">Pengumuman Kelulusan</span>
            </button>
          </div>

          {/* Template Dynamic Inputs */}
          {selectedTemplate === "observasi" && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-lg border bg-muted/20 text-xs">
              <div className="space-y-1">
                <Label htmlFor="tgl-tes" className="text-xs font-medium">Tanggal Tes</Label>
                <Input
                  id="tgl-tes"
                  value={tanggalTes}
                  onChange={(e) => setTanggalTes(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="waktu-tes" className="text-xs font-medium">Waktu Tes</Label>
                <Input
                  id="waktu-tes"
                  value={waktuTes}
                  onChange={(e) => setWaktuTes(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="lokasi-tes" className="text-xs font-medium">Lokasi / Tempat</Label>
                <Input
                  id="lokasi-tes"
                  value={lokasiTes}
                  onChange={(e) => setLokasiTes(e.target.value)}
                  className="h-8 text-xs bg-background"
                />
              </div>
            </div>
          )}

          {selectedTemplate === "berkas" && (
            <div className="p-3.5 rounded-lg border bg-muted/20 text-xs space-y-1">
              <Label htmlFor="catatan-berkas" className="text-xs font-medium">Catatan Kelengkapan Berkas</Label>
              <Textarea
                id="catatan-berkas"
                value={catatanBerkas}
                onChange={(e) => setCatatanBerkas(e.target.value)}
                rows={2}
                className="text-xs bg-background resize-none"
              />
            </div>
          )}

          {/* Preview Card */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Pratinjau Pesan ({primaryRecipient.nama_lengkap})
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyText}
                className="h-7 text-xs gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copied ? "Tersalin!" : "Salin Teks Pesan"}</span>
              </Button>
            </div>
            <div className="p-3.5 rounded-lg border bg-emerald-50/40 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-200 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {previewMessage}
            </div>
          </div>

          {/* Recipient Queue Table */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-semibold text-foreground">
                  Antrean Pengiriman ({recipients.length} Kontak)
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                Terkirim: <span className="font-semibold text-emerald-600">{sentIds.size}</span> / {recipients.length}
              </span>
            </div>

            <div className="border rounded-lg overflow-hidden max-h-48 overflow-y-auto divide-y divide-border">
              {recipients.map((recipient) => {
                const isSent = sentIds.has(recipient.id);
                const hasPhone = Boolean(recipient.nomor_telepon);

                return (
                  <div
                    key={recipient.id}
                    className="p-2.5 flex items-center justify-between gap-3 text-xs hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground truncate">
                          {recipient.nama_lengkap || "Nama tidak tersedia"}
                        </span>
                        {recipient.regId && (
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {recipient.regId}
                          </span>
                        )}
                      </div>
                      <span className="text-muted-foreground text-[11px]">
                        {hasPhone ? recipient.nomor_telepon : "Nomor telepon tidak tersedia"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSent ? (
                        <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-[11px] gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Terkirim
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground text-[11px] gap-1">
                          <Clock className="h-3 w-3" />
                          Belum
                        </Badge>
                      )}

                      <Button
                        size="sm"
                        disabled={!hasPhone}
                        onClick={() => handleSendSingle(recipient)}
                        className={`h-7 px-2.5 text-xs font-medium gap-1 ${
                          isSent
                            ? "bg-muted text-muted-foreground hover:bg-muted/80"
                            : "bg-emerald-600 hover:bg-emerald-700 text-white"
                        }`}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        Kirim WA
                        <ExternalLink className="h-3 w-3 opacity-70" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="text-xs">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
