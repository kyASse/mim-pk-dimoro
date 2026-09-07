"use client";

import { useState, useRef, ChangeEvent } from "react";
import { FileText, Upload, Download, RefreshCw, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface DocumentUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  description?: string;
  defaultUrl?: string;
  disabled?: boolean;
}

export function DocumentUploader({
  label,
  value,
  onChange,
  description,
  defaultUrl = "/Formulir Pendaftaran MIM PK Dimoro.pdf",
  disabled = false,
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (file: File) => {
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      toast.error("Hanya file dokumen PDF yang diperbolehkan.");
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      toast.error("Ukuran file PDF maksimal 15MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Mengunggah dokumen PDF...");

    try {
      const supabase = createClient();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_");
      const fileName = `${Date.now()}_${sanitizedName}.pdf`;
      const filePath = `dokumen/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("konten-publik")
        .upload(filePath, file, {
          contentType: "application/pdf",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data: publicUrlData } = supabase.storage
        .from("konten-publik")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      onChange(publicUrl);
      toast.success("Dokumen PDF berhasil diunggah!", { id: toastId });
    } catch (err: any) {
      console.error("[DocumentUploader] Upload error:", err);
      toast.error(`Gagal mengunggah dokumen: ${err?.message || "Terjadi kesalahan"}`, {
        id: toastId,
      });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-3 p-4 border border-border/80 rounded-xl bg-muted/20 dark:bg-muted/10">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">{label}</Label>
        {defaultUrl && value && value !== defaultUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultUrl)}
            disabled={disabled || isUploading}
            className="h-7 text-xs text-muted-foreground hover:text-emerald-600 dark:hover:text-emerald-400 px-2"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset ke File Bawaan
          </Button>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={onFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-card border border-border/80 rounded-xl shadow-xs">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-1 ring-red-500/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {value ? value.split("/").pop() || "Formulir PDF" : "Belum ada dokumen"}
            </p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              Format PDF Siap Unduh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          {value && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              asChild
              className="h-9 text-xs border-border/80 hover:bg-muted/50"
            >
              <a href={value} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                Buka PDF
              </a>
            </Button>
          )}

          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="h-9 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
          >
            {isUploading ? (
              <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
            ) : (
              <Upload className="w-3.5 h-3.5 mr-1.5" />
            )}
            {value ? "Ganti File PDF" : "Unggah PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}
