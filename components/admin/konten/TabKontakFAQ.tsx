"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  PhoneCall,
  HelpCircle,
  MapPin,
  Mail,
  Clock,
  Globe,
  Save,
  Loader2,
  Plus,
  Trash2,
  Edit2,
} from "lucide-react";
import { toast } from "sonner";
import { saveFAQListAction, saveKontakSekolahAction } from "@/app/admin/konten/actions";
import { FAQItem } from "@/lib/types/content";

interface KontakData {
  id?: number;
  alamat: string;
  whatsapp: string;
  email_utama: string;
  email_admin: string;
  jam_operasional: string;
  maps_embed_url?: string | null;
  facebook_url?: string | null;
  instagram_url?: string | null;
  youtube_url?: string | null;
}

interface TabKontakFAQProps {
  initialKontak: KontakData;
  initialFAQ: FAQItem[];
}

export function TabKontakFAQ({ initialKontak, initialFAQ }: TabKontakFAQProps) {
  const [kontak, setKontak] = useState<KontakData>(initialKontak);
  const [faqList, setFaqList] = useState<FAQItem[]>(initialFAQ);
  const [isSaving, setIsSaving] = useState(false);

  // Modal FAQ state
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem>>({
    question: "",
    answer: "",
    category: "Umum",
  });

  const handleOpenAddFaq = () => {
    setEditingFaq({
      id: `faq-${Date.now()}`,
      question: "",
      answer: "",
      category: "Umum",
    });
    setIsFaqModalOpen(true);
  };

  const handleOpenEditFaq = (item: FAQItem) => {
    setEditingFaq({ ...item });
    setIsFaqModalOpen(true);
  };

  const handleSaveFaqModal = () => {
    if (!editingFaq.question?.trim() || !editingFaq.answer?.trim()) {
      toast.error("Pertanyaan dan Jawaban wajib diisi!");
      return;
    }

    const item: FAQItem = {
      id: editingFaq.id || `faq-${Date.now()}`,
      question: editingFaq.question.trim(),
      answer: editingFaq.answer.trim(),
      category: editingFaq.category || "Umum",
    };

    setFaqList((prev) => {
      const exists = prev.some((f) => f.id === item.id);
      if (exists) {
        return prev.map((f) => (f.id === item.id ? item : f));
      }
      return [...prev, item];
    });

    setIsFaqModalOpen(false);
    toast.success("Item FAQ diperbarui dalam daftar!");
  };

  const handleRemoveFaq = (id: string) => {
    setFaqList((prev) => prev.filter((f) => f.id !== id));
    toast.success("Item FAQ dihapus dari daftar!");
  };

  const handleSaveAll = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan informasi Kontak & FAQ...");

    try {
      const [resKontak, resFaq] = await Promise.all([
        saveKontakSekolahAction(kontak),
        saveFAQListAction(faqList),
      ]);

      if (!resKontak.success || !resFaq.success) {
        throw new Error(resKontak.message || resFaq.message || "Gagal menyimpan");
      }

      toast.success("Kontak & FAQ berhasil disimpan!", { id: toastId });
    } catch (err: any) {
      toast.error(`Gagal: ${err?.message || "Terjadi kesalahan"}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. SEKSI INFORMASI KONTAK SEKOLAH */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-5 h-5 text-emerald-600" />
            <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
              Informasi Kontak & Jam Operasional
            </CardTitle>
          </div>
          <CardDescription className="text-xs sm:text-sm text-gray-500">
            Nomor telepon, WhatsApp, email, dan alamat kantor madrasah.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Nomor WhatsApp Resmi</Label>
              <Input
                value={kontak.whatsapp}
                onChange={(e) => setKontak({ ...kontak, whatsapp: e.target.value })}
                placeholder="6281234567890"
                className="h-10 text-sm sm:h-8 sm:text-xs font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Email Utama Madrasah</Label>
              <Input
                value={kontak.email_utama}
                onChange={(e) => setKontak({ ...kontak, email_utama: e.target.value })}
                placeholder="info@mimpkdimoro.sch.id"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Email Layanan Admin / TU</Label>
              <Input
                value={kontak.email_admin}
                onChange={(e) => setKontak({ ...kontak, email_admin: e.target.value })}
                placeholder="admin@mimpkdimoro.sch.id"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Jam Operasional Pelayanan</Label>
              <Input
                value={kontak.jam_operasional}
                onChange={(e) => setKontak({ ...kontak, jam_operasional: e.target.value })}
                placeholder="Senin - Kamis: 07:00 - 14:00 WIB | Jumat: 07:00 - 11:00 WIB"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Alamat Lengkap</Label>
              <Textarea
                rows={2}
                value={kontak.alamat}
                onChange={(e) => setKontak({ ...kontak, alamat: e.target.value })}
                className="text-sm sm:text-xs leading-relaxed"
                placeholder="Sudimoro, RT.003/RW.X, Parangjoro, Kec. Grogol, Kab. Sukoharjo, Jawa Tengah"
              />
            </div>

            <div className="sm:col-span-2 lg:col-span-3 space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">
                Google Maps Embed URL / Link iframe
              </Label>
              <Input
                value={kontak.maps_embed_url || ""}
                onChange={(e) => setKontak({ ...kontak, maps_embed_url: e.target.value })}
                placeholder="https://www.google.com/maps/embed?..."
                className="h-10 text-sm sm:h-8 sm:text-xs font-mono text-muted-foreground"
              />
            </div>

            {/* Media Sosial */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Instagram URL</Label>
              <Input
                value={kontak.instagram_url || ""}
                onChange={(e) => setKontak({ ...kontak, instagram_url: e.target.value })}
                placeholder="https://instagram.com/mim_pk_dimoro"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Facebook URL</Label>
              <Input
                value={kontak.facebook_url || ""}
                onChange={(e) => setKontak({ ...kontak, facebook_url: e.target.value })}
                placeholder="https://facebook.com/mimpkdimoro"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">YouTube Channel URL</Label>
              <Input
                value={kontak.youtube_url || ""}
                onChange={(e) => setKontak({ ...kontak, youtube_url: e.target.value })}
                placeholder="https://youtube.com/@mimpkdimoro"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. SEKSI KELOLA DAFTAR FAQ (TANYA JAWAB PUBLIK) */}
      <Card className="border-gray-200/80 shadow-sm">
        <CardHeader className="border-b border-gray-100 bg-gray-50/50 pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-emerald-600" />
                <CardTitle className="text-base sm:text-lg font-bold text-gray-900">
                  Daftar Pertanyaan Umum (FAQ) ({faqList.length} Pertanyaan)
                </CardTitle>
              </div>
              <CardDescription className="text-xs sm:text-sm text-gray-500 mt-1">
                Tanya jawab yang ditampilkan pada akordion halaman Kontak dan Informasi PPDB.
              </CardDescription>
            </div>
            <Button
              type="button"
              onClick={handleOpenAddFaq}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 font-medium shrink-0"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Tambah Pertanyaan FAQ
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-3">
            {faqList.map((faq, idx) => (
              <div
                key={faq.id || idx}
                className="p-4 rounded-xl border border-gray-200 bg-white shadow-xs space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-300">
                      #{idx + 1} {faq.category || "Umum"}
                    </Badge>
                    <h5 className="font-bold text-sm text-gray-900">{faq.question}</h5>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenEditFaq(faq)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-emerald-600"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFaq(faq.id)}
                      className="h-7 w-7 p-0 text-muted-foreground hover:text-red-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed pl-1 border-l-2 border-emerald-200">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Modal Dialog Add / Edit FAQ */}
      <Dialog open={isFaqModalOpen} onOpenChange={setIsFaqModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-gray-900">
              {editingFaq.question ? "Edit Pertanyaan FAQ" : "Tambah Pertanyaan FAQ"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Kategori</Label>
              <Input
                value={editingFaq.category || "Umum"}
                onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                placeholder="Umum / Pendaftaran / Kurikulum"
                className="h-10 text-sm sm:h-8 sm:text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Pertanyaan (Question)</Label>
              <Input
                value={editingFaq.question || ""}
                onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                placeholder="Apakah ada tes seleksi masuk di MIM PK Dimoro?"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-gray-700">Jawaban (Answer)</Label>
              <Textarea
                rows={4}
                value={editingFaq.answer || ""}
                onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                placeholder="Tidak ada tes seleksi akademik. Kami menerapkan observasi minat, bakat, dan kesiapan belajar anak..."
                className="text-sm sm:text-xs leading-relaxed"
              />
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsFaqModalOpen(false)}
              className="h-9 text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={handleSaveFaqModal}
              className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              Simpan ke Daftar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Desktop Save Bar */}
      <div className="hidden lg:flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={handleSaveAll}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-10 shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan Seluruh Kontak & FAQ
        </Button>
      </div>
    </div>
  );
}
