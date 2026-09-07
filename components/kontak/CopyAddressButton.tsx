"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

interface CopyAddressButtonProps {
  address: string;
  className?: string;
}

export default function CopyAddressButton({
  address,
  className = "",
}: CopyAddressButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      toast.success("Alamat Berhasil Disalin", {
        description: "Alamat madrasah telah disalin ke clipboard.",
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Gagal menyalin alamat");
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={`rounded-lg border-emerald-500/20 hover:bg-emerald-500/10 text-xs font-medium gap-1.5 h-8 ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Tersalin</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Salin Alamat</span>
        </>
      )}
    </Button>
  );
}
