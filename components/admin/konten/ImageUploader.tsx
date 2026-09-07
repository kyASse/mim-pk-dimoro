"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import Image from "next/image";
import { Upload, X, RefreshCw, CheckCircle2, Image as ImageIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ImageUploaderProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  description?: string;
  folder?: string;
  aspectRatio?: "video" | "square" | "portrait" | "4/3";
  defaultUrl?: string;
  disabled?: boolean;
}

export function ImageUploader({
  label,
  value,
  onChange,
  description,
  folder = "konten",
  aspectRatio = "16/9" as any,
  defaultUrl,
  disabled = false,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compress image to WebP using HTML Canvas
  const compressToWebP = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const img = document.createElement("img");
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1920;
        const MAX_HEIGHT = 1080;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Gagal menginisialisasi canvas context"));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error("Konversi WebP gagal"));
            }
          },
          "image/webp",
          0.85
        );
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject(new Error("Gagal membaca file gambar"));
      };

      img.src = url;
    });
  };

  const handleUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Format tidak didukung. Harap pilih file gambar (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Ukuran file terlalu besar. Maksimal 10MB.");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading("Mengompresi & mengunggah gambar...");

    try {
      // 1. Kompresi gambar client-side ke WebP
      const compressedBlob = await compressToWebP(file);

      // 2. Unggah ke Supabase Storage konten-publik
      const supabase = createClient();
      const sanitizedName = file.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "_")
        .toLowerCase();
      const fileName = `${Date.now()}_${sanitizedName}.webp`;
      const filePath = `${folder}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("konten-publik")
        .upload(filePath, compressedBlob, {
          contentType: "image/webp",
          upsert: true,
        });

      if (uploadError) {
        throw uploadError;
      }

      // 3. Ambil URL Publik
      const { data: publicUrlData } = supabase.storage
        .from("konten-publik")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;
      onChange(publicUrl);
      toast.success("Gambar berhasil diunggah!", { id: toastId });
    } catch (err: any) {
      console.error("[ImageUploader] Upload error:", err);
      toast.error(`Gagal mengunggah gambar: ${err?.message || "Terjadi kesalahan"}`, {
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

  const onDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  };

  const onDragLeave = () => {
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case "video":
        return "aspect-video";
      case "square":
        return "aspect-square";
      case "portrait":
        return "aspect-[3/4]";
      case "4/3":
        return "aspect-[4/3]";
      default:
        return "aspect-video";
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-gray-800">{label}</Label>
        {defaultUrl && value && value !== defaultUrl && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onChange(defaultUrl)}
            disabled={disabled || isUploading}
            className="h-7 text-xs text-muted-foreground hover:text-emerald-600 px-2"
          >
            <RefreshCw className="w-3 h-3 mr-1" />
            Reset ke Default
          </Button>
        )}
      </div>

      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={onFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`relative border-2 border-dashed rounded-xl overflow-hidden transition-all duration-200 ${
          isDragging
            ? "border-emerald-500 bg-emerald-50/50"
            : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
        } ${disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
      >
        {value ? (
          <div className={`relative w-full ${getAspectClass()} group`}>
            <Image
              src={value}
              alt={label}
              fill
              className="object-cover rounded-lg"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4 text-white">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled || isUploading}
                className="h-8 text-xs font-medium shadow"
              >
                <Upload className="w-3.5 h-3.5 mr-1.5" />
                Ganti Gambar
              </Button>
            </div>

            {/* Badge URL tersimpan */}
            <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-[11px] text-white px-2 py-0.5 rounded flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              Tersimpan
            </div>
          </div>
        ) : (
          <div
            onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center p-6 text-center space-y-2 min-h-[140px]"
          >
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
              {isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <ImageIcon className="w-5 h-5" />
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-gray-700">
                {isUploading ? "Mengunggah..." : "Klik atau seret gambar ke sini"}
              </p>
              <p className="text-xs text-gray-500">
                Otomatis dikonversi ke WebP untuk performa optimal
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
