"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Search, 
  UserPlus, 
  Link as LinkIcon, 
  Unlink, 
  Check, 
  Loader2, 
  Mail, 
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  searchParentProfilesAction,
  linkExistingParentAccountAction,
  linkOrCreateParentAccountAction,
  unlinkParentAccountAction,
} from "@/app/admin/siswa/actions";

export interface SiswaLinkProps {
  id: string;
  nama_lengkap: string;
  profile_orang_tua_id?: string | null;
  parentProfile?: {
    id: string;
    nama_lengkap: string | null;
    email?: string | null;
  } | null;
}

interface LinkParentModalProps {
  siswa: SiswaLinkProps | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function LinkParentModal({
  siswa,
  open,
  onOpenChange,
  onSuccess,
}: LinkParentModalProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Create form state
  const [createEmail, setCreateEmail] = useState("");
  const [createNama, setCreateNama] = useState("");

  // Search effect
  useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setSearchResults([]);
      setCreateEmail("");
      setCreateNama("");
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchParentProfilesAction(searchQuery);
        if (res.success) {
          setSearchResults(res.data || []);
        }
      } catch (err) {
        console.error("Search parent profiles error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, open]);

  if (!siswa) return null;

  const handleLinkExisting = (parentId: string) => {
    startTransition(async () => {
      try {
        const res = await linkExistingParentAccountAction(siswa.id, parentId);
        if (res.success) {
          toast.success("Akun orang tua berhasil ditautkan");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.message || "Gagal menautkan akun");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  };

  const handleCreateAndLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createEmail) return;

    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.append("email", createEmail);
        if (createNama) fd.append("nama_lengkap", createNama);

        const res = await linkOrCreateParentAccountAction(siswa.id, fd);
        if (res.success) {
          toast.success("Akun orang tua berhasil dibuat dan ditautkan");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.message || "Gagal membuat akun");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  };

  const handleUnlink = () => {
    startTransition(async () => {
      try {
        const res = await unlinkParentAccountAction(siswa.id);
        if (res.success) {
          toast.success("Tautan akun orang tua berhasil diputuskan");
          onOpenChange(false);
          router.refresh();
          onSuccess?.();
        } else {
          toast.error(res.message || "Gagal memutuskan tautan");
        }
      } catch (err: any) {
        toast.error(err?.message || "Terjadi kesalahan");
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[92vw] sm:max-w-lg max-h-[85dvh] overflow-y-auto rounded-2xl p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <span>Hubungkan Akun Orang Tua</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Hubungkan akun portal wali murid untuk ananda{" "}
            <span className="font-semibold text-foreground">
              {siswa.nama_lengkap}
            </span>
            . Satu akun orang tua dapat terhubung ke lebih dari 1 siswa (anak kandung).
          </DialogDescription>
        </DialogHeader>

        {/* Current Linked Status */}
        {siswa.profile_orang_tua_id && (
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
              <div className="min-w-0">
                <p className="font-semibold text-emerald-900 dark:text-emerald-300">
                  Akun Wali Saat Ini Terhubung
                </p>
                <p className="text-emerald-700 dark:text-emerald-400 truncate">
                  {siswa.parentProfile?.nama_lengkap ||
                    siswa.parentProfile?.email ||
                    "ID: " + siswa.profile_orang_tua_id.slice(0, 8)}
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={handleUnlink}
              disabled={isPending}
              className="h-9 text-xs text-rose-600 border-rose-200 hover:bg-rose-50 gap-1 w-full sm:w-auto shrink-0"
            >
              {isPending ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Unlink className="h-3 w-3" />
              )}
              Putuskan Tautan
            </Button>
          </div>
        )}

        <Tabs defaultValue="search" className="w-full space-y-3.5 pt-1">
          <TabsList className="grid grid-cols-2 w-full h-11 p-1 bg-muted/60 rounded-xl border border-border/60">
            <TabsTrigger
              value="search"
              className="h-9 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <Search className="h-3.5 w-3.5 mr-1.5" />
              Cari Akun
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="h-9 text-xs font-semibold rounded-lg data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm"
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              Buat Akun Baru
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Search & Link Existing Parent (Multi-child) */}
          <TabsContent value="search" className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau email orang tua..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 text-sm sm:h-9 sm:text-xs"
              />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {isSearching ? (
                <div className="py-6 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  Mencari profil orang tua...
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((parent) => {
                  const isCurrent = parent.id === siswa.profile_orang_tua_id;
                  const childrenCount = parent.siswa?.length || 0;

                  return (
                    <div
                      key={parent.id}
                      className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-semibold text-foreground truncate">
                            {parent.nama_lengkap || "Wali Murid"}
                          </span>
                          {childrenCount > 0 && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] py-0 px-1.5 bg-blue-50 text-blue-700 border-blue-200"
                            >
                              {childrenCount} anak terhubung
                            </Badge>
                          )}
                        </div>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Mail className="h-3 w-3 shrink-0" />
                          <span className="truncate">{parent.email || "Email tidak tercatat"}</span>
                        </p>
                        {childrenCount > 0 && (
                          <p className="text-[11px] text-muted-foreground italic truncate">
                            Anak:{" "}
                            {parent.siswa
                              .map((s: any) => s.nama_lengkap)
                              .join(", ")}
                          </p>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant={isCurrent ? "secondary" : "default"}
                        disabled={isPending || isCurrent}
                        onClick={() => handleLinkExisting(parent.id)}
                        className="w-full sm:w-auto shrink-0 h-9 text-xs gap-1.5 font-medium"
                      >
                        {isCurrent ? (
                          <>
                            <Check className="h-3.5 w-3.5" /> Terhubung
                          </>
                        ) : (
                          <>
                            <LinkIcon className="h-3.5 w-3.5" /> Pilih Akun Ini
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-muted-foreground">
                  <AlertCircle className="h-6 w-6 mx-auto mb-1 opacity-40" />
                  <p>Tidak ditemukan akun orang tua.</p>
                  <p className="text-[11px] mt-0.5">
                    Gunakan tab &quot;Buat Akun Baru&quot; jika orang tua belum memiliki akun.
                  </p>
                </div>
              )}
            </div>
          </TabsContent>

          {/* TAB 2: Create New Parent Account */}
          <TabsContent value="create" className="space-y-3.5">
            <form onSubmit={handleCreateAndLink} className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="create-nama" className="text-xs">
                  Nama Lengkap Orang Tua (Opsional)
                </Label>
                <Input
                  id="create-nama"
                  placeholder="Contoh: Bambang Sutrisno, S.Pd."
                  value={createNama}
                  onChange={(e) => setCreateNama(e.target.value)}
                  className="h-10 text-sm sm:h-9 sm:text-xs"
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="create-email" className="text-xs">
                  Email Orang Tua <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="create-email"
                  type="email"
                  required
                  placeholder="orangtua@example.com"
                  value={createEmail}
                  onChange={(e) => setCreateEmail(e.target.value)}
                  className="h-10 text-sm sm:h-9 sm:text-xs"
                />
                <p className="text-[11px] text-muted-foreground">
                  Password awal akan otomatis diset dari tanggal lahir siswa (DDMMYYYY).
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="h-10 text-sm sm:h-8 sm:text-xs"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending || !createEmail}
                  className="h-10 text-sm sm:h-8 sm:text-xs gap-1.5 font-medium"
                >
                  {isPending && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  Buat & Tautkan Akun
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
