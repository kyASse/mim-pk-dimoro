"use client";

import { useRef, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Network, Plus, Save, Sparkles, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { saveStrukturOrganisasiAction } from "@/app/admin/konten/actions";
import { ImageUploader } from "./ImageUploader";
import type {
  PersonilOrganisasi,
  SlotJabatan,
  StrukturOrganisasiContent,
} from "@/lib/types/content";

interface TabStrukturOrganisasiProps {
  initialData: StrukturOrganisasiContent;
}

type SlotArrayGroupKey =
  | "administrasi"
  | "penunjang"
  | "wali_kelas"
  | "guru_mapel";

interface SlotArrayGroupConfig {
  key: SlotArrayGroupKey;
  title: string;
  description: string;
  addLabel: string;
  jabatanPlaceholder: string;
}

const SLOT_ARRAY_GROUPS: readonly SlotArrayGroupConfig[] = [
  {
    key: "administrasi",
    title: "Administrasi",
    description: "Staf tata usaha, bendahara, dan layanan administrasi madrasah.",
    addLabel: "Tambah Administrasi",
    jabatanPlaceholder: "Tata Usaha / Bendahara",
  },
  {
    key: "penunjang",
    title: "Penunjang",
    description: "Unit pendukung operasional seperti koperasi siswa dan penjaga sekolah.",
    addLabel: "Tambah Penunjang",
    jabatanPlaceholder: "Koor. Kop. Siswa / Penjaga Sekolah",
  },
  {
    key: "wali_kelas",
    title: "Wali Kelas",
    description: "Wali kelas rombongan belajar kelas I sampai kelas VI.",
    addLabel: "Tambah Wali Kelas",
    jabatanPlaceholder: "Wali Kelas I A",
  },
  {
    key: "guru_mapel",
    title: "Guru Mapel",
    description: "Daftar guru mata pelajaran dan guru pendamping.",
    addLabel: "Tambah Guru Mapel",
    jabatanPlaceholder: "Guru Mapel",
  },
];

const SELECT_CLASS_NAME =
  "flex h-10 text-sm sm:h-8 sm:text-xs w-full rounded-md border border-input bg-background px-3 py-1 shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring";

function clearPersonilFromSlot(
  slot: SlotJabatan,
  personilId: string
): { slot: SlotJabatan; cleared: number } {
  let cleared = 0;
  let nextPersonilId = slot.personil_id;

  if (nextPersonilId === personilId) {
    nextPersonilId = "";
    cleared += 1;
  }

  let nextSubUnit = slot.sub_unit;
  if (slot.sub_unit && slot.sub_unit.personil_id === personilId) {
    nextSubUnit = { ...slot.sub_unit, personil_id: "" };
    cleared += 1;
  }

  if (nextPersonilId === slot.personil_id && nextSubUnit === slot.sub_unit) {
    return { slot, cleared: 0 };
  }

  return {
    slot: {
      ...slot,
      personil_id: nextPersonilId,
      ...(slot.sub_unit !== undefined ? { sub_unit: nextSubUnit } : {}),
    },
    cleared,
  };
}

function clearPersonilFromSlotList(
  slots: SlotJabatan[],
  personilId: string
): { slots: SlotJabatan[]; cleared: number } {
  let cleared = 0;
  const nextSlots = slots.map((slot) => {
    const res = clearPersonilFromSlot(slot, personilId);
    cleared += res.cleared;
    return res.slot;
  });
  return { slots: nextSlots, cleared };
}

function removePersonilAndClearSlots(
  prev: StrukturOrganisasiContent,
  personilId: string
): { nextContent: StrukturOrganisasiContent; clearedCount: number } {
  const komiteRes = clearPersonilFromSlot(prev.komite, personilId);
  const kamadRes = clearPersonilFromSlot(prev.kamad, personilId);
  const adminRes = clearPersonilFromSlotList(prev.administrasi, personilId);
  const wakaRes = clearPersonilFromSlotList(prev.waka, personilId);
  const penunjangRes = clearPersonilFromSlotList(prev.penunjang, personilId);
  const waliKelasRes = clearPersonilFromSlotList(prev.wali_kelas, personilId);
  const guruMapelRes = clearPersonilFromSlotList(prev.guru_mapel, personilId);

  const clearedCount =
    komiteRes.cleared +
    kamadRes.cleared +
    adminRes.cleared +
    wakaRes.cleared +
    penunjangRes.cleared +
    waliKelasRes.cleared +
    guruMapelRes.cleared;

  return {
    nextContent: {
      ...prev,
      personil: prev.personil.filter((p) => p.id !== personilId),
      komite: komiteRes.slot,
      kamad: kamadRes.slot,
      administrasi: adminRes.slots,
      waka: wakaRes.slots,
      penunjang: penunjangRes.slots,
      wali_kelas: waliKelasRes.slots,
      guru_mapel: guruMapelRes.slots,
    },
    clearedCount,
  };
}

interface SlotFieldsProps {
  slot: SlotJabatan;
  personilList: PersonilOrganisasi[];
  idPrefix: string;
  jabatanLabel?: string;
  holderLabel?: string;
  jabatanPlaceholder?: string;
  onChangeJabatan: (value: string) => void;
  onChangePersonilId: (value: string) => void;
}

function SlotFields({
  slot,
  personilList,
  idPrefix,
  jabatanLabel = "Nama Jabatan",
  holderLabel = "Pemegang Jabatan",
  jabatanPlaceholder = "Nama jabatan...",
  onChangeJabatan,
  onChangePersonilId,
}: SlotFieldsProps) {
  const jabatanInputId = `${idPrefix}-jabatan-${slot.id}`;
  const holderSelectId = `${idPrefix}-personil-${slot.id}`;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <div className="space-y-1.5">
        <Label
          htmlFor={jabatanInputId}
          className="text-xs font-semibold text-foreground/80"
        >
          {jabatanLabel}
        </Label>
        <Input
          id={jabatanInputId}
          value={slot.jabatan}
          onChange={(e) => onChangeJabatan(e.target.value)}
          placeholder={jabatanPlaceholder}
          className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
        />
      </div>

      <div className="space-y-1.5">
        <Label
          htmlFor={holderSelectId}
          className="text-xs font-semibold text-foreground/80"
        >
          {holderLabel}
        </Label>
        <select
          id={holderSelectId}
          value={slot.personil_id}
          onChange={(e) => onChangePersonilId(e.target.value)}
          className={SELECT_CLASS_NAME}
        >
          <option value="">-- Belum Ditentukan --</option>
          {personilList.map((person) => (
            <option key={person.id} value={person.id}>
              {person.nama.trim() || "Personil Tanpa Nama"}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

/**
 * Editor CMS admin untuk halaman publik /struktur-organisasi.
 * Mengelola metadata header, direktori personil (Bagian A), dan slot jabatan (Bagian B).
 */
export function TabStrukturOrganisasi({ initialData }: TabStrukturOrganisasiProps) {
  const [content, setContent] = useState<StrukturOrganisasiContent>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const nextIdCounterRef = useRef(1);

  const createUniqueId = (prefix: string): string => {
    const seq = nextIdCounterRef.current++;
    return `${prefix}-${Date.now()}-${seq}`;
  };

  // -------------------------------------------------------------
  // 1. HEADER & METADATA HANDLERS
  // -------------------------------------------------------------
  const handleHeroChange = (
    field: keyof StrukturOrganisasiContent["hero"],
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: value },
    }));
  };

  // -------------------------------------------------------------
  // 2. BAGIAN A: DIREKTORI PERSONIL HANDLERS
  // -------------------------------------------------------------
  const handleAddPersonil = () => {
    const newPersonil: PersonilOrganisasi = {
      id: createUniqueId("personil"),
      nama: "",
      foto_url: "",
      gender: "P",
    };

    setContent((prev) => ({
      ...prev,
      personil: [...prev.personil, newPersonil],
    }));
  };

  const handleUpdatePersonil = <K extends keyof PersonilOrganisasi>(
    personilId: string,
    field: K,
    value: PersonilOrganisasi[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      personil: prev.personil.map((person) =>
        person.id === personilId ? { ...person, [field]: value } : person
      ),
    }));
  };

  const handleRemovePersonil = (personilId: string) => {
    const { nextContent, clearedCount } = removePersonilAndClearSlots(
      content,
      personilId
    );
    setContent(nextContent);

    if (clearedCount > 0) {
      toast.info(
        `Profil dihapus dan ${clearedCount} slot jabatan yang terkait telah dikosongkan.`
      );
    }
  };

  // -------------------------------------------------------------
  // 3. BAGIAN B: SLOT JABATAN HANDLERS
  // -------------------------------------------------------------
  const handleUpdateSingletonSlot = (
    key: "komite" | "kamad",
    field: "jabatan" | "personil_id",
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: value },
    }));
  };

  const handleAddArraySlot = (key: SlotArrayGroupKey | "waka", defaultJabatan: string) => {
    const newSlot: SlotJabatan = {
      id: createUniqueId(key),
      jabatan: defaultJabatan,
      personil_id: "",
      ...(key === "waka" ? { sub_unit: null } : {}),
    };

    setContent((prev) => ({
      ...prev,
      [key]: [...prev[key], newSlot],
    }));
  };

  const handleUpdateArraySlot = (
    key: SlotArrayGroupKey | "waka",
    slotId: string,
    field: "jabatan" | "personil_id",
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: prev[key].map((slot) =>
        slot.id === slotId ? { ...slot, [field]: value } : slot
      ),
    }));
  };

  const handleRemoveArraySlot = (
    key: SlotArrayGroupKey | "waka",
    slotId: string
  ) => {
    setContent((prev) => ({
      ...prev,
      [key]: prev[key].filter((slot) => slot.id !== slotId),
    }));
  };

  const handleToggleWakaSubUnit = (slotId: string, enable: boolean) => {
    setContent((prev) => ({
      ...prev,
      waka: prev.waka.map((slot) => {
        if (slot.id !== slotId) return slot;
        return {
          ...slot,
          sub_unit: enable
            ? {
                id: createUniqueId("sub-unit"),
                jabatan: "",
                personil_id: "",
              }
            : null,
        };
      }),
    }));
  };

  const handleUpdateWakaSubUnit = (
    slotId: string,
    field: "jabatan" | "personil_id",
    value: string
  ) => {
    setContent((prev) => ({
      ...prev,
      waka: prev.waka.map((slot) => {
        if (slot.id !== slotId || !slot.sub_unit) return slot;
        return {
          ...slot,
          sub_unit: { ...slot.sub_unit, [field]: value },
        };
      }),
    }));
  };

  // -------------------------------------------------------------
  // 4. SAVE HANDLER
  // -------------------------------------------------------------
  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading("Menyimpan perubahan Struktur Organisasi...");

    try {
      const res = await saveStrukturOrganisasiAction(content);
      if (!res.success) {
        throw new Error(res.message || "Gagal menyimpan konten Struktur Organisasi");
      }
      toast.success(
        res.message || "Konten Struktur Organisasi berhasil diperbarui!",
        { id: toastId }
      );
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Terjadi kesalahan sistem";
      console.error("[TabStrukturOrganisasi] Save error:", err);
      toast.error(`Gagal: ${message}`, { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. HEADER & METADATA */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Sparkles className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Header &amp; Metadata Halaman
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Judul halaman publik, tahun ajaran aktif, dan label kelompok bagan terbawah.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="struktur-hero-badge"
                className="text-xs font-semibold text-foreground/80"
              >
                Badge Header
              </Label>
              <Input
                id="struktur-hero-badge"
                value={content.hero.badge}
                onChange={(e) => handleHeroChange("badge", e.target.value)}
                placeholder="Struktur Kepemimpinan & Pendidik"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="struktur-hero-tahun-ajaran"
                className="text-xs font-semibold text-foreground/80"
              >
                Tahun Ajaran
              </Label>
              <Input
                id="struktur-hero-tahun-ajaran"
                value={content.hero.tahun_ajaran}
                onChange={(e) => handleHeroChange("tahun_ajaran", e.target.value)}
                placeholder="Tahun Ajaran 2026/2027"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="struktur-hero-judul"
              className="text-xs font-semibold text-foreground/80"
            >
              Judul Halaman
            </Label>
            <Input
              id="struktur-hero-judul"
              value={content.hero.judul}
              onChange={(e) => handleHeroChange("judul", e.target.value)}
              placeholder="Struktur Organisasi MI Muhammadiyah Dimoro"
              className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="struktur-hero-subjudul"
              className="text-xs font-semibold text-foreground/80"
            >
              Subjudul / Deskripsi
            </Label>
            <Textarea
              id="struktur-hero-subjudul"
              rows={2}
              value={content.hero.subjudul}
              onChange={(e) => handleHeroChange("subjudul", e.target.value)}
              placeholder="Susunan pimpinan, wali kelas, dewan guru, dan tenaga kependidikan..."
              className="text-sm sm:text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <Label
                htmlFor="struktur-dewan-guru-label"
                className="text-xs font-semibold text-foreground/80"
              >
                Label Dewan Guru
              </Label>
              <Input
                id="struktur-dewan-guru-label"
                value={content.dewan_guru_label}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    dewan_guru_label: e.target.value,
                  }))
                }
                placeholder="Dewan Guru"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="struktur-siswa-label"
                className="text-xs font-semibold text-foreground/80"
              >
                Label Siswa
              </Label>
              <Input
                id="struktur-siswa-label"
                value={content.siswa_label}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    siswa_label: e.target.value,
                  }))
                }
                placeholder="Siswa"
                className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. BAGIAN A — DIREKTORI PROFIL GURU & STAF */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Users className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div className="space-y-1 min-w-0 flex-1">
                <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                  Bagian A — Direktori Profil Guru &amp; Staf ({content.personil.length})
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Kelola daftar personil unik beserta foto profil. Satu personil dapat ditugaskan ke lebih dari satu jabatan di Bagian B.
                </CardDescription>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddPersonil}
              className="h-9 sm:h-8 text-xs border-border/80 hover:bg-muted/50 shrink-0 self-start sm:self-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1.5" />
              Tambah Guru/Staf
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6">
          {content.personil.length === 0 ? (
            <div className="p-6 text-center rounded-xl border border-dashed border-border/70 bg-muted/10 text-xs text-muted-foreground">
              Belum ada profil guru/staf. Klik &ldquo;Tambah Guru/Staf&rdquo; untuk menambahkan personil baru.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.personil.map((person, idx) => {
                const namaId = `personil-nama-${person.id}`;
                const genderId = `personil-gender-${person.id}`;
                const displayName = person.nama.trim() || `#${idx + 1}`;

                return (
                  <div
                    key={person.id}
                    className="p-4 rounded-xl border border-border/70 bg-muted/15 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2 pb-2 border-b border-border/50">
                      <span className="text-xs font-bold text-foreground truncate">
                        Personil #{idx + 1}
                        {person.nama.trim() ? ` — ${person.nama.trim()}` : ""}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        aria-label={`Hapus personil ${displayName}`}
                        onClick={() => handleRemovePersonil(person.id)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                      <div className="sm:col-span-5">
                        <ImageUploader
                          label={`Foto ${displayName}`}
                          value={person.foto_url}
                          onChange={(url) =>
                            handleUpdatePersonil(person.id, "foto_url", url)
                          }
                          folder="struktur-organisasi"
                          aspectRatio="square"
                        />
                      </div>

                      <div className="sm:col-span-7 space-y-3">
                        <div className="space-y-1.5">
                          <Label
                            htmlFor={namaId}
                            className="text-xs font-semibold text-foreground/80"
                          >
                            Nama Lengkap
                          </Label>
                          <Input
                            id={namaId}
                            value={person.nama}
                            onChange={(e) =>
                              handleUpdatePersonil(person.id, "nama", e.target.value)
                            }
                            placeholder="Nama & gelar pendidik..."
                            className="h-10 text-sm sm:h-8 sm:text-xs font-medium"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <Label
                            htmlFor={genderId}
                            className="text-xs font-semibold text-foreground/80"
                          >
                            Jenis Kelamin
                          </Label>
                          <select
                            id={genderId}
                            value={person.gender ?? "P"}
                            onChange={(e) =>
                              handleUpdatePersonil(
                                person.id,
                                "gender",
                                e.target.value as "L" | "P"
                              )
                            }
                            className={SELECT_CLASS_NAME}
                          >
                            <option value="P">Perempuan (P)</option>
                            <option value="L">Laki-laki (L)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. BAGIAN B — SUSUNAN JABATAN & BAGAN */}
      <Card className="border-border/80 bg-card shadow-xs rounded-2xl overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-border/60 bg-muted/30 dark:bg-muted/15">
          <div className="flex items-start gap-3.5 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
              <Network className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
            </div>
            <div className="space-y-1 min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg font-bold text-foreground leading-snug">
                Bagian B — Susunan Jabatan &amp; Bagan
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Atur penugasan setiap jabatan struktural dengan memilih profil personil dari Bagian A.
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-8">
          {/* B.1 Pimpinan & Komite */}
          <section className="space-y-3" aria-labelledby="heading-pimpinan-komite">
            <div>
              <h3
                id="heading-pimpinan-komite"
                className="text-sm font-bold text-foreground"
              >
                Pimpinan &amp; Komite
              </h3>
              <p className="text-xs text-muted-foreground">
                Jabatan puncak struktur organisasi madrasah.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                data-slot-card={content.komite.id}
                className="p-4 rounded-xl border border-border/70 bg-muted/15 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground">
                    Komite Madrasah
                  </span>
                  {!content.komite.personil_id && (
                    <Badge variant="outline" className="text-[10px]">
                      Belum Ditentukan
                    </Badge>
                  )}
                </div>
                <SlotFields
                  slot={content.komite}
                  personilList={content.personil}
                  idPrefix="komite"
                  jabatanPlaceholder="Komite Madrasah"
                  onChangeJabatan={(val) =>
                    handleUpdateSingletonSlot("komite", "jabatan", val)
                  }
                  onChangePersonilId={(val) =>
                    handleUpdateSingletonSlot("komite", "personil_id", val)
                  }
                />
              </div>

              <div
                data-slot-card={content.kamad.id}
                className="p-4 rounded-xl border border-border/70 bg-muted/15 space-y-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground">
                    Kepala Madrasah
                  </span>
                  {!content.kamad.personil_id && (
                    <Badge variant="outline" className="text-[10px]">
                      Belum Ditentukan
                    </Badge>
                  )}
                </div>
                <SlotFields
                  slot={content.kamad}
                  personilList={content.personil}
                  idPrefix="kamad"
                  jabatanPlaceholder="Kepala Madrasah (Kamad)"
                  onChangeJabatan={(val) =>
                    handleUpdateSingletonSlot("kamad", "jabatan", val)
                  }
                  onChangePersonilId={(val) =>
                    handleUpdateSingletonSlot("kamad", "personil_id", val)
                  }
                />
              </div>
            </div>
          </section>

          {/* B.2 Administrasi */}
          {SLOT_ARRAY_GROUPS.slice(0, 1).map((group) => (
            <SlotListGroupSection
              key={group.key}
              group={group}
              slots={content[group.key]}
              personilList={content.personil}
              onAdd={() => handleAddArraySlot(group.key, "")}
              onUpdate={(slotId, field, value) =>
                handleUpdateArraySlot(group.key, slotId, field, value)
              }
              onRemove={(slotId) => handleRemoveArraySlot(group.key, slotId)}
            />
          ))}

          {/* B.3 Wakil Kepala & Sub-Unit */}
          <section
            className="space-y-3 pt-6 border-t border-border/60"
            aria-labelledby="heading-waka"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 id="heading-waka" className="text-sm font-bold text-foreground">
                  Wakil Kepala &amp; Sub-Unit ({content.waka.length})
                </h3>
                <p className="text-xs text-muted-foreground">
                  Wakil kepala madrasah beserta unit turunan opsional di bawahnya.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleAddArraySlot("waka", "")}
                className="h-8 sm:h-7 text-xs border-border/80 hover:bg-muted/50 self-start sm:self-center"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                Tambah Waka
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.waka.map((slot, idx) => (
                <div
                  key={slot.id}
                  data-slot-card={slot.id}
                  className="p-4 rounded-xl border border-border/70 bg-muted/15 space-y-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-xs font-bold text-foreground truncate">
                        Waka #{idx + 1}
                      </span>
                      {!slot.personil_id && (
                        <Badge variant="outline" className="text-[10px]">
                          Belum Ditentukan
                        </Badge>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Hapus slot ${slot.jabatan || `Waka #${idx + 1}`}`}
                      onClick={() => handleRemoveArraySlot("waka", slot.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <SlotFields
                    slot={slot}
                    personilList={content.personil}
                    idPrefix="waka"
                    jabatanPlaceholder="Waka Kurikulum"
                    onChangeJabatan={(val) =>
                      handleUpdateArraySlot("waka", slot.id, "jabatan", val)
                    }
                    onChangePersonilId={(val) =>
                      handleUpdateArraySlot("waka", slot.id, "personil_id", val)
                    }
                  />

                  <div className="pt-3 border-t border-border/50">
                    {slot.sub_unit ? (
                      <div className="p-3 rounded-lg border border-border/60 bg-background/70 space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                            Sub-Unit Turunan
                          </span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            aria-label={`Hapus sub-unit ${slot.jabatan || `Waka #${idx + 1}`}`}
                            onClick={() => handleToggleWakaSubUnit(slot.id, false)}
                            className="h-7 px-2 text-xs text-muted-foreground hover:text-red-600"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            Hapus Sub-Unit
                          </Button>
                        </div>

                        <SlotFields
                          slot={slot.sub_unit}
                          personilList={content.personil}
                          idPrefix={`subunit-${slot.id}`}
                          jabatanLabel="Jabatan Sub-Unit"
                          holderLabel="Pemegang Jabatan Sub-Unit"
                          jabatanPlaceholder="Koord. Perpus / Guru BP"
                          onChangeJabatan={(val) =>
                            handleUpdateWakaSubUnit(slot.id, "jabatan", val)
                          }
                          onChangePersonilId={(val) =>
                            handleUpdateWakaSubUnit(slot.id, "personil_id", val)
                          }
                        />
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleWakaSubUnit(slot.id, true)}
                        className="h-8 sm:h-7 text-xs border-dashed border-border/80 hover:bg-muted/50"
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Tambah Sub-Unit
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* B.4 Penunjang, B.5 Wali Kelas, B.6 Guru Mapel */}
          {SLOT_ARRAY_GROUPS.slice(1).map((group) => (
            <SlotListGroupSection
              key={group.key}
              group={group}
              slots={content[group.key]}
              personilList={content.personil}
              onAdd={() => handleAddArraySlot(group.key, "")}
              onUpdate={(slotId, field, value) =>
                handleUpdateArraySlot(group.key, slotId, field, value)
              }
              onRemove={(slotId) => handleRemoveArraySlot(group.key, slotId)}
            />
          ))}
        </CardContent>
      </Card>

      {/* PRIMARY SAVE ACTION */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-6 h-10 shadow-sm"
        >
          {isSaving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Simpan Struktur Organisasi
        </Button>
      </div>
    </div>
  );
}

interface SlotListGroupSectionProps {
  group: SlotArrayGroupConfig;
  slots: SlotJabatan[];
  personilList: PersonilOrganisasi[];
  onAdd: () => void;
  onUpdate: (
    slotId: string,
    field: "jabatan" | "personil_id",
    value: string
  ) => void;
  onRemove: (slotId: string) => void;
}

function SlotListGroupSection({
  group,
  slots,
  personilList,
  onAdd,
  onUpdate,
  onRemove,
}: SlotListGroupSectionProps) {
  const headingId = `heading-${group.key}`;

  return (
    <section
      className="space-y-3 pt-6 border-t border-border/60"
      aria-labelledby={headingId}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 id={headingId} className="text-sm font-bold text-foreground">
            {group.title} ({slots.length})
          </h3>
          <p className="text-xs text-muted-foreground">{group.description}</p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          className="h-8 sm:h-7 text-xs border-border/80 hover:bg-muted/50 self-start sm:self-center"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          {group.addLabel}
        </Button>
      </div>

      {slots.length === 0 ? (
        <div className="p-4 text-center rounded-xl border border-dashed border-border/70 bg-muted/10 text-xs text-muted-foreground">
          Belum ada slot pada kelompok {group.title}.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map((slot, idx) => (
            <div
              key={slot.id}
              data-slot-card={slot.id}
              className="p-4 rounded-xl border border-border/70 bg-muted/15 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-foreground truncate">
                    {group.title} #{idx + 1}
                  </span>
                  {!slot.personil_id && (
                    <Badge variant="outline" className="text-[10px]">
                      Belum Ditentukan
                    </Badge>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  aria-label={`Hapus slot ${slot.jabatan || `${group.title} #${idx + 1}`}`}
                  onClick={() => onRemove(slot.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600 shrink-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <SlotFields
                slot={slot}
                personilList={personilList}
                idPrefix={group.key}
                jabatanPlaceholder={group.jabatanPlaceholder}
                onChangeJabatan={(val) => onUpdate(slot.id, "jabatan", val)}
                onChangePersonilId={(val) =>
                  onUpdate(slot.id, "personil_id", val)
                }
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
