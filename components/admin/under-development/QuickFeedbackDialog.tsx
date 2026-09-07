"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  MessageSquarePlus,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  QuickFeedbackDialogProps,
  FeedbackPayload,
  UnderDevPriority,
} from "./types";

const roleOptions = [
  "Kepala Sekolah",
  "Guru / Wali Kelas",
  "Tata Usaha / Admin",
  "Bendahara / Keuangan",
  "Tim IT / Developer",
  "Wali Murid",
  "Lainnya",
];

const categoryOptions = [
  { value: "fitur_baru", label: "Usulan Fitur Baru" },
  { value: "alur_kerja", label: "Peningkatan Alur Kerja / UX" },
  { value: "kendala", label: "Laporan Kendala / Bug" },
  { value: "pertanyaan", label: "Pertanyaan Teknis" },
];

const priorityOptions: {
  value: UnderDevPriority;
  label: string;
  badgeClass: string;
}[] = [
  {
    value: "low",
    label: "Rendah - Saran Tambahan",
    badgeClass: "text-slate-600 dark:text-slate-400",
  },
  {
    value: "medium",
    label: "Sedang - Optimalisasi Alur Kerja",
    badgeClass: "text-blue-600 dark:text-blue-400",
  },
  {
    value: "high",
    label: "Tinggi - Kebutuhan Utama",
    badgeClass: "text-amber-600 dark:text-amber-400",
  },
  {
    value: "urgent",
    label: "Mendesak - Kendala Kritis",
    badgeClass: "text-rose-600 dark:text-rose-400",
  },
];

export function QuickFeedbackDialog({
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  trigger,
  moduleName = "Modul Administrasi",
  defaultRole = "Tata Usaha / Admin",
  onSubmit,
  onSuccess,
  className,
}: QuickFeedbackDialogProps) {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : internalOpen;

  const handleOpenChange = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    controlledOnOpenChange?.(nextOpen);

    // Reset error on open
    if (nextOpen) {
      setError(null);
    }
  };

  const [role, setRole] = React.useState(defaultRole);
  const [category, setCategory] = React.useState("fitur_baru");
  const [priority, setPriority] = React.useState<UnderDevPriority>("medium");
  const [notes, setNotes] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const resetForm = () => {
    setRole(defaultRole);
    setCategory("fitur_baru");
    setPriority("medium");
    setNotes("");
    setError(null);
    setIsSubmitted(false);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!notes.trim()) {
      setError("Mohon tuliskan rincian masukan atau kebutuhan fitur Anda.");
      return;
    }

    setError(null);
    setIsSubmitting(true);

    const payload: FeedbackPayload = {
      role,
      category,
      notes: notes.trim(),
      priority,
      moduleName,
      timestamp: new Date().toISOString(),
    };

    try {
      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // Fallback simulation if no external handler is provided
        await new Promise((resolve) => setTimeout(resolve, 300));
      }

      setIsSubmitted(true);
      onSuccess?.();
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kendala saat mengirim masukan. Silakan coba kembali.";
      setError(
        message.includes("Terjadi kendala")
          ? message
          : `Terjadi kendala saat mengirim masukan: ${message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {!isControlled && (
        <DialogTrigger asChild>
          {trigger || (
            <Button
              variant="outline"
              size="sm"
              className="h-10 sm:h-8 gap-2 text-xs font-semibold border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 dark:text-emerald-400 dark:border-emerald-500/30 dark:hover:bg-emerald-950/40"
            >
              <MessageSquarePlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>Beri Masukan / Usulan Fitur</span>
            </Button>
          )}
        </DialogTrigger>
      )}

      <DialogContent
        className={cn(
          "w-full max-w-lg p-5 sm:p-6 overflow-hidden rounded-xl bg-background border shadow-lg",
          className
        )}
      >
        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader className="space-y-1.5 text-left">
              <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <Sparkles className="h-4 w-4" />
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold">
                  Beri Masukan & Usulan Fitur
                </DialogTitle>
              </div>
              <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
                Bantu kami menyempurnakan{" "}
                <span className="font-semibold text-foreground">
                  {moduleName}
                </span>{" "}
                sesuai alur kerja nyata di MIM PK Dimoro.
              </DialogDescription>
            </DialogHeader>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 p-3 text-xs text-rose-900 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
                <div className="leading-relaxed">{error}</div>
              </div>
            )}

            <div className="space-y-3.5 pt-1">
              {/* Role Selection */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="feedback-role"
                  className="text-xs font-semibold text-foreground"
                >
                  Peran Pengguna
                </Label>
                <select
                  id="feedback-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="h-10 sm:h-8 text-sm sm:text-xs w-full rounded-md border border-input bg-background px-3 py-1 text-foreground shadow-2xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-slate-800"
                >
                  {roleOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Selection */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="feedback-category"
                  className="text-xs font-semibold text-foreground"
                >
                  Kategori Masukan
                </Label>
                <select
                  id="feedback-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="h-10 sm:h-8 text-sm sm:text-xs w-full rounded-md border border-input bg-background px-3 py-1 text-foreground shadow-2xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-slate-800"
                >
                  {categoryOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority Selection */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="feedback-priority"
                  className="text-xs font-semibold text-foreground"
                >
                  Prioritas Usulan
                </Label>
                <select
                  id="feedback-priority"
                  value={priority}
                  onChange={(e) =>
                    setPriority(e.target.value as UnderDevPriority)
                  }
                  className="h-10 sm:h-8 text-sm sm:text-xs w-full rounded-md border border-input bg-background px-3 py-1 text-foreground shadow-2xs focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:border-slate-800"
                >
                  {priorityOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Feedback Notes */}
              <div className="space-y-1.5">
                <Label
                  htmlFor="feedback-notes"
                  className="text-xs font-semibold text-foreground"
                >
                  Rincian Masukan & Kebutuhan Fitur{" "}
                  <span className="text-rose-500">*</span>
                </Label>
                <Textarea
                  id="feedback-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tuliskan saran, ide perbaikan alur kerja, atau kebutuhan fitur baru Anda di sini..."
                  rows={4}
                  className="text-sm sm:text-xs resize-none bg-background focus-visible:ring-emerald-600"
                />
              </div>
            </div>

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end border-t border-border/80 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
                className="h-10 sm:h-8 text-xs"
              >
                Batal
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isSubmitting}
                className="h-10 sm:h-8 text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-xs"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    <span>Mengirim...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5 mr-1.5" />
                    <span>Kirim Masukan</span>
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          /* Success State View */
          <div className="py-4 text-center space-y-4">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-foreground">
                Masukan Berhasil Terkirim!
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed">
                Jazakumullah khairan atas kontribusi Anda. Setiap masukan dicatat
                langsung ke daftar prioritas rilis sistem madrasah.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={resetForm}
                className="h-10 sm:h-8 w-full sm:w-auto text-xs gap-1.5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Kirim Masukan Lain</span>
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={() => handleOpenChange(false)}
                className="h-10 sm:h-8 w-full sm:w-auto text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 shadow-xs"
              >
                Tutup
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default QuickFeedbackDialog;
